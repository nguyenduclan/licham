// /doi-ngay-am-duong: công cụ đổi ngày (chạy trên trình duyệt) + phần giải thích tĩnh cho SEO.
import type { Metadata } from "next";
import { DoiNgayApp } from "@/components/doi-ngay/doi-ngay-app";
import { JsonLd } from "@/components/json-ld";
import { Section } from "@/components/xem-ngay/section";
import { breadcrumbSchema, webAppSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Đổi ngày dương sang âm, âm sang dương chính xác",
  description:
    "Công cụ đổi lịch dương sang âm và âm sang dương theo giờ Việt Nam (1900–2100), có tháng nhuận, kèm can chi ngày tháng năm.",
  alternates: { canonical: "/doi-ngay-am-duong" },
};

export default function DoiNgayPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:py-10">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Trang chủ", path: "/" }, { name: "Đổi ngày âm dương", path: "/doi-ngay-am-duong" }]),
          webAppSchema("Đổi ngày dương sang âm", "/doi-ngay-am-duong", String(metadata.description)),
        ]}
      />
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">Đổi ngày dương sang âm, âm sang dương</h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted">Nhập ngày theo dạng dd/mm/yyyy, kết quả hiện ngay.</p>
      </header>
      <DoiNgayApp />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Section title="Cách tính lịch âm Việt Nam">
          <p>
            Lịch âm Việt Nam là âm dương lịch: mỗi tháng bắt đầu vào ngày có trăng mới (sóc), tính theo giờ Việt Nam (UTC+7).
            Vì khác múi giờ nên có năm Tết Việt Nam lệch một ngày so với Trung Quốc, ví dụ năm 2030.
          </p>
          <p>
            Tháng âm có 29 ngày (tháng thiếu) hoặc 30 ngày (tháng đủ). Khoảng 3 năm có một năm nhuận 13 tháng; tháng nhuận là
            tháng đầu tiên không chứa trung khí.
          </p>
        </Section>
        <Section title="Câu hỏi thường gặp">
          <p><b>Đổi ngày sinh âm lịch để làm gì?</b> Nhiều thủ tục, giấy tờ dùng ngày dương, còn cúng giỗ, xem tuổi lại theo ngày âm.</p>
          <p><b>Sinh vào tháng nhuận thì sao?</b> Tick ô &ldquo;Tháng nhuận&rdquo; khi đổi âm sang dương. Năm không có tháng nhuận đó sẽ báo lỗi.</p>
          <p><b>Công cụ chính xác đến năm nào?</b> Đã kiểm tra từ năm 1900 đến 2100, gồm các ngày Tết và tháng nhuận.</p>
        </Section>
      </div>
    </main>
  );
}
