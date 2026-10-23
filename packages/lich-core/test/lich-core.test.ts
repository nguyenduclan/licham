// =============================================================================
// lich-core.test.ts: chạy toàn bộ shared/test_cases.json (cùng file với Dart).
// Chạy: cd packages/lich-core && npm test
// =============================================================================

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  chiOfDay,
  danhGiaTuoi,
  getDayInfo,
  gioLyThuanPhong,
  hacThan,
  hyThan,
  leapMonthOfYear,
  LUC_DIEU_NAMES,
  lucDieuIndex,
  lunarMonthLength,
  lunarToSolar,
  ngayKy,
  NHI_THAP_BAT_TU_NAMES,
  nhiThapBatTuIndex,
  taiThan,
  tamSat,
  TRUC_NAMES,
  trucIndex,
  type LunarDate,
  type SolarDate,
} from '../src';

interface TestCase {
  category: string;
  note: string;
  solar: string;
  jd: number;
  lunar: { day: number; month: number; year: number; leap: boolean };
  canChi: { day: string; month: string; year: string };
  tietKhi: string;
  gioHoangDao: number[];
  napAm: string;
  thanNgay: string;
  hoangDao: boolean;
  tuoiXung: string[];
  truc: string;
  nhiThapBatTu: string;
  ngayKy: string[];
  lucDieu: string;
  gioLyThuanPhong: number[];
  hyThan: string;
  taiThan: string;
  hacThan: string | null;
  tamSat: number[];
}

interface TuoiCase {
  solar: string;
  birth: string;
  birthLunarYear: number;
  canChiTuoi: string;
  menh: string;
  factors: string[];
  score: number;
  verdict: string;
}

const data = JSON.parse(readFileSync(new URL('../../../shared/test_cases.json', import.meta.url), 'utf8')) as {
  leapMonths: Record<string, number>;
  cases: TestCase[];
  tuoiCases: TuoiCase[];
};

const parseIso = (iso: string): SolarDate => {
  const [year, month, day] = iso.split('-').map(Number);
  return { day, month, year };
};
const lunarOf = (c: TestCase): LunarDate => ({ day: c.lunar.day, month: c.lunar.month, year: c.lunar.year, isLeap: c.lunar.leap });

it('có ít nhất 200 test case', () => expect(data.cases.length).toBeGreaterThanOrEqual(200));

describe('Dương -> Âm, can chi, tiết khí, giờ hoàng đạo', () => {
  it.each(data.cases.map((c) => [`${c.solar} ${c.note}`, c] as const))('%s', (_, c) => {
    const info = getDayInfo(parseIso(c.solar));
    expect(info.jd).toBe(c.jd);
    expect(info.lunar).toEqual(lunarOf(c));
    expect(info.canChiDay).toBe(c.canChi.day);
    expect(info.canChiMonth).toBe(c.canChi.month);
    expect(info.canChiYear).toBe(c.canChi.year);
    expect(info.tietKhi).toBe(c.tietKhi);
    expect(info.gioHoangDao).toEqual(c.gioHoangDao);
    expect(info.napAm).toBe(c.napAm);
    expect(info.thanNgay).toBe(c.thanNgay);
    expect(info.isHoangDao).toBe(c.hoangDao);
    expect(info.tuoiXung).toEqual(c.tuoiXung);
  });
});

describe('Xem ngày: trực, sao, ngày kỵ, Lục Diệu, xuất hành, Tam Sát', () => {
  it.each(data.cases.map((c) => [c.solar, c] as const))('%s', (_, c) => {
    const lunar = lunarOf(c);
    expect(TRUC_NAMES[trucIndex(c.jd)]).toBe(c.truc);
    expect(NHI_THAP_BAT_TU_NAMES[nhiThapBatTuIndex(c.jd)]).toBe(c.nhiThapBatTu);
    expect(ngayKy(c.jd, lunar)).toEqual(c.ngayKy);
    expect(LUC_DIEU_NAMES[lucDieuIndex(lunar.month, lunar.day)]).toBe(c.lucDieu);
    expect(gioLyThuanPhong(lunar.month, lunar.day)).toEqual(c.gioLyThuanPhong);
    expect(hyThan(c.jd)).toBe(c.hyThan);
    expect(taiThan(c.jd)).toBe(c.taiThan);
    expect(hacThan(c.jd)).toBe(c.hacThan);
    expect(tamSat(chiOfDay(c.jd))).toEqual(c.tamSat);
  });
});

describe('Đánh giá ngày theo tuổi', () => {
  it.each(data.tuoiCases.map((t) => [`${t.solar} / sinh ${t.birth}`, t] as const))('%s', (_, t) => {
    const r = danhGiaTuoi(parseIso(t.birth), parseIso(t.solar));
    expect(r.birthLunarYear).toBe(t.birthLunarYear);
    expect(r.canChiTuoi).toBe(t.canChiTuoi);
    expect(r.menh).toBe(t.menh);
    expect(r.factors).toEqual(t.factors);
    expect(r.score).toBe(t.score);
    expect(r.verdict).toBe(t.verdict);
  });
});

describe('Âm -> Dương', () => {
  it.each(data.cases.map((c) => [c.solar, c] as const))('%s', (_, c) => {
    expect(lunarToSolar(lunarOf(c))).toEqual(parseIso(c.solar));
  });
});

it('Tháng nhuận 1900-2100', () => {
  for (let y = 1900; y <= 2100; y++) {
    expect(leapMonthOfYear(y), `năm ${y}`).toBe(data.leapMonths[String(y)] ?? 0);
  }
});

it('Tháng nhuận không tồn tại -> null', () => {
  expect(lunarToSolar({ day: 1, month: 3, year: 2024, isLeap: true })).toBeNull();
});

it('Tổng độ dài các tháng = số ngày giữa hai Tết liên tiếp', () => {
  const tetJd = new Map(data.cases.filter((c) => c.category === 'tet').map((c) => [c.lunar.year, c.jd]));
  for (let y = 1900; y < 2100; y++) {
    const leap = leapMonthOfYear(y);
    let total = 0;
    for (let m = 1; m <= 12; m++) {
      total += lunarMonthLength(m, y);
      if (m === leap) total += lunarMonthLength(m, y, true);
    }
    expect(total, `năm ${y}`).toBe(tetJd.get(y + 1)! - tetJd.get(y)!);
  }
});
