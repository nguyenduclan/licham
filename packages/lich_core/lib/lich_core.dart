// =============================================================================
// lich_core.dart: điểm vào duy nhất của package (≈ index.ts).
// -----------------------------------------------------------------------------
// App Flutter chỉ cần: `import 'package:lich_core/lich_core.dart';`
// Code trong lib/src/ là "private" theo quy ước Dart, chỉ lộ ra qua file này.
// =============================================================================

library;

export 'src/can_chi.dart';
export 'src/day_info.dart';
export 'src/hoang_dao.dart';
export 'src/julian_day.dart' show jdFromDate, jdToDate;
export 'src/lunar_calendar.dart';
export 'src/models.dart';
export 'src/tuoi.dart';
export 'src/xem_ngay.dart';
export 'src/xuat_hanh.dart';
