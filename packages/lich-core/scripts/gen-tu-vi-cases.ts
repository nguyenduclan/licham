// =============================================================================
// gen-tu-vi-cases.ts: sinh shared/tu_vi_cases.json từ bản TypeScript.
// -----------------------------------------------------------------------------
// Mục đích: kiểm tra bản Dart cho ra lá số GIỐNG HỆT bản TS (cùng logic).
// Tính đúng của công thức được kiểm bằng các lá số mẫu đối chiếu ("anchors" trong test).
// Chạy (từ thư mục gốc repo): npm run gen:tu-vi -w lich-core
// =============================================================================

import { writeFileSync } from 'node:fs';
import { lapLaSoTuVi, lapLaSoTuViAmLich, toIso, type GioiTinh, type LaSoTuVi } from '../src';

interface Case {
  input: { solar?: string; lunar?: { day: number; month: number; year: number; isLeap: boolean }; hourChi: number; gioiTinh: GioiTinh };
  laSo: Omit<LaSoTuVi, 'lunar' | 'hourChi' | 'gioiTinh'> & { lunar: LaSoTuVi['lunar'] };
}

const strip = (l: LaSoTuVi): Case['laSo'] => {
  const { hourChi: _h, gioiTinh: _g, ...rest } = l;
  return rest;
};

const cases: Case[] = [];
const genders: GioiTinh[] = ['nam', 'nu'];

// Ngày dương lịch rải đều 1920-2030, đủ 12 giờ và 2 giới tính (dùng công thức cố định, không ngẫu nhiên)
for (let i = 0; i < 144; i++) {
  const year = 1920 + ((i * 7) % 111);
  const month = (i % 12) + 1;
  const day = ((i * 11) % 28) + 1;
  const solar = { day, month, year };
  const hourChi = i % 12;
  const gioiTinh = genders[Math.floor(i / 12) % 2];
  cases.push({ input: { solar: toIso(solar), hourChi, gioiTinh }, laSo: strip(lapLaSoTuVi(solar, hourChi, gioiTinh)) });
}

// Sinh trong tháng nhuận (trước và sau ngày 15) để kiểm tra quy tắc tháng an sao
const leap = [
  { day: 10, month: 6, year: 2025 }, { day: 20, month: 6, year: 2025 },
  { day: 1, month: 2, year: 2023 }, { day: 29, month: 2, year: 2023 },
  { day: 15, month: 4, year: 2020 }, { day: 16, month: 4, year: 2020 },
  { day: 5, month: 11, year: 2033 }, { day: 25, month: 11, year: 2033 },
];
leap.forEach((d, i) => {
  const input = { lunar: { ...d, isLeap: true }, hourChi: (i * 5) % 12, gioiTinh: genders[i % 2] };
  cases.push({ input, laSo: strip(lapLaSoTuViAmLich(input)) });
});

const out = new URL('../../../shared/tu_vi_cases.json', import.meta.url);
writeFileSync(
  out,
  `{\n  "description": "Lá số tử vi để kiểm tra bản Dart khớp bản TS. Sinh bởi packages/lich-core/scripts/gen-tu-vi-cases.ts - KHÔNG sửa tay.",\n  "cases": [\n${cases
    .map((c) => '    ' + JSON.stringify(c))
    .join(',\n')}\n  ]\n}\n`,
);
console.log(`Đã ghi ${cases.length} lá số -> shared/tu_vi_cases.json`);
