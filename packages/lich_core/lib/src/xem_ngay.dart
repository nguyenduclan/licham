// =============================================================================
// xem_ngay.dart: Thập nhị trực, Nhị thập bát tú, các ngày kỵ.
// -----------------------------------------------------------------------------
// Logic giống hệt packages/lich-core/src/xem-ngay.ts và script sinh test.
// Phần giải nghĩa (nên làm / kiêng kỵ) nằm trong shared/data/xem-ngay.json.
// =============================================================================

import 'can_chi.dart';
import 'julian_day.dart';
import 'lunar_calendar.dart';
import 'models.dart';

/// 12 trực, bắt đầu từ Kiến.
const List<String> trucNames = [
  'Kiến', 'Trừ', 'Mãn', 'Bình', 'Định', 'Chấp', 'Phá', 'Nguy', 'Thành', 'Thu', 'Khai', 'Bế', //
];

/// 28 sao (Nhị thập bát tú), bắt đầu từ Giác.
const List<String> nhiThapBatTuNames = [
  'Giác', 'Cang', 'Đê', 'Phòng', 'Tâm', 'Vĩ', 'Cơ', //
  'Đẩu', 'Ngưu', 'Nữ', 'Hư', 'Nguy', 'Thất', 'Bích', //
  'Khuê', 'Lâu', 'Vị', 'Mão', 'Tất', 'Chủy', 'Sâm', //
  'Tỉnh', 'Quỷ', 'Liễu', 'Tinh', 'Trương', 'Dực', 'Chẩn', //
];

/// Chi (0..11) của tháng tiết khí chứa ngày [jd]. Tháng Dần bắt đầu từ Lập xuân,
/// mỗi "tiết" (Kinh trập, Thanh minh...) sang một tháng mới.
int chiOfSolarTermMonth(int jd, {double timeZone = vietnamTimeZone}) {
  final term = tietKhiIndex(jd, timeZone: timeZone); // 21 = Lập xuân
  return (2 + ((term - 21 + 24) % 24) ~/ 2) % 12;
}

/// Chỉ số trực (0 = Kiến ... 11 = Bế). Ngày Kiến là ngày có chi trùng chi tháng tiết khí.
int trucIndex(int jd, {double timeZone = vietnamTimeZone}) =>
    (chiOfDay(jd) - chiOfSolarTermMonth(jd, timeZone: timeZone) + 12) % 12;

/// Chỉ số sao Nhị thập bát tú (0 = Giác ... 27 = Chẩn). Chu kỳ 28 ngày, mỗi sao
/// luôn rơi vào cùng một thứ trong tuần (ví dụ sao Cơ luôn là thứ Tư).
int nhiThapBatTuIndex(int jd) => (jd + 11) % 28;

/// Các loại ngày kỵ theo ngày âm.
enum NgayKy { nguyetKy, nguyetTan, tamNuong, duongCongKy }

const Set<int> _nguyetKyDays = {5, 14, 23};
const Set<int> _tamNuongDays = {3, 7, 13, 18, 22, 27};

/// Dương Công Kỵ Nhật: 13 ngày âm cố định (tháng -> các ngày).
const Map<int, List<int>> _duongCongKy = {
  1: [13], 2: [11], 3: [9], 4: [7], 5: [5], 6: [3], //
  7: [8, 29], 8: [27], 9: [25], 10: [23], 11: [21], 12: [19], //
};

/// Danh sách ngày kỵ mà ngày [jd] (âm lịch [lunar]) phạm phải. Rỗng = không phạm.
List<NgayKy> ngayKy(int jd, LunarDate lunar, {double timeZone = vietnamTimeZone}) {
  final next = solarToLunar(jdToDate(jd + 1), timeZone: timeZone);
  return [
    if (_nguyetKyDays.contains(lunar.day)) NgayKy.nguyetKy,
    if (next.day == 1) NgayKy.nguyetTan, // hôm sau là mùng 1 -> hôm nay là ngày cuối tháng
    if (_tamNuongDays.contains(lunar.day)) NgayKy.tamNuong,
    if (!lunar.isLeap && (_duongCongKy[lunar.month]?.contains(lunar.day) ?? false)) NgayKy.duongCongKy,
  ];
}
