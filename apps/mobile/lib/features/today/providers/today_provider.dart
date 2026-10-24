// =============================================================================
// today_provider.dart: state của tính năng "Hôm nay".
// Provider ≈ một giá trị dùng chung toàn app (giống context/useMemo toàn cục).
// =============================================================================

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lich_core/lich_core.dart';

/// Ngày hôm nay theo giờ của điện thoại (người dùng ở Việt Nam -> giờ Việt Nam).
final todayProvider = Provider<SolarDate>((ref) => SolarDate.fromDateTime(DateTime.now()));

/// Thông tin đầy đủ của một ngày (âm lịch, can chi, hoàng đạo...). `.family` ≈ hàm nhận tham số.
final dayInfoProvider = Provider.family<DayInfo, SolarDate>((ref, date) => DayInfo.fromSolar(date));
