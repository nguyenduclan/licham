// /lich-am/2026-10-23 (ngày), /lich-am/thang-10-2026 (tháng), /lich-am/nam-2026 (năm).
// Các năm trong SEO_YEARS được dựng sẵn lúc build; năm khác (1900-2100) tạo ở lần truy cập đầu rồi lưu lại.
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canChiYear, getDayInfo } from "lich-core";
import { DayPage } from "@/components/lich-am/day-page";
import { MonthPage } from "@/components/lich-am/month-page";
import { YearPage } from "@/components/lich-am/year-page";
import { fmt, lunarYearInfo, parseLichSlug, seoSlugs } from "@/lib/lich-pages";
import { pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return seoSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/lich-am/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = parseLichSlug(slug);
  if (!p) return {};
  const path = `/lich-am/${slug}`;
  if (p.kind === "day") {
    const info = getDayInfo(p.date);
    const am = `${info.lunar.day}/${info.lunar.month}${info.lunar.isLeap ? " nhuận" : ""}`;
    return pageMeta({
      title: `Lịch âm ngày ${fmt(p.date)} – Âm lịch ${am} ${info.canChiYear}`,
      description: `Ngày ${fmt(p.date)} là ngày ${am} âm lịch năm ${info.canChiYear}, ngày ${info.canChiDay}, ${
        info.isHoangDao ? "ngày hoàng đạo" : "ngày hắc đạo"
      } (${info.thanNgay}), tiết ${info.tietKhi}. Xem giờ hoàng đạo, tuổi xung, việc nên làm và nên tránh.`,
      path,
    });
  }
  if (p.kind === "month") {
    return pageMeta({
      title: `Lịch âm tháng ${p.month} năm ${p.year}`,
      description: `Lịch âm tháng ${p.month}/${p.year}: đối chiếu ngày dương – âm, ngày hoàng đạo, ngày lễ, ngày rằm, mùng 1 và tiết khí trong tháng.`,
      path,
    });
  }
  const { tet } = lunarYearInfo(p.year);
  return pageMeta({
    title: `Lịch âm năm ${p.year} – Năm ${canChiYear(p.year)}, Tết ngày ${fmt(tet)}`,
    description: `Lịch âm ${p.year} (${canChiYear(p.year)}): Tết Nguyên Đán ngày ${fmt(tet)}, tháng nhuận, ngày mùng 1 các tháng âm, ngày lễ và 24 tiết khí trong năm.`,
    path,
  });
}

export default async function LichAmPage({ params }: PageProps<"/lich-am/[slug]">) {
  const { slug } = await params;
  const p = parseLichSlug(slug);
  if (!p) notFound();
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:py-10">
      {p.kind === "day" && <DayPage date={p.date} />}
      {p.kind === "month" && <MonthPage month={p.month} year={p.year} />}
      {p.kind === "year" && <YearPage year={p.year} />}
    </main>
  );
}
