"use client";

// Công cụ đổi ngày dương -> âm và âm -> dương. Tính ngay trên trình duyệt khi gõ, không gửi đi đâu.
import Link from "next/link";
import { useState } from "react";
import { canChiDay, canChiMonth, canChiYear, jdFromDate, lunarToSolar, solarToLunar, type SolarDate } from "lich-core";
import { DateInput } from "@/components/date-input";
import { dayHref, fmt } from "@/lib/lich-pages";
import { WEEKDAYS } from "@/lib/vn-date";

const parse = (iso: string): SolarDate | null => {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  return { day, month, year };
};

/** Ngày âm (có/không nhuận) có tồn tại không: đổi sang dương rồi đổi ngược phải ra đúng ngày đó. */
const lunarExists = (d: SolarDate, isLeap: boolean) => {
  const s = lunarToSolar({ ...d, isLeap });
  if (!s) return false;
  const b = solarToLunar(s);
  return b.day === d.day && b.month === d.month && b.year === d.year && b.isLeap === isLeap;
};

const card = "flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6";

export function DoiNgayApp() {
  const [solar, setSolar] = useState<SolarDate | null>(null);
  const [lunarInput, setLunarInput] = useState<SolarDate | null>(null);
  const [isLeap, setIsLeap] = useState(false);

  const lunarOfSolar = solar ? solarToLunar(solar) : null;
  const solarOfLunar = lunarInput && lunarExists(lunarInput, isLeap) ? lunarToSolar({ ...lunarInput, isLeap }) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className={card}>
        <h2 className="text-lg font-bold text-primary">Đổi ngày dương sang âm</h2>
        <DateInput label="Ngày dương lịch" onValueChange={(iso) => setSolar(parse(iso))} />
        {solar && lunarOfSolar && (
          <div className="rounded-xl bg-primary-soft p-4">
            <p>
              {WEEKDAYS[jdFromDate(solar.day, solar.month, solar.year) % 7]}, {fmt(solar)} là ngày{" "}
              <b className="text-primary">
                {lunarOfSolar.day}/{lunarOfSolar.month}
                {lunarOfSolar.isLeap ? " (nhuận)" : ""}/{lunarOfSolar.year}
              </b>{" "}
              âm lịch.
            </p>
            <p className="mt-1 text-sm text-muted">
              Ngày {canChiDay(jdFromDate(solar.day, solar.month, solar.year))}, tháng {canChiMonth(lunarOfSolar.month, lunarOfSolar.year)},
              năm {canChiYear(lunarOfSolar.year)}
            </p>
            <Link href={dayHref(solar)} className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
              Xem chi tiết ngày {fmt(solar)} ›
            </Link>
          </div>
        )}
      </section>

      <section className={card}>
        <h2 className="text-lg font-bold text-primary">Đổi ngày âm sang dương</h2>
        <DateInput
          label="Ngày âm lịch"
          onValueChange={(iso) => setLunarInput(parse(iso))}
          isValid={(d) => lunarExists(d, false) || lunarExists(d, true)}
          errorMessage="Ngày âm lịch không tồn tại (tháng âm chỉ có 29 hoặc 30 ngày)"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isLeap} onChange={(e) => setIsLeap(e.target.checked)} /> Tháng nhuận
        </label>
        {lunarInput && !solarOfLunar && (
          <p className="text-sm text-primary">
            {isLeap ? `Năm ${lunarInput.year} không có tháng ${lunarInput.month} nhuận.` : "Ngày âm lịch này không tồn tại."}
          </p>
        )}
        {solarOfLunar && lunarInput && (
          <div className="rounded-xl bg-primary-soft p-4">
            <p>
              Ngày {lunarInput.day}/{lunarInput.month}
              {isLeap ? " (nhuận)" : ""} năm {canChiYear(lunarInput.year)} âm lịch là{" "}
              <b className="text-primary">
                {WEEKDAYS[jdFromDate(solarOfLunar.day, solarOfLunar.month, solarOfLunar.year) % 7]}, {fmt(solarOfLunar)}
              </b>{" "}
              dương lịch.
            </p>
            <Link href={dayHref(solarOfLunar)} className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
              Xem chi tiết ngày {fmt(solarOfLunar)} ›
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
