"use client";

// Kết quả chấm điểm một số điện thoại: điểm tổng, từng tiêu chí, quẻ Kinh Dịch, bộ số tìm thấy.
import content from "@shared/data/sim.json";
import { batQuaiOf, type KetQuaSim } from "@/lib/sim";

const formatPhone = (d: string) => `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;

function Row({ label, score, max, note }: { label: string; score: number; max: number; note: string }) {
  return (
    <li className="flex flex-col gap-0.5 border-b border-line py-2 last:border-0">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{label}</span>
        <b className={score > 0 ? "text-primary" : "text-muted"}>
          {score > 0 && max === 1 ? "+" : ""}
          {score}
          {max > 1 ? ` / ${max}` : ""}
        </b>
      </div>
      <span className="text-sm text-muted">{note}</span>
    </li>
  );
}

export function SimResult({ r }: { r: KetQuaSim }) {
  const verdict = content.verdict[r.verdict];
  const queText = (so: number) => content.que[String(so) as keyof typeof content.que];
  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
      <div className="text-center">
        <p className="text-sm text-muted">Số {formatPhone(r.digits)} · Tuổi {r.menh.canChi}, mệnh {r.menh.napAm}</p>
        <p className="mt-2 text-6xl font-bold text-primary">
          {r.total}
          <span className="text-2xl text-muted">/10</span>
        </p>
        <p className="mt-1 text-xl font-semibold">{verdict.ten}</p>
        <p className="text-sm text-muted">{verdict.moTa}</p>
      </div>

      <ul className="text-sm sm:text-base">
        <Row label="Ngũ hành hợp mệnh" score={r.nguHanh.score} max={3}
          note={`${r.nguHanh.hop} chữ số hợp mệnh, ${r.nguHanh.khac} chữ số khắc mệnh (trên 10 số).`} />
        <Row label="Âm dương" score={r.amDuong.score} max={2} note={`${r.amDuong.chan} số chẵn (âm), ${r.amDuong.le} số lẻ (dương).`} />
        <Row label="Tổng nút" score={r.tongNut.score} max={2} note={`Số đạt ${r.tongNut.nut} nút.`} />
        <Row label="Quẻ Kinh Dịch" score={r.que.score} max={2} note={`Quẻ chủ ${r.que.chu.ten}.`} />
        <Row
          label="Bộ số"
          score={r.boSo.score}
          max={1}
          note={
            r.boSo.dep.length + r.boSo.xau.length === 0
              ? "Không có bộ số đặc biệt ở 6 số cuối."
              : [...r.boSo.dep.map((id) => content.boSoDep[id].ten), ...r.boSo.xau.map((id) => `${content.boSoXau[id].ten} (kiêng)`)].join(", ")
          }
        />
      </ul>

      <div className="rounded-xl bg-background p-4 text-sm">
        <h3 className="mb-2 font-semibold text-primary">Quẻ Kinh Dịch của số</h3>
        <p>
          <b>Quẻ chủ: {r.que.chu.ten}</b> ({batQuaiOf(r.que.chu)}) – {queText(r.que.chu.so)}
        </p>
        <p className="mt-2">
          <b>Quẻ biến: {r.que.bien.ten}</b> (động hào {r.que.haoDong}) – {queText(r.que.bien.so)}
        </p>
        <p className="mt-2 text-muted">Quẻ chủ nói về hiện tại, quẻ biến gợi ý xu hướng về sau.</p>
      </div>
    </section>
  );
}
