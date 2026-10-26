// Trang chủ: tiêu đề tĩnh + lịch tương tác. Phần lịch phụ thuộc "hôm nay" nên nằm trong Suspense,
// nhưng được render trên server cho từng request (HomeCalendar) nên HTML vẫn có đủ nội dung.
// JSON-LD WebSite/Organization nằm ở layout (có trên mọi trang).
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { HomeCalendar } from "@/components/calendar/home-calendar";
import { yearHref } from "@/lib/lich-pages";
import { pageMeta } from "@/lib/seo";
import { SEO_YEARS, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = pageMeta({ description: SITE_DESCRIPTION, path: "/" });

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">Lịch Âm Hôm Nay</h1>
        <p className="mt-2 text-muted">
          Lịch vạn niên Việt Nam: ngày âm lịch, can chi, ngày hoàng đạo, giờ hoàng đạo và tiết khí
        </p>
      </header>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-surface" />}>
        <HomeCalendar />
      </Suspense>
      {/* Liên kết nội bộ tới trang năm (thay cho chân trang đang tạm ẩn) để Google đi tới các trang lịch */}
      <nav aria-labelledby="lich-theo-nam" className="mt-6 text-center">
        <h2 id="lich-theo-nam" className="mb-2 font-semibold">Lịch âm theo năm</h2>
        <ul className="flex flex-wrap justify-center gap-2 text-sm">
          {SEO_YEARS.map((y) => (
            <li key={y}>
              <Link href={yearHref(y)} className="inline-block rounded-lg border border-line px-3 py-1.5 hover:bg-primary-soft hover:text-primary">
                Lịch âm năm {y}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
