// Thanh đầu trang chung cho mọi trang: logo + tên + menu.
import Link from "next/link";
import { Logo } from "./logo";

const NAV = [
  { href: "/", label: "Lịch âm" },
  { href: "/xem-ngay-tot-xau", label: "Xem ngày tốt xấu" },
  { href: "/la-so-tu-vi", label: "Lá số tử vi" },
  { href: "/sim-phong-thuy", label: "Sim phong thủy" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Lịch Âm Lịch – Trang chủ">
          <Logo size={40} />
          <span className="text-lg font-bold leading-tight text-primary">
            Lịch Âm Lịch
            <span className="block text-xs font-normal text-muted">Lịch vạn niên Việt Nam</span>
          </span>
        </Link>
        <nav className="flex gap-1 text-sm font-medium sm:gap-4">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-lg px-2 py-1.5 hover:bg-primary-soft hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
