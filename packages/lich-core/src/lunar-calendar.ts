// =============================================================================
// lunar-calendar.ts: đổi dương lịch <-> âm lịch, tìm tháng nhuận.
// Logic giống hệt packages/lich_core/lib/src/lunar_calendar.dart
// (đọc comment đầu file Dart để hiểu nguyên tắc lịch âm).
// =============================================================================

import { newMoonDay, sunSector12 } from './astronomy';
import { jdFromDate, jdToDate } from './julian-day';
import type { LunarDate, SolarDate } from './types';

/** Múi giờ mặc định: Việt Nam (UTC+7). */
export const VIETNAM_TIME_ZONE = 7;

const SYNODIC_MONTH = 29.530588853; // độ dài trung bình 1 tháng âm (ngày)
const FIRST_NEW_MOON_JD = 2415021.076998695; // sóc ngày 1/1/1900
const int = Math.floor;

/** JD của mùng 1 tháng 11 âm trong năm dương `year`. */
function lunarMonth11(year: number, tz: number): number {
  const off = jdFromDate(31, 12, year) - 2415021;
  const k = int(off / SYNODIC_MONTH);
  let nm = newMoonDay(k, tz);
  if (sunSector12(nm, tz) >= 9) nm = newMoonDay(k - 1, tz);
  return nm;
}

/** Vị trí tháng nhuận, đếm từ tháng 11 âm `a11` (1 = tháng ngay sau tháng 11). */
function leapMonthOffset(a11: number, tz: number): number {
  const k = int((a11 - FIRST_NEW_MOON_JD) / SYNODIC_MONTH + 0.5);
  let i = 1;
  let arc = sunSector12(newMoonDay(k + i, tz), tz);
  let last: number;
  do {
    last = arc;
    i++;
    arc = sunSector12(newMoonDay(k + i, tz), tz);
  } while (arc !== last && i < 14);
  return i - 1;
}

/** Đổi vị trí tháng nhuận (tính từ tháng 11) ra số tháng (1..12). */
function leapMonthFromOffset(offset: number): number {
  const m = offset + 10;
  return m > 12 ? m - 12 : m;
}

/** Dương lịch -> âm lịch. Ví dụ solarToLunar({day: 29, month: 1, year: 2025}) -> 1/1/2025. */
export function solarToLunar(date: SolarDate, timeZone = VIETNAM_TIME_ZONE): LunarDate {
  const dayNumber = jdFromDate(date.day, date.month, date.year);
  const k = int((dayNumber - FIRST_NEW_MOON_JD) / SYNODIC_MONTH);
  let monthStart = newMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) monthStart = newMoonDay(k, timeZone);

  let a11 = lunarMonth11(date.year, timeZone);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = date.year;
    a11 = lunarMonth11(date.year - 1, timeZone);
  } else {
    lunarYear = date.year + 1;
    b11 = lunarMonth11(date.year + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = int((monthStart - a11) / 29);
  let isLeap = false;
  let lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    const leapOffset = leapMonthOffset(a11, timeZone);
    if (diff >= leapOffset) {
      lunarMonth = diff + 10;
      if (diff === leapOffset) isLeap = true;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return { day: lunarDay, month: lunarMonth, year: lunarYear, isLeap };
}

/** Âm lịch -> dương lịch. Trả về null nếu ngày âm không tồn tại. */
export function lunarToSolar(lunar: LunarDate, timeZone = VIETNAM_TIME_ZONE): SolarDate | null {
  let a11: number, b11: number;
  if (lunar.month < 11) {
    a11 = lunarMonth11(lunar.year - 1, timeZone);
    b11 = lunarMonth11(lunar.year, timeZone);
  } else {
    a11 = lunarMonth11(lunar.year, timeZone);
    b11 = lunarMonth11(lunar.year + 1, timeZone);
  }
  const k = int(0.5 + (a11 - FIRST_NEW_MOON_JD) / SYNODIC_MONTH);
  let off = lunar.month - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    const leapOffset = leapMonthOffset(a11, timeZone);
    const leapMonth = leapMonthFromOffset(leapOffset);
    if (lunar.isLeap && lunar.month !== leapMonth) return null;
    if (lunar.isLeap || off >= leapOffset) off += 1;
  } else if (lunar.isLeap) {
    return null;
  }
  const monthStart = newMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunar.day - 1);
}

/** Tháng nhuận của năm âm lịch, 0 nếu không nhuận. */
export function leapMonthOfYear(lunarYear: number, timeZone = VIETNAM_TIME_ZONE): number {
  // Tháng nhuận 1..10 nằm giữa tháng 11 năm trước và tháng 11 năm nay
  let a11 = lunarMonth11(lunarYear - 1, timeZone);
  let b11 = lunarMonth11(lunarYear, timeZone);
  if (b11 - a11 > 365) {
    const m = leapMonthFromOffset(leapMonthOffset(a11, timeZone));
    if (m <= 10) return m;
  }
  // Tháng nhuận 11, 12 nằm sau tháng 11 năm nay (ví dụ 2033 nhuận tháng 11)
  a11 = b11;
  b11 = lunarMonth11(lunarYear + 1, timeZone);
  if (b11 - a11 > 365) {
    const m = leapMonthFromOffset(leapMonthOffset(a11, timeZone));
    if (m >= 11) return m;
  }
  return 0;
}

/** Số ngày (29 hoặc 30) của tháng âm. Ném lỗi nếu tháng không tồn tại. */
export function lunarMonthLength(month: number, year: number, isLeap = false, timeZone = VIETNAM_TIME_ZONE): number {
  const first = lunarToSolar({ day: 1, month, year, isLeap }, timeZone);
  if (!first) throw new RangeError(`Không có tháng ${month}${isLeap ? ' nhuận' : ''} năm ${year}`);
  const startJd = jdFromDate(first.day, first.month, first.year);
  let k = int((startJd - FIRST_NEW_MOON_JD) / SYNODIC_MONTH);
  while (newMoonDay(k, timeZone) <= startJd) k++;
  return newMoonDay(k, timeZone) - startJd;
}
