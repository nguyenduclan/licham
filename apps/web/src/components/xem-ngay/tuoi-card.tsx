// Thẻ kết luận riêng: ngày đang xem có hợp với tuổi người dùng không.
import { TUOI_FACTOR_SCORE, type DanhGiaTuoi } from "lich-core";
import { content } from "@/lib/xem-ngay";

const VERDICT_STYLE = {
  tot: "border-primary bg-primary-soft text-primary",
  binhThuong: "border-accent text-accent",
  xau: "border-line bg-background text-muted",
} as const;

export function TuoiCard({ tuoi }: { tuoi: DanhGiaTuoi }) {
  const verdict = content.tuoiVerdict[tuoi.verdict];

  return (
    <section className={`rounded-2xl border-2 p-5 shadow-sm sm:p-6 ${VERDICT_STYLE[tuoi.verdict]}`}>
      <p className="text-sm font-medium">
        Tuổi <b>{tuoi.canChiTuoi}</b> ({tuoi.birthLunarYear}) · Mệnh <b>{tuoi.menh}</b>
      </p>
      <h2 className="mt-1 text-2xl font-bold">{verdict.ten}</h2>
      <p className="mt-1 text-foreground">{verdict.moTa}</p>
      <ul className="mt-4 flex flex-col gap-1.5 text-sm text-foreground">
        {tuoi.factors.map((f) => {
          const score = TUOI_FACTOR_SCORE[f];
          return (
            <li key={f} className="flex items-center gap-2">
              <span
                className={`w-8 shrink-0 rounded text-center text-xs font-bold ${
                  score > 0 ? "bg-primary text-on-primary" : "bg-dot-hac text-white"
                }`}
              >
                {score > 0 ? `+${score}` : score}
              </span>
              {content.tuoiFactors[f]}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
