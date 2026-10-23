// Trang lịch theo năm: Tết, tháng nhuận, mùng 1 từng tháng âm, ngày lễ, 24 tiết khí, liên kết 12 tháng.
import Link from "next/link";
import { canChiYear, jdFromDate, menhTheoNam } from "lich-core";
import { dayHref, fmt, holidaysOfYear, lunarYearInfo, monthHref, tietKhiStarts, yearHref } from "@/lib/lich-pages";
import { WEEKDAYS } from "@/lib/vn-date";
import { Section } from "@/components/xem-ngay/section";
import { Breadcrumb } from "./breadcrumb";

export function YearPage({ year }: { year: number }) {
  const { tet, leap, months } = lunarYearInfo(year);
  const menh = menhTheoNam(year);
  const holidays = holidaysOfYear(year);
  const tiet = tietKhiStarts(jdFromDate(1, 1, year), jdFromDate(31, 12, year));
  const tetJd = jdFromDate(tet.day, tet.month, tet.year);
  const leapInfo = months.find((m) => m.isLeap);

  return (
    <article className="flex flex-col gap-5">
      <Breadcrumb items={[{ name: "Trang chủ", path: "/" }, { name: `Lịch âm ${year}`, path: yearHref(year) }]} />
      <header>
        <h1 className="text-3xl font-bold text-primary">Lịch âm năm {year} – năm {canChiYear(year)}</h1>
        <p className="mt-3 leading-relaxed">
          Năm {year} là năm <b>{canChiYear(year)}</b>, mệnh <b>{menh.napAm}</b>. Tết Nguyên Đán {year} rơi vào{" "}
          <b>{WEEKDAYS[tetJd % 7]}, ngày <Link href={dayHref(tet)} className="text-primary hover:underline">{fmt(tet)}</Link></b>{" "}
          dương lịch.{" "}
          {leap && leapInfo
            ? <>Năm âm lịch {year} có <b>tháng {leap} nhuận</b>, bắt đầu từ ngày {fmt(leapInfo.start)}, nên năm này có 13 tháng âm.</>
            : <>Năm âm lịch {year} không có tháng nhuận.</>}
        </p>
      </header>

      <Section title={`Lịch âm 12 tháng năm ${year}`}>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }, (_, i) => (
            <li key={i}>
              <Link href={monthHref(i + 1, year)} className="block rounded-lg border border-line py-2 text-center hover:bg-primary-soft">
                Tháng {i + 1}/{year}
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={`Ngày mùng 1 các tháng âm lịch năm ${canChiYear(year)}`}>
        <table className="w-full text-left text-sm">
          <thead className="text-muted">
            <tr><th className="py-1">Tháng âm</th><th>Mùng 1 (dương lịch)</th><th>Số ngày</th></tr>
          </thead>
          <tbody>
            {months.map((m) => (
              <tr key={`${m.month}${m.isLeap}`} className="border-t border-line">
                <td className="py-1.5">Tháng {m.month}{m.isLeap ? " nhuận" : ""}</td>
                <td><Link href={dayHref(m.start)} className="text-primary hover:underline">{fmt(m.start)}</Link></td>
                <td>{m.length} ({m.length === 30 ? "tháng đủ" : "tháng thiếu"})</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Section title={`Ngày lễ năm ${year}`}>
          <ul className="flex flex-col gap-1">
            {holidays.map((h) => (
              <li key={`${h.name}-${fmt(h.date)}`}>
                <Link href={dayHref(h.date)} className="font-semibold hover:text-primary">{fmt(h.date)}</Link>: {h.name}
                {h.dayOff && <span className="text-primary"> (nghỉ lễ)</span>}
              </li>
            ))}
          </ul>
        </Section>
        <Section title={`24 tiết khí năm ${year}`}>
          <ul className="flex flex-col gap-1">
            {tiet.map((t) => (
              <li key={t.name}><Link href={dayHref(t.date)} className="font-semibold hover:text-primary">{fmt(t.date)}</Link>: {t.name}</li>
            ))}
          </ul>
        </Section>
      </div>

      <nav className="flex justify-between gap-3 text-sm" aria-label="Chuyển năm">
        <Link href={yearHref(year - 1)} className="rounded-lg border border-line px-3 py-2 hover:bg-primary-soft">‹ Lịch âm {year - 1}</Link>
        <Link href={yearHref(year + 1)} className="rounded-lg border border-line px-3 py-2 hover:bg-primary-soft">Lịch âm {year + 1} ›</Link>
      </nav>
    </article>
  );
}
