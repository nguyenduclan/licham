"use client";

// Thẻ chi tiết ngày: ngày dương, ngày âm, can chi, mệnh ngày, hoàng/hắc đạo, tuổi xung, giờ hoàng đạo.
import { chiHourStart, DIA_CHI, getDayInfo, type SolarDate } from "lich-core";
import { toIso } from "lich-core";
import { XemNgayForm } from "@/components/xem-ngay/xem-ngay-form";
import { getHolidays } from "@/lib/holidays";
import { WEEKDAYS } from "@/lib/vn-date";

export function DayDetail({ date }: { date: SolarDate }) {
  const info = getDayInfo(date);
  const { lunar } = info;
  const holidays = getHolidays(date, lunar, info.jd);

  return (
    <section className="flex flex-col gap-5 self-start rounded-2xl border border-line bg-surface p-6 shadow-sm">
      <div className="text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-muted">
          {WEEKDAYS[info.jd % 7]} · Tháng {date.month}/{date.year}
        </p>
        <p className="my-2 text-7xl font-bold text-primary sm:text-8xl">{date.day}</p>
        <p className="text-lg">
          Ngày <b>{lunar.day}</b> tháng <b>{lunar.month}</b>
          {lunar.isLeap && " (nhuận)"} năm <b>{info.canChiYear}</b>
        </p>
        {holidays.length > 0 && (
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {holidays.map((h) => (
              <span key={h.name} className="rounded-full bg-primary-soft px-3 py-1 text-sm font-medium text-primary">
                {h.name}
              </span>
            ))}
          </div>
        )}
      </div>

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

      <div>
        <h3 className="mb-2 text-sm font-semibold text-muted">Giờ hoàng đạo</h3>
        <ul className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
          {info.gioHoangDao.map((chi) => {
            const start = chiHourStart(chi);
            return (
              <li key={chi} className="flex flex-col items-center rounded-lg bg-primary-soft px-2 py-1.5">
                <b>{DIA_CHI[chi]}</b>
                <span className="whitespace-nowrap text-muted">
                  ({start}h–{(start + 2) % 24}h)
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-line pt-4">
        <h3 className="mb-3 text-sm font-semibold text-muted">Ngày này có hợp tuổi bạn không?</h3>
        {/* key: đổi ngày chọn thì form tạo lại để ô "Ngày cần xem" cập nhật theo */}
        <XemNgayForm key={toIso(date)} date={date} />
      </div>
    </section>
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
