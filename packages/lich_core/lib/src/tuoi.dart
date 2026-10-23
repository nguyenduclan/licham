// =============================================================================
// tuoi.dart: quan hệ giữa các địa chi và đánh giá ngày hợp/xung với tuổi.
// -----------------------------------------------------------------------------
// Logic giống hệt packages/lich-core/src/tuoi.ts và script sinh test.
// Kết quả trả về dạng mã (enum) để giao diện tự dịch ra câu chữ (l10n).
// =============================================================================

import 'can_chi.dart';
import 'hoang_dao.dart';
import 'julian_day.dart';
import 'lunar_calendar.dart';
import 'models.dart';

/// Tam hợp: Thân Tý Thìn, Dần Ngọ Tuất, Hợi Mão Mùi, Tỵ Dậu Sửu.
bool isTamHop(int a, int b) => a != b && a % 4 == b % 4;

/// Lục hợp: Tý-Sửu, Dần-Hợi, Mão-Tuất, Thìn-Dậu, Tỵ-Thân, Ngọ-Mùi.
bool isLucHop(int a, int b) => (a + b) % 12 == 1;

/// Lục xung: hai chi đối nhau (cách 6).
bool isLucXung(int a, int b) => (a - b + 12) % 12 == 6;

/// Lục hại: Tý-Mùi, Sửu-Ngọ, Dần-Tỵ, Mão-Thìn, Thân-Hợi, Dậu-Tuất.
bool isTuongHai(int a, int b) => (a + b) % 12 == 7;

int _pairKey(int a, int b) => a < b ? a * 12 + b : b * 12 + a;

/// Tương hình: Dần-Tỵ-Thân, Sửu-Tuất-Mùi, Tý-Mão, tự hình Thìn/Ngọ/Dậu/Hợi.
final Set<int> _hinh = {
  for (final p in const [[2, 5], [5, 8], [2, 8], [1, 10], [7, 10], [1, 7], [0, 3], [4, 4], [6, 6], [9, 9], [11, 11]])
    _pairKey(p[0], p[1]),
};

/// Tương phá: Tý-Dậu, Sửu-Thìn, Dần-Hợi, Mão-Ngọ, Tỵ-Thân, Mùi-Tuất.
final Set<int> _pha = {
  for (final p in const [[0, 9], [1, 4], [2, 11], [3, 6], [5, 8], [7, 10]]) _pairKey(p[0], p[1]),
};

bool isTuongHinh(int a, int b) => _hinh.contains(_pairKey(a, b));
bool isTuongPha(int a, int b) => _pha.contains(_pairKey(a, b));

/// Các chi phạm Tam Sát của ngày có chi [dayChi]. Chỉ ngày Sửu, Thìn, Mùi, Tuất mới có;
/// tuổi kỵ là nhóm tam hợp kế tiếp (ví dụ ngày Thìn kỵ tuổi Tỵ, Dậu, Sửu).
List<int> tamSat(int dayChi) {
  if (dayChi % 3 != 1) return const [];
  final start = (dayChi + 1) % 12;
  return [start, (start + 4) % 12, (start + 8) % 12];
}

/// Các yếu tố ảnh hưởng khi xét ngày với tuổi. Điểm của từng yếu tố xem [tuoiFactorScore].
enum TuoiFactor {
  hoangDao, hacDao, tamHop, lucHop, tuoiXung, lucXung, tuongHinh, tuongHai, tuongPha, tamSat, //
  ngaySinhMenh, dongHanh, ngayKhacMenh, menhKhacNgay, //
}

const Map<TuoiFactor, int> tuoiFactorScore = {
  TuoiFactor.hoangDao: 1, TuoiFactor.hacDao: -1, TuoiFactor.tamHop: 2, TuoiFactor.lucHop: 2, //
  TuoiFactor.tuoiXung: -3, TuoiFactor.lucXung: -2, TuoiFactor.tuongHinh: -1, TuoiFactor.tuongHai: -1, //
  TuoiFactor.tuongPha: -1, TuoiFactor.tamSat: -2, TuoiFactor.ngaySinhMenh: 2, TuoiFactor.dongHanh: 1, //
  TuoiFactor.ngayKhacMenh: -2, TuoiFactor.menhKhacNgay: -1, //
};

enum TuoiVerdict { tot, binhThuong, xau }

/// Kết quả đánh giá một ngày với một người.
class DanhGiaTuoi {
  /// Năm âm lịch sinh (người sinh trước Tết thuộc năm âm trước).
  final int birthLunarYear;
  final int birthCan;
  final int birthChi;
  final List<TuoiFactor> factors;

  const DanhGiaTuoi(this.birthLunarYear, this.birthCan, this.birthChi, this.factors);

  String get canChiTuoi => '${thienCan[birthCan]} ${diaChi[birthChi]}';
  String get menh => napAm(birthCan, birthChi);
  int get score => factors.fold(0, (sum, f) => sum + tuoiFactorScore[f]!);
  TuoiVerdict get verdict => score >= 2 ? TuoiVerdict.tot : (score <= -2 ? TuoiVerdict.xau : TuoiVerdict.binhThuong);
}

/// Đánh giá ngày [day] với người sinh ngày [birth] (dương lịch).
DanhGiaTuoi danhGiaTuoi(SolarDate birth, SolarDate day, {double timeZone = vietnamTimeZone}) =>
    danhGiaTuoiTheoNam(solarToLunar(birth, timeZone: timeZone).year, day, timeZone: timeZone);

/// Đánh giá ngày [day] chỉ dựa trên năm sinh âm lịch [y]. Dùng hàm này khi không muốn
/// truyền ngày sinh đầy đủ (ví dụ trên URL web, để tránh lộ dữ liệu cá nhân).
DanhGiaTuoi danhGiaTuoiTheoNam(int y, SolarDate day, {double timeZone = vietnamTimeZone}) {
  final can = (y + 6) % 10;
  final chi = (y + 8) % 12;
  final jd = jdFromDate(day.day, day.month, day.year);
  final lunar = solarToLunar(day, timeZone: timeZone);
  final dayChi = chiOfDay(jd);
  final menhHanh = napAmHanh(napAmIndex(can, chi));
  final ngayHanh = napAmHanh(napAmIndexOfDay(jd));
  final xung = tuoiXung(jd).contains('${thienCan[can]} ${diaChi[chi]}');

  return DanhGiaTuoi(y, can, chi, [
    isHoangDao(jd, lunar.month) ? TuoiFactor.hoangDao : TuoiFactor.hacDao,
    if (isTamHop(chi, dayChi)) TuoiFactor.tamHop,
    if (isLucHop(chi, dayChi)) TuoiFactor.lucHop,
    if (xung) TuoiFactor.tuoiXung else if (isLucXung(chi, dayChi)) TuoiFactor.lucXung,
    if (isTuongHinh(chi, dayChi)) TuoiFactor.tuongHinh,
    if (isTuongHai(chi, dayChi)) TuoiFactor.tuongHai,
    if (isTuongPha(chi, dayChi)) TuoiFactor.tuongPha,
    if (tamSat(dayChi).contains(chi)) TuoiFactor.tamSat,
    if ((ngayHanh + 1) % 5 == menhHanh)
      TuoiFactor.ngaySinhMenh
    else if (ngayHanh == menhHanh)
      TuoiFactor.dongHanh
    else if ((ngayHanh + 2) % 5 == menhHanh)
      TuoiFactor.ngayKhacMenh
    else if ((menhHanh + 2) % 5 == ngayHanh)
      TuoiFactor.menhKhacNgay,
  ]);
}
