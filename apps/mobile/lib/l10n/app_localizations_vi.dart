// ignore: unused_import
import 'package:intl/intl.dart' as intl;

import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Vietnamese (`vi`).
class AppLocalizationsVi extends AppLocalizations {
  AppLocalizationsVi([String locale = 'vi']) : super(locale);

  @override
  String get appTitle => 'Lịch Âm LAL';

  @override
  String get navToday => 'Hôm nay';

  @override
  String get navCalendar => 'Lịch tháng';

  @override
  String lunarDate(Object day, Object month, Object leap, Object canChiYear) {
    return 'Ngày $day tháng $month$leap năm $canChiYear';
  }

  @override
  String get leapSuffix => ' (nhuận)';

  @override
  String get dayLabel => 'Ngày';

  @override
  String get monthLabel => 'Tháng';

  @override
  String get yearLabel => 'Năm';

  @override
  String get napAm => 'Mệnh ngày';

  @override
  String get hoangDao => 'Ngày hoàng đạo';

  @override
  String get hacDao => 'Ngày hắc đạo';

  @override
  String get tuoiXung => 'Tuổi xung';

  @override
  String get tietKhi => 'Tiết khí';

  @override
  String get gioHoangDao => 'Giờ hoàng đạo';

  @override
  String hourRange(Object start, Object end) {
    return '${start}h–${end}h';
  }

  @override
  String monthTitle(Object month, Object year) {
    return 'Tháng $month / $year';
  }

  @override
  String get today => 'Hôm nay';

  @override
  String get previousMonth => 'Tháng trước';

  @override
  String get nextMonth => 'Tháng sau';

  @override
  String get legendHoangDao => 'Hoàng đạo';

  @override
  String get legendHacDao => 'Hắc đạo';

  @override
  String get weekdays =>
      'Thứ Hai|Thứ Ba|Thứ Tư|Thứ Năm|Thứ Sáu|Thứ Bảy|Chủ Nhật';

  @override
  String get weekdaysShort => 'T2|T3|T4|T5|T6|T7|CN';

  @override
  String get referenceNote => 'Nội dung xem ngày chỉ mang tính tham khảo.';
}
