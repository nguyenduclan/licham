import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// CSP: trình duyệt chỉ cho tải tài nguyên và GỬI DỮ LIỆU về chính website này (connect-src 'self'),
// nên kể cả khi có mã lạ lọt vào trang cũng không gửi được ngày sinh / số điện thoại ra ngoài.
// Theo mục "Without Nonces" trong tài liệu Next.js để giữ được trang tĩnh.
// Khi gắn AdSense: thêm đúng các tên miền Google cần thiết vào script-src, img-src, frame-src, connect-src.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`, // dev cần eval cho báo lỗi của React
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:", // blob: dùng khi xuất ảnh lá số
  "font-src 'self'", // next/font tự host font, không gọi Google Fonts lúc chạy
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Không dùng upgrade-insecure-requests: sẽ hỏng khi chạy thử trên http://localhost; HTTPS đã do HSTS đảm nhận.
].join("; ");

// Header bảo mật gửi kèm mọi trang.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" }, // chặn trình duyệt đoán sai loại file
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }, // không lộ đường dẫn đầy đủ sang web khác
  { key: "X-Frame-Options", value: "DENY" }, // chặn web khác nhúng trang (clickjacking)
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }, // chỉ có tác dụng khi chạy HTTPS
];

const nextConfig: NextConfig = {
  poweredByHeader: false, // ẩn header "X-Powered-By: Next.js"
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // lich-core xuất thẳng file .ts (không build trước) nên Next.js cần tự biên dịch nó
  transpilePackages: ["lich-core"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
