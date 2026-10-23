// =============================================================================
// julian-day.ts: đổi qua lại ngày dương lịch <-> số ngày Julius (JD).
// Logic giống hệt packages/lich_core/lib/src/julian_day.dart.
// =============================================================================

import type { SolarDate } from './types';

const int = Math.floor;

/** Ngày dương lịch -> JD. Trước 15/10/1582 tự dùng lịch Julius. */
export function jdFromDate(day: number, month: number, year: number): number {
  const a = int((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  let jd = day + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - int(y / 100) + int(y / 400) - 32045;
  if (jd < 2299161) {
    jd = day + int((153 * m + 2) / 5) + 365 * y + int(y / 4) - 32083;
  }
  return jd;
}

/** JD -> ngày dương lịch. */
export function jdToDate(jd: number): SolarDate {
  let b: number, c: number;
  if (jd > 2299160) {
    const a = jd + 32044;
    b = int((4 * a + 3) / 146097);
    c = a - int((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = int((4 * c + 3) / 1461);
  const e = c - int((1461 * d) / 4);
  const m = int((5 * e + 2) / 153);
  const day = e - int((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * int(m / 10);
  const year = b * 100 + d - 4800 + int(m / 10);
  return { day, month, year };
}
