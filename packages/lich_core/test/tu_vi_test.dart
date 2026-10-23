// =============================================================================
// tu_vi_test.dart: bản Dart phải ra lá số GIỐNG HỆT bản TS (shared/tu_vi_cases.json),
// cộng vài mốc tra bảng an sao kinh điển.
// Chạy: cd packages/lich_core && dart test
// =============================================================================

import 'dart:convert';
import 'dart:io';

import 'package:lich_core/lich_core.dart';
import 'package:test/test.dart';

void main() {
  final data = jsonDecode(File('../../shared/tu_vi_cases.json').readAsStringSync()) as Map<String, dynamic>;
  final cases = (data['cases'] as List).cast<Map<String, dynamic>>();

  group('Lá số khớp bản TypeScript', () {
    for (final c in cases) {
      final input = c['input'] as Map<String, dynamic>;
      final expected = c['laSo'] as Map<String, dynamic>;
      test('${input['solar'] ?? input['lunar']} giờ ${input['hourChi']} ${input['gioiTinh']}', () {
        final gioiTinh = input['gioiTinh'] == 'nu' ? GioiTinh.nu : GioiTinh.nam;
        final LaSoTuVi l;
        if (input['solar'] != null) {
          final p = (input['solar'] as String).split('-').map(int.parse).toList();
          l = lapLaSoTuVi(SolarDate(p[2], p[1], p[0]), input['hourChi'] as int, gioiTinh);
        } else {
          final lu = input['lunar'] as Map<String, dynamic>;
          l = lapLaSoTuViAmLich(
            LunarDate(lu['day'] as int, lu['month'] as int, lu['year'] as int, isLeap: lu['isLeap'] as bool),
            input['hourChi'] as int,
            gioiTinh,
          );
        }
        final el = expected['lunar'] as Map<String, dynamic>;
        expect(l.lunar, LunarDate(el['day'] as int, el['month'] as int, el['year'] as int, isLeap: el['isLeap'] as bool));
        expect(l.thangAnSao, expected['thangAnSao']);
        expect(l.canChiNam, expected['canChiNam']);
        expect(l.amDuong, expected['amDuong']);
        expect(l.banMenh, expected['banMenh']);
        expect(l.cuc, expected['cuc']);
        expect(l.menhChi, expected['menhChi']);
        expect(l.thanChi, expected['thanChi']);
        final cung = (expected['cung'] as List).cast<Map<String, dynamic>>();
        for (var i = 0; i < 12; i++) {
          final e = cung[i];
          final g = l.cung[i];
          expect(g.canChi, e['canChi'], reason: 'cung $i');
          expect(g.cung, e['cung'], reason: 'cung $i');
          expect(g.isThan, e['isThan'], reason: 'cung $i');
          expect(g.chinhTinh, (e['chinhTinh'] as List).cast<String>(), reason: 'cung $i');
          expect(g.phuTinh, (e['phuTinh'] as List).cast<String>(), reason: 'cung $i');
          expect(g.tuHoa, (e['tuHoa'] as List).cast<String>(), reason: 'cung $i');
          expect(g.trangSinh, e['trangSinh'], reason: 'cung $i');
          expect(g.daiVan, e['daiVan'], reason: 'cung $i');
        }
      });
    }
  });

  group('Đối chiếu lá số mẫu tuvi.vn', () {
    final anchors = ((jsonDecode(File('../../shared/tu_vi_anchors.json').readAsStringSync()) as Map)['anchors'] as List)
        .cast<Map<String, dynamic>>();
    for (final a in anchors) {
      test(a['name'] as String, () {
        final p = (a['solar'] as String).split('-').map(int.parse).toList();
        final l = lapLaSoTuVi(SolarDate(p[2], p[1], p[0]), a['hourChi'] as int, a['gioiTinh'] == 'nu' ? GioiTinh.nu : GioiTinh.nam);
        final lu = a['lunar'] as Map<String, dynamic>;
        expect([l.lunar.day, l.lunar.month, l.lunar.year], [lu['day'], lu['month'], lu['year']]);
        expect([l.amDuong, l.banMenh, l.cuc, l.menhChi, l.thanChi],
            [a['amDuong'], a['banMenh'], a['cuc'], a['menhChi'], a['thanChi']]);
        int chiOf(List<String> Function(CungTuVi) pick, String star) => l.cung.indexWhere((c) => pick(c).contains(star));
        (a['chinhTinh'] as Map<String, dynamic>).forEach((star, chi) => expect(chiOf((c) => c.chinhTinh, star), chi, reason: star));
        (a['phuTinh'] as Map<String, dynamic>).forEach((star, chi) => expect(chiOf((c) => c.phuTinh, star), chi, reason: star));
        (a['tuHoa'] as Map<String, dynamic>).forEach((hoa, chi) {
          expect(l.cung.indexWhere((c) => c.tuHoa.any((h) => h.startsWith(hoa))), chi, reason: hoa);
        });
        expect(l.cung[a['trangSinhChi'] as int].trangSinh, 'Tràng Sinh');
        expect(l.cung[a['menhChi'] as int].daiVan, a['daiVanMenh']);
        final ke = a['daiVanCungKe'] as Map<String, dynamic>;
        expect(l.cung[ke['chi'] as int].daiVan, ke['tuoi']);
      });
    }
  });

  // Bảng an Tử Vi kinh điển: Thủy nhị cục ngày 1 -> Sửu, ngày 2 -> Dần; Mộc tam cục ngày 1 -> Thìn
  test('An Tử Vi theo bảng', () {
    expect(anTuVi(2, 1), 1);
    expect(anTuVi(2, 2), 2);
    expect(anTuVi(2, 3), 2);
    expect(anTuVi(3, 1), 4);
    expect(anTuVi(3, 2), 1);
  });
}
