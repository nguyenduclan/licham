// /sitemap.xml: danh sách trang cho Google. Trang lịch theo ngày/tháng/năm chỉ đưa các năm SEO_YEARS
// (xem src/lib/site.ts) để tránh bị coi là sinh trang hàng loạt.
import type { MetadataRoute } from "next";
import { seoSlugs } from "@/lib/lich-pages";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/doi-ngay-am-duong`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/xem-ngay-tot-xau`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/la-so-tu-vi`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/sim-phong-thuy`, changeFrequency: "monthly", priority: 0.7 },
  ];
  for (const slug of seoSlugs()) {
    const priority = slug.startsWith("nam-") ? 0.8 : slug.startsWith("thang-") ? 0.7 : 0.5;
    pages.push({ url: `${SITE_URL}/lich-am/${slug}`, changeFrequency: "yearly", priority });
  }
  return pages;
}
