"use client";

// Khung chính của trang lịch: giữ state tháng đang xem và ngày đang chọn.
import { io } from "next/cache";
import { use, useState } from "react";
import type { SolarDate } from "lich-core";
import { todayInVietnam } from "@/lib/vn-date";
import { DayDetail } from "./day-detail";
import { MonthGrid } from "./month-grid";

export function CalendarApp() {
  // Ngày hôm nay phải tính lúc có request, không chụp vào trang tĩnh lúc build
  use(io());
  const [today] = useState(todayInVietnam);
  const [selected, setSelected] = useState<SolarDate>(today);
  const [view, setView] = useState({ month: today.month, year: today.year });

  const shiftMonth = (delta: number) =>
    setView(({ month, year }) => {
      const index = year * 12 + (month - 1) + delta;
      return { month: (index % 12) + 1, year: Math.floor(index / 12) };
    });

  // Chọn ngày; nếu bấm vào ngày mờ của tháng trước/sau thì chuyển luôn sang tháng đó
  const selectDay = (date: SolarDate) => {
    setSelected(date);
    setView({ month: date.month, year: date.year });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
      <DayDetail date={selected} />
      <section className="rounded-2xl border border-line bg-surface p-3 shadow-sm sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button onClick={() => shiftMonth(-1)} className="nav-btn" aria-label="Tháng trước">
            ‹
          </button>
          <div className="text-center">
            <h2 className="text-lg font-semibold">
              Tháng {view.month} / {view.year}
            </h2>
            <button onClick={() => selectDay(today)} className="text-sm font-medium text-primary hover:underline">
              Hôm nay
            </button>
          </div>
          <button onClick={() => shiftMonth(1)} className="nav-btn" aria-label="Tháng sau">
            ›
          </button>
        </div>
        <MonthGrid
          month={view.month}
          year={view.year}
          today={today}
          selected={selected}
          onSelect={selectDay}
        />
      </section>
    </div>
  );
}
