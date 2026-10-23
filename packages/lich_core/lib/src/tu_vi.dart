// =============================================================================
// tu_vi.dart: lập lá số Tử Vi Đẩu Số (an 12 cung, Cục, 14 chính tinh, phụ tinh chính,
// Tứ Hóa, vòng Tràng Sinh, đại vận). Logic giống hệt packages/lich-core/src/tu-vi.ts.
//
// Mọi vị trí tính theo chỉ số địa chi: 0 = Tý ... 11 = Hợi. "Thuận" = tăng, "nghịch" = giảm.
// Ghi chú cho dev JS: toán tử % của Dart luôn trả số không âm (khác JS), nên không cần
// viết ((n % 12) + 12) % 12 như bên TypeScript.
// =============================================================================

import 'can_chi.dart';
import 'hoang_dao.dart';
import 'lunar_calendar.dart';
import 'models.dart';

/// 12 cung, theo thứ tự đi NGHỊCH từ Mệnh.
const List<String> cungNames = [
  'Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Tức', 'Tài Bạch', 'Tật Ách', //
  'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu', //
];

const List<String> chinhTinhNames = [
  'Tử Vi', 'Thiên Cơ', 'Thái Dương', 'Vũ Khúc', 'Thiên Đồng', 'Liêm Trinh', //
  'Thiên Phủ', 'Thái Âm', 'Tham Lang', 'Cự Môn', 'Thiên Tướng', 'Thiên Lương', 'Thất Sát', 'Phá Quân', //
];

const List<String> trangSinhNames = [
  'Tràng Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy', //
  'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng', //
];

const List<String> tuHoaNames = ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ'];

/// Tứ Hóa theo can năm: [Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ].
const List<List<String>> _tuHoaTheoCan = [
  ['Liêm Trinh', 'Phá Quân', 'Vũ Khúc', 'Thái Dương'], // Giáp
  ['Thiên Cơ', 'Thiên Lương', 'Tử Vi', 'Thái Âm'], // Ất
  ['Thiên Đồng', 'Thiên Cơ', 'Văn Xương', 'Liêm Trinh'], // Bính
  ['Thái Âm', 'Thiên Đồng', 'Thiên Cơ', 'Cự Môn'], // Đinh
  ['Tham Lang', 'Thái Âm', 'Hữu Bật', 'Thiên Cơ'], // Mậu
  ['Vũ Khúc', 'Tham Lang', 'Thiên Lương', 'Văn Khúc'], // Kỷ
  ['Thái Dương', 'Vũ Khúc', 'Thái Âm', 'Thiên Đồng'], // Canh
  ['Cự Môn', 'Thái Dương', 'Văn Khúc', 'Văn Xương'], // Tân
  ['Thiên Lương', 'Tử Vi', 'Tả Phù', 'Vũ Khúc'], // Nhâm
  ['Phá Quân', 'Cự Môn', 'Thái Âm', 'Tham Lang'], // Quý
];

/// Cục theo ngũ hành nạp âm của cung Mệnh (thứ tự nguHanh: Kim, Thủy, Mộc, Hỏa, Thổ).
const List<int> _cucTheoHanh = [4, 2, 3, 6, 5];
const Map<int, String> _cucNames = {
  2: 'Thủy nhị cục', 3: 'Mộc tam cục', 4: 'Kim tứ cục', 5: 'Thổ ngũ cục', 6: 'Hỏa lục cục', //
};
const Map<int, int> _trangSinhStart = {2: 8, 5: 8, 3: 11, 4: 5, 6: 2};
const List<int> _locTon = [2, 3, 5, 6, 5, 6, 8, 9, 11, 0];
const List<List<int>> _khoiViet = [
  [1, 7], [0, 8], [11, 9], [11, 9], [1, 7], [0, 8], [1, 7], [6, 2], [3, 5], [3, 5], //
];
/// [khởi Hỏa Tinh, khởi Linh Tinh] theo nhóm tam hợp của chi năm (chi % 4).
const Map<int, List<int>> _hoaLinhStart = {0: [2, 10], 1: [3, 10], 2: [1, 3], 3: [9, 10]};
const Map<int, int> _thienMa = {0: 2, 1: 11, 2: 8, 3: 5};

enum GioiTinh { nam, nu }

class CungTuVi {
  final int chi;
  final String canChi;
  final String cung;
  final bool isThan;
  final List<String> chinhTinh;
  final List<String> phuTinh;
  final List<String> tuHoa;
  final String trangSinh;
  final int daiVan;

  const CungTuVi({
    required this.chi,
    required this.canChi,
    required this.cung,
    required this.isThan,
    required this.chinhTinh,
    required this.phuTinh,
    required this.tuHoa,
    required this.trangSinh,
    required this.daiVan,
  });
}

class LaSoTuVi {
  final LunarDate lunar;
  /// Tháng dùng để an sao (tháng nhuận: ngày 1–15 tính tháng đó, từ 16 tính tháng sau).
  final int thangAnSao;
  final int hourChi;
  final GioiTinh gioiTinh;
  final String canChiNam;
  final String amDuong;
  final String banMenh;
  final int cuc;
  final String cucName;
  final int menhChi;
  final int thanChi;
  /// 12 cung, chỉ số = chi (0 = Tý).
  final List<CungTuVi> cung;

  const LaSoTuVi({
    required this.lunar,
    required this.thangAnSao,
    required this.hourChi,
    required this.gioiTinh,
    required this.canChiNam,
    required this.amDuong,
    required this.banMenh,
    required this.cuc,
    required this.cucName,
    required this.menhChi,
    required this.thanChi,
    required this.cung,
  });
}

/// Lập lá số từ ngày sinh dương lịch.
LaSoTuVi lapLaSoTuVi(SolarDate solar, int hourChi, GioiTinh gioiTinh) =>
    lapLaSoTuViAmLich(solarToLunar(solar), hourChi, gioiTinh);

/// Lập lá số từ ngày sinh âm lịch.
LaSoTuVi lapLaSoTuViAmLich(LunarDate lunar, int hourChi, GioiTinh gioiTinh) {
  final yCan = (lunar.year + 6) % 10;
  final yChi = (lunar.year + 8) % 12;
  final duong = yCan.isEven; // Giáp, Bính, Mậu, Canh, Nhâm là can dương
  final thuan = duong == (gioiTinh == GioiTinh.nam); // Dương Nam, Âm Nữ đi thuận
  final month = lunar.isLeap && lunar.day > 15 ? (lunar.month % 12) + 1 : lunar.month;
  final h = hourChi;

  final menh = (2 + month - 1 - h) % 12;
  final than = (2 + month - 1 + h) % 12;

  final canDan = ((yCan % 5) * 2 + 2) % 10;
  int canOf(int chi) => (canDan + (chi - 2) % 12) % 10;

  final cuc = _cucTheoHanh[napAmHanh(napAmIndex(canOf(menh), menh))];

  final stars = List.generate(12, (_) => <String>[]);
  void put(int chi, String name) => stars[chi % 12].add(name);

  final tuVi = anTuVi(cuc, lunar.day);
  final thienPhu = (4 - tuVi) % 12;
  const tuViOffsets = [0, -1, -3, -4, -5, -8];
  const thienPhuOffsets = [0, 1, 2, 3, 4, 5, 6, 10];
  for (var i = 0; i < tuViOffsets.length; i++) {
    put(tuVi + tuViOffsets[i], chinhTinhNames[i]);
  }
  for (var i = 0; i < thienPhuOffsets.length; i++) {
    put(thienPhu + thienPhuOffsets[i], chinhTinhNames[6 + i]);
  }

  final phu = List.generate(12, (_) => <String>[]);
  void putPhu(int chi, String name) => phu[chi % 12].add(name);
  final locTon = _locTon[yCan];
  final hoaStart = _hoaLinhStart[yChi % 4]![0];
  final linhStart = _hoaLinhStart[yChi % 4]![1];
  putPhu(10 - h, 'Văn Xương');
  putPhu(4 + h, 'Văn Khúc');
  putPhu(4 + month - 1, 'Tả Phù');
  putPhu(10 - (month - 1), 'Hữu Bật');
  putPhu(_khoiViet[yCan][0], 'Thiên Khôi');
  putPhu(_khoiViet[yCan][1], 'Thiên Việt');
  putPhu(locTon, 'Lộc Tồn');
  putPhu(locTon + 1, 'Kình Dương');
  putPhu(locTon - 1, 'Đà La');
  putPhu(thuan ? hoaStart + h : hoaStart - h, 'Hỏa Tinh');
  putPhu(thuan ? linhStart - h : linhStart + h, 'Linh Tinh');
  putPhu(11 - h, 'Địa Không');
  putPhu(11 + h, 'Địa Kiếp');
  putPhu(_thienMa[yChi % 4]!, 'Thiên Mã');
  putPhu(3 - yChi, 'Hồng Loan');
  putPhu(3 - yChi + 6, 'Thiên Hỷ');
  putPhu(yChi, 'Thái Tuế');

  final tuHoa = List.generate(12, (_) => <String>[]);
  final hoaStars = _tuHoaTheoCan[yCan];
  for (var i = 0; i < hoaStars.length; i++) {
    final star = hoaStars[i];
    var at = stars.indexWhere((s) => s.contains(star));
    if (at < 0) at = phu.indexWhere((s) => s.contains(star));
    if (at >= 0) tuHoa[at].add('${tuHoaNames[i]} ($star)');
  }

  final trangStart = _trangSinhStart[cuc]!;
  final cung = List.generate(12, (chi) {
    final fromMenh = (menh - chi) % 12;
    final step = thuan ? (chi - menh) % 12 : (menh - chi) % 12;
    return CungTuVi(
      chi: chi,
      canChi: '${thienCan[canOf(chi)]} ${diaChi[chi]}',
      cung: cungNames[fromMenh],
      isThan: chi == than,
      chinhTinh: stars[chi],
      phuTinh: phu[chi],
      tuHoa: tuHoa[chi],
      trangSinh: trangSinhNames[thuan ? (chi - trangStart) % 12 : (trangStart - chi) % 12],
      daiVan: cuc + step * 10,
    );
  });

  return LaSoTuVi(
    lunar: lunar,
    thangAnSao: month,
    hourChi: hourChi,
    gioiTinh: gioiTinh,
    canChiNam: '${thienCan[yCan]} ${diaChi[yChi]}',
    amDuong: '${duong ? 'Dương' : 'Âm'} ${gioiTinh == GioiTinh.nam ? 'Nam' : 'Nữ'}',
    banMenh: napAm(yCan, yChi),
    cuc: cuc,
    cucName: _cucNames[cuc]!,
    menhChi: menh,
    thanChi: than,
    cung: cung,
  );
}

/// Vị trí sao Tử Vi: tìm k nhỏ nhất để (ngày + k) chia hết cho cục, thương q.
/// Từ Dần đếm thuận q - 1 cung; k lẻ lùi lại k cung, k chẵn tiến thêm k cung.
int anTuVi(int cuc, int lunarDay) {
  final k = (cuc - lunarDay % cuc) % cuc;
  final q = (lunarDay + k) ~/ cuc;
  final base = 2 + q - 1;
  return (k.isOdd ? base - k : base + k) % 12;
}
