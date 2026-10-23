// Chèn dữ liệu có cấu trúc JSON-LD vào trang.
// Chỉ truyền dữ liệu do code tạo ra (không truyền chuỗi người dùng nhập); "<" được escape
// theo hướng dẫn của Next.js để không thể đóng thẻ <script> sớm.
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
