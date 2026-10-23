// Trang chủ: tiêu đề tĩnh + lịch tương tác (phần lịch phụ thuộc ngày hôm nay nên nằm trong Suspense).
import { Suspense } from "react";
import { CalendarApp } from "@/components/calendar/calendar-app";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">Lịch Âm Việt Nam</h1>
        <p className="mt-2 text-muted">Xem ngày âm lịch, can chi, tiết khí và giờ hoàng đạo</p>
      </header>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-surface" />}>
        <CalendarApp />
      </Suspense>
    </main>
  );
}
