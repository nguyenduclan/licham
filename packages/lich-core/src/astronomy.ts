// =============================================================================
// astronomy.ts: thời điểm sóc (trăng mới) và kinh độ mặt trời.
// Logic giống hệt packages/lich_core/lib/src/astronomy.dart.
// KHÔNG sửa hằng số: đây là hệ số thiên văn (Jean Meeus).
// =============================================================================

const { sin, PI, floor } = Math;

/** Thời điểm sóc thứ k (tính từ sóc 1/1/1900), JD số thực (giờ UT). */
export function newMoon(k: number): number {
  const t = k / 1236.85;
  const t2 = t * t;
  const t3 = t2 * t;
  const dr = PI / 180;
  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * t2 - 0.000000155 * t3;
  jd1 = jd1 + 0.00033 * sin((166.56 + 132.87 * t - 0.009173 * t2) * dr);
  const m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;
  const mpr = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;
  const f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;
  let c1 = (0.1734 - 0.000393 * t) * sin(m * dr) + 0.0021 * sin(2 * dr * m);
  c1 = c1 - 0.4068 * sin(mpr * dr) + 0.0161 * sin(dr * 2 * mpr);
  c1 = c1 - 0.0004 * sin(dr * 3 * mpr);
  c1 = c1 + 0.0104 * sin(dr * 2 * f) - 0.0051 * sin(dr * (m + mpr));
  c1 = c1 - 0.0074 * sin(dr * (m - mpr)) + 0.0004 * sin(dr * (2 * f + m));
  c1 = c1 - 0.0004 * sin(dr * (2 * f - m)) - 0.0006 * sin(dr * (2 * f + mpr));
  c1 = c1 + 0.001 * sin(dr * (2 * f - mpr)) + 0.0005 * sin(dr * (2 * mpr + m));
  let deltat: number;
  if (t < -11) {
    deltat = 0.001 + 0.000839 * t + 0.0002261 * t2 - 0.00000845 * t3 - 0.000000081 * t * t3;
  } else {
    deltat = -0.000278 + 0.000265 * t + 0.000262 * t2;
  }
  return jd1 + c1 - deltat;
}

/** Ngày (JD nguyên, theo giờ địa phương) chứa sóc thứ k. */
export function newMoonDay(k: number, timeZone: number): number {
  return floor(newMoon(k) + 0.5 + timeZone / 24);
}

/** Kinh độ mặt trời (radian, 0..2π) tại JD số thực (giờ UT). */
export function sunLongitude(jdn: number): number {
  const t = (jdn - 2451545.0) / 36525;
  const t2 = t * t;
  const dr = PI / 180;
  const m = 357.5291 + 35999.0503 * t - 0.0001559 * t2 - 0.00000048 * t * t2;
  const l0 = 280.46645 + 36000.76983 * t + 0.0003032 * t2;
  let dl = (1.9146 - 0.004817 * t - 0.000014 * t2) * sin(dr * m);
  dl = dl + (0.019993 - 0.000101 * t) * sin(dr * 2 * m) + 0.00029 * sin(dr * 3 * m);
  const l = (l0 + dl) * dr;
  return l - PI * 2 * floor(l / (PI * 2));
}

/** Cung trung khí (0..11) tại 00:00 giờ địa phương của ngày dayNumber. */
export function sunSector12(dayNumber: number, timeZone: number): number {
  return floor((sunLongitude(dayNumber - 0.5 - timeZone / 24) / PI) * 6);
}
