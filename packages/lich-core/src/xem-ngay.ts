// =============================================================================
// xem-ngay.ts: Thập nhị trực, Nhị thập bát tú, các ngày kỵ.
// Logic giống hệt packages/lich_core/lib/src/xem_ngay.dart.
// =============================================================================

import { chiOfDay, tietKhiIndex } from './can-chi';
import { jdToDate } from './julian-day';
import { solarToLunar, VIETNAM_TIME_ZONE } from './lunar-calendar';
import type { LunarDate } from './types';

/** 12 trực, bắt đầu từ Kiến. */
export const TRUC_NAMES = ['Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế'] as const;

/** 28 sao (Nhị thập bát tú), bắt đầu từ Giác. */
export const NHI_THAP_BAT_TU_NAMES = [
  'Giác', 'Cang', 'Đê', 'Phòng', 'Tâm', 'Vĩ', 'Cơ',
  'Đẩu', 'Ngưu', 'Nữ', 'Hư', 'Nguy', 'Thất', 'Bích',
  'Khuê', 'Lâu', 'Vị', 'Mão', 'Tất', 'Chủy', 'Sâm',
  'Tỉnh', 'Quỷ', 'Liễu', 'Tinh', 'Trương', 'Dực', 'Chẩn',
] as const;

/** Chi (0..11) của tháng tiết khí chứa ngày jd. Tháng Dần bắt đầu từ Lập xuân. */
export function chiOfSolarTermMonth(jd: number, timeZone = VIETNAM_TIME_ZONE): number {
  const term = tietKhiIndex(jd, timeZone); // 21 = Lập xuân
  return (2 + Math.floor(((term - 21 + 24) % 24) / 2)) % 12;
}

/** Chỉ số trực (0 = Kiến ... 11 = Bế). Ngày Kiến là ngày có chi trùng chi tháng tiết khí. */
export function trucIndex(jd: number, timeZone = VIETNAM_TIME_ZONE): number {
  return (chiOfDay(jd) - chiOfSolarTermMonth(jd, timeZone) + 12) % 12;
}

/** Chỉ số sao Nhị thập bát tú (0 = Giác ... 27 = Chẩn), chu kỳ 28 ngày. */
export function nhiThapBatTuIndex(jd: number): number {
  return (jd + 11) % 28;
}

/** Các loại ngày kỵ theo ngày âm. */
export type NgayKy = 'nguyetKy' | 'nguyetTan' | 'tamNuong' | 'duongCongKy';

const NGUYET_KY_DAYS = new Set([5, 14, 23]);
const TAM_NUONG_DAYS = new Set([3, 7, 13, 18, 22, 27]);

/** Dương Công Kỵ Nhật: 13 ngày âm cố định (tháng -> các ngày). */
const DUONG_CONG_KY: Record<number, number[]> = {
  1: [13], 2: [11], 3: [9], 4: [7], 5: [5], 6: [3],
  7: [8, 29], 8: [27], 9: [25], 10: [23], 11: [21], 12: [19],
};

/** Danh sách ngày kỵ mà ngày jd (âm lịch lunar) phạm phải. Rỗng = không phạm. */
export function ngayKy(jd: number, lunar: LunarDate, timeZone = VIETNAM_TIME_ZONE): NgayKy[] {
  const next = solarToLunar(jdToDate(jd + 1), timeZone);
  const result: NgayKy[] = [];
  if (NGUYET_KY_DAYS.has(lunar.day)) result.push('nguyetKy');
  if (next.day === 1) result.push('nguyetTan'); // hôm sau là mùng 1 -> hôm nay là ngày cuối tháng
  if (TAM_NUONG_DAYS.has(lunar.day)) result.push('tamNuong');
  if (!lunar.isLeap && DUONG_CONG_KY[lunar.month]?.includes(lunar.day)) result.push('duongCongKy');
  return result;
}
