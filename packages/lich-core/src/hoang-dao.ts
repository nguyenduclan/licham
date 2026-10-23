// =============================================================================
// hoang-dao.ts: nạp âm (mệnh), thần trực ngày (hoàng/hắc đạo), tuổi xung.
// Logic giống hệt packages/lich_core/lib/src/hoang_dao.dart.
// =============================================================================

import { chiOfDay, DIA_CHI, THIEN_CAN } from './can-chi';

/** Ngũ hành theo vòng tương sinh: hành a sinh (a+1)%5, khắc (a+2)%5. */
export const NGU_HANH = ['Kim', 'Thủy', 'Mộc', 'Hỏa', 'Thổ'] as const;

/** 30 nạp âm theo thứ tự lục thập hoa giáp (mỗi nạp âm ứng 2 can chi liên tiếp). */
export const NAP_AM_NAMES = [
  'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim',
  'Sơn Đầu Hỏa', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc',
  'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy',
  'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bích Thượng Thổ', 'Kim Bạch Kim',
  'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Dịch Thổ', 'Thoa Xuyến Kim', 'Tang Đố Mộc',
  'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy',
] as const;

/** 12 thần trực ngày, theo thứ tự bắt đầu từ Thanh Long. */
export const THAN_NGAY_NAMES = [
  'Thanh Long', 'Minh Đường', 'Thiên Hình', 'Chu Tước', 'Kim Quỹ', 'Kim Đường',
  'Bạch Hổ', 'Ngọc Đường', 'Thiên Lao', 'Huyền Vũ', 'Tư Mệnh', 'Câu Trận',
] as const;

/** Chỉ số các thần hoàng đạo; còn lại là hắc đạo. */
const HOANG_DAO_THAN = new Set([0, 1, 4, 5, 7, 10]);

/** Chỉ số nạp âm (0..29) của cặp can (0..9) và chi (0..11). */
export function napAmIndex(can: number, chi: number): number {
  return Math.floor((((6 * can - 5 * chi) % 60) + 60) % 60 / 2);
}

/** Tên nạp âm của can chi. Ví dụ Mậu Thìn (4, 4) -> "Đại Lâm Mộc". */
export function napAm(can: number, chi: number): string {
  return NAP_AM_NAMES[napAmIndex(can, chi)];
}

/** Chỉ số ngũ hành (theo NGU_HANH) của nạp âm thứ index. */
export function napAmHanh(index: number): number {
  const last = NAP_AM_NAMES[index].split(' ').pop() as (typeof NGU_HANH)[number];
  return NGU_HANH.indexOf(last);
}

/** Chỉ số nạp âm của ngày có số Julius jd. */
export function napAmIndexOfDay(jd: number): number {
  return napAmIndex((jd + 9) % 10, chiOfDay(jd));
}

/**
 * Chỉ số thần trực ngày (0..11). Thanh Long khởi tại: tháng 1,7 -> Tý;
 * 2,8 -> Dần; 3,9 -> Thìn; 4,10 -> Ngọ; 5,11 -> Thân; 6,12 -> Tuất.
 * Tháng nhuận tính như tháng thường.
 */
export function thanNgayIndex(jd: number, lunarMonth: number): number {
  const start = ((lunarMonth - 1) % 6) * 2;
  return (chiOfDay(jd) - start + 12) % 12;
}

/** Ngày hoàng đạo hay không. */
export function isHoangDao(jd: number, lunarMonth: number): boolean {
  return HOANG_DAO_THAN.has(thanNgayIndex(jd, lunarMonth));
}

/** Hai ngũ hành có khắc nhau (theo bất kỳ chiều nào) không. */
export function nguHanhKhac(a: number, b: number): boolean {
  return (a + 2) % 5 === b || (b + 2) % 5 === a;
}

/**
 * Các tuổi xung với ngày: chi xung với chi ngày VÀ nạp âm khắc (hoặc bị khắc) nạp âm ngày.
 * Ví dụ ngày Mậu Thìn (Đại Lâm Mộc) -> ["Bính Tuất", "Canh Tuất"].
 */
export function tuoiXung(jd: number): string[] {
  const dayHanh = napAmHanh(napAmIndexOfDay(jd));
  const xungChi = (chiOfDay(jd) + 6) % 12;
  const result: string[] = [];
  for (let can = xungChi % 2; can < 10; can += 2) {
    if (nguHanhKhac(dayHanh, napAmHanh(napAmIndex(can, xungChi)))) {
      result.push(`${THIEN_CAN[can]} ${DIA_CHI[xungChi]}`);
    }
  }
  return result;
}
