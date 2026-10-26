"use client";

// Thẻ chi tiết ngày: ngày dương, ngày âm, can chi, mệnh ngày, hoàng/hắc đạo, tuổi xung, giờ hoàng đạo.
import { chiHourStart, DIA_CHI, getDayInfo, type SolarDate } from "lich-core";
import Link from "next/link";
import { toIso } from "lich-core";
import { HourList } from "@/components/xem-ngay/section";
import { XemNgayForm } from "@/components/xem-ngay/xem-ngay-form";
import { getHolidays } from "@/lib/holidays";
import { dayHref } from "@/lib/lich-pages";
import { WEEKDAYS } from "@/lib/vn-date";

export function DayDetail({ date }: { date: SolarDate }) {
  const info = getDayInfo(date);
  const { lunar } = info;
  const holidays = getHolidays(date, lunar, info.jd);

  return (
    <article className="flex flex-col gap-5 self-start rounded-2xl border border-line bg-surface p-6 shadow-sm">
      <header className="text-center">
        {/* Tiêu đề cho máy đọc (Google, trình đọc màn hình); giao diện đã thể hiện bằng số ngày lớn bên dưới */}
        <h2 className="sr-only">
          Lịch âm ngày {date.day}/{date.month}/{date.year}
        </h2>
        <p className="text-sm font-medium uppercase tracking-wide text-muted">
          {WEEKDAYS[info.jd % 7]} · Tháng {date.month}/{date.year}
        </p>
        <p className="my-2 text-7xl font-bold text-primary sm:text-8xl">{date.day}</p>
        <p className="text-lg">
          Ngày <b>{lunar.day}</b> tháng <b>{lunar.month}</b>
          {lunar.isLeap && " (nhuận)"} năm <b>{info.canChiYear}</b>
        </p>
        <Link href={dayHref(date)} className="mt-1 inline-block text-sm font-medium text-primary hover:underline">
          Xem chi tiết ngày {date.day}/{date.month}/{date.year} ›
        </Link>
        {holidays.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {holidays.map((h) => (
              <span key={h.name} className="rounded-full bg-primary-soft px-3 py-1 text-sm font-medium text-primary">
                {h.name}
              </span>
            ))}
          </div>
        )}
      </header>

      <dl className="grid grid-cols-3 gap-2 text-center text-sm">
        <InfoItem label="Ngày" value={info.canChiDay} />
        <InfoItem label="Tháng" value={info.canChiMonth} />
        <InfoItem label="Năm" value={info.canChiYear} />
      </dl>

      <ul className="flex flex-col gap-2 text-sm">
        <li>
          <span className="text-muted">Mệnh ngày:</span> <b>{info.napAm}</b> –{" "}
          <span
            className={`inline-flex items-center gap-1 font-semibold ${info.isHoangDao ? "text-primary" : "text-muted"}`}
          >
            <span className={`size-2 rounded-full ${info.isHoangDao ? "bg-primary" : "bg-dot-hac"}`} />
            Ngày {info.isHoangDao ? "hoàng đạo" : "hắc đạo"} ({info.thanNgay})
          </span>
        </li>
        <li>
          <span className="text-muted">Tuổi xung:</span> <b>{info.tuoiXung.join(", ")}</b>
        </li>
        <li>
          <span className="text-muted">Tiết khí:</span> <b className="text-accent">{info.tietKhi}</b>
        </li>
      </ul>

      <section className="text-sm">
        <h3 className="mb-2 font-semibold text-muted">Giờ hoàng đạo</h3>
        <HourList
          hours={info.gioHoangDao.map((chi) => {
            const start = chiHourStart(chi);
            return { chi: DIA_CHI[chi], range: `${start}h–${(start + 2) % 24}h` };
          })}
          caption={`Giờ hoàng đạo ngày ${date.day}/${date.month}/${date.year}`}
          cellClassName="bg-primary-soft"
        />
      </section>

      <section className="border-t border-line pt-4">
        <h3 className="mb-3 text-sm font-semibold text-muted">Ngày này có hợp tuổi bạn không?</h3>
        {/* key: đổi ngày chọn thì form tạo lại để ô "Ngày cần xem" cập nhật theo */}
        <XemNgayForm key={toIso(date)} date={date} />
      </section>
    </article>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background px-2 py-2">
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}
