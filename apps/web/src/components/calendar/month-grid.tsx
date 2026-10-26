"use client";

// Lịch tháng dạng bảng (<table>): luôn bắt đầu từ Thứ Hai, ngày của tháng trước/sau hiện mờ.
import { useMemo } from "react";
import { getDayInfo, jdFromDate, jdToDate, type SolarDate } from "lich-core";
import { getHolidays } from "@/lib/holidays";
import { daysInMonth, isSameDay, WEEKDAYS, WEEKDAYS_SHORT } from "@/lib/vn-date";
import { DayCell } from "./day-cell";

interface Props {
  month: number;
  year: number;
  today: SolarDate;
  selected: SolarDate;
  onSelect: (date: SolarDate) => void;
}

export function MonthGrid({ month, year, today, selected, onSelect }: Props) {
  const cells = useMemo(() => {
    const firstJd = jdFromDate(1, month, year);
    const startJd = firstJd - (firstJd % 7); // lùi về Thứ Hai gần nhất (jd % 7 = 0 là Thứ Hai)
    const total = Math.ceil((firstJd - startJd + daysInMonth(month, year)) / 7) * 7;
    return Array.from({ length: total }, (_, i) => {
      const jd = startJd + i;
      const info = getDayInfo(jdToDate(jd));
      return { info, holidays: getHolidays(info.solar, info.lunar, jd), inMonth: info.solar.month === month };
    });
  }, [month, year]);

  // Chia thành từng tuần (7 ô) để dựng bảng <table>: dữ liệu dạng bảng giúp Google/AI đọc đúng cột thứ - ngày
  const weeks = Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));

  return (
    <div>
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">Lịch âm dương tháng {month}/{year}</caption>
        <thead>
          <tr>
            {WEEKDAYS.map((w, i) => (
              <th
                key={w}
                scope="col"
                className={`border border-line bg-background py-2 text-center text-xs font-medium sm:text-sm ${
                  i === 6 ? "text-primary" : "text-muted"
                }`}
              >
                <span className="sm:hidden">{WEEKDAYS_SHORT[i]}</span>
                <span className="hidden sm:inline">{w}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0].info.jd}>
              {week.map(({ info, holidays, inMonth }, i) => (
                // h-px: mẹo để ô con h-full cao bằng cả hàng
                <td key={info.jd} className="h-px border border-line p-0 align-top">
                  <DayCell
                    info={info}
                    holidays={holidays}
                    inMonth={inMonth}
                    isSunday={i === 6}
                    isToday={isSameDay(info.solar, today)}
                    isSelected={isSameDay(info.solar, selected)}
                    onClick={() => onSelect(info.solar)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" /> Ngày hoàng đạo
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-dot-hac" /> Ngày hắc đạo
        </span>
      </div>
    </div>
  );
}
