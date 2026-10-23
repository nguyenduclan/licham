// Trang lịch theo tháng: bảng lịch (mỗi ô dẫn tới trang ngày) + danh sách ngày hoàng đạo, ngày lễ, tiết khí.
import Link from "next/link";
import { jdFromDate } from "lich-core";
import { dayHref, fmt, monthDays, monthHref, tietKhiStarts, yearHref } from "@/lib/lich-pages";
import { daysInMonth, WEEKDAYS_SHORT } from "@/lib/vn-date";
import { Section } from "@/components/xem-ngay/section";
import { Breadcrumb } from "./breadcrumb";

export function MonthPage({ month, year }: { month: number; year: number }) {
  const days = monthDays(month, year);
  const firstJd = jdFromDate(1, month, year);
  const blanks = firstJd % 7; // 0 = Thứ Hai
  const first = days[0].info.lunar;
  const last = days[days.length - 1].info.lunar;
  const hoangDao = days.filter((d) => d.info.isHoangDao);
  const holidays = days.flatMap((d) => d.holidays.map((h) => ({ date: d.info.solar, name: h.name })));
  const tiet = tietKhiStarts(firstJd, firstJd + daysInMonth(month, year) - 1);
  const prev = month === 1 ? { m: 12, y: year - 1 } : { m: month - 1, y: year };
  const next = month === 12 ? { m: 1, y: year + 1 } : { m: month + 1, y: year };

  return (
    <article className="flex flex-col gap-5">
      <Breadcrumb
        items={[
          { name: "Trang chủ", path: "/" },
          { name: `Lịch âm ${year}`, path: yearHref(year) },
          { name: `Tháng ${month}/${year}`, path: monthHref(month, year) },
        ]}
      />
      <header>
        <h1 className="text-3xl font-bold text-primary">Lịch âm tháng {month} năm {year}</h1>
        <p className="mt-3 leading-relaxed">
          Tháng {month}/{year} dương lịch bắt đầu từ ngày <b>{first.day}/{first.month}</b> và kết thúc vào ngày{" "}
          <b>{last.day}/{last.month}</b> âm lịch, năm {days[0].info.canChiYear}
          {last.year !== first.year ? ` – ${days[days.length - 1].info.canChiYear}` : ""}. Trong tháng có {hoangDao.length} ngày
          hoàng đạo{tiet.length > 0 && <> và bắt đầu tiết {tiet.map((t) => t.name).join(", ")}</>}.
        </p>
      </header>

      <Section title={`Bảng lịch tháng ${month}/${year}`}>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {WEEKDAYS_SHORT.map((w, i) => (
            <div key={w} className={`py-1 font-semibold ${i === 6 ? "text-primary" : "text-muted"}`}>{w}</div>
          ))}
          {Array.from({ length: blanks }, (_, i) => <div key={`b${i}`} />)}
          {days.map(({ info, holidays: hs }) => (
            <Link
              key={info.jd}
              href={dayHref(info.solar)}
              title={`${fmt(info.solar)} – âm lịch ${info.lunar.day}/${info.lunar.month}`}
              className="flex flex-col items-center rounded-lg border border-line py-1.5 hover:bg-primary-soft"
            >
              <span className={`font-semibold ${hs.length || info.jd % 7 === 6 ? "text-primary" : ""}`}>{info.solar.day}</span>
              <span className="flex items-center gap-1 text-xs text-muted">
                <span className={`size-1.5 rounded-full ${info.isHoangDao ? "bg-primary" : "bg-dot-hac"}`} />
                {info.lunar.day === 1 ? `${info.lunar.day}/${info.lunar.month}` : info.lunar.day}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Ngày hoàng đạo trong tháng">
          <p>
            {hoangDao.map((d, i) => (
              <span key={d.info.jd}>
                {i > 0 && ", "}
                <Link href={dayHref(d.info.solar)} className="text-primary hover:underline">{d.info.solar.day}/{month}</Link>
              </span>
            ))}
          </p>
        </Section>
        <Section title="Ngày lễ, ngày rằm và tiết khí">
          <ul className="flex flex-col gap-1">
            {holidays.map((h) => (
              <li key={`${h.name}-${h.date.day}`}><b>{fmt(h.date)}</b>: {h.name}</li>
            ))}
            {tiet.map((t) => (
              <li key={t.name}><b>{fmt(t.date)}</b>: bắt đầu tiết {t.name}</li>
            ))}
          </ul>
        </Section>
      </div>

      <nav className="flex justify-between gap-3 text-sm" aria-label="Chuyển tháng">
        <Link href={monthHref(prev.m, prev.y)} className="rounded-lg border border-line px-3 py-2 hover:bg-primary-soft">‹ Tháng {prev.m}/{prev.y}</Link>
        <Link href={yearHref(year)} className="rounded-lg border border-line px-3 py-2 hover:bg-primary-soft">Lịch năm {year}</Link>
        <Link href={monthHref(next.m, next.y)} className="rounded-lg border border-line px-3 py-2 hover:bg-primary-soft">Tháng {next.m}/{next.y} ›</Link>
      </nav>
    </article>
  );
}
