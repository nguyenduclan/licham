// Trang /xem-ngay-tot-xau?ngay=YYYY-MM-DD&sinh=YYYY-MM-DD
// Phần đọc tham số URL nằm trong Suspense (yêu cầu của cacheComponents).
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JsonLd } from "@/components/json-ld";
import { KetQua } from "@/components/xem-ngay/ket-qua";
import { breadcrumbSchema, webAppSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Xem ngày tốt xấu theo tuổi hôm nay",
  description:
    "Xem ngày tốt xấu hợp tuổi: giờ hoàng đạo, ngày kỵ, ngũ hành, Bành Tổ Bách Kỵ, Lục Diệu, Nhị Thập Bát Tú, trực, hướng và giờ xuất hành.",
  // Mọi biến thể ?ngay=&nam= đều trỏ canonical về một trang để Google không coi là trang trùng lặp
  alternates: { canonical: "/xem-ngay-tot-xau" },
};

export default function XemNgayPage({ searchParams }: PageProps<"/xem-ngay-tot-xau">) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:py-12">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Trang chủ", path: "/" }, { name: "Xem ngày tốt xấu", path: "/xem-ngay-tot-xau" }]),
          webAppSchema("Xem ngày tốt xấu theo tuổi", "/xem-ngay-tot-xau", String(metadata.description)),
        ]}
      />
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
