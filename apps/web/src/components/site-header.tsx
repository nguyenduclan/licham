// Thanh đầu trang chung cho mọi trang: logo + tên + menu.
import Link from "next/link";
import { Logo } from "./logo";
import { SiteNav } from "./site-nav";
import { ThemeSwitch } from "./theme-switch";

const NAV = [
  { href: "/", label: "Lịch âm" },
  { href: "/doi-ngay-am-duong", label: "Đổi ngày" },
  { href: "/xem-ngay-tot-xau", label: "Xem ngày tốt xấu" },
  { href: "/la-so-tu-vi", label: "Lá số tử vi" },
  { href: "/sim-phong-thuy", label: "Sim phong thủy" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Lịch Âm Lịch – Trang chủ">
          <Logo size={40} />
          <span className="text-lg font-bold leading-tight text-primary">
            Lịch Âm Lịch
            <span className="block text-xs font-normal text-muted">Lịch vạn niên Việt Nam</span>
          </span>
        </Link>
        {/* Điện thoại: nút ☰ + menu xổ xuống; tablet: menu xuống dòng dưới logo, cuộn ngang; máy tính: cùng hàng logo */}
        <SiteNav items={NAV}>
          <ThemeSwitch />
        </SiteNav>
      </div>
    </header>
  );
}
