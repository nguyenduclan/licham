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

/** Danh sách giờ dạng "Dần (3:00–4:59)". */
export function HourList({ hours }: { hours: { chi: string; range: string }[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {hours.map((h) => (
        <li key={h.chi} className="flex flex-col items-center rounded-lg bg-background px-2 py-1.5">
          <b>{h.chi}</b>
          <span className="whitespace-nowrap text-muted">({h.range})</span>
        </li>
      ))}
    </ul>
  );
}
