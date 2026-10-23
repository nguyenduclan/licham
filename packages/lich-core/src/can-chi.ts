// =============================================================================
// can-chi.ts: can chi năm/tháng/ngày, tiết khí, giờ hoàng đạo.
// Logic giống hệt packages/lich_core/lib/src/can_chi.dart.
// =============================================================================

import { sunLongitude } from './astronomy';
import { VIETNAM_TIME_ZONE } from './lunar-calendar';

/** 10 thiên can. */
export const THIEN_CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const;

/** 12 địa chi (0 = Tý ... 11 = Hợi). */
export const DIA_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const;

/** 24 tiết khí, bắt đầu từ Xuân phân (0°), mỗi tiết cách nhau 15°. */
export const TIET_KHI_NAMES = [
  'Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ', 'Tiểu mãn', 'Mang chủng',
  'Hạ chí', 'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ',
  'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông', 'Tiểu tuyết', 'Đại tuyết',
  'Đông chí', 'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập',
] as const;

/** Giờ hoàng đạo theo chi của ngày (chi % 6). '1' ở vị trí i = giờ chi i là giờ tốt. */
const GIO_HOANG_DAO_PATTERNS = [
  '110100101100', '001101001011', '110011010010',
  '101100110100', '001011001101', '010010110011',
];

/** Can chi của năm âm lịch. Ví dụ 2025 -> "Ất Tỵ". */
export function canChiYear(lunarYear: number): string {
  return `${THIEN_CAN[(lunarYear + 6) % 10]} ${DIA_CHI[(lunarYear + 8) % 12]}`;
}

/** Can chi của tháng âm lịch (tháng nhuận dùng chung can chi với tháng thường). */
export function canChiMonth(lunarMonth: number, lunarYear: number): string {
  return `${THIEN_CAN[(lunarYear * 12 + lunarMonth + 3) % 10]} ${DIA_CHI[(lunarMonth + 1) % 12]}`;
}

/** Chỉ số chi (0..11) của ngày có số Julius jd. */
export function chiOfDay(jd: number): number {
  return (jd + 1) % 12;
}

/** Can chi của ngày có số Julius jd. */
export function canChiDay(jd: number): string {
  return `${THIEN_CAN[(jd + 9) % 10]} ${DIA_CHI[chiOfDay(jd)]}`;
}

/** Chỉ số tiết khí (0..23) đang hiệu lực lúc 24:00 của ngày jd. */
export function tietKhiIndex(jd: number, timeZone = VIETNAM_TIME_ZONE): number {
  return Math.floor((sunLongitude(jd + 1 - 0.5 - timeZone / 24) / Math.PI) * 12);
}

/** Tên tiết khí của ngày jd. */
export function tietKhi(jd: number, timeZone = VIETNAM_TIME_ZONE): string {
  return TIET_KHI_NAMES[tietKhiIndex(jd, timeZone)];
}

/** Chỉ số chi (0 = Tý ...) của 6 giờ hoàng đạo trong ngày jd. */
export function gioHoangDao(jd: number): number[] {
  const pattern = GIO_HOANG_DAO_PATTERNS[chiOfDay(jd) % 6];
  const result: number[] = [];
  for (let i = 0; i < 12; i++) if (pattern[i] === '1') result.push(i);
  return result;
}

/** Giờ bắt đầu (0..23) của giờ chi. Ví dụ Tý -> 23 (23h-1h), Sửu -> 1. */
export function chiHourStart(chiIndex: number): number {
  return (chiIndex * 2 + 23) % 24;
}
