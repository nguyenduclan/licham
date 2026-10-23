// Tra ngày lễ của một ngày từ shared/data/holidays.json (dùng chung với app Flutter).
import data from "@shared/data/holidays.json";
import { jdToDate, solarToLunar, type LunarDate, type SolarDate } from "lich-core";

export interface Holiday {
  name: string;
  dayOff: boolean;
  /** Ngày lễ theo lịch dương hay âm (ngày lễ âm thì tô đỏ ngày âm). */
  source: "solar" | "lunar";
}

export function getHolidays(solar: SolarDate, lunar: LunarDate, jd: number): Holiday[] {
  const result: Holiday[] = [];
  for (const h of data.solar) {
    if (h.day === solar.day && h.month === solar.month) {
      result.push({ name: h.name, dayOff: h.dayOff ?? false, source: "solar" });
    }
  }
  // Lễ âm lịch chỉ tính tháng thường, không tính tháng nhuận
  const lunarHolidays = lunar.isLeap ? [] : data.lunar.filter((h) => h.day === lunar.day && h.month === lunar.month);
  for (const h of lunarHolidays) result.push({ name: h.name, dayOff: h.dayOff ?? false, source: "lunar" });
  if (lunarHolidays.length === 0) {
    for (const h of data.lunarEveryMonth) {
      if (h.day === lunar.day) result.push({ name: h.name, dayOff: false, source: "lunar" });
    }
  }
  // Giao thừa = ngày mà hôm sau là mùng 1 Tết (tháng Chạp có thể 29 hoặc 30 ngày)
  const next = solarToLunar(jdToDate(jd + 1));
  if (next.day === 1 && next.month === 1 && !next.isLeap) {
    result.push({ ...data.lunarNewYearEve, source: "lunar" });
  }
  return result;
}
