"use client";

// Một ô trong lịch tháng: ngày dương + chấm hoàng/hắc đạo, ngày âm, can chi, ngày lễ.
import Link from "next/link";
import type { DayInfo } from "lich-core";
import type { Holiday } from "@/lib/holidays";
import { inPlaceClick } from "@/lib/in-place-click";
import { dayHref } from "@/lib/lich-pages";

interface Props {
  info: DayInfo;
  holidays: Holiday[];
  inMonth: boolean;
  isSunday: boolean;
  isToday: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export function DayCell({ info, holidays, inMonth, isSunday, isToday, isSelected, onClick }: Props) {
  const { solar, lunar } = info;
  const redSolar = inMonth && (isSunday || holidays.length > 0);
  const redLunar = inMonth && (lunar.day === 1 || lunar.day === 15 || holidays.some((h) => h.source === "lunar"));
  const lunarLabel = lunar.day === 1 ? `${lunar.day}/${lunar.month}${lunar.isLeap ? "N" : ""}` : `${lunar.day}`;

  return (
    // Link thật tới trang ngày (Google lần theo được); bấm thường thì chỉ chọn ngày tại chỗ.
    // prefetch={false}: tránh tải trước cả chục trang ngày đang hiện trên lịch.
    <Link
      href={dayHref(solar)}
      prefetch={false}
      onClick={inPlaceClick(onClick)}
      aria-label={`${solar.day}/${solar.month}/${solar.year}, âm lịch ${lunarLabel}, ngày ${info.isHoangDao ? "hoàng đạo" : "hắc đạo"}`}
      aria-current={isSelected ? "date" : undefined}
      className={[
        "relative flex h-full min-h-16 flex-col p-1 text-left transition-colors sm:min-h-28 sm:p-2",
        isToday ? "bg-today" : "hover:bg-primary-soft",
        isSelected ? "z-10 outline-2 -outline-offset-2 outline-primary" : "",
        inMonth ? "" : "opacity-45",
      ].join(" ")}
    >
      <div className="flex items-start gap-1">
        <span className={`text-lg font-semibold leading-none sm:text-3xl ${redSolar ? "text-primary" : ""}`}>
          {String(solar.day).padStart(2, "0")}
        </span>
        <span
          title={info.isHoangDao ? "Ngày hoàng đạo" : "Ngày hắc đạo"}
          className={`mt-0.5 size-1.5 shrink-0 rounded-full sm:size-2 ${info.isHoangDao ? "bg-primary" : "bg-dot-hac"}`}
        />
      </div>
      <span
        className={`mt-auto block w-full text-right text-[11px] sm:mt-1 sm:text-sm ${
          redLunar ? "font-semibold text-primary" : ""
        }`}
      >
        {lunarLabel}
      </span>
      <span className="hidden text-center text-xs text-muted sm:block">
        {inMonth ? info.canChiDay : `Ngày ${info.canChiDay}`}
      </span>
      {inMonth && holidays.length > 0 && (
        <span className="mt-0.5 hidden text-center text-xs leading-tight text-primary sm:block">
          {holidays.map((h) => h.name).join(" · ")}
        </span>
      )}
    </Link>
  );
}
