// =============================================================================
// day_info.dart: gom toàn bộ thông tin của một ngày vào một object.
// -----------------------------------------------------------------------------
// Màn hình "Hôm nay" và ô lịch chỉ cần gọi `DayInfo.fromSolar(...)` một lần.
// Ghi chú cho dev JS: `factory` constructor ≈ static method trả về instance
// (giống `static from(...)` trong class TS).
//
// `import ... as cc` ≈ `import * as cc from ...`: cần prefix vì tên field
// (canChiDay, tietKhi...) trùng tên hàm trong can_chi.dart.
// =============================================================================

import 'can_chi.dart' as cc;
import 'hoang_dao.dart' as hd;
import 'julian_day.dart';
import 'lunar_calendar.dart';
import 'models.dart';

class DayInfo {
  final SolarDate solar;
  final LunarDate lunar;

  /// Số ngày Julius, dùng để tính can chi và so sánh/cộng trừ ngày.
  final int jd;
  final String canChiDay;
  final String canChiMonth;
  final String canChiYear;
  final String tietKhi;

  /// Chỉ số chi (0 = Tý ...) của các giờ hoàng đạo.
  final List<int> gioHoangDao;

  /// Mệnh ngày (nạp âm), ví dụ "Đại Lâm Mộc".
  final String napAm;

  /// Thần trực ngày, ví dụ "Thanh Long".
  final String thanNgay;

  /// true = ngày hoàng đạo, false = ngày hắc đạo.
  final bool isHoangDao;

  /// Các tuổi xung với ngày, ví dụ ["Bính Tuất", "Canh Tuất"].
  final List<String> tuoiXung;

  const DayInfo({
    required this.solar,
    required this.lunar,
    required this.jd,
    required this.canChiDay,
    required this.canChiMonth,
    required this.canChiYear,
    required this.tietKhi,
    required this.gioHoangDao,
    required this.napAm,
    required this.thanNgay,
    required this.isHoangDao,
    required this.tuoiXung,
  });

  /// Tính đầy đủ thông tin cho ngày dương lịch [solar].
  factory DayInfo.fromSolar(SolarDate solar, {double timeZone = vietnamTimeZone}) {
    final jd = jdFromDate(solar.day, solar.month, solar.year);
    final lunar = solarToLunar(solar, timeZone: timeZone);
    return DayInfo(
      solar: solar,
      lunar: lunar,
      jd: jd,
      canChiDay: cc.canChiDay(jd),
      canChiMonth: cc.canChiMonth(lunar.month, lunar.year),
      canChiYear: cc.canChiYear(lunar.year),
      tietKhi: cc.tietKhi(jd, timeZone: timeZone),
      gioHoangDao: cc.gioHoangDao(jd),
      napAm: hd.napAmNames[hd.napAmIndexOfDay(jd)],
      thanNgay: hd.thanNgayNames[hd.thanNgayIndex(jd, lunar.month)],
      isHoangDao: hd.isHoangDao(jd, lunar.month),
      tuoiXung: hd.tuoiXung(jd),
    );
  }
}
