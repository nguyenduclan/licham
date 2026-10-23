"use client";

// Lưới lịch tháng kiểu bảng: luôn bắt đầu từ Thứ Hai, ngày của tháng trước/sau hiện mờ.
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

  return (
    <div>
      <div className="grid grid-cols-7 border-l border-t border-line">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`border-b border-r border-line bg-background py-2 text-center text-xs font-medium sm:text-sm ${
              i === 6 ? "text-primary" : "text-muted"
            }`}
          >
            <span className="sm:hidden">{WEEKDAYS_SHORT[i]}</span>
            <span className="hidden sm:inline">{w}</span>
          </div>
        ))}
        {cells.map(({ info, holidays, inMonth }, i) => (
          <DayCell
            key={info.jd}
            info={info}
            holidays={holidays}
            inMonth={inMonth}
            isSunday={i % 7 === 6}
            isToday={isSameDay(info.solar, today)}
            isSelected={isSameDay(info.solar, selected)}
            onClick={() => onSelect(info.solar)}
          />
        ))}
      </div>
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
