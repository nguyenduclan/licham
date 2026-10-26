"use client";

// Menu đầu trang. Điện thoại (< 640px): nút ☰ mở danh sách xổ xuống dưới header.
// Từ 640px trở lên: menu ngang như cũ. Link luôn có trong HTML (chỉ ẩn bằng CSS) nên Google vẫn đọc được.
// Không dùng usePathname (tô mục đang xem): với cacheComponents nó làm hỏng prerender trang /lich-am/[slug].
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

/** children: các nút đặt cạnh nút ☰ (ví dụ công tắc sáng/tối); máy tính thì nằm cuối hàng menu. */
export function SiteNav({ items, children }: { items: { href: string; label: string }[]; children?: ReactNode }) {
  const [open, setOpen] = useState(false);

  // Nhấn Esc thì đóng menu (bấm vào một mục cũng đóng, xem onClick của Link)
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="flex items-center gap-1 lg:order-last">
        {children}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="menu-chinh"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          className="nav-btn sm:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>
      {/* Điện thoại: ẩn khi đóng, mở thì thành danh sách dọc. Màn lớn hơn: menu ngang cuộn được như cũ */}
      <nav
        id="menu-chinh"
        aria-label="Menu chính"
        className={`${open ? "flex" : "hidden"} w-full flex-col gap-1 border-t border-line pt-2 font-medium sm:-mx-2 sm:flex sm:flex-row sm:overflow-x-auto sm:border-0 sm:pt-0 sm:text-sm lg:mx-0 lg:w-auto lg:gap-2`}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className="whitespace-nowrap rounded-lg px-3 py-2.5 hover:bg-primary-soft hover:text-primary sm:px-2 sm:py-1.5"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
