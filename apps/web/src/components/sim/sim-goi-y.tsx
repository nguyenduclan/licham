"use client";

// Gợi ý theo năm sinh: mệnh, chữ số hợp / nên hạn chế, đuôi số đẹp hợp mệnh.
import { chuSoTheoMenh, goiYDuoiSo, menhTheoNam } from "lich-core";
import { tenHanh } from "@/lib/sim";

export function SimGoiY({ lunarYear }: { lunarYear: number }) {
  const menh = menhTheoNam(lunarYear);
  const { hop, khac } = chuSoTheoMenh(menh.hanh);
  const duoi = goiYDuoiSo(lunarYear);
  const namSinh = String(lunarYear);

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold text-primary">Gợi ý số hợp tuổi {menh.canChi}</h2>
      <p className="text-sm">
        Mệnh <b>{menh.napAm}</b> (hành <b>{tenHanh(menh.hanh)}</b>).
      </p>
      <p className="text-sm">
        <span className="text-muted">Chữ số nên ưu tiên (cùng hành hoặc sinh mệnh):</span>{" "}
        <b className="text-primary">{hop.join(", ")}</b>
      </p>
      <p className="text-sm">
        <span className="text-muted">Chữ số nên hạn chế (khắc mệnh):</span> <b>{khac.join(", ") || "không có"}</b>
      </p>
      <div>
        <p className="mb-2 text-sm text-muted">Đuôi số đẹp hợp mệnh (mọi chữ số đều hợp):</p>
        <ul className="flex flex-wrap gap-2">
          {duoi.map((d) => (
            <li key={d} className="rounded-lg bg-primary-soft px-3 py-1.5 font-semibold tabular-nums text-primary">
              …{d}
            </li>
          ))}
          <li className="rounded-lg bg-background px-3 py-1.5 font-semibold tabular-nums">…{namSinh} (năm sinh)</li>
        </ul>
      </div>
      <p className="text-xs text-muted">
        Gợi ý dựa trên mẫu số phổ biến, không phải danh sách sim đang bán. Khi chọn số, nên tránh các bộ số dân gian kiêng
        ở mục bên dưới.
      </p>
    </section>
  );
}
