// Từ điển bộ số đẹp / xấu và cách chấm điểm (render sẵn trên server để Google đọc được).
import content from "@shared/data/sim.json";

export function BoSoDictionary() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
        <h2 className="mb-3 text-lg font-bold text-primary">Bộ số đẹp theo quan niệm dân gian</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {Object.values(content.boSoDep).map((b) => (
            <li key={b.ten}>
              <b className="text-primary">{b.ten}</b> <span className="tabular-nums text-muted">({b.so})</span>: {b.yNghia}
            </li>
          ))}
        </ul>
      </section>
      <div className="flex flex-col gap-6">
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
          <h2 className="mb-3 text-lg font-bold text-primary">Bộ số nhiều người kiêng</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {Object.values(content.boSoXau).map((b) => (
              <li key={b.ten}>
                <b>{b.ten}</b> <span className="tabular-nums text-muted">({b.so})</span>: {b.yNghia}
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
          <h2 className="mb-3 text-lg font-bold text-primary">Cách chấm điểm sim (thang 10)</h2>
          <ul className="flex flex-col gap-2 text-sm">
            {Object.values(content.tieuChi).map((t) => (
              <li key={t}>{t}</li>
            ))}
            <li className="text-muted">
              Ngũ hành chữ số: Kim {content.chuSo.Kim} · Thủy {content.chuSo.Thủy} · Mộc {content.chuSo.Mộc} · Hỏa{" "}
              {content.chuSo.Hỏa} · Thổ {content.chuSo.Thổ}.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
