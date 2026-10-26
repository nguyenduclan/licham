// Khung một mục trên trang Xem ngày tốt xấu (tiêu đề + nội dung).
import type { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <h2 className="mb-3 text-lg font-bold text-primary">{title}</h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed sm:text-base">{children}</div>
    </section>
  );
}

/** Nhãn Tốt/Xấu màu sắc. */
export function Rating({ label, good }: { label: string; good: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
        good ? "bg-primary-soft text-primary" : "bg-background text-muted"
      }`}
    >
      {label}
    </span>
  );
}

/**
 * Bảng giờ dạng "Dần (3:00–4:59)". Là <table> 2 cột (Giờ – Khoảng giờ) để Google/AI trích đúng,
 * nhưng CSS xếp thành lưới ô như cũ. caption mô tả bảng (ẩn, chỉ cho máy đọc).
 */
export function HourList({
  hours,
  caption,
  cellClassName = "bg-background",
}: {
  hours: { chi: string; range: string }[];
  caption: string;
  cellClassName?: string;
}) {
  return (
    <table className="w-full">
      <caption className="sr-only">{caption}</caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Giờ</th>
          <th scope="col">Khoảng giờ</th>
        </tr>
      </thead>
      <tbody className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {hours.map((h) => (
          <tr key={h.chi} className={`flex flex-col items-center rounded-lg px-2 py-1.5 ${cellClassName}`}>
            <th scope="row">{h.chi}</th>
            <td className="whitespace-nowrap text-muted">({h.range})</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
