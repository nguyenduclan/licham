"use client";

// Công tắc sáng/tối trên header: đang sáng hiện mặt trời, đang tối hiện mặt trăng; bấm để đổi.
// Icon đổi bằng CSS theo data-theme (biến thể dark: trong globals.css) nên hiện đúng ngay khi trang tải,
// không phải chờ JavaScript.
import { useEffect } from "react";
import { applyTheme, THEME_KEY } from "@/lib/theme";

export function ThemeSwitch() {
  // Chưa bấm lần nào thì đi theo trình duyệt: máy đổi sáng/tối là trang đổi theo.
  // Đổi ở tab khác (sự kiện "storage") cũng áp dụng lại.
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", applyTheme);
    window.addEventListener("storage", applyTheme);
    return () => {
      media.removeEventListener("change", applyTheme);
      window.removeEventListener("storage", applyTheme);
    };
  }, []);

  const toggle = () => {
    const isDark = document.documentElement.dataset.theme === "dark";
    try {
      localStorage.setItem(THEME_KEY, isDark ? "sang" : "toi");
      applyTheme();
    } catch {
      // không lưu được thì vẫn đổi cho lần xem này
      document.documentElement.dataset.theme = isDark ? "light" : "dark";
    }
  };

  return (
    <button type="button" onClick={toggle} aria-label="Đổi nền sáng/tối" title="Đổi nền sáng/tối" className="nav-btn">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {/* Mặt trời: hiện khi nền sáng */}
        <g className="dark:hidden">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </g>
        {/* Mặt trăng: hiện khi nền tối */}
        <path className="hidden dark:inline" d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
