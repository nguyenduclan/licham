// Chân trang chung: liên kết nội bộ tới mọi mục (tốt cho SEO và người dùng) + giới thiệu ngắn.
import Link from "next/link";
import { SEO_YEARS, SITE_NAME } from "@/lib/site";
import { Logo } from "./logo";

const TOOLS = [
  { href: "/", label: "Lịch âm hôm nay" },
  { href: "/doi-ngay-am-duong", label: "Đổi ngày âm dương" },
  { href: "/xem-ngay-tot-xau", label: "Xem ngày tốt xấu" },
  { href: "/la-so-tu-vi", label: "Lập lá số tử vi" },
  { href: "/sim-phong-thuy", label: "Sim phong thủy" },
];

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-line bg-surface">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 text-sm sm:grid-cols-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Logo size={32} />
            <b className="text-primary">{SITE_NAME}</b>
          </div>
          <p className="text-muted">
            Lịch vạn niên Việt Nam: tra cứu ngày âm lịch, can chi, ngày tốt xấu, giờ hoàng đạo. Nội dung xem ngày, tử vi, phong
            thủy chỉ mang tính tham khảo.
          </p>
        </div>
        <nav aria-label="Công cụ">
          <h2 className="mb-2 font-semibold">Công cụ</h2>
          <ul className="flex flex-col gap-1.5">
            {TOOLS.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="text-muted hover:text-primary">{t.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Lịch âm theo năm">
          <h2 className="mb-2 font-semibold">Lịch âm theo năm</h2>
          <ul className="flex flex-col gap-1.5">
            {SEO_YEARS.map((y) => (
              <li key={y}>
                <Link href={`/lich-am/nam-${y}`} className="text-muted hover:text-primary">Lịch âm năm {y}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
