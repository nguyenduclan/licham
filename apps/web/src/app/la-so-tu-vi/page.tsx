// Trang /la-so-tu-vi: lập lá số tử vi. Toàn bộ tính toán chạy trên trình duyệt (LaSoApp là
// client component), trang này chỉ là phần tĩnh: tiêu đề, cam kết bảo mật, cảnh báo tham khảo.
import type { Metadata } from "next";
import content from "@shared/data/tu-vi.json";
import { JsonLd } from "@/components/json-ld";
import { LaSoApp } from "@/components/tu-vi/la-so-app";
import { breadcrumbSchema, webAppSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Lập lá số tử vi trọn đời miễn phí",
  description:
    "Lập lá số Tử Vi Đẩu Số theo ngày giờ sinh: 12 cung, 14 chính tinh, phụ tinh, Tứ Hóa, Tràng Sinh, đại vận và giải nghĩa từng cung. Dữ liệu chỉ xử lý trên máy bạn.",
  alternates: { canonical: "/la-so-tu-vi" },
};

export default function LaSoTuViPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:py-10">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Trang chủ", path: "/" }, { name: "Lập lá số tử vi", path: "/la-so-tu-vi" }]),
          webAppSchema("Lập lá số tử vi", "/la-so-tu-vi", String(metadata.description)),
        ]}
      />
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">Lập lá số tử vi</h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted">
          Nhập ngày giờ sinh để xem lá số Tử Vi Đẩu Số: vị trí 12 cung, các sao và giải nghĩa ngắn cho từng cung.
        </p>
        <p className="mx-auto mt-3 max-w-2xl rounded-xl bg-primary-soft px-4 py-2 text-sm text-primary">
          🔒 {content.baoMat}
        </p>
      </header>
      <LaSoApp />
      <p className="mt-8 rounded-xl bg-background p-4 text-center text-sm text-muted">⚠ {content.canhBao}</p>
    </main>
  );
}
