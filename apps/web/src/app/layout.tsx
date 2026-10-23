import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, THEME_COLOR } from "@/lib/site";
import "./globals.css";

// Font có đủ dấu tiếng Việt (Geist mặc định không có subset vietnamese)
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

// SEO chung cho mọi trang; từng trang ghi đè title/description/canonical riêng.
// Icon (favicon.ico, icon.svg, apple-icon.png) và ảnh chia sẻ (opengraph-image.png) nằm
// trong src/app/, Next.js tự thêm thẻ <link>/<meta> tương ứng.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – Xem lịch âm hôm nay, ngày tốt xấu, giờ hoàng đạo`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { type: "website", locale: "vi_VN", siteName: SITE_NAME },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: THEME_COLOR };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
