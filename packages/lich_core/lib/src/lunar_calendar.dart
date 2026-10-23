// =============================================================================
// lunar_calendar.dart: đổi dương lịch <-> âm lịch, tìm tháng nhuận.
// -----------------------------------------------------------------------------
// Nguyên tắc lịch âm Việt Nam (tóm tắt):
// - Mùng 1 là ngày có sóc, tính theo giờ Việt Nam (UTC+7). Vì khác múi giờ
//   nên Tết Việt Nam đôi khi lệch Tết Trung Quốc (ví dụ 1985, 2007, 2030).
// - Tháng 11 âm luôn chứa ngày Đông chí.
// - Năm có 13 tháng thì tháng đầu tiên không chứa trung khí là tháng nhuận.
//
// Biến "a11"/"b11" = JD ngày mùng 1 tháng 11 âm của năm trước / năm sau.
// =============================================================================

import 'astronomy.dart';
import 'julian_day.dart';
import 'models.dart';

/// Múi giờ mặc định: Việt Nam (UTC+7).
const double vietnamTimeZone = 7.0;

const double _synodicMonth = 29.530588853; // độ dài trung bình 1 tháng âm (ngày)
const double _firstNewMoonJd = 2415021.076998695; // sóc ngày 1/1/1900

/// JD của mùng 1 tháng 11 âm trong năm dương [year].
int _lunarMonth11(int year, double tz) {
  final off = jdFromDate(31, 12, year) - 2415021;
  final k = (off / _synodicMonth).floor();
  var nm = newMoonDay(k, tz);
  if (sunSector12(nm, tz) >= 9) nm = newMoonDay(k - 1, tz);
  return nm;
}

/// Vị trí tháng nhuận, đếm từ tháng 11 âm [a11] (1 = tháng ngay sau tháng 11).
int _leapMonthOffset(int a11, double tz) {
  final k = ((a11 - _firstNewMoonJd) / _synodicMonth + 0.5).floor();
  var i = 1;
  var arc = sunSector12(newMoonDay(k + i, tz), tz);
  int last;
  do {
    last = arc;
    i++;
    arc = sunSector12(newMoonDay(k + i, tz), tz);
  } while (arc != last && i < 14);
  return i - 1;
}

/// Đổi vị trí tháng nhuận (tính từ tháng 11) ra số tháng (1..12).
int _leapMonthFromOffset(int offset) {
  final m = offset + 10;
  return m > 12 ? m - 12 : m;
}

/// Dương lịch -> âm lịch.
///
/// Ví dụ: `solarToLunar(SolarDate(29, 1, 2025))` -> mùng 1 tháng 1 năm 2025.
LunarDate solarToLunar(SolarDate date, {double timeZone = vietnamTimeZone}) {
  final dayNumber = jdFromDate(date.day, date.month, date.year);
  final k = ((dayNumber - _firstNewMoonJd) / _synodicMonth).floor();
  var monthStart = newMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) monthStart = newMoonDay(k, timeZone);

  var a11 = _lunarMonth11(date.year, timeZone);
  var b11 = a11;
  int lunarYear;
  if (a11 >= monthStart) {
    lunarYear = date.year;
    a11 = _lunarMonth11(date.year - 1, timeZone);
  } else {
    lunarYear = date.year + 1;
    b11 = _lunarMonth11(date.year + 1, timeZone);
  }

  final lunarDay = dayNumber - monthStart + 1;
  final diff = ((monthStart - a11) / 29).floor();
  var isLeap = false;
  var lunarMonth = diff + 11;
  if (b11 - a11 > 365) {
    final leapOffset = _leapMonthOffset(a11, timeZone);
    if (diff >= leapOffset) {
      lunarMonth = diff + 10;
      if (diff == leapOffset) isLeap = true;
    }
  }
  if (lunarMonth > 12) lunarMonth -= 12;
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1;
  return LunarDate(lunarDay, lunarMonth, lunarYear, isLeap: isLeap);
}

/// Âm lịch -> dương lịch. Trả về `null` nếu ngày âm không tồn tại
/// (ví dụ hỏi "tháng 3 nhuận" trong năm không nhuận tháng 3).
SolarDate? lunarToSolar(LunarDate lunar, {double timeZone = vietnamTimeZone}) {
  int a11, b11;
  if (lunar.month < 11) {
    a11 = _lunarMonth11(lunar.year - 1, timeZone);
    b11 = _lunarMonth11(lunar.year, timeZone);
  } else {
    a11 = _lunarMonth11(lunar.year, timeZone);
    b11 = _lunarMonth11(lunar.year + 1, timeZone);
  }
  final k = (0.5 + (a11 - _firstNewMoonJd) / _synodicMonth).floor();
  var off = lunar.month - 11;
  if (off < 0) off += 12;
  if (b11 - a11 > 365) {
    final leapOffset = _leapMonthOffset(a11, timeZone);
    final leapMonth = _leapMonthFromOffset(leapOffset);
    if (lunar.isLeap && lunar.month != leapMonth) return null;
    if (lunar.isLeap || off >= leapOffset) off += 1;
  } else if (lunar.isLeap) {
    return null;
  }
  final monthStart = newMoonDay(k + off, timeZone);
  return jdToDate(monthStart + lunar.day - 1);
}

/// Tháng nhuận của năm âm lịch [lunarYear], trả về 0 nếu năm đó không nhuận.
int leapMonthOfYear(int lunarYear, {double timeZone = vietnamTimeZone}) {
  // Tháng nhuận 1..10 nằm giữa tháng 11 năm trước và tháng 11 năm nay
  var a11 = _lunarMonth11(lunarYear - 1, timeZone);
  var b11 = _lunarMonth11(lunarYear, timeZone);
  if (b11 - a11 > 365) {
    final m = _leapMonthFromOffset(_leapMonthOffset(a11, timeZone));
    if (m <= 10) return m;
  }
  // Tháng nhuận 11, 12 nằm sau tháng 11 năm nay (ví dụ 2033 nhuận tháng 11)
  a11 = b11;
  b11 = _lunarMonth11(lunarYear + 1, timeZone);
  if (b11 - a11 > 365) {
    final m = _leapMonthFromOffset(_leapMonthOffset(a11, timeZone));
    if (m >= 11) return m;
  }
  return 0;
}

/// Số ngày (29 hoặc 30) của tháng âm. Ném [ArgumentError] nếu tháng không tồn tại.
int lunarMonthLength(int month, int year, {bool isLeap = false, double timeZone = vietnamTimeZone}) {
  final first = lunarToSolar(LunarDate(1, month, year, isLeap: isLeap), timeZone: timeZone);
  if (first == null) throw ArgumentError('Không có tháng $month${isLeap ? ' nhuận' : ''} năm $year');
  final startJd = jdFromDate(first.day, first.month, first.year);
  var k = ((startJd - _firstNewMoonJd) / _synodicMonth).floor();
  while (newMoonDay(k, timeZone) <= startJd) {
    k++;
  }
  return newMoonDay(k, timeZone) - startJd;
}
