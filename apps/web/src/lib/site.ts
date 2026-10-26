// Thông tin chung của website (dùng cho SEO, sitemap, manifest).
// Khi có tên miền thật: đặt NEXT_PUBLIC_SITE_URL=https://ten-mien.vn trong file .env
// Bản build production BẮT BUỘC có biến này: thiếu thì canonical, sitemap, JSON-LD sẽ trỏ về localhost
// và Google bỏ qua cả website. Build thử trên máy: tạo .env.local với NEXT_PUBLIC_SITE_URL=http://localhost:3000
if (!process.env.NEXT_PUBLIC_SITE_URL && process.env.NODE_ENV === "production") {
  throw new Error("Thiếu NEXT_PUBLIC_SITE_URL (xem apps/web/.env.example)");
}
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_NAME = "Lịch Âm Lịch";
export const SITE_DESCRIPTION =
  "Lịch âm hôm nay, lịch vạn niên Việt Nam: đổi ngày dương sang âm, xem ngày tốt xấu theo tuổi, giờ hoàng đạo, can chi, tiết khí và các ngày lễ.";
export const THEME_COLOR = "#8A1C1C";

/**
 * Các năm có trang lịch ngày/tháng/năm được dựng sẵn lúc build và đưa vào sitemap.
 * CẬP NHẬT MỖI ĐẦU NĂM (giữ năm trước, năm nay, năm sau). Ngày ngoài các năm này vẫn xem được,
 * chỉ không quảng bá trong sitemap để tránh bị Google coi là sinh trang hàng loạt.
 */
export const SEO_YEARS = [2025, 2026, 2027];
