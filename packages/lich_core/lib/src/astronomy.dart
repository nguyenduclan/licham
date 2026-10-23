// =============================================================================
// astronomy.dart: tính thời điểm sóc (trăng mới) và kinh độ mặt trời.
// -----------------------------------------------------------------------------
// Đây là phần "thiên văn" của thuật toán Hồ Ngọc Đức (dựa theo sách
// "Astronomical Algorithms" của Jean Meeus). Độ chính xác cỡ vài phút, đủ dùng
// cho lịch 1900-2100.
//
// KHÔNG sửa các hằng số trong file này: chúng là hệ số thiên văn. Muốn sửa
// thì phải sửa đồng thời bản TypeScript và chạy lại toàn bộ test.
// =============================================================================

import 'dart:math' as math;

/// Thời điểm sóc thứ [k] (tính từ sóc ngày 1/1/1900), trả về JD dạng số thực (giờ UT).
double newMoon(int k) {
  final t = k / 1236.85;
  final t2 = t * t;
  final t3 = t2 * t;
  const dr = math.pi / 180;
  var jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * t2 - 0.000000155 * t3;
  jd1 = jd1 + 0.00033 * math.sin((166.56 + 132.87 * t - 0.009173 * t2) * dr);
  final m = 359.2242 + 29.10535608 * k - 0.0000333 * t2 - 0.00000347 * t3;
  final mpr = 306.0253 + 385.81691806 * k + 0.0107306 * t2 + 0.00001236 * t3;
  final f = 21.2964 + 390.67050646 * k - 0.0016528 * t2 - 0.00000239 * t3;
  var c1 = (0.1734 - 0.000393 * t) * math.sin(m * dr) + 0.0021 * math.sin(2 * dr * m);
  c1 = c1 - 0.4068 * math.sin(mpr * dr) + 0.0161 * math.sin(dr * 2 * mpr);
  c1 = c1 - 0.0004 * math.sin(dr * 3 * mpr);
  c1 = c1 + 0.0104 * math.sin(dr * 2 * f) - 0.0051 * math.sin(dr * (m + mpr));
  c1 = c1 - 0.0074 * math.sin(dr * (m - mpr)) + 0.0004 * math.sin(dr * (2 * f + m));
  c1 = c1 - 0.0004 * math.sin(dr * (2 * f - m)) - 0.0006 * math.sin(dr * (2 * f + mpr));
  c1 = c1 + 0.0010 * math.sin(dr * (2 * f - mpr)) + 0.0005 * math.sin(dr * (2 * mpr + m));
  final double deltat;
  if (t < -11) {
    deltat = 0.001 + 0.000839 * t + 0.0002261 * t2 - 0.00000845 * t3 - 0.000000081 * t * t3;
  } else {
    deltat = -0.000278 + 0.000265 * t + 0.000262 * t2;
  }
  return jd1 + c1 - deltat;
}

/// Ngày (JD nguyên, theo giờ địa phương [timeZone]) chứa sóc thứ [k].
int newMoonDay(int k, double timeZone) => (newMoon(k) + 0.5 + timeZone / 24).floor();

/// Kinh độ mặt trời (radian, 0..2π) tại thời điểm [jdn] (JD số thực, giờ UT).
double sunLongitude(double jdn) {
  final t = (jdn - 2451545.0) / 36525;
  final t2 = t * t;
  const dr = math.pi / 180;
  final m = 357.52910 + 35999.05030 * t - 0.0001559 * t2 - 0.00000048 * t * t2;
  final l0 = 280.46645 + 36000.76983 * t + 0.0003032 * t2;
  var dl = (1.914600 - 0.004817 * t - 0.000014 * t2) * math.sin(dr * m);
  dl = dl + (0.019993 - 0.000101 * t) * math.sin(dr * 2 * m) + 0.000290 * math.sin(dr * 3 * m);
  final l = (l0 + dl) * dr;
  return l - math.pi * 2 * (l / (math.pi * 2)).floor();
}

/// Cung trung khí (0..11) mà mặt trời đang ở, tính tại 00:00 giờ địa phương của ngày [dayNumber].
int sunSector12(int dayNumber, double timeZone) =>
    (sunLongitude(dayNumber - 0.5 - timeZone / 24) / math.pi * 6).floor();
