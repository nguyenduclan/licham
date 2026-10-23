// =============================================================================
// hoang_dao.dart: nạp âm (mệnh), thần trực ngày (hoàng/hắc đạo), tuổi xung.
// -----------------------------------------------------------------------------
// Logic giống hệt packages/lich-core/src/hoang-dao.ts và script sinh test.
// =============================================================================

import 'can_chi.dart';

/// Ngũ hành theo vòng tương sinh: hành a sinh (a+1)%5, khắc (a+2)%5.
const List<String> nguHanh = ['Kim', 'Thủy', 'Mộc', 'Hỏa', 'Thổ'];

/// 30 nạp âm theo thứ tự lục thập hoa giáp (mỗi nạp âm ứng 2 can chi liên tiếp).
const List<String> napAmNames = [
  'Hải Trung Kim', 'Lư Trung Hỏa', 'Đại Lâm Mộc', 'Lộ Bàng Thổ', 'Kiếm Phong Kim', //
  'Sơn Đầu Hỏa', 'Giản Hạ Thủy', 'Thành Đầu Thổ', 'Bạch Lạp Kim', 'Dương Liễu Mộc', //
  'Tuyền Trung Thủy', 'Ốc Thượng Thổ', 'Tích Lịch Hỏa', 'Tùng Bách Mộc', 'Trường Lưu Thủy', //
  'Sa Trung Kim', 'Sơn Hạ Hỏa', 'Bình Địa Mộc', 'Bích Thượng Thổ', 'Kim Bạch Kim', //
  'Phú Đăng Hỏa', 'Thiên Hà Thủy', 'Đại Dịch Thổ', 'Thoa Xuyến Kim', 'Tang Đố Mộc', //
  'Đại Khê Thủy', 'Sa Trung Thổ', 'Thiên Thượng Hỏa', 'Thạch Lựu Mộc', 'Đại Hải Thủy', //
];

/// 12 thần trực ngày, theo thứ tự bắt đầu từ Thanh Long.
const List<String> thanNgayNames = [
  'Thanh Long', 'Minh Đường', 'Thiên Hình', 'Chu Tước', 'Kim Quỹ', 'Kim Đường', //
  'Bạch Hổ', 'Ngọc Đường', 'Thiên Lao', 'Huyền Vũ', 'Tư Mệnh', 'Câu Trận', //
];

/// Chỉ số các thần hoàng đạo trong [thanNgayNames]; còn lại là hắc đạo.
const Set<int> _hoangDaoThan = {0, 1, 4, 5, 7, 10};

/// Chỉ số nạp âm (0..29) của cặp can [can] (0..9) và chi [chi] (0..11).
int napAmIndex(int can, int chi) => ((6 * can - 5 * chi) % 60) ~/ 2;

/// Tên nạp âm của can chi. Ví dụ Mậu Thìn (4, 4) -> "Đại Lâm Mộc".
String napAm(int can, int chi) => napAmNames[napAmIndex(can, chi)];

/// Chỉ số ngũ hành (theo [nguHanh]) của nạp âm thứ [index].
int napAmHanh(int index) => nguHanh.indexOf(napAmNames[index].split(' ').last);

/// Chỉ số nạp âm của ngày có số Julius [jd].
int napAmIndexOfDay(int jd) => napAmIndex((jd + 9) % 10, chiOfDay(jd));

/// Chỉ số thần trực ngày (0..11). Thanh Long khởi tại: tháng 1,7 -> Tý;
/// 2,8 -> Dần; 3,9 -> Thìn; 4,10 -> Ngọ; 5,11 -> Thân; 6,12 -> Tuất.
/// Tháng nhuận tính như tháng thường.
int thanNgayIndex(int jd, int lunarMonth) {
  final start = ((lunarMonth - 1) % 6) * 2;
  return (chiOfDay(jd) - start + 12) % 12;
}

/// Ngày hoàng đạo hay không.
bool isHoangDao(int jd, int lunarMonth) => _hoangDaoThan.contains(thanNgayIndex(jd, lunarMonth));

/// Hai ngũ hành có khắc nhau (theo bất kỳ chiều nào) không.
bool nguHanhKhac(int a, int b) => (a + 2) % 5 == b || (b + 2) % 5 == a;

/// Các tuổi xung với ngày: chi xung với chi ngày VÀ nạp âm khắc (hoặc bị khắc) nạp âm ngày.
/// Ví dụ ngày Mậu Thìn (Đại Lâm Mộc) -> ["Bính Tuất", "Canh Tuất"].
List<String> tuoiXung(int jd) {
  final dayHanh = napAmHanh(napAmIndexOfDay(jd));
  final xungChi = (chiOfDay(jd) + 6) % 12;
  return [
    for (var can = xungChi % 2; can < 10; can += 2)
      if (nguHanhKhac(dayHanh, napAmHanh(napAmIndex(can, xungChi)))) '${thienCan[can]} ${diaChi[xungChi]}',
  ];
}
