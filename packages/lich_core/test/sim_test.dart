// =============================================================================
// sim_test.dart: Kinh Dịch + chấm điểm sim. Mốc tính tay + khớp shared/sim_cases.json (sinh từ bản TS).
// =============================================================================

import 'dart:convert';
import 'dart:io';

import 'package:lich_core/lich_core.dart';
import 'package:test/test.dart';

void main() {
  group('Kinh Dịch', () {
    test('Đủ 64 quẻ không trùng', () {
      final seen = <int>{};
      for (var t = 1; t <= 8; t++) {
        for (var h = 1; h <= 8; h++) {
          seen.add(queTheoQuai(t, h).so);
        }
      }
      expect(seen.length, 64);
    });

    test('Thái động hào 1 biến Thăng; biến 2 lần về quẻ cũ', () {
      final thai = queTheoQuai(8, 1);
      expect(queBien(thai, 1).ten, 'Địa Phong Thăng');
      for (var hao = 1; hao <= 6; hao++) {
        expect(queBien(queBien(thai, hao), hao).so, thai.so);
      }
    });

    test('Lập quẻ 0912345678 (tính tay)', () {
      final q = lapQueTuDaySo('0912345678');
      expect([q.chu.ten, q.haoDong, q.bien.ten], ['Sơn Thủy Mông', 3, 'Sơn Phong Cổ']);
    });
  });

  test('Chuẩn hóa số điện thoại', () {
    expect(chuanHoaSoDienThoai('+84 912 345 678'), '0912345678');
    expect(chuanHoaSoDienThoai('0912.345.678'), '0912345678');
    expect(chuanHoaSoDienThoai('091234567'), isNull);
  });

  final data = jsonDecode(File('../../shared/sim_cases.json').readAsStringSync()) as Map<String, dynamic>;

  group('Khớp bản TypeScript', () {
    for (final c in (data['cases'] as List).cast<Map<String, dynamic>>()) {
      test('${c['digits']} / ${c['lunarYear']}', () {
        final r = chamDiemSim(c['digits'] as String, c['lunarYear'] as int);
        final menh = c['menh'] as Map<String, dynamic>;
        expect([r.menh.canChi, r.menh.napAm, r.menh.hanh], [menh['canChi'], menh['napAm'], menh['hanh']]);
        final nh = c['nguHanh'] as Map<String, dynamic>;
        expect([r.nguHanhScore, r.soHop, r.soKhac], [nh['score'], nh['hop'], nh['khac']]);
        final ad = c['amDuong'] as Map<String, dynamic>;
        expect([r.amDuongScore, r.chan, r.le], [ad['score'], ad['chan'], ad['le']]);
        final tn = c['tongNut'] as Map<String, dynamic>;
        expect([r.tongNutScore, r.nut], [tn['score'], tn['nut']]);
        final q = c['que'] as Map<String, dynamic>;
        expect([r.que.chu.so, r.que.bien.so, r.que.haoDong, r.que.chu.ten, r.queScore],
            [q['chu'], q['bien'], q['haoDong'], q['ten'], q['score']]);
        final bo = c['boSo'] as Map<String, dynamic>;
        expect(r.boSoScore, bo['score']);
        expect(r.boSoDep.map((e) => e.name).toList(), (bo['dep'] as List).cast<String>());
        expect(r.boSoXau.map((e) => e.name).toList(), (bo['xau'] as List).cast<String>());
        expect(r.total, c['total']);
        expect(r.verdict.name, c['verdict']);
      });
    }
  });

  test('Gợi ý đuôi số khớp bản TypeScript', () {
    for (final g in (data['goiY'] as List).cast<Map<String, dynamic>>()) {
      expect(goiYDuoiSo(g['lunarYear'] as int), (g['duoi'] as List).cast<String>());
    }
  });
}
