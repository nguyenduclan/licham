"use client";

// Giải nghĩa cung đang chọn: ý nghĩa cung + các sao trong cung.
import content from "@shared/data/tu-vi.json";
import { DIA_CHI, type CungTuVi } from "lich-core";

const lookup = (table: Record<string, string>, key: string) => table[key] ?? "";

export function LaSoDetail({ cung }: { cung: CungTuVi }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
      <h2 className="text-lg font-bold text-primary">
        Cung {cung.cung}
        {cung.isThan && " (Thân cư)"} · {cung.canChi}
      </h2>
      <p className="mt-1 text-sm text-muted">{lookup(content.cung, cung.cung)}</p>

      {cung.chinhTinh.length === 0 && (
        <p className="mt-3 text-sm">Cung không có chính tinh (vô chính diệu): thường được luận theo các sao ở cung đối diện.</p>
      )}
      <ul className="mt-3 flex flex-col gap-2 text-sm">
        {cung.chinhTinh.map((s) => (
          <li key={s}>
            <b className="text-primary">{s}</b>: {lookup(content.chinhTinh, s)}
          </li>
        ))}
        {cung.tuHoa.map((h) => {
          const name = h.split(" (")[0];
          return (
            <li key={h}>
              <b className="text-accent">{h}</b>: {lookup(content.tuHoa, name)}
            </li>
          );
        })}
        {cung.phuTinh.map((s) => (
          <li key={s}>
            <b>{s}</b>: {lookup(content.phuTinh, s)}
          </li>
        ))}
        <li>
          <b>{cung.trangSinh}</b> (vòng Tràng Sinh): {lookup(content.trangSinh, cung.trangSinh)}
        </li>
        <li className="text-muted">
          Đại vận tại cung này bắt đầu từ năm {cung.daiVan} tuổi (cung {DIA_CHI[cung.chi]}).
        </li>
      </ul>
    </section>
  );
}
