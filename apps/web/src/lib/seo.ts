// Dữ liệu có cấu trúc (schema.org JSON-LD) dùng chung cho các trang.
// Giúp Google hiểu trang là gì: website, tổ chức, đường dẫn (breadcrumb), công cụ (web app).
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

type Schema = Record<string, unknown>;
const abs = (path: string) => new URL(path, SITE_URL).toString();

export const websiteSchema: Schema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  alternateName: "LAL",
  url: abs("/"),
  description: SITE_DESCRIPTION,
  inLanguage: "vi-VN",
};

export const organizationSchema: Schema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "LAL",
  url: abs("/"),
  logo: abs("/icons/icon-512.png"),
};

/** Breadcrumb: [{ name: "Trang chủ", path: "/" }, { name: "Lịch âm 2026", path: "/lich-am/nam-2026" }, ...] */
export function breadcrumbSchema(items: { name: string; path: string }[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: abs(item.path) })),
  };
}

/** Công cụ chạy trên web (xem ngày, lá số, sim, đổi ngày), miễn phí. */
export function webAppSchema(name: string, path: string, description: string): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: abs(path),
    description,
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Mọi trình duyệt",
    inLanguage: "vi-VN",
    offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
  };
}
