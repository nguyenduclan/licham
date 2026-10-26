// SEO dùng chung: metadata từng trang (pageMeta) và dữ liệu có cấu trúc (schema.org JSON-LD).
// JSON-LD giúp Google/AI hiểu trang là gì: website, tổ chức, đường dẫn (breadcrumb), công cụ (web app), hỏi đáp.
// Các thực thể nối với nhau bằng "@id" (ví dụ công cụ -> thuộc website -> do tổ chức phát hành).
import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

type Schema = Record<string, unknown>;
const abs = (path: string) => new URL(path, SITE_URL).toString();
const WEBSITE_ID = abs("/#website");
const ORGANIZATION_ID = abs("/#organization");

/**
 * Metadata chuẩn cho một trang: title, description, canonical, og:url.
 * og:title/og:description và thẻ Twitter Next.js tự lấy từ title/description.
 * openGraph của trang THAY HẲN của layout (kể cả ảnh tự sinh từ src/app/opengraph-image.png) nên phải
 * khai báo lại locale/siteName và ảnh chia sẻ. Đổi ảnh thì giữ kích thước 1200x630.
 */
export function pageMeta({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  return {
    ...(title && { title }),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: SITE_NAME,
      url: path,
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: `${SITE_NAME} – Lịch vạn niên Việt Nam` }],
    },
  };
}

/** Website + tổ chức đứng sau website. Đặt ở layout nên có trên mọi trang. */
export const siteSchema: Schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: SITE_NAME,
      alternateName: "LAL",
      url: abs("/"),
      description: SITE_DESCRIPTION,
      inLanguage: "vi-VN",
      publisher: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: SITE_NAME,
      alternateName: "LAL",
      url: abs("/"),
      logo: { "@type": "ImageObject", url: abs("/icons/icon-512.png"), width: 512, height: 512 },
    },
  ],
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
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORGANIZATION_ID },
    offers: { "@type": "Offer", price: "0", priceCurrency: "VND" },
  };
}

export type FaqItem = { q: string; a: string };

/** Hỏi đáp. Chỉ dùng cùng component <Faq> để câu hỏi luôn HIỂN THỊ trên trang (Google yêu cầu). */
export function faqSchema(items: FaqItem[]): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };
}
