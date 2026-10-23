// Thanh đầu trang chung cho mọi trang: logo + tên + menu.
import Link from "next/link";
import { Logo } from "./logo";

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
        {/* Màn hình nhỏ: menu xuống dòng dưới logo và cuộn ngang được */}
        <nav className="-mx-2 flex w-full gap-1 overflow-x-auto text-sm font-medium lg:mx-0 lg:w-auto lg:gap-2">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap rounded-lg px-2 py-1.5 hover:bg-primary-soft hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
