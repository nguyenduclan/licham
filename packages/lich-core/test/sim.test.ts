// =============================================================================
// sim.test.ts: Kinh Dịch + chấm điểm sim. Gồm mốc tính tay (độc lập với code) và
// đối chiếu shared/sim_cases.json (file chuẩn cho bản Dart).
// Sau khi SỬA CÔNG THỨC: chạy `npm run gen:sim -w lich-core` để sinh lại file JSON.
// =============================================================================

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { chamDiemSim, chuanHoaSoDienThoai, goiYDuoiSo, lapQueTuDaySo, queBien, queTheoQuai, timBoSo } from '../src';

describe('Kinh Dịch', () => {
  it('Bảng đủ 64 quẻ, mỗi cặp thượng/hạ đúng 1 quẻ, số thứ tự 1..64 không trùng', () => {
    const seen = new Set<number>();
    for (let t = 1; t <= 8; t++) for (let h = 1; h <= 8; h++) seen.add(queTheoQuai(t, h).so);
    expect(seen.size).toBe(64);
  });

  it('Tên quẻ: Khảm trên Chấn dưới = Thủy Lôi Truân; Càn kép = Thuần Càn', () => {
    expect(queTheoQuai(6, 4).ten).toBe('Thủy Lôi Truân');
    expect(queTheoQuai(1, 1).ten).toBe('Thuần Càn');
  });

  it('Địa Thiên Thái động hào 1 biến Địa Phong Thăng (ví dụ kinh điển); biến 2 lần về quẻ cũ', () => {
    const thai = queTheoQuai(8, 1);
    expect(queBien(thai, 1).ten).toBe('Địa Phong Thăng');
    for (let hao = 1; hao <= 6; hao++) expect(queBien(queBien(thai, hao), hao).so).toBe(thai.so);
  });

  it('Lập quẻ 0912345678 (tính tay): 0+9+1+2+3=15 -> Cấn, 4+5+6+7+8=30 -> Khảm, 45 % 6 = 3', () => {
    const q = lapQueTuDaySo('0912345678');
    expect([q.chu.ten, q.haoDong, q.bien.ten]).toEqual(['Sơn Thủy Mông', 3, 'Sơn Phong Cổ']);
  });
});

describe('Sim', () => {
  it('Chuẩn hóa số điện thoại', () => {
    expect(chuanHoaSoDienThoai('+84 912 345 678')).toBe('0912345678');
    expect(chuanHoaSoDienThoai('84912345678')).toBe('0912345678');
    expect(chuanHoaSoDienThoai('0912.345.678')).toBe('0912345678');
    expect(chuanHoaSoDienThoai('091234567')).toBeNull();
    expect(chuanHoaSoDienThoai('abc')).toBeNull();
  });

  it('Bộ số (tính tay)', () => {
    expect(timBoSo('0988886868').dep).toEqual(expect.arrayContaining(['locPhat', 'phatPhat', 'taxi']));
    expect(timBoSo('0377777777').dep).toContain('tuQuy');
    expect(timBoSo('0901101102').dep).toContain('docNhat');
    expect(timBoSo('0981991994')).toMatchObject({ xau: ['duoiTu'] });
    expect(timBoSo('0904934953').xau).toEqual(['bonChin', 'namBa']);
  });

  it('0912345678, sinh 1992 (Kiếm Phong Kim): tổng 45 -> 5 nút, 5 chẵn 5 lẻ', () => {
    const r = chamDiemSim('0912345678', 1992);
    expect(r.menh.napAm).toBe('Kiếm Phong Kim');
    expect([r.tongNut.nut, r.amDuong.chan, r.amDuong.le, r.amDuong.score]).toEqual([5, 5, 5, 2]);
  });

  it('Gợi ý cho mệnh Kim chỉ gồm chữ số Thổ (2,5,8) và Kim (6,7)', () => {
    for (const s of goiYDuoiSo(1992)) expect(/^[25867]+$/.test(s)).toBe(true);
  });

  const data = JSON.parse(readFileSync(new URL('../../../shared/sim_cases.json', import.meta.url), 'utf8')) as {
    cases: { digits: string; lunarYear: number; [k: string]: unknown }[];
    goiY: { lunarYear: number; duoi: string[] }[];
  };

  it.each(data.cases.map((c) => [`${c.digits} / ${c.lunarYear}`, c] as const))('Khớp file chuẩn: %s', (_, c) => {
    const r = chamDiemSim(c.digits, c.lunarYear);
    expect({
      digits: r.digits, lunarYear: c.lunarYear, menh: r.menh, nguHanh: r.nguHanh, amDuong: r.amDuong, tongNut: r.tongNut,
      que: { chu: r.que.chu.so, bien: r.que.bien.so, haoDong: r.que.haoDong, ten: r.que.chu.ten, score: r.que.score },
      boSo: r.boSo, total: r.total, verdict: r.verdict,
    }).toEqual(c);
  });

  it('Gợi ý khớp file chuẩn', () => {
    for (const g of data.goiY) expect(goiYDuoiSo(g.lunarYear)).toEqual(g.duoi);
  });
});
