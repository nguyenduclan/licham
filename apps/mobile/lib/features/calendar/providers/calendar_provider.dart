// =============================================================================
// calendar_provider.dart: state của màn Lịch tháng: tháng đang xem + ngày đang chọn.
// Notifier ≈ một reducer/store nhỏ: state là dữ liệu, các hàm là "action".
// =============================================================================

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lich_core/lich_core.dart';

import '../../today/providers/today_provider.dart';

class CalendarState {
  final SolarDate selected;
  final int viewMonth;
  final int viewYear;
  const CalendarState({required this.selected, required this.viewMonth, required this.viewYear});
}

class CalendarNotifier extends Notifier<CalendarState> {
  /// Giá trị ban đầu: chọn hôm nay, xem tháng hiện tại (≈ useState(initial)).
  @override
  CalendarState build() {
    final today = ref.watch(todayProvider);
    return CalendarState(selected: today, viewMonth: today.month, viewYear: today.year);
  }

  /// Chọn một ngày; nếu là ngày của tháng trước/sau thì chuyển luôn sang tháng đó.
  void select(SolarDate date) => state = CalendarState(selected: date, viewMonth: date.month, viewYear: date.year);

  void goToday() => select(ref.read(todayProvider));

  /// Lùi (-1) hoặc tiến (+1) một tháng.
  void shiftMonth(int delta) {
    final index = state.viewYear * 12 + (state.viewMonth - 1) + delta;
    state = CalendarState(selected: state.selected, viewMonth: index % 12 + 1, viewYear: index ~/ 12);
  }
}

final calendarProvider = NotifierProvider<CalendarNotifier, CalendarState>(CalendarNotifier.new);
