// /manifest.webmanifest: thông tin để "Thêm vào màn hình chính" (nền tảng cho PWA sau này).
import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME, THEME_COLOR } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "LAL",
    description: SITE_DESCRIPTION,
    lang: "vi",
    start_url: "/",
    display: "standalone",
    background_color: "#FDF8F1",
    theme_color: THEME_COLOR,
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
