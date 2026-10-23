// =============================================================================
// xuat-hanh.ts: Khổng Minh Lục Diệu, giờ xuất hành Lý Thuần Phong,
// hướng xuất hành (Hỷ thần, Tài thần, Hạc thần).
// Logic giống hệt packages/lich_core/lib/src/xuat_hanh.dart.
// =============================================================================

/** 6 sao Lục Diệu. Tốt: Đại An, Tốc Hỷ, Tiểu Cát. */
export const LUC_DIEU_NAMES = ['Đại An', 'Lưu Liên', 'Tốc Hỷ', 'Xích Khẩu', 'Tiểu Cát', 'Không Vong'] as const;

/** 6 trạng thái giờ Lý Thuần Phong (cùng thứ tự vòng với Lục Diệu). */
export const LY_THUAN_PHONG_NAMES = ['Đại An', 'Lưu Niên', 'Tốc Hỷ', 'Xích Khẩu', 'Tiểu Cát', 'Tuyệt Lộ'] as const;

/** Sao/giờ có chỉ số index (theo 2 danh sách trên) là tốt hay xấu. */
export function isLucDieuTot(index: number): boolean {
  return index % 2 === 0;
}

/** Chỉ số Lục Diệu của ngày âm (tháng nhuận tính như tháng thường). */
export function lucDieuIndex(lunarMonth: number, lunarDay: number): number {
  return (lunarMonth + lunarDay - 1) % 6;
}

/**
 * Giờ xuất hành Lý Thuần Phong: 6 phần tử cho 6 cặp giờ
 * [Tý-Ngọ, Sửu-Mùi, Dần-Thân, Mão-Dậu, Thìn-Tuất, Tỵ-Hợi], giá trị là chỉ số trong LY_THUAN_PHONG_NAMES.
 */
export function gioLyThuanPhong(lunarMonth: number, lunarDay: number): number[] {
  const start = lucDieuIndex(lunarMonth, lunarDay);
  return Array.from({ length: 6 }, (_, k) => (start + k) % 6);
}

/** Hỷ thần theo can ngày. */
const HY_THAN = [
  'Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Chính Nam', 'Đông Nam',
  'Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Chính Nam', 'Đông Nam',
];

/** Tài thần theo can ngày. Lưu ý: ngày Mậu có trang ghi Chính Bắc; ở đây theo xemlicham (Chính Nam). */
const TAI_THAN = [
  'Đông Nam', 'Đông Nam', 'Chính Đông', 'Chính Đông', 'Chính Nam',
  'Chính Nam', 'Tây Nam', 'Tây Nam', 'Chính Tây', 'Tây Bắc',
];

/** Hướng Hỷ thần (đón niềm vui) của ngày jd. */
export function hyThan(jd: number): string {
  return HY_THAN[(jd + 9) % 10];
}

/** Hướng Tài thần (đón tài lộc) của ngày jd. */
export function taiThan(jd: number): string {
  return TAI_THAN[(jd + 9) % 10];
}

const HAC_THAN_HUONG = ['Đông Bắc', 'Chính Đông', 'Đông Nam', 'Chính Nam', 'Tây Nam', 'Chính Tây', 'Tây Bắc', 'Chính Bắc'];
const HAC_THAN_SO_NGAY = [6, 5, 6, 5, 6, 5, 6, 5];
const KY_DAU_INDEX = 45; // chỉ số Kỷ Dậu trong lục thập hoa giáp

/** Hướng Hạc thần của ngày jd, hoặc null nếu Hạc thần đang "lên trời". */
export function hacThan(jd: number): string | null {
  let offset = ((((jd + 49) % 60) - KY_DAU_INDEX) + 60) % 60;
  for (let i = 0; i < 8; i++) {
    if (offset < HAC_THAN_SO_NGAY[i]) return HAC_THAN_HUONG[i];
    offset -= HAC_THAN_SO_NGAY[i];
  }
  return null;
}
