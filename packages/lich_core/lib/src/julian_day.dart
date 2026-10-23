// =============================================================================
// julian_day.dart: đổi qua lại giữa ngày dương lịch và số ngày Julius (JD).
// -----------------------------------------------------------------------------
// JD là số nguyên đếm ngày liên tục từ năm 4713 TCN. Mọi phép tính âm lịch
// đều làm trên JD vì cộng/trừ ngày rất đơn giản (giống timestamp tính theo
// ngày thay vì mili-giây).
//
// Ghi chú cho dev JS: `~/` trong Dart là phép chia lấy phần nguyên
// (≈ Math.trunc(a / b)). Ở đây mọi số đều dương nên kết quả bằng Math.floor.
// =============================================================================

import 'models.dart';

/// Ngày dương lịch -> JD. Trước 15/10/1582 tự dùng lịch Julius.
int jdFromDate(int day, int month, int year) {
  final a = (14 - month) ~/ 12;
  final y = year + 4800 - a;
  final m = month + 12 * a - 3;
  var jd = day + (153 * m + 2) ~/ 5 + 365 * y + y ~/ 4 - y ~/ 100 + y ~/ 400 - 32045;
  if (jd < 2299161) {
    jd = day + (153 * m + 2) ~/ 5 + 365 * y + y ~/ 4 - 32083;
  }
  return jd;
}

/// JD -> ngày dương lịch.
SolarDate jdToDate(int jd) {
  int b, c;
  if (jd > 2299160) {
    final a = jd + 32044;
    b = (4 * a + 3) ~/ 146097;
    c = a - (b * 146097) ~/ 4;
  } else {
    b = 0;
    c = jd + 32082;
  }
  final d = (4 * c + 3) ~/ 1461;
  final e = c - (1461 * d) ~/ 4;
  final m = (5 * e + 2) ~/ 153;
  final day = e - (153 * m + 2) ~/ 5 + 1;
  final month = m + 3 - 12 * (m ~/ 10);
  final year = b * 100 + d - 4800 + m ~/ 10;
  return SolarDate(day, month, year);
}
