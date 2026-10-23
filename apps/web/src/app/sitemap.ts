// /sitemap.xml: danh sách trang cho Google. Thêm trang mới (bài viết, trang theo ngày...) vào đây.
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/xem-ngay-tot-xau`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/la-so-tu-vi`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/sim-phong-thuy`, changeFrequency: "monthly", priority: 0.7 },
  ];
}
