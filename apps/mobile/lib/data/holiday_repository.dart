// =============================================================================
// holiday_repository.dart: đọc ngày lễ từ assets/data/holidays.json (copy từ shared/data).
// Logic giống apps/web/src/lib/holidays.ts. Thêm ngày lễ: sửa shared/data/holidays.json
// rồi chạy shared/tools/sync-mobile-data.ps1.
// =============================================================================

import 'dart:convert';

import 'package:flutter/services.dart' show rootBundle;
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lich_core/lich_core.dart';

class Holiday {
  final String name;
  final bool dayOff;
  /// true nếu là lễ theo âm lịch (tô đỏ ngày âm trên lịch).
  final bool isLunar;
  const Holiday(this.name, {this.dayOff = false, this.isLunar = false});
}

class HolidayRepository {
  final List<Map<String, dynamic>> _solar;
  final List<Map<String, dynamic>> _lunar;
  final List<Map<String, dynamic>> _everyMonth;
  final Map<String, dynamic> _newYearEve;

  HolidayRepository._(this._solar, this._lunar, this._everyMonth, this._newYearEve);

  /// Đọc file JSON trong assets (bất đồng bộ ≈ await fetch).
  static Future<HolidayRepository> load() async {
    final data = jsonDecode(await rootBundle.loadString('assets/data/holidays.json')) as Map<String, dynamic>;
    List<Map<String, dynamic>> list(String key) => (data[key] as List).cast<Map<String, dynamic>>();
    return HolidayRepository._(list('solar'), list('lunar'), list('lunarEveryMonth'), data['lunarNewYearEve'] as Map<String, dynamic>);
  }

  /// Các ngày lễ của một ngày (dương lịch [solar], âm lịch [lunar], số Julius [jd]).
  List<Holiday> holidaysOf(SolarDate solar, LunarDate lunar, int jd) {
    final result = <Holiday>[
      for (final h in _solar)
        if (h['day'] == solar.day && h['month'] == solar.month) Holiday(h['name'] as String, dayOff: h['dayOff'] == true),
    ];
    // Lễ âm lịch chỉ tính tháng thường, không tính tháng nhuận
    final lunarHolidays = lunar.isLeap
        ? <Map<String, dynamic>>[]
        : _lunar.where((h) => h['day'] == lunar.day && h['month'] == lunar.month).toList();
    for (final h in lunarHolidays) {
      result.add(Holiday(h['name'] as String, dayOff: h['dayOff'] == true, isLunar: true));
    }
    if (lunarHolidays.isEmpty) {
      for (final h in _everyMonth) {
        if (h['day'] == lunar.day) result.add(Holiday(h['name'] as String, isLunar: true));
      }
    }
    // Giao thừa = ngày mà hôm sau là mùng 1 Tết
    final next = solarToLunar(jdToDate(jd + 1));
    if (next.day == 1 && next.month == 1 && !next.isLeap) {
      result.add(Holiday(_newYearEve['name'] as String, dayOff: _newYearEve['dayOff'] == true, isLunar: true));
    }
    return result;
  }
}

/// FutureProvider ≈ một hook useQuery: đọc file một lần, các widget dùng chung kết quả.
final holidayRepositoryProvider = FutureProvider<HolidayRepository>((ref) => HolidayRepository.load());
