// Trang /sim-phong-thuy: chấm điểm sim + gợi ý số hợp tuổi (chạy trên trình duyệt) và từ điển bộ số (tĩnh).
import type { Metadata } from "next";
import content from "@shared/data/sim.json";
import { JsonLd } from "@/components/json-ld";
import { BoSoDictionary } from "@/components/sim/bo-so-dictionary";
import { breadcrumbSchema, webAppSchema } from "@/lib/seo";
import { SimApp } from "@/components/sim/sim-app";

export const metadata: Metadata = {
  title: "Sim phong thủy hợp tuổi – Chấm điểm số điện thoại",
  description:
    "Chấm điểm sim phong thủy theo ngày sinh: ngũ hành hợp mệnh, âm dương, tổng nút, quẻ Kinh Dịch; gợi ý đuôi số đẹp hợp tuổi và các bộ số nên tránh.",
  alternates: { canonical: "/sim-phong-thuy" },
};

export default function SimPhongThuyPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-10">
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Trang chủ", path: "/" }, { name: "Sim phong thủy", path: "/sim-phong-thuy" }]),
          webAppSchema("Chấm điểm sim phong thủy", "/sim-phong-thuy", String(metadata.description)),
        ]}
      />
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary sm:text-4xl">Sim phong thủy hợp tuổi</h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted">
          Chấm điểm số điện thoại theo ngày sinh và xem gợi ý những đuôi số hợp mệnh của bạn.
        </p>
        <p className="mx-auto mt-3 max-w-2xl rounded-xl bg-primary-soft px-4 py-2 text-sm text-primary">🔒 {content.baoMat}</p>
      </header>
      <SimApp />
      <div className="mt-8">
        <BoSoDictionary />
      </div>
      <p className="mt-8 rounded-xl bg-background p-4 text-center text-sm text-muted">⚠ {content.canhBao}</p>
    </main>
  );
}
