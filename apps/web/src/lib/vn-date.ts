// Tiện ích ngày tháng theo giờ Việt Nam, dùng chung cho các component lịch.
import { jdFromDate, type SolarDate } from "lich-core";

/** Ngày hôm nay theo giờ Việt Nam, bất kể server/trình duyệt đang ở múi giờ nào. */
export function todayInVietnam(): SolarDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { day: get("day"), month: get("month"), year: get("year") };
}

/** Tên thứ, chỉ số = jd % 7 (0 = Thứ Hai ... 6 = Chủ Nhật). */
export const WEEKDAYS = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
export const WEEKDAYS_SHORT = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

/** Số ngày của tháng dương lịch. */
export function daysInMonth(month: number, year: number): number {
  const next = month === 12 ? jdFromDate(1, 1, year + 1) : jdFromDate(1, month + 1, year);
  return next - jdFromDate(1, month, year);
}

export function isSameDay(a: SolarDate, b: SolarDate): boolean {
  return a.day === b.day && a.month === b.month && a.year === b.year;
}
