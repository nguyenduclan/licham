// Mục "Câu hỏi thường gặp": hiển thị hỏi đáp trên trang + JSON-LD FAQPage từ CÙNG dữ liệu
// (Google chỉ chấp nhận FAQPage khi câu hỏi có hiện trên trang). Dạng <dl> để AI dễ trích câu trả lời.
import { JsonLd } from "@/components/json-ld";
import { faqSchema, type FaqItem } from "@/lib/seo";

export function Faq({ items, title = "Câu hỏi thường gặp" }: { items: FaqItem[]; title?: string }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <JsonLd data={faqSchema(items)} />
      <h2 className="mb-3 text-lg font-bold text-primary">{title}</h2>
      <dl className="flex flex-col gap-3 text-sm leading-relaxed sm:text-base">
        {items.map(({ q, a }) => (
          <div key={q}>
            <dt className="font-semibold">{q}</dt>
            <dd className="mt-0.5 text-muted">{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
