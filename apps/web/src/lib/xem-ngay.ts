// Gom toàn bộ dữ liệu cho trang "Xem ngày tốt xấu" từ lich-core + shared/data/xem-ngay.json.
import content from "@shared/data/xem-ngay.json";
import {
  chiHourStart,
  chiOfDay,
  danhGiaTuoi,
  DIA_CHI,
  getDayInfo,
  gioLyThuanPhong,
  hacThan,
  hyThan,
  isLucDieuTot,
  LUC_DIEU_NAMES,
  lucDieuIndex,
  LY_THUAN_PHONG_NAMES,
  ngayKy,
  NHI_THAP_BAT_TU_NAMES,
  nhiThapBatTuIndex,
  taiThan,
  tamSat,
  TRUC_NAMES,
  trucIndex,
  type SolarDate,
} from "lich-core";

export { content };

/** Đọc chuỗi "YYYY-MM-DD" (trong khoảng 1900-2100) thành SolarDate, sai định dạng trả về null. */
export function parseIsoDate(value: string | string[] | undefined): SolarDate | null {
  if (typeof value !== "string") return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return null;
  const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { day, month, year };
}

/** Khung giờ của giờ chi, ví dụ Dần -> "3:00–4:59". */
export function chiHourRange(chi: number): string {
  const start = chiHourStart(chi);
  return `${start}:00–${(start + 1) % 24}:59`;
}

const CAP_GIO = [
  "Tý (23h–1h) và Ngọ (11h–13h)",
  "Sửu (1h–3h) và Mùi (13h–15h)",
  "Dần (3h–5h) và Thân (15h–17h)",
  "Mão (5h–7h) và Dậu (17h–19h)",
  "Thìn (7h–9h) và Tuất (19h–21h)",
  "Tỵ (9h–11h) và Hợi (21h–23h)",
];

export function buildXemNgay(day: SolarDate, birth: SolarDate | null) {
  const info = getDayInfo(day);
  const { jd, lunar } = info;
  const dayCan = (jd + 9) % 10;
  const dayChi = chiOfDay(jd);
  const lucDieu = lucDieuIndex(lunar.month, lunar.day);
  const tu = nhiThapBatTuIndex(jd);
  const truc = trucIndex(jd);

  return {
    info,
    gioHoangDao: info.gioHoangDao.map((chi) => ({ chi: DIA_CHI[chi], range: chiHourRange(chi) })),
    gioHacDao: DIA_CHI.map((name, chi) => ({ chi, name }))
      .filter(({ chi }) => !info.gioHoangDao.includes(chi))
      .map(({ chi, name }) => ({ chi: name, range: chiHourRange(chi) })),
    ngayKy: ngayKy(jd, lunar).map((k) => content.ngayKy[k]),
    tamSat: tamSat(dayChi).map((c) => DIA_CHI[c]),
    banhTo: [content.banhToCan[dayCan], content.banhToChi[dayChi]],
    lucDieu: { name: LUC_DIEU_NAMES[lucDieu], tot: isLucDieuTot(lucDieu), ...content.lucDieu[lucDieu] },
    tu: { name: NHI_THAP_BAT_TU_NAMES[tu], ...content.nhiThapBatTu[tu] },
    truc: { name: TRUC_NAMES[truc], ...content.truc[truc] },
    huong: { hyThan: hyThan(jd), taiThan: taiThan(jd), hacThan: hacThan(jd) },
    gioXuatHanh: gioLyThuanPhong(lunar.month, lunar.day).map((idx, k) => ({
      capGio: CAP_GIO[k],
      name: LY_THUAN_PHONG_NAMES[idx],
      tot: isLucDieuTot(idx),
      ...content.lyThuanPhong[idx],
    })),
    tuoi: birth ? danhGiaTuoi(birth, day) : null,
  };
}

export type XemNgayData = ReturnType<typeof buildXemNgay>;
