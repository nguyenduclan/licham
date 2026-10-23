// =============================================================================
// models.dart: kiểu dữ liệu ngày dương lịch và ngày âm lịch.
// -----------------------------------------------------------------------------
// Ghi chú cho dev JS/TS:
// - `final` ≈ `readonly`: gán một lần trong constructor rồi không đổi.
// - `const SolarDate(...)` ≈ object bất biến, Dart có thể tạo sẵn lúc compile.
// - Override `==` và `hashCode` để so sánh theo giá trị (giống so sánh
//   từng field), nhờ vậy `expect(a, b)` trong test chạy đúng.
// =============================================================================

/// Ngày dương lịch. Không dùng DateTime để tránh rắc rối múi giờ và giờ/phút.
class SolarDate {
  final int day;
  final int month;
  final int year;

  const SolarDate(this.day, this.month, this.year);

  /// Tạo từ DateTime của Flutter (chỉ lấy ngày/tháng/năm).
  factory SolarDate.fromDateTime(DateTime d) => SolarDate(d.day, d.month, d.year);

  /// Đổi sang DateTime (00:00 giờ máy) để hiển thị bằng intl/DateFormat.
  DateTime toDateTime() => DateTime(year, month, day);

  /// Dạng "YYYY-MM-DD".
  String toIso() =>
      '${year.toString().padLeft(4, '0')}-${month.toString().padLeft(2, '0')}-${day.toString().padLeft(2, '0')}';

  @override
  bool operator ==(Object other) =>
      other is SolarDate && other.day == day && other.month == month && other.year == year;

  @override
  int get hashCode => Object.hash(day, month, year);

  @override
  String toString() => 'SolarDate(${toIso()})';
}

/// Ngày âm lịch. [isLeap] = true nếu thuộc tháng nhuận.
class LunarDate {
  final int day;
  final int month;
  final int year;
  final bool isLeap;

  const LunarDate(this.day, this.month, this.year, {this.isLeap = false});

  @override
  bool operator ==(Object other) =>
      other is LunarDate &&
      other.day == day &&
      other.month == month &&
      other.year == year &&
      other.isLeap == isLeap;

  @override
  int get hashCode => Object.hash(day, month, year, isLeap);

  @override
  String toString() => 'LunarDate($day/$month${isLeap ? ' nhuận' : ''}/$year)';
}
