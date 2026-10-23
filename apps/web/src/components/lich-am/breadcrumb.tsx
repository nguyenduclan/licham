// Đường dẫn (breadcrumb) hiển thị trên trang + dữ liệu có cấu trúc BreadcrumbList cho Google.
import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbSchema } from "@/lib/seo";

export function Breadcrumb({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(items)} />
      <nav aria-label="Đường dẫn" className="mb-4 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => (
            <li key={item.path} className="flex items-center gap-1">
              {i > 0 && <span aria-hidden>›</span>}
              {i < items.length - 1 ? (
                <Link href={item.path} className="hover:text-primary">{item.name}</Link>
              ) : (
                <span className="text-foreground">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
