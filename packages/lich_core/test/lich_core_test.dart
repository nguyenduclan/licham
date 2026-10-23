// =============================================================================
// lich_core_test.dart: chạy toàn bộ shared/test_cases.json.
// -----------------------------------------------------------------------------
// Chạy: cd packages/lich_core && dart test
// `group` ≈ `describe`, `test` ≈ `it`, `expect(a, b)` ≈ `expect(a).toEqual(b)`.
// =============================================================================

import 'dart:convert';
import 'dart:io';

import 'package:lich_core/lich_core.dart';
import 'package:test/test.dart';

SolarDate parseIso(String iso) {
  final p = iso.split('-').map(int.parse).toList();
  return SolarDate(p[2], p[1], p[0]);
}

void main() {
  // `dart test` chạy với thư mục hiện tại = packages/lich_core
  final data = jsonDecode(File('../../shared/test_cases.json').readAsStringSync()) as Map<String, dynamic>;
  final cases = (data['cases'] as List).cast<Map<String, dynamic>>();
  final leapMonths = data['leapMonths'] as Map<String, dynamic>;

  LunarDate lunarOf(Map<String, dynamic> c) {
    final l = c['lunar'] as Map<String, dynamic>;
    return LunarDate(l['day'] as int, l['month'] as int, l['year'] as int, isLeap: l['leap'] as bool);
  }

  test('có ít nhất 200 test case', () => expect(cases.length, greaterThanOrEqualTo(200)));

  group('Dương -> Âm, can chi, tiết khí, giờ hoàng đạo', () {
    for (final c in cases) {
      test('${c['solar']} ${c['note']}', () {
        final info = DayInfo.fromSolar(parseIso(c['solar'] as String));
        final canChi = c['canChi'] as Map<String, dynamic>;
        expect(info.jd, c['jd']);
        expect(info.lunar, lunarOf(c));
        expect(info.canChiDay, canChi['day']);
        expect(info.canChiMonth, canChi['month']);
        expect(info.canChiYear, canChi['year']);
        expect(info.tietKhi, c['tietKhi']);
        expect(info.gioHoangDao, (c['gioHoangDao'] as List).cast<int>());
        expect(info.napAm, c['napAm']);
        expect(info.thanNgay, c['thanNgay']);
        expect(info.isHoangDao, c['hoangDao']);
        expect(info.tuoiXung, (c['tuoiXung'] as List).cast<String>());
      });
    }
  });

  group('Xem ngày: trực, sao, ngày kỵ, Lục Diệu, xuất hành, Tam Sát', () {
    for (final c in cases) {
      test('${c['solar']}', () {
        final jd = c['jd'] as int;
        final lunar = lunarOf(c);
        expect(trucNames[trucIndex(jd)], c['truc']);
        expect(nhiThapBatTuNames[nhiThapBatTuIndex(jd)], c['nhiThapBatTu']);
        expect(ngayKy(jd, lunar).map((k) => k.name).toList(), (c['ngayKy'] as List).cast<String>());
        expect(lucDieuNames[lucDieuIndex(lunar.month, lunar.day)], c['lucDieu']);
        expect(gioLyThuanPhong(lunar.month, lunar.day), (c['gioLyThuanPhong'] as List).cast<int>());
        expect(hyThan(jd), c['hyThan']);
        expect(taiThan(jd), c['taiThan']);
        expect(hacThan(jd), c['hacThan']);
        expect(tamSat(chiOfDay(jd)), (c['tamSat'] as List).cast<int>());
      });
    }
  });

  group('Đánh giá ngày theo tuổi', () {
    for (final t in (data['tuoiCases'] as List).cast<Map<String, dynamic>>()) {
      test('${t['solar']} / sinh ${t['birth']}', () {
        final r = danhGiaTuoi(parseIso(t['birth'] as String), parseIso(t['solar'] as String));
        expect(r.birthLunarYear, t['birthLunarYear']);
        expect(r.canChiTuoi, t['canChiTuoi']);
        expect(r.menh, t['menh']);
        expect(r.factors.map((f) => f.name).toList(), (t['factors'] as List).cast<String>());
        expect(r.score, t['score']);
        expect(r.verdict.name, t['verdict']);
      });
    }
  });

  group('Âm -> Dương', () {
    for (final c in cases) {
      test('${c['solar']}', () {
        expect(lunarToSolar(lunarOf(c)), parseIso(c['solar'] as String));
      });
    }
  });

  test('Tháng nhuận 1900-2100', () {
    for (var y = 1900; y <= 2100; y++) {
      expect(leapMonthOfYear(y), leapMonths['$y'] ?? 0, reason: 'năm $y');
    }
  });

  test('Tháng nhuận không tồn tại -> null', () {
    expect(lunarToSolar(const LunarDate(1, 3, 2024, isLeap: true)), isNull);
  });

  test('Tổng độ dài các tháng = số ngày giữa hai Tết liên tiếp', () {
    final tetJd = {
      for (final c in cases.where((c) => c['category'] == 'tet')) (c['lunar'] as Map)['year'] as int: c['jd'] as int,
    };
    for (var y = 1900; y < 2100; y++) {
      final leap = leapMonthOfYear(y);
      var total = 0;
      for (var m = 1; m <= 12; m++) {
        total += lunarMonthLength(m, y);
        if (m == leap) total += lunarMonthLength(m, y, isLeap: true);
      }
      expect(total, tetJd[y + 1]! - tetJd[y]!, reason: 'năm $y');
    }
  });
}
