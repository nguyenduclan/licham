import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

// Font có đủ dấu tiếng Việt (Geist mặc định không có subset vietnamese)
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lịch Âm Việt Nam – Xem ngày âm lịch, can chi, giờ hoàng đạo",
  description: "Tra cứu lịch âm Việt Nam: đổi ngày dương sang âm, can chi, tiết khí và giờ hoàng đạo mỗi ngày.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
