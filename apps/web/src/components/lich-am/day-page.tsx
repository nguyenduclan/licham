// Trang lịch theo ngày: số liệu đầy đủ + đoạn mô tả riêng (tiết khí, ngày lễ, nên/kiêng) + liên kết.
import Link from "next/link";
import { jdFromDate, jdToDate, toIso, type SolarDate } from "lich-core";
import { getHolidays } from "@/lib/holidays";
import { dayHref, fmt, monthHref, tietKhiInfo, yearHref } from "@/lib/lich-pages";
import { WEEKDAYS } from "@/lib/vn-date";
import { buildXemNgay } from "@/lib/xem-ngay";
import { HourList, Section } from "@/components/xem-ngay/section";
import { Breadcrumb } from "./breadcrumb";

export function DayPage({ date }: { date: SolarDate }) {
  const d = buildXemNgay(date, null);
  const { info } = d;
  const { lunar } = info;
  const holidays = getHolidays(date, lunar, info.jd);
  const tk = tietKhiInfo(info.tietKhi);
  const jd = jdFromDate(date.day, date.month, date.year);
  const prev = jdToDate(jd - 1);
  const next = jdToDate(jd + 1);
  const amLich = `${lunar.day}/${lunar.month}${lunar.isLeap ? " (nhuận)" : ""}`;

  return (
    <article className="flex flex-col gap-5">
      <Breadcrumb
        items={[
          { name: "Trang chủ", path: "/" },
          { name: `Lịch âm ${date.year}`, path: yearHref(date.year) },
          { name: `Tháng ${date.month}/${date.year}`, path: monthHref(date.month, date.year) },
          { name: fmt(date), path: dayHref(date) },
        ]}
      />
      <header>
        <h1 className="text-3xl font-bold text-primary">Lịch âm ngày {fmt(date)}</h1>
        <p className="mt-3 leading-relaxed">
          {WEEKDAYS[jd % 7]}, ngày {fmt(date)} dương lịch là ngày <b>{amLich}</b> năm <b>{info.canChiYear}</b> âm lịch, tức
          ngày <b>{info.canChiDay}</b>, tháng <b>{info.canChiMonth}</b>. Đây là ngày{" "}
          <b className={info.isHoangDao ? "text-primary" : ""}>{info.isHoangDao ? "hoàng đạo" : "hắc đạo"}</b> ({info.thanNgay}),
          thuộc tiết <b>{info.tietKhi}</b>, trực <b>{d.truc.name}</b>, sao <b>{d.tu.name}</b>.
          {holidays.length > 0 && <> Ngày này là <b>{holidays.map((h) => h.name).join(", ")}</b>.</>}
        </p>
      </header>

      <Section title="Thông tin ngày">
        <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {[
            ["Âm lịch", `${amLich} năm ${info.canChiYear}`],
            ["Can chi", `Ngày ${info.canChiDay}, tháng ${info.canChiMonth}`],
            ["Mệnh ngày (nạp âm)", info.napAm],
            ["Hoàng đạo / hắc đạo", `${info.isHoangDao ? "Hoàng đạo" : "Hắc đạo"} (${info.thanNgay})`],
            ["Tuổi xung với ngày", info.tuoiXung.join(", ")],
            ["Tiết khí", info.tietKhi],
            ["Hướng xuất hành", `Hỷ Thần: ${d.huong.hyThan} · Tài Thần: ${d.huong.taiThan}`],
            ["Ngày kỵ", d.ngayKy.length ? d.ngayKy.map((k) => k.ten).join(", ") : "Không phạm"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-sm text-muted">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section title="Giờ hoàng đạo">
        <HourList hours={d.gioHoangDao} />
      </Section>

      <Section title="Việc nên làm và nên tránh">
        <p>
          <span className="text-muted">Theo trực {d.truc.name}:</span> nên {d.truc.nen.toLowerCase()} Tránh{" "}
          {d.truc.kieng.toLowerCase()}
        </p>
        <p>
          <span className="text-muted">Theo sao {d.tu.name} ({d.tu.ten}):</span> nên {d.tu.nen.toLowerCase()} Kiêng{" "}
          {d.tu.kieng.toLowerCase()}
        </p>
        {d.ngayKy.map((k) => (
          <p key={k.ten}>
            <span className="text-muted">{k.ten}:</span> {k.moTa}
          </p>
        ))}
      </Section>

      {tk && (
        <Section title={`Tiết ${info.tietKhi}`}>
          <p>{tk.moTa}</p>
          <p className="text-sm text-muted">Tiết {info.tietKhi} thường bắt đầu vào khoảng ngày {tk.khoangNgay} dương lịch.</p>
        </Section>
      )}

      <nav className="flex flex-wrap justify-between gap-3 text-sm" aria-label="Chuyển ngày">
        <Link href={dayHref(prev)} className="rounded-lg border border-line px-3 py-2 hover:bg-primary-soft">‹ {fmt(prev)}</Link>
        <Link href={`/xem-ngay-tot-xau?ngay=${toIso(date)}`} className="rounded-lg bg-primary px-3 py-2 font-semibold text-on-primary">
          Ngày này có hợp tuổi bạn?
        </Link>
        <Link href={dayHref(next)} className="rounded-lg border border-line px-3 py-2 hover:bg-primary-soft">{fmt(next)} ›</Link>
      </nav>
      <p className="text-sm text-muted">
        Xem thêm: <Link href={monthHref(date.month, date.year)} className="text-primary hover:underline">lịch âm tháng {date.month}/{date.year}</Link> ·{" "}
        <Link href={yearHref(date.year)} className="text-primary hover:underline">lịch âm năm {date.year}</Link>. Nội dung xem ngày mang tính tham khảo.
      </p>
    </article>
  );
}
