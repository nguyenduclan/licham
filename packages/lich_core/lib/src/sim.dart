// =============================================================================
// sim.dart: chấm điểm số điện thoại theo phong thủy và gợi ý số hợp mệnh.
// Logic giống hệt packages/lich-core/src/sim.ts (đọc comment đầu file đó để hiểu thang điểm).
// =============================================================================

import 'can_chi.dart';
import 'hoang_dao.dart';
import 'kinh_dich.dart';

/// Ngũ hành (chỉ số theo nguHanh: Kim 0, Thủy 1, Mộc 2, Hỏa 3, Thổ 4) của chữ số 0..9.
const List<int> hanhChuSo = [1, 1, 4, 2, 2, 4, 0, 0, 4, 3];

enum BoSoDep { locPhat, thanTai, ongDia, phatPhat, locLoc, truongCuu, tuQuy, tamHoa, sanhTien, taxi, lapKep, docNhat, namSinh }

enum BoSoXau { bonChin, namBa, duoiTu }

enum SimVerdict { ratTot, tot, kha, trungBinh, xau }

/// Chuẩn hóa số điện thoại Việt Nam: bỏ dấu cách/chấm/gạch, đổi +84/84 thành 0. Sai trả về null.
String? chuanHoaSoDienThoai(String input) {
  var s = input.replaceAll(RegExp(r'[\s.\-()]'), '');
  if (s.startsWith('+84')) {
    s = '0${s.substring(3)}';
  } else if (RegExp(r'^84\d{9}$').hasMatch(s)) {
    s = '0${s.substring(2)}';
  }
  return RegExp(r'^0\d{9}$').hasMatch(s) ? s : null;
}

class MenhNam {
  final String canChi;
  final String napAm;
  final int hanh;
  const MenhNam(this.canChi, this.napAm, this.hanh);
}

/// Mệnh (nạp âm) và hành của người sinh năm âm lịch [lunarYear].
MenhNam menhTheoNam(int lunarYear) {
  final can = (lunarYear + 6) % 10;
  final chi = (lunarYear + 8) % 12;
  return MenhNam('${thienCan[can]} ${diaChi[chi]}', napAm(can, chi), napAmHanh(napAmIndex(can, chi)));
}

/// Chữ số hợp mệnh (cùng hành hoặc sinh mệnh) và chữ số nên hạn chế (khắc mệnh).
({List<int> hop, List<int> khac}) chuSoTheoMenh(int hanh) {
  final hop = <int>[];
  final khac = <int>[];
  for (var digit = 0; digit < 10; digit++) {
    final h = hanhChuSo[digit];
    if (h == hanh || (h + 1) % 5 == hanh) {
      hop.add(digit);
    } else if ((h + 2) % 5 == hanh) {
      khac.add(digit);
    }
  }
  return (hop: hop, khac: khac);
}

String _end(String s, int n) => s.substring(s.length - n);
bool _same(String s) => s.split('').every((c) => c == s[0]);

/// Tìm các bộ số đẹp / xấu trong 6 số cuối (tứ quý, sảnh, năm sinh... xét ở đuôi).
({List<BoSoDep> dep, List<BoSoXau> xau}) timBoSo(String digits) {
  final tail = _end(digits, 6);
  final dep = <BoSoDep>[];
  if (tail.contains('68') || tail.contains('86')) dep.add(BoSoDep.locPhat);
  if (tail.contains('39') || tail.contains('79')) dep.add(BoSoDep.thanTai);
  if (tail.contains('38') || tail.contains('78')) dep.add(BoSoDep.ongDia);
  if (tail.contains('88')) dep.add(BoSoDep.phatPhat);
  if (tail.contains('66')) dep.add(BoSoDep.locLoc);
  if (tail.contains('99')) dep.add(BoSoDep.truongCuu);
  if (_same(_end(digits, 4))) {
    dep.add(BoSoDep.tuQuy);
  } else if (_same(_end(digits, 3))) {
    dep.add(BoSoDep.tamHoa);
  }
  final e3 = _end(digits, 3).split('').map(int.parse).toList();
  if (e3[1] == e3[0] + 1 && e3[2] == e3[1] + 1) dep.add(BoSoDep.sanhTien);
  final e4 = _end(digits, 4);
  final e6 = _end(digits, 6);
  if ((e4[0] == e4[2] && e4[1] == e4[3] && e4[0] != e4[1]) || (e6.substring(0, 3) == e6.substring(3) && !_same(e6))) {
    dep.add(BoSoDep.taxi);
  }
  if (e4[0] == e4[1] && e4[2] == e4[3] && e4[0] != e4[2]) dep.add(BoSoDep.lapKep);
  if (e4 == '1102') dep.add(BoSoDep.docNhat);
  final year = int.parse(e4);
  if (year >= 1950 && year <= 2030) dep.add(BoSoDep.namSinh);

  final xau = <BoSoXau>[];
  if (tail.contains('49')) xau.add(BoSoXau.bonChin);
  if (tail.contains('53')) xau.add(BoSoXau.namBa);
  if (digits.endsWith('4')) xau.add(BoSoXau.duoiTu);
  return (dep: dep, xau: xau);
}

double _half(double x) => (x * 2).round() / 2;

class KetQuaSim {
  final String digits;
  final MenhNam menh;
  final double nguHanhScore;
  final int soHop;
  final int soKhac;
  final double amDuongScore;
  final int chan;
  final int le;
  final double tongNutScore;
  final int nut;
  final QueSo que;
  final double queScore;
  final double boSoScore;
  final List<BoSoDep> boSoDep;
  final List<BoSoXau> boSoXau;
  final double total;
  final SimVerdict verdict;

  const KetQuaSim({
    required this.digits, required this.menh, required this.nguHanhScore, required this.soHop,
    required this.soKhac, required this.amDuongScore, required this.chan, required this.le,
    required this.tongNutScore, required this.nut, required this.que, required this.queScore,
    required this.boSoScore, required this.boSoDep, required this.boSoXau, required this.total,
    required this.verdict,
  });
}

/// Chấm điểm số [digits] (đã chuẩn hóa) cho người sinh năm âm lịch [lunarYear].
KetQuaSim chamDiemSim(String digits, int lunarYear) {
  final nums = digits.split('').map(int.parse).toList();
  final menh = menhTheoNam(lunarYear);
  final cs = chuSoTheoMenh(menh.hanh);
  final soHop = nums.where(cs.hop.contains).length;
  final soKhac = nums.where(cs.khac.contains).length;
  final nguHanhScore = _half((3 * (soHop - soKhac) / nums.length).clamp(0, 3).toDouble());

  final chan = nums.where((d) => d.isEven).length;
  final le = nums.length - chan;
  final lech = (chan - le).abs();
  final double amDuongScore = lech <= 2 ? 2 : (lech <= 4 ? 1 : 0);

  final r = nums.fold(0, (s, d) => s + d) % 10;
  final nut = r == 0 ? 10 : r;
  final double tongNutScore = nut >= 9 ? 2 : (nut >= 7 ? 1 : 0);

  final que = lapQueTuDaySo(digits);
  final double queScore = switch (que.chu.rating) { QueRating.tot => 2, QueRating.binh => 1, QueRating.xau => 0 };

  final bo = timBoSo(digits);
  final boSoScore = (bo.dep.isNotEmpty ? 1 : 0) - bo.xau.length.toDouble();

  final total = (nguHanhScore + amDuongScore + tongNutScore + queScore + boSoScore).clamp(0, 10).toDouble();
  final verdict = total >= 8
      ? SimVerdict.ratTot
      : total >= 6.5
          ? SimVerdict.tot
          : total >= 5
              ? SimVerdict.kha
              : total >= 3.5
                  ? SimVerdict.trungBinh
                  : SimVerdict.xau;
  return KetQuaSim(
    digits: digits, menh: menh, nguHanhScore: nguHanhScore, soHop: soHop, soKhac: soKhac,
    amDuongScore: amDuongScore, chan: chan, le: le, tongNutScore: tongNutScore, nut: nut,
    que: que, queScore: queScore, boSoScore: boSoScore, boSoDep: bo.dep, boSoXau: bo.xau,
    total: total, verdict: verdict,
  );
}

const List<String> _duoiDep = [
  '68', '86', '88', '66', '99', '39', '79', '38', '78', '6868', '8686', '6688', '8866', '8668', '6886', //
  '3939', '7979', '3838', '7878', '1368', '5678', '6789', '2468', '1102', '2828', '5858', '8888', '6666', //
  '9999', '5555', '7777', '3333', '1111', '0000', '2222', '4444', '3456', '1234', '2345', '0123', //
];

/// Gợi ý đuôi số mà MỌI chữ số đều hợp mệnh. Tối đa [limit] đuôi.
List<String> goiYDuoiSo(int lunarYear, {int limit = 12}) {
  final hop = chuSoTheoMenh(menhTheoNam(lunarYear).hanh).hop;
  return _duoiDep.where((s) => s.split('').every((c) => hop.contains(int.parse(c)))).take(limit).toList();
}
