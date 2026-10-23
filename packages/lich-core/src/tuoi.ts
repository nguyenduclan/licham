// =============================================================================
// tuoi.ts: quan hệ giữa các địa chi và đánh giá ngày hợp/xung với tuổi.
// Logic giống hệt packages/lich_core/lib/src/tuoi.dart.
// =============================================================================

import { chiOfDay, DIA_CHI, THIEN_CAN } from './can-chi';
import { isHoangDao, napAm, napAmHanh, napAmIndex, napAmIndexOfDay, tuoiXung } from './hoang-dao';
import { jdFromDate } from './julian-day';
import { solarToLunar, VIETNAM_TIME_ZONE } from './lunar-calendar';
import type { SolarDate } from './types';

/** Tam hợp: Thân Tý Thìn, Dần Ngọ Tuất, Hợi Mão Mùi, Tỵ Dậu Sửu. */
export const isTamHop = (a: number, b: number) => a !== b && a % 4 === b % 4;
/** Lục hợp: Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi. */
export const isLucHop = (a: number, b: number) => (a + b) % 12 === 1;
/** Lục xung: hai chi đối nhau (cách 6). */
export const isLucXung = (a: number, b: number) => (a - b + 12) % 12 === 6;
/** Lục hại: Tý-Mùi, Sửu-Ngọ, Dần-Tỵ, Mão-Thìn, Thân-Hợi, Dậu-Tuất. */
export const isTuongHai = (a: number, b: number) => (a + b) % 12 === 7;

const pairKey = (a: number, b: number) => (a < b ? a * 12 + b : b * 12 + a);
/** Tương hình: Dần-Tỵ-Thân, Sửu-Tuất-Mùi, Tý-Mão, tự hình Thìn/Ngọ/Dậu/Hợi. */
const HINH = new Set(
  [[2, 5], [5, 8], [2, 8], [1, 10], [7, 10], [1, 7], [0, 3], [4, 4], [6, 6], [9, 9], [11, 11]].map(([a, b]) => pairKey(a, b)),
);
/** Tương phá: Tý-Dậu, Sửu-Thìn, Dần-Hợi, Mão-Ngọ, Tỵ-Thân, Mùi-Tuất. */
const PHA = new Set([[0, 9], [1, 4], [2, 11], [3, 6], [5, 8], [7, 10]].map(([a, b]) => pairKey(a, b)));

export const isTuongHinh = (a: number, b: number) => HINH.has(pairKey(a, b));
export const isTuongPha = (a: number, b: number) => PHA.has(pairKey(a, b));

/** Các chi phạm Tam Sát của ngày (chỉ ngày Sửu, Thìn, Mùi, Tuất mới có). */
export function tamSat(dayChi: number): number[] {
  if (dayChi % 3 !== 1) return [];
  const start = (dayChi + 1) % 12;
  return [start, (start + 4) % 12, (start + 8) % 12];
}

export type TuoiFactor =
  | 'hoangDao' | 'hacDao' | 'tamHop' | 'lucHop' | 'tuoiXung' | 'lucXung' | 'tuongHinh'
  | 'tuongHai' | 'tuongPha' | 'tamSat' | 'ngaySinhMenh' | 'dongHanh' | 'ngayKhacMenh' | 'menhKhacNgay';

export const TUOI_FACTOR_SCORE: Record<TuoiFactor, number> = {
  hoangDao: 1, hacDao: -1, tamHop: 2, lucHop: 2, tuoiXung: -3, lucXung: -2, tuongHinh: -1,
  tuongHai: -1, tuongPha: -1, tamSat: -2, ngaySinhMenh: 2, dongHanh: 1, ngayKhacMenh: -2, menhKhacNgay: -1,
};

export type TuoiVerdict = 'tot' | 'binhThuong' | 'xau';

export interface DanhGiaTuoi {
  /** Năm âm lịch sinh (người sinh trước Tết thuộc năm âm trước). */
  birthLunarYear: number;
  canChiTuoi: string;
  menh: string;
  factors: TuoiFactor[];
  score: number;
  verdict: TuoiVerdict;
}

/** Đánh giá ngày `day` với người sinh ngày `birth` (dương lịch). */
export function danhGiaTuoi(birth: SolarDate, day: SolarDate, timeZone = VIETNAM_TIME_ZONE): DanhGiaTuoi {
  return danhGiaTuoiTheoNam(solarToLunar(birth, timeZone).year, day, timeZone);
}

/**
 * Đánh giá ngày `day` chỉ dựa trên năm sinh âm lịch `y`. Dùng hàm này khi không muốn
 * truyền ngày sinh đầy đủ (ví dụ trên URL web, để tránh lộ dữ liệu cá nhân).
 */
export function danhGiaTuoiTheoNam(y: number, day: SolarDate, timeZone = VIETNAM_TIME_ZONE): DanhGiaTuoi {
  const can = (y + 6) % 10;
  const chi = (y + 8) % 12;
  const jd = jdFromDate(day.day, day.month, day.year);
  const lunar = solarToLunar(day, timeZone);
  const dayChi = chiOfDay(jd);
  const menhHanh = napAmHanh(napAmIndex(can, chi));
  const ngayHanh = napAmHanh(napAmIndexOfDay(jd));
  const canChiTuoi = `${THIEN_CAN[can]} ${DIA_CHI[chi]}`;

  const factors: TuoiFactor[] = [isHoangDao(jd, lunar.month) ? 'hoangDao' : 'hacDao'];
  if (isTamHop(chi, dayChi)) factors.push('tamHop');
  if (isLucHop(chi, dayChi)) factors.push('lucHop');
  if (tuoiXung(jd).includes(canChiTuoi)) factors.push('tuoiXung');
  else if (isLucXung(chi, dayChi)) factors.push('lucXung');
  if (isTuongHinh(chi, dayChi)) factors.push('tuongHinh');
  if (isTuongHai(chi, dayChi)) factors.push('tuongHai');
  if (isTuongPha(chi, dayChi)) factors.push('tuongPha');
  if (tamSat(dayChi).includes(chi)) factors.push('tamSat');
  if ((ngayHanh + 1) % 5 === menhHanh) factors.push('ngaySinhMenh');
  else if (ngayHanh === menhHanh) factors.push('dongHanh');
  else if ((ngayHanh + 2) % 5 === menhHanh) factors.push('ngayKhacMenh');
  else if ((menhHanh + 2) % 5 === ngayHanh) factors.push('menhKhacNgay');

  const score = factors.reduce((sum, f) => sum + TUOI_FACTOR_SCORE[f], 0);
  const verdict: TuoiVerdict = score >= 2 ? 'tot' : score <= -2 ? 'xau' : 'binhThuong';
  return { birthLunarYear: y, canChiTuoi, menh: napAm(can, chi), factors, score, verdict };
}
