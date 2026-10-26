// Giao diện sáng/tối. Chưa bấm công tắc: theo cài đặt sáng/tối của trình duyệt.
// Đã bấm: lưu "sang" hoặc "toi" trong localStorage (không gửi lên server) và giữ cố định.
// Kết quả cuối cùng luôn là <html data-theme="light|dark">; màu tối khai báo trong globals.css.

/** Khóa localStorage (phải trùng chuỗi trong applyTheme). */
export const THEME_KEY = "giao-dien";

/**
 * Đọc lựa chọn đã lưu (không có thì theo trình duyệt) rồi gắn data-theme lên <html>.
 * Hàm này còn được nhúng nguyên văn vào <head> (xem themeScript) để chạy TRƯỚC khi trang hiện ra,
 * tránh chớp nền sáng. Vì vậy KHÔNG được dùng biến/hàm/import bên ngoài hàm.
 */
export function applyTheme() {
  let saved: string | null = null;
  try {
    saved = localStorage.getItem("giao-dien");
  } catch {
    // trình duyệt chặn localStorage -> theo trình duyệt
  }
  const dark = saved === "toi" || (saved !== "sang" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

/** Đoạn script chèn vào <head> ở layout.tsx. */
export const themeScript = `(${applyTheme.toString()})()`;
