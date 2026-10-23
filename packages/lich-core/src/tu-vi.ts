// =============================================================================
// tu-vi.ts: lập lá số Tử Vi Đẩu Số (an 12 cung, Cục, 14 chính tinh, phụ tinh chính,
// Tứ Hóa, vòng Tràng Sinh, đại vận). Logic giống hệt packages/lich_core/lib/src/tu_vi.dart.
//
// Mọi vị trí tính theo chỉ số địa chi: 0 = Tý, 1 = Sửu, 2 = Dần ... 11 = Hợi.
// "Thuận" = tăng chỉ số (Tý -> Sửu -> Dần...), "nghịch" = giảm.
// Lá số chỉ tính trong bộ nhớ, không lưu/gửi đi đâu (quyền riêng tư do nơi gọi quyết định).
// =============================================================================

import { DIA_CHI, THIEN_CAN } from './can-chi';
import { napAm, napAmHanh, napAmIndex } from './hoang-dao';
import { solarToLunar } from './lunar-calendar';
import type { LunarDate, SolarDate } from './types';

const mod12 = (n: number) => ((n % 12) + 12) % 12;

/** 12 cung, theo thứ tự đi NGHỊCH từ Mệnh (Mệnh, Huynh Đệ, Phu Thê...). */
export const CUNG_NAMES = [
  'Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách',
  'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu',
] as const;

export const CHINH_TINH = [
  'Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh',
  'Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân',
] as const;

export const TRANG_SINH = [
  'Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy',
  'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng',
] as const;

export const TU_HOA = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'] as const;

/** Tứ Hóa theo can năm: [sao Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ]. */
const TU_HOA_THEO_CAN: string[][] = [
  ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'], // Giáp
  ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'], // Ất
  ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'], // Bính
  ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'], // Đinh
  ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'], // Mậu
  ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'], // Kỷ
  ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'], // Canh
  ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'], // Tân
  ['Thiên Lương', 'Tử Vi', 'Tả Phù', 'Vũ Khúc'], // Nhâm
  ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'], // Quý
];

/** Cục theo ngũ hành nạp âm của cung Mệnh (thứ tự NGU_HANH: Kim, Thủy, Mộc, Hỏa, Thổ). */
const CUC_THEO_HANH = [4, 2, 3, 6, 5];
const CUC_NAMES: Record<number, string> = {
  2: 'Thủy nhị cục', 3: 'Mộc tam cục', 4: 'Kim tứ cục', 5: 'Thổ ngũ cục', 6: 'Hỏa lục cục',
};
/** Vị trí khởi Tràng Sinh theo cục. */
const TRANG_SINH_START: Record<number, number> = { 2: 8, 5: 8, 3: 11, 4: 5, 6: 2 };

/** Lộc Tồn theo can năm. */
const LOC_TON = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
/** [Thiên Khôi, Thiên Việt] theo can năm. */
const KHOI_VIET = [[1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [6, 2], [3, 5], [3, 5]];
/** [điểm khởi Hỏa Tinh, điểm khởi Linh Tinh] theo nhóm tam hợp của chi năm (chi % 4). */
const HOA_LINH_START: Record<number, [number, number]> = {
  0: [2, 10], // Thân Tý Thìn
  1: [3, 10], // Tỵ Dậu Sửu
  2: [1, 3], // Dần Ngọ Tuất
  3: [9, 10], // Hợi Mão Mùi
};
/** Thiên Mã theo nhóm tam hợp của chi năm. */
const THIEN_MA: Record<number, number> = { 0: 2, 1: 11, 2: 8, 3: 5 };

export type GioiTinh = 'nam' | 'nu';

export interface TuViInput {
  /** Ngày sinh âm lịch. */
  lunar: LunarDate;
  /** Giờ sinh theo địa chi: 0 = Tý (23h–1h) ... 11 = Hợi. */
  hourChi: number;
  gioiTinh: GioiTinh;
}

export interface CungTuVi {
  chi: number;
  /** Can chi của cung, ví dụ "Bính Dần". */
  canChi: string;
  /** Tên cung (Mệnh, Huynh Đệ...). */
  cung: (typeof CUNG_NAMES)[number];
  isThan: boolean;
  chinhTinh: string[];
  phuTinh: string[];
  /** Tứ Hóa nằm ở cung này, dạng "Hóa Lộc (Liêm Trinh)". */
  tuHoa: string[];
  trangSinh: (typeof TRANG_SINH)[number];
  /** Tuổi bắt đầu đại vận tại cung này. */
  daiVan: number;
}

export interface LaSoTuVi {
  lunar: LunarDate;
  /** Tháng dùng để an sao (tháng nhuận: ngày 1–15 tính tháng đó, từ 16 tính tháng sau). */
  thangAnSao: number;
  hourChi: number;
  gioiTinh: GioiTinh;
  canChiNam: string;
  /** "Dương Nam", "Âm Nữ"... */
  amDuong: string;
  banMenh: string;
  cuc: number;
  cucName: string;
  menhChi: number;
  thanChi: number;
  /** 12 cung, chỉ số mảng = chi (0 = Tý). */
  cung: CungTuVi[];
}

/** Lập lá số từ ngày sinh dương lịch. */
export function lapLaSoTuVi(solar: SolarDate, hourChi: number, gioiTinh: GioiTinh): LaSoTuVi {
  return lapLaSoTuViAmLich({ lunar: solarToLunar(solar), hourChi, gioiTinh });
}

/** Lập lá số từ ngày sinh âm lịch. */
export function lapLaSoTuViAmLich({ lunar, hourChi, gioiTinh }: TuViInput): LaSoTuVi {
  const yCan = (lunar.year + 6) % 10;
  const yChi = (lunar.year + 8) % 12;
  const duong = yCan % 2 === 0; // Giáp, Bính, Mậu, Canh, Nhâm là can dương
  const thuan = duong === (gioiTinh === 'nam'); // Dương Nam, Âm Nữ đi thuận
  const month = lunar.isLeap && lunar.day > 15 ? (lunar.month % 12) + 1 : lunar.month;
  const h = hourChi;

  // Cung Mệnh: từ Dần đếm thuận đến tháng sinh, rồi đếm nghịch đến giờ sinh. Thân: đếm thuận giờ.
  const menh = mod12(2 + month - 1 - h);
  const than = mod12(2 + month - 1 + h);

  // Can của cung Dần theo can năm (ngũ hổ độn), các cung sau tăng dần
  const canDan = ((yCan % 5) * 2 + 2) % 10;
  const canOf = (chi: number) => (canDan + mod12(chi - 2)) % 10;

  const cuc = CUC_THEO_HANH[napAmHanh(napAmIndex(canOf(menh), menh))];

  const stars: string[][] = Array.from({ length: 12 }, () => []);
  const put = (chi: number, name: string) => stars[mod12(chi)].push(name);

  // An Tử Vi theo cục và ngày sinh
  const tuVi = anTuVi(cuc, lunar.day);
  const thienPhu = mod12(4 - tuVi);
  [0, -1, -3, -4, -5, -8].forEach((off, i) => put(tuVi + off, CHINH_TINH[i]));
  [0, 1, 2, 3, 4, 5, 6, 10].forEach((off, i) => put(thienPhu + off, CHINH_TINH[6 + i]));

  // Phụ tinh
  const phu: string[][] = Array.from({ length: 12 }, () => []);
  const putPhu = (chi: number, name: string) => phu[mod12(chi)].push(name);
  const locTon = LOC_TON[yCan];
  const [hoaStart, linhStart] = HOA_LINH_START[yChi % 4];
  putPhu(10 - h, 'Văn Xương');
  putPhu(4 + h, 'Văn Khúc');
  putPhu(4 + month - 1, 'Tả Phù');
  putPhu(10 - (month - 1), 'Hữu Bật');
  putPhu(KHOI_VIET[yCan][0], 'Thiên Khôi');
  putPhu(KHOI_VIET[yCan][1], 'Thiên Việt');
  putPhu(locTon, 'Lộc Tồn');
  putPhu(locTon + 1, 'Kình Dương');
  putPhu(locTon - 1, 'Đà La');
  putPhu(thuan ? hoaStart + h : hoaStart - h, 'Hỏa Tinh');
  putPhu(thuan ? linhStart - h : linhStart + h, 'Linh Tinh');
  putPhu(11 - h, 'Địa Không');
  putPhu(11 + h, 'Địa Kiếp');
  putPhu(THIEN_MA[yChi % 4], 'Thiên Mã');
  putPhu(3 - yChi, 'Hồng Loan');
  putPhu(3 - yChi + 6, 'Thiên Hỷ');
  putPhu(yChi, 'Thái Tuế');

  // Tứ Hóa: gắn vào cung đang chứa sao tương ứng (chính tinh hoặc phụ tinh)
  const tuHoa: string[][] = Array.from({ length: 12 }, () => []);
  TU_HOA_THEO_CAN[yCan].forEach((star, i) => {
    const chi = stars.findIndex((s) => s.includes(star));
    const at = chi >= 0 ? chi : phu.findIndex((s) => s.includes(star));
    if (at >= 0) tuHoa[at].push(`${TU_HOA[i]} (${star})`);
  });

  const trangStart = TRANG_SINH_START[cuc];
  const cung: CungTuVi[] = Array.from({ length: 12 }, (_, chi) => {
    const fromMenh = mod12(menh - chi); // các cung đi nghịch từ Mệnh
    const step = thuan ? mod12(chi - menh) : mod12(menh - chi); // bước đại vận tính từ Mệnh
    return {
      chi,
      canChi: `${THIEN_CAN[canOf(chi)]} ${DIA_CHI[chi]}`,
      cung: CUNG_NAMES[fromMenh],
      isThan: chi === than,
      chinhTinh: stars[chi],
      phuTinh: phu[chi],
      tuHoa: tuHoa[chi],
      trangSinh: TRANG_SINH[thuan ? mod12(chi - trangStart) : mod12(trangStart - chi)],
      daiVan: cuc + step * 10,
    };
  });

  return {
    lunar,
    thangAnSao: month,
    hourChi,
    gioiTinh,
    canChiNam: `${THIEN_CAN[yCan]} ${DIA_CHI[yChi]}`,
    amDuong: `${duong ? 'Dương' : 'Âm'} ${gioiTinh === 'nam' ? 'Nam' : 'Nữ'}`,
    banMenh: napAm(yCan, yChi),
    cuc,
    cucName: CUC_NAMES[cuc],
    menhChi: menh,
    thanChi: than,
    cung,
  };
}

/**
 * Vị trí sao Tử Vi: tìm số k nhỏ nhất để (ngày + k) chia hết cho cục, thương q.
 * Từ Dần đếm thuận q - 1 cung; nếu k lẻ lùi lại k cung, k chẵn tiến thêm k cung.
 */
export function anTuVi(cuc: number, lunarDay: number): number {
  const k = (cuc - (lunarDay % cuc)) % cuc;
  const q = (lunarDay + k) / cuc;
  const base = 2 + q - 1;
  return mod12(k % 2 === 1 ? base - k : base + k);
}
