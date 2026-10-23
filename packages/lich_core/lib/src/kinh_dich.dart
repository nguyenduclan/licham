// =============================================================================
// kinh_dich.dart: bát quái, 64 quẻ Kinh Dịch, lập quẻ từ một dãy số (dùng cho sim).
// Logic giống hệt packages/lich-core/src/kinh-dich.ts.
//
// Quẻ đơn đánh số theo Tiên Thiên: 1 Càn, 2 Đoài, 3 Ly, 4 Chấn, 5 Tốn, 6 Khảm, 7 Cấn, 8 Khôn.
// Hào tính từ dưới lên. 1 = hào dương (liền), 0 = hào âm (đứt).
// =============================================================================

const List<String> batQuai = ['', 'Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn', 'Khôn'];
const List<String> tuongQuai = ['', 'Thiên', 'Trạch', 'Hỏa', 'Lôi', 'Phong', 'Thủy', 'Sơn', 'Địa'];
const List<List<int>> _hao = [
  [], [1, 1, 1], [1, 1, 0], [1, 0, 1], [1, 0, 0], [0, 1, 1], [0, 1, 0], [0, 0, 1], [0, 0, 0], //
];

enum QueRating { tot, binh, xau }

/// (số Văn Vương, thượng, hạ, tên ngắn, đánh giá) của 64 quẻ.
const List<(int, int, int, String, QueRating)> _que64 = [
  (1, 1, 1, 'Càn', QueRating.tot), (2, 8, 8, 'Khôn', QueRating.tot), (3, 6, 4, 'Truân', QueRating.xau),
  (4, 7, 6, 'Mông', QueRating.binh), (5, 6, 1, 'Nhu', QueRating.tot), (6, 1, 6, 'Tụng', QueRating.xau),
  (7, 8, 6, 'Sư', QueRating.tot), (8, 6, 8, 'Tỷ', QueRating.tot), (9, 5, 1, 'Tiểu Súc', QueRating.tot),
  (10, 1, 2, 'Lý', QueRating.tot), (11, 8, 1, 'Thái', QueRating.tot), (12, 1, 8, 'Bĩ', QueRating.xau),
  (13, 1, 3, 'Đồng Nhân', QueRating.tot), (14, 3, 1, 'Đại Hữu', QueRating.tot), (15, 8, 7, 'Khiêm', QueRating.tot),
  (16, 4, 8, 'Dự', QueRating.tot), (17, 2, 4, 'Tùy', QueRating.tot), (18, 7, 5, 'Cổ', QueRating.xau),
  (19, 8, 2, 'Lâm', QueRating.tot), (20, 5, 8, 'Quan', QueRating.binh), (21, 3, 4, 'Phệ Hạp', QueRating.binh),
  (22, 7, 3, 'Bí', QueRating.tot), (23, 7, 8, 'Bác', QueRating.xau), (24, 8, 4, 'Phục', QueRating.tot),
  (25, 1, 4, 'Vô Vọng', QueRating.binh), (26, 7, 1, 'Đại Súc', QueRating.tot), (27, 7, 4, 'Di', QueRating.binh),
  (28, 2, 5, 'Đại Quá', QueRating.xau), (29, 6, 6, 'Khảm', QueRating.xau), (30, 3, 3, 'Ly', QueRating.binh),
  (31, 2, 7, 'Hàm', QueRating.tot), (32, 4, 5, 'Hằng', QueRating.tot), (33, 1, 7, 'Độn', QueRating.binh),
  (34, 4, 1, 'Đại Tráng', QueRating.tot), (35, 3, 8, 'Tấn', QueRating.tot), (36, 8, 3, 'Minh Di', QueRating.xau),
  (37, 5, 3, 'Gia Nhân', QueRating.tot), (38, 3, 2, 'Khuê', QueRating.xau), (39, 6, 7, 'Kiển', QueRating.xau),
  (40, 4, 6, 'Giải', QueRating.tot), (41, 7, 2, 'Tổn', QueRating.binh), (42, 5, 4, 'Ích', QueRating.tot),
  (43, 2, 1, 'Quải', QueRating.binh), (44, 1, 5, 'Cấu', QueRating.xau), (45, 2, 8, 'Tụy', QueRating.tot),
  (46, 8, 5, 'Thăng', QueRating.tot), (47, 2, 6, 'Khốn', QueRating.xau), (48, 6, 5, 'Tỉnh', QueRating.tot),
  (49, 2, 3, 'Cách', QueRating.tot), (50, 3, 5, 'Đỉnh', QueRating.tot), (51, 4, 4, 'Chấn', QueRating.binh),
  (52, 7, 7, 'Cấn', QueRating.binh), (53, 5, 7, 'Tiệm', QueRating.tot), (54, 4, 2, 'Quy Muội', QueRating.xau),
  (55, 4, 3, 'Phong', QueRating.tot), (56, 3, 7, 'Lữ', QueRating.xau), (57, 5, 5, 'Tốn', QueRating.binh),
  (58, 2, 2, 'Đoài', QueRating.tot), (59, 5, 6, 'Hoán', QueRating.tot), (60, 6, 2, 'Tiết', QueRating.tot),
  (61, 5, 2, 'Trung Phu', QueRating.tot), (62, 4, 7, 'Tiểu Quá', QueRating.xau), (63, 6, 3, 'Ký Tế', QueRating.tot),
  (64, 3, 6, 'Vị Tế', QueRating.binh),
];

class Que {
  /// Số thứ tự 1..64 theo Văn Vương.
  final int so;
  final int thuong;
  final int ha;
  final String ten;
  final QueRating rating;
  const Que(this.so, this.thuong, this.ha, this.ten, this.rating);
}

/// Tra quẻ kép theo quẻ thượng và quẻ hạ (1..8).
Que queTheoQuai(int thuong, int ha) {
  final row = _que64.firstWhere((q) => q.$2 == thuong && q.$3 == ha);
  final ten = thuong == ha ? 'Thuần ${row.$4}' : '${tuongQuai[thuong]} ${tuongQuai[ha]} ${row.$4}';
  return Que(row.$1, thuong, ha, ten, row.$5);
}

int _quaiTheoHao(List<int> hao) {
  for (var i = 1; i < _hao.length; i++) {
    if (_hao[i][0] == hao[0] && _hao[i][1] == hao[1] && _hao[i][2] == hao[2]) return i;
  }
  throw StateError('Không có quẻ đơn này');
}

/// Quẻ biến: đảo hào động (1..6, đếm từ dưới lên).
Que queBien(Que que, int haoDong) {
  final hao = [..._hao[que.ha], ..._hao[que.thuong]];
  hao[haoDong - 1] = 1 - hao[haoDong - 1];
  return queTheoQuai(_quaiTheoHao(hao.sublist(3)), _quaiTheoHao(hao.sublist(0, 3)));
}

class QueSo {
  final Que chu;
  final Que bien;
  final int haoDong;
  const QueSo(this.chu, this.bien, this.haoDong);
}

/// Lập quẻ từ dãy chữ số: tổng nửa đầu % 8 -> thượng, tổng nửa sau % 8 -> hạ (dư 0 = 8 Khôn),
/// tổng cả dãy % 6 -> hào động (dư 0 = 6). Dãy lẻ: nửa đầu ít hơn 1 số.
QueSo lapQueTuDaySo(String digits) {
  final nums = digits.split('').map(int.parse).toList();
  final mid = nums.length ~/ 2;
  int sum(List<int> a) => a.fold(0, (s, n) => s + n);
  final t = sum(nums.sublist(0, mid)) % 8;
  final h = sum(nums.sublist(mid)) % 8;
  final d = sum(nums) % 6;
  final chu = queTheoQuai(t == 0 ? 8 : t, h == 0 ? 8 : h);
  final haoDong = d == 0 ? 6 : d;
  return QueSo(chu, queBien(chu, haoDong), haoDong);
}
