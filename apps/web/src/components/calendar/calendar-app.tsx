"use client";

// Khung chính của trang lịch: giữ state tháng đang xem và ngày đang chọn.
// "today" do server tính sẵn (xem home-calendar.tsx) để HTML gửi về đã có nội dung cho SEO.
import Link from "next/link";
import { useState } from "react";
import type { SolarDate } from "lich-core";
import { inPlaceClick } from "@/lib/in-place-click";
import { monthHref } from "@/lib/lich-pages";
import { DayDetail } from "./day-detail";
import { MonthGrid } from "./month-grid";

export function CalendarApp({ today }: { today: SolarDate }) {
  const [selected, setSelected] = useState<SolarDate>(today);
  const [view, setView] = useState({ month: today.month, year: today.year });

  const monthAt = (delta: number) => {
    const index = view.year * 12 + (view.month - 1) + delta;
    return { month: (index % 12) + 1, year: Math.floor(index / 12) };
  };
  const prev = monthAt(-1);
  const next = monthAt(1);

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
          {/* Nút tháng là link thật tới trang tháng (cho Google), bấm thường thì chỉ đổi tháng tại chỗ */}
          <Link
            href={monthHref(prev.month, prev.year)}
            prefetch={false}
            onClick={inPlaceClick(() => setView(prev))}
            className="nav-btn"
            aria-label={`Tháng trước (${prev.month}/${prev.year})`}
          >
            ‹
          </Link>
          <div className="text-center">
            <h2 className="text-lg font-semibold">
              <Link href={monthHref(view.month, view.year)} className="hover:text-primary">
                Tháng {view.month} / {view.year}
              </Link>
            </h2>
            <button onClick={() => selectDay(today)} className="text-sm font-medium text-primary hover:underline">
              Hôm nay
            </button>
          </div>
          <Link
            href={monthHref(next.month, next.year)}
            prefetch={false}
            onClick={inPlaceClick(() => setView(next))}
            className="nav-btn"
            aria-label={`Tháng sau (${next.month}/${next.year})`}
          >
            ›
          </Link>
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
