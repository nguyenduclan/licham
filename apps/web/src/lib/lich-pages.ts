// Dữ liệu cho các trang /lich-am/[slug]: theo ngày (2026-10-23), theo tháng (thang-10-2026), theo năm (nam-2026).
import tietKhiContent from "@shared/data/tiet-khi.json";
import {
  getDayInfo,
  jdFromDate,
  jdToDate,
  leapMonthOfYear,
  lunarMonthLength,
  lunarToSolar,
  tietKhiIndex,
  TIET_KHI_NAMES,
  toIso,
  type SolarDate,
} from "lich-core";
import { getHolidays } from "./holidays";
import { SEO_YEARS } from "./site";
import { daysInMonth } from "./vn-date";

export type LichSlug =
  | { kind: "day"; date: SolarDate }
  | { kind: "month"; month: number; year: number }
  | { kind: "year"; year: number };

const inRange = (y: number) => y >= 1900 && y <= 2100;

/** Đọc slug URL; sai định dạng hoặc ngoài 1900-2100 trả về null (trang sẽ 404). */
export function parseLichSlug(slug: string): LichSlug | null {
  let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(slug);
  if (m) {
    const [year, month, day] = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (!inRange(year) || month < 1 || month > 12 || day < 1 || day > daysInMonth(month, year)) return null;
    return { kind: "day", date: { day, month, year } };
  }
  m = /^thang-(\d{1,2})-(\d{4})$/.exec(slug);
  if (m) {
    const [month, year] = [Number(m[1]), Number(m[2])];
    return inRange(year) && month >= 1 && month <= 12 ? { kind: "month", month, year } : null;
  }
  m = /^nam-(\d{4})$/.exec(slug);
  if (m && inRange(Number(m[1]))) return { kind: "year", year: Number(m[1]) };
  return null;
}

export const dayHref = (d: SolarDate) => `/lich-am/${toIso(d)}`;
export const monthHref = (month: number, year: number) => `/lich-am/thang-${month}-${year}`;
export const yearHref = (year: number) => `/lich-am/nam-${year}`;
export const fmt = (d: SolarDate) => `${d.day}/${d.month}/${d.year}`;

/** Mọi slug của các năm SEO_YEARS (dựng sẵn lúc build + đưa vào sitemap). */
export function seoSlugs(): string[] {
  const slugs: string[] = [];
  for (const year of SEO_YEARS) {
    slugs.push(`nam-${year}`);
    for (let month = 1; month <= 12; month++) {
      slugs.push(`thang-${month}-${year}`);
      for (let day = 1; day <= daysInMonth(month, year); day++) slugs.push(toIso({ day, month, year }));
    }
  }
  return slugs;
}

/** Mô tả tiết khí từ shared/data/tiet-khi.json (bỏ qua khóa ghi chú "_huongDan"). */
export function tietKhiInfo(name: string): { khoangNgay: string; moTa: string } | undefined {
  const entry: unknown = (tietKhiContent as Record<string, unknown>)[name];
  return typeof entry === "object" && entry !== null ? (entry as { khoangNgay: string; moTa: string }) : undefined;
}

/** Các ngày trong khoảng [fromJd, toJd] mà một tiết khí mới bắt đầu. */
export function tietKhiStarts(fromJd: number, toJd: number): { date: SolarDate; name: string }[] {
  const out: { date: SolarDate; name: string }[] = [];
  let prev = tietKhiIndex(fromJd - 1);
  for (let jd = fromJd; jd <= toJd; jd++) {
    const cur = tietKhiIndex(jd);
    if (cur !== prev) out.push({ date: jdToDate(jd), name: TIET_KHI_NAMES[cur] });
    prev = cur;
  }
  return out;
}

/** Thông tin từng ngày của một tháng dương lịch (dùng cho trang tháng). */
export function monthDays(month: number, year: number) {
  return Array.from({ length: daysInMonth(month, year) }, (_, i) => {
    const info = getDayInfo({ day: i + 1, month, year });
    return { info, holidays: getHolidays(info.solar, info.lunar, info.jd) };
  });
}

/** Thông tin cả năm âm lịch `year`: Tết, tháng nhuận, ngày mùng 1 từng tháng âm. */
export function lunarYearInfo(year: number) {
  const leap = leapMonthOfYear(year);
  const months: { month: number; isLeap: boolean; start: SolarDate; length: number }[] = [];
  for (let month = 1; month <= 12; month++) {
    for (const isLeap of month === leap ? [false, true] : [false]) {
      const start = lunarToSolar({ day: 1, month, year, isLeap });
      if (start) months.push({ month, isLeap, start, length: lunarMonthLength(month, year, isLeap) });
    }
  }
  return { tet: months[0].start, leap, months };
}

/** Ngày lễ trong một năm dương lịch (cả lễ dương và lễ âm quy đổi), sắp theo ngày. */
export function holidaysOfYear(year: number) {
  const fromJd = jdFromDate(1, 1, year);
  const toJd = jdFromDate(31, 12, year);
  const out: { date: SolarDate; name: string; dayOff: boolean }[] = [];
  for (let jd = fromJd; jd <= toJd; jd++) {
    const info = getDayInfo(jdToDate(jd));
    for (const h of getHolidays(info.solar, info.lunar, jd)) {
      if (h.name !== "Ngày rằm") out.push({ date: info.solar, name: h.name, dayOff: h.dayOff });
    }
  }
  return out;
}
