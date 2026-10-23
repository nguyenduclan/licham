// =============================================================================
// tu-vi.test.ts: lá số TS phải khớp shared/tu_vi_cases.json (file này cũng là chuẩn
// để kiểm bản Dart), cộng các mốc tra bảng an sao kinh điển.
// Sau khi SỬA CÔNG THỨC tử vi: chạy `npm run gen:tu-vi -w lich-core` để sinh lại file JSON.
// =============================================================================

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { anTuVi, lapLaSoTuVi, lapLaSoTuViAmLich, type GioiTinh } from '../src';

interface Case {
  input: { solar?: string; lunar?: { day: number; month: number; year: number; isLeap: boolean }; hourChi: number; gioiTinh: GioiTinh };
  laSo: Record<string, unknown>;
}

const data = JSON.parse(readFileSync(new URL('../../../shared/tu_vi_cases.json', import.meta.url), 'utf8')) as { cases: Case[] };

describe('Lá số khớp file chuẩn', () => {
  it.each(data.cases.map((c) => [`${c.input.solar ?? JSON.stringify(c.input.lunar)} giờ ${c.input.hourChi}`, c] as const))(
    '%s',
    (_, c) => {
      const { input } = c;
      const laSo = input.solar
        ? (() => {
            const [year, month, day] = input.solar!.split('-').map(Number);
            return lapLaSoTuVi({ day, month, year }, input.hourChi, input.gioiTinh);
          })()
        : lapLaSoTuViAmLich({ lunar: input.lunar!, hourChi: input.hourChi, gioiTinh: input.gioiTinh });
      const { hourChi: _h, gioiTinh: _g, ...rest } = laSo;
      expect(rest).toEqual(c.laSo);
    },
  );
});

interface Anchor {
  name: string;
  solar: string;
  hourChi: number;
  gioiTinh: GioiTinh;
  lunar: { day: number; month: number; year: number };
  amDuong: string;
  banMenh: string;
  cuc: number;
  menhChi: number;
  thanChi: number;
  chinhTinh: Record<string, number>;
  phuTinh: Record<string, number>;
  tuHoa: Record<string, number>;
  trangSinhChi: number;
  daiVanMenh: number;
  daiVanCungKe: { chi: number; tuoi: number };
}

const anchors = (
  JSON.parse(readFileSync(new URL('../../../shared/tu_vi_anchors.json', import.meta.url), 'utf8')) as { anchors: Anchor[] }
).anchors;

describe('Đối chiếu lá số mẫu tuvi.vn', () => {
  it.each(anchors.map((a) => [a.name, a] as const))('%s', (_, a) => {
    const [year, month, day] = a.solar.split('-').map(Number);
    const l = lapLaSoTuVi({ day, month, year }, a.hourChi, a.gioiTinh);
    expect([l.lunar.day, l.lunar.month, l.lunar.year]).toEqual([a.lunar.day, a.lunar.month, a.lunar.year]);
    expect([l.amDuong, l.banMenh, l.cuc, l.menhChi, l.thanChi]).toEqual([a.amDuong, a.banMenh, a.cuc, a.menhChi, a.thanChi]);
    const chiOf = (pick: (c: (typeof l.cung)[number]) => string[], star: string) => l.cung.findIndex((c) => pick(c).includes(star));
    for (const [star, chi] of Object.entries(a.chinhTinh)) expect(chiOf((c) => c.chinhTinh, star), star).toBe(chi);
    for (const [star, chi] of Object.entries(a.phuTinh)) expect(chiOf((c) => c.phuTinh, star), star).toBe(chi);
    for (const [hoa, chi] of Object.entries(a.tuHoa)) {
      expect(l.cung.findIndex((c) => c.tuHoa.some((h) => h.startsWith(hoa))), hoa).toBe(chi);
    }
    expect(l.cung[a.trangSinhChi].trangSinh).toBe('Tràng Sinh');
    expect(l.cung[a.menhChi].daiVan).toBe(a.daiVanMenh);
    expect(l.cung[a.daiVanCungKe.chi].daiVan).toBe(a.daiVanCungKe.tuoi);
  });
});

describe('Mốc tra bảng', () => {
  it('An Tử Vi: Thủy nhị cục ngày 1 -> Sửu, ngày 2,3 -> Dần; Mộc tam cục ngày 1 -> Thìn, ngày 2 -> Sửu', () => {
    expect([anTuVi(2, 1), anTuVi(2, 2), anTuVi(2, 3), anTuVi(3, 1), anTuVi(3, 2)]).toEqual([1, 2, 2, 4, 1]);
  });

  it('Thiên Phủ đồng cung Tử Vi tại Dần và Thân', () => {
    for (let h = 0; h < 12; h++) {
      const l = lapLaSoTuVi({ day: 15, month: 3, year: 1990 }, h, 'nam');
      for (const c of l.cung) {
        if (c.chinhTinh.includes('Tử Vi') && (c.chi === 2 || c.chi === 8)) expect(c.chinhTinh).toContain('Thiên Phủ');
      }
    }
  });

  it('Mỗi lá số có đủ 14 chính tinh, mỗi sao đúng 1 lần, Mệnh và 12 cung khác nhau', () => {
    for (const c of data.cases) {
      const cung = (c.laSo as { cung: { chinhTinh: string[]; cung: string }[] }).cung;
      expect(cung.flatMap((x) => x.chinhTinh).sort()).toHaveLength(14);
      expect(new Set(cung.flatMap((x) => x.chinhTinh)).size).toBe(14);
      expect(new Set(cung.map((x) => x.cung)).size).toBe(12);
    }
  });
});
