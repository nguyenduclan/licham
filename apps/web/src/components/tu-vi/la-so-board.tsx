"use client";

// Bàn lá số tử vi vẽ bằng SVG (một nguồn duy nhất cho cả hiển thị lẫn xuất ảnh PNG).
// Bố cục chuẩn 4x4: 12 cung quanh viền, ô giữa ghi thông tin chung.
import { forwardRef } from "react";
import { DIA_CHI, type LaSoTuVi } from "lich-core";

const CELL = 250;
// Vị trí [cột, hàng] của từng chi trên bàn (Tý = 0 ... Hợi = 11)
const POS: [number, number][] = [
  [2, 3], [1, 3], [0, 3], [0, 2], [0, 1], [0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [3, 3],
];
const COLORS = { red: "#8A1C1C", gold: "#B7791F", text: "#2B1D16", muted: "#7A6A5E", line: "#D9C9B4", soft: "#FBEAEA" };
const FONT = "'Be Vietnam Pro', 'Segoe UI', Arial, sans-serif";
const GIO = ["Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];

interface Props {
  laSo: LaSoTuVi;
  selected: number;
  onSelect: (chi: number) => void;
  title?: string;
}

export const LaSoBoard = forwardRef<SVGSVGElement, Props>(function LaSoBoard({ laSo, selected, onSelect, title }, ref) {
  const { lunar } = laSo;
  return (
    <svg ref={ref} viewBox={`0 0 ${CELL * 4} ${CELL * 4}`} xmlns="http://www.w3.org/2000/svg" className="h-auto w-full" fontFamily={FONT}>
      <rect width={CELL * 4} height={CELL * 4} fill="#FFFDF9" />
      {laSo.cung.map((c) => {
        const [col, row] = POS[c.chi];
        const x = col * CELL;
        const y = row * CELL;
        const isMenh = c.chi === laSo.menhChi;
        let line = y + 66;
        return (
          <g key={c.chi} onClick={() => onSelect(c.chi)} style={{ cursor: "pointer" }}>
            <rect x={x} y={y} width={CELL} height={CELL} fill={c.chi === selected ? COLORS.soft : "transparent"} stroke={COLORS.line} strokeWidth={2} />
            <text x={x + 10} y={y + 24} fontSize={15} fill={COLORS.muted}>{c.canChi}</text>
            <text x={x + CELL - 10} y={y + 24} fontSize={15} fill={COLORS.muted} textAnchor="end">{c.daiVan}</text>
            <text x={x + CELL / 2} y={y + 46} fontSize={18} fontWeight={700} fill={isMenh ? COLORS.red : COLORS.text} textAnchor="middle">
              {c.cung.toUpperCase()}{c.isThan ? " (THÂN)" : ""}
            </text>
            {c.chinhTinh.map((s) => {
              line += 22;
              return <text key={s} x={x + CELL / 2} y={line - 4} fontSize={18} fontWeight={700} fill={COLORS.red} textAnchor="middle">{s}</text>;
            })}
            {c.tuHoa.map((h) => {
              line += 18;
              return <text key={h} x={x + CELL / 2} y={line} fontSize={14} fill={COLORS.gold} textAnchor="middle">{h}</text>;
            })}
            {wrap(c.phuTinh, 2).map((pair, i) => (
              <text key={i} x={x + CELL / 2} y={line + 22 + i * 18} fontSize={14} fill={COLORS.text} textAnchor="middle">{pair.join(" · ")}</text>
            ))}
            <text x={x + 10} y={y + CELL - 10} fontSize={14} fill={COLORS.muted}>{c.trangSinh}</text>
            <text x={x + CELL - 10} y={y + CELL - 10} fontSize={14} fill={COLORS.muted} textAnchor="end">{DIA_CHI[c.chi]}</text>
          </g>
        );
      })}
      {/* Ô giữa: thông tin chung */}
      <rect x={CELL} y={CELL} width={CELL * 2} height={CELL * 2} fill="#FFFDF9" stroke={COLORS.line} strokeWidth={2} />
      <g textAnchor="middle" fill={COLORS.text}>
        <text x={CELL * 2} y={CELL + 60} fontSize={30} fontWeight={700} fill={COLORS.red}>LÁ SỐ TỬ VI</text>
        {title && <text x={CELL * 2} y={CELL + 98} fontSize={20} fontWeight={600}>{title}</text>}
        <text x={CELL * 2} y={CELL + 150} fontSize={18}>Năm {laSo.canChiNam} · {laSo.amDuong}</text>
        <text x={CELL * 2} y={CELL + 182} fontSize={18}>
          Âm lịch: {lunar.day}/{lunar.month}{lunar.isLeap ? " (nhuận)" : ""}/{lunar.year} · Giờ {GIO[laSo.hourChi]}
        </text>
        <text x={CELL * 2} y={CELL + 230} fontSize={18}>Bản mệnh: {laSo.banMenh}</text>
        <text x={CELL * 2} y={CELL + 262} fontSize={18}>Cục: {laSo.cucName}</text>
        <text x={CELL * 2} y={CELL + 294} fontSize={18}>Mệnh tại {DIA_CHI[laSo.menhChi]} · Thân tại {DIA_CHI[laSo.thanChi]}</text>
        <text x={CELL * 2} y={CELL * 3 - 40} fontSize={14} fill={COLORS.muted}>Mang tính tham khảo · Lịch Âm Lịch (LAL)</text>
      </g>
    </svg>
  );
});

function wrap<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
