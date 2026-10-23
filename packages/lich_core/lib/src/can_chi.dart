// =============================================================================
// can_chi.dart: can chi của năm/tháng/ngày, tiết khí, giờ hoàng đạo.
// -----------------------------------------------------------------------------
// Tên can, chi, tiết khí là THUẬT NGỮ CỐ ĐỊNH của lịch nên để ở đây.
// Chữ giao diện (nhãn, câu chữ) thì vẫn đặt trong file l10n của app.
// =============================================================================

import 'dart:math' as math;

import 'astronomy.dart';
import 'lunar_calendar.dart' show vietnamTimeZone;

/// 10 thiên can.
const List<String> thienCan = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

/// 12 địa chi (chỉ số 0 = Tý ... 11 = Hợi).
const List<String> diaChi = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

/// 24 tiết khí, bắt đầu từ Xuân phân (kinh độ mặt trời 0°), mỗi tiết cách nhau 15°.
const List<String> tietKhiNames = [
  'Xuân phân', 'Thanh minh', 'Cốc vũ', 'Lập hạ', 'Tiểu mãn', 'Mang chủng', //
  'Hạ chí', 'Tiểu thử', 'Đại thử', 'Lập thu', 'Xử thử', 'Bạch lộ', //
  'Thu phân', 'Hàn lộ', 'Sương giáng', 'Lập đông', 'Tiểu tuyết', 'Đại tuyết', //
  'Đông chí', 'Tiểu hàn', 'Đại hàn', 'Lập xuân', 'Vũ thủy', 'Kinh trập', //
];

/// Giờ hoàng đạo theo chi của ngày (chi % 6). Ký tự '1' ở vị trí i = giờ chi i là giờ tốt.
const List<String> _gioHoangDaoPatterns = [
  '110100101100', '001101001011', '110011010010', //
  '101100110100', '001011001101', '010010110011', //
];

/// Can chi của năm âm lịch. Ví dụ 2025 -> "Ất Tỵ".
String canChiYear(int lunarYear) => '${thienCan[(lunarYear + 6) % 10]} ${diaChi[(lunarYear + 8) % 12]}';

/// Can chi của tháng âm lịch (tháng nhuận dùng chung can chi với tháng thường).
String canChiMonth(int lunarMonth, int lunarYear) =>
    '${thienCan[(lunarYear * 12 + lunarMonth + 3) % 10]} ${diaChi[(lunarMonth + 1) % 12]}';

/// Chỉ số chi (0..11) của ngày có số Julius [jd].
int chiOfDay(int jd) => (jd + 1) % 12;

/// Can chi của ngày có số Julius [jd].
String canChiDay(int jd) => '${thienCan[(jd + 9) % 10]} ${diaChi[chiOfDay(jd)]}';

/// Chỉ số tiết khí (0..23, xem [tietKhiNames]) đang hiệu lực lúc 24:00 của ngày [jd].
int tietKhiIndex(int jd, {double timeZone = vietnamTimeZone}) =>
    (sunLongitude(jd + 1 - 0.5 - timeZone / 24) / math.pi * 12).floor();

/// Tên tiết khí của ngày [jd].
String tietKhi(int jd, {double timeZone = vietnamTimeZone}) => tietKhiNames[tietKhiIndex(jd, timeZone: timeZone)];

/// Danh sách chỉ số chi (0 = Tý ...) của 6 giờ hoàng đạo trong ngày [jd].
List<int> gioHoangDao(int jd) {
  final pattern = _gioHoangDaoPatterns[chiOfDay(jd) % 6];
  return [for (var i = 0; i < 12; i++) if (pattern[i] == '1') i];
}

/// Giờ bắt đầu (0..23) của giờ chi [chiIndex]. Ví dụ Tý -> 23 (23h-1h), Sửu -> 1.
int chiHourStart(int chiIndex) => (chiIndex * 2 + 23) % 24;
