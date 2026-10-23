// Trang 404: báo không tìm thấy và dẫn về các mục chính (giữ người dùng ở lại trang).
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  robots: { index: false, follow: true },
};

const LINKS = [
  { href: "/", label: "Lịch âm hôm nay" },
  { href: "/doi-ngay-am-duong", label: "Đổi ngày âm dương" },
  { href: "/xem-ngay-tot-xau", label: "Xem ngày tốt xấu" },
  { href: "/la-so-tu-vi", label: "Lập lá số tử vi" },
  { href: "/sim-phong-thuy", label: "Sim phong thủy" },
];

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-16 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold">Không tìm thấy trang bạn cần</h1>
      <p className="mt-2 text-muted">Đường dẫn có thể đã sai hoặc trang không còn tồn tại. Bạn thử một trong các mục sau:</p>
      <ul className="mt-6 flex flex-wrap justify-center gap-3">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-block rounded-lg border border-line px-4 py-2 hover:bg-primary-soft hover:text-primary">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
