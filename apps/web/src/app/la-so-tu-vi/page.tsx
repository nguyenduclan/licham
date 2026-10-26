// Trang /la-so-tu-vi: lập lá số tử vi. Toàn bộ tính toán chạy trên trình duyệt (LaSoApp là
// client component), trang này chỉ là phần tĩnh: tiêu đề, cam kết bảo mật, giải thích 12 cung / 14 chính tinh,
// hỏi đáp, cảnh báo tham khảo. Phần tĩnh render sẵn trên server nên Google/AI đọc được dù lá số chỉ có trên máy người dùng.
import type { Metadata } from "next";
import content from "@shared/data/tu-vi.json";
import { Faq } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { LaSoApp } from "@/components/tu-vi/la-so-app";
import { Section } from "@/components/xem-ngay/section";
import { FAQ_LA_SO } from "@/lib/faq";
import { breadcrumbSchema, pageMeta, webAppSchema } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Lập lá số tử vi trọn đời miễn phí",
  description:
    "Lập lá số Tử Vi Đẩu Số theo ngày giờ sinh: 12 cung, 14 chính tinh, phụ tinh, Tứ Hóa, Tràng Sinh, đại vận và giải nghĩa từng cung. Dữ liệu chỉ xử lý trên máy bạn.",
  path: "/la-so-tu-vi",
});

/** Danh sách thuật ngữ - giải nghĩa dạng <dl> (dễ trích dẫn hơn đoạn văn). */
function TermList({ items }: { items: Record<string, string> }) {
  return (
    <dl className="flex flex-col gap-2">
      {Object.entries(items).map(([ten, moTa]) => (
        <div key={ten}>
          <dt className="inline font-semibold">{ten}: </dt>
          <dd className="inline">{moTa}</dd>
        </div>
      ))}
    </dl>
  );
}

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
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="12 cung trong lá số tử vi">
          <TermList items={content.cung} />
        </Section>
        <Section title="14 chính tinh và ý nghĩa">
          <TermList items={content.chinhTinh} />
        </Section>
      </div>
      <div className="mt-6">
        <Faq items={FAQ_LA_SO} />
      </div>
      <p className="mt-8 rounded-xl bg-background p-4 text-center text-sm text-muted">⚠ {content.canhBao}</p>
    </main>
  );
}
