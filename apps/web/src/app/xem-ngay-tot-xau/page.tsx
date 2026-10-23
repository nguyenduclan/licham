// Trang /xem-ngay-tot-xau?ngay=YYYY-MM-DD&sinh=YYYY-MM-DD
// Phần đọc tham số URL nằm trong Suspense (yêu cầu của cacheComponents).
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { KetQua } from "@/components/xem-ngay/ket-qua";

export const metadata: Metadata = {
  title: "Xem ngày tốt xấu theo tuổi – Lịch Âm Việt Nam",
  description:
    "Xem ngày tốt xấu hợp tuổi: giờ hoàng đạo, ngày kỵ, ngũ hành, Bành Tổ Bách Kỵ, Lục Diệu, Nhị Thập Bát Tú, trực, hướng và giờ xuất hành.",
};

export default function XemNgayPage({ searchParams }: PageProps<"/xem-ngay-tot-xau">) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        ‹ Về trang lịch
      </Link>
      <h1 className="mb-6 mt-2 text-center text-3xl font-bold text-primary">Xem ngày tốt xấu</h1>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-surface" />}>
        <KetQua searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
