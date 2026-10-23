// =============================================================================
// xuat_hanh.dart: Khổng Minh Lục Diệu, giờ xuất hành Lý Thuần Phong,
// hướng xuất hành (Hỷ thần, Tài thần, Hạc thần).
// -----------------------------------------------------------------------------
// Logic giống hệt packages/lich-core/src/xuat-hanh.ts và script sinh test.
// Các trang lịch không thống nhất với nhau; công thức ở đây được đối chiếu
// khớp với xemlicham.com trên 8 ngày mẫu (xem shared/tools/generate-test-cases.ps1).
// =============================================================================

/// 6 sao Lục Diệu. Tốt: Đại An, Tốc Hỷ, Tiểu Cát.
const List<String> lucDieuNames = ['Đại An', 'Lưu Liên', 'Tốc Hỷ', 'Xích Khẩu', 'Tiểu Cát', 'Không Vong'];

/// 6 trạng thái giờ Lý Thuần Phong (cùng thứ tự vòng với Lục Diệu). Tốt: Đại An, Tốc Hỷ, Tiểu Cát.
const List<String> lyThuanPhongNames = ['Đại An', 'Lưu Niên', 'Tốc Hỷ', 'Xích Khẩu', 'Tiểu Cát', 'Tuyệt Lộ'];

/// Sao/giờ có chỉ số [index] (theo 2 danh sách trên) là tốt hay xấu.
bool isLucDieuTot(int index) => index.isEven;

/// Chỉ số Lục Diệu của ngày âm [lunarDay] tháng [lunarMonth] (tháng nhuận tính như tháng thường).
int lucDieuIndex(int lunarMonth, int lunarDay) => (lunarMonth + lunarDay - 1) % 6;

/// Giờ xuất hành Lý Thuần Phong: 6 phần tử cho 6 cặp giờ
/// [Tý-Ngọ, Sửu-Mùi, Dần-Thân, Mão-Dậu, Thìn-Tuất, Tỵ-Hợi], giá trị là chỉ số trong [lyThuanPhongNames].
List<int> gioLyThuanPhong(int lunarMonth, int lunarDay) {
  final start = lucDieuIndex(lunarMonth, lunarDay);
  return [for (var k = 0; k < 6; k++) (start + k) % 6];
}

/// Hỷ thần theo can ngày (Giáp Kỷ: Đông Bắc; Ất Canh: Tây Bắc; Bính Tân: Tây Nam;
/// Đinh Nhâm: Chính Nam; Mậu Quý: Đông Nam).
const List<String> _hyThan = [
  'Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Chính Nam', 'Đông Nam', //
  'Đông Bắc', 'Tây Bắc', 'Tây Nam', 'Chính Nam', 'Đông Nam', //
];

/// Tài thần theo can ngày. Lưu ý: ngày Mậu có trang ghi Chính Bắc; ở đây theo xemlicham (Chính Nam).
const List<String> _taiThan = [
  'Đông Nam', 'Đông Nam', 'Chính Đông', 'Chính Đông', 'Chính Nam', //
  'Chính Nam', 'Tây Nam', 'Tây Nam', 'Chính Tây', 'Tây Bắc', //
];

/// Hướng Hỷ thần (đón niềm vui) của ngày [jd].
String hyThan(int jd) => _hyThan[(jd + 9) % 10];

/// Hướng Tài thần (đón tài lộc) của ngày [jd].
String taiThan(int jd) => _taiThan[(jd + 9) % 10];

/// Hạc thần (hung thần, nên tránh) đi vòng 8 hướng trong 44 ngày, bắt đầu ngày Kỷ Dậu
/// ở Đông Bắc, rồi "lên trời" 16 ngày (Quý Tỵ đến Mậu Thân).
const List<String> _hacThanHuong = [
  'Đông Bắc', 'Chính Đông', 'Đông Nam', 'Chính Nam', 'Tây Nam', 'Chính Tây', 'Tây Bắc', 'Chính Bắc', //
];
const List<int> _hacThanSoNgay = [6, 5, 6, 5, 6, 5, 6, 5];
const int _kyDauIndex = 45; // chỉ số Kỷ Dậu trong lục thập hoa giáp

/// Hướng Hạc thần của ngày [jd], hoặc `null` nếu Hạc thần đang "lên trời" (không cần tránh hướng nào).
String? hacThan(int jd) {
  var offset = ((jd + 49) % 60 - _kyDauIndex + 60) % 60;
  for (var i = 0; i < 8; i++) {
    if (offset < _hacThanSoNgay[i]) return _hacThanHuong[i];
    offset -= _hacThanSoNgay[i];
  }
  return null;
}
