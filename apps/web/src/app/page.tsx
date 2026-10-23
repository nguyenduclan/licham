// Trang chủ: tiêu đề tĩnh + lịch tương tác. Phần lịch phụ thuộc "hôm nay" nên nằm trong Suspense,
// nhưng được render trên server cho từng request (HomeCalendar) nên HTML vẫn có đủ nội dung.
import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeCalendar } from "@/components/calendar/home-calendar";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:py-10">
      <JsonLd data={[websiteSchema, organizationSchema]} />
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">Lịch Âm Hôm Nay</h1>
        <p className="mt-2 text-muted">
          Lịch vạn niên Việt Nam: ngày âm lịch, can chi, ngày hoàng đạo, giờ hoàng đạo và tiết khí
        </p>
      </header>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-surface" />}>
        <HomeCalendar />
      </Suspense>
    </main>
  );
}
