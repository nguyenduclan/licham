// =============================================================================
// month_grid.dart: lưới lịch tháng, luôn bắt đầu từ Thứ Hai; ngày tháng trước/sau hiện mờ.
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lich_core/lich_core.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/holiday_repository.dart';
import '../../../l10n/app_localizations.dart';
import '../../today/providers/today_provider.dart';
import '../providers/calendar_provider.dart';
import 'day_cell.dart';

/// Số ngày của tháng dương lịch.
int daysInMonth(int month, int year) =>
    (month == 12 ? jdFromDate(1, 1, year + 1) : jdFromDate(1, month + 1, year)) - jdFromDate(1, month, year);

class MonthGrid extends ConsumerWidget {
  const MonthGrid({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(calendarProvider);
    final today = ref.watch(todayProvider);
    final holidaysRepo = ref.watch(holidayRepositoryProvider).value;
    final primary = Theme.of(context).colorScheme.primary;
    final weekdays = AppLocalizations.of(context).weekdaysShort.split('|');

    final firstJd = jdFromDate(1, state.viewMonth, state.viewYear);
    final startJd = firstJd - firstJd % 7; // lùi về Thứ Hai (jd % 7 == 0 là Thứ Hai)
    final total = ((firstJd - startJd + daysInMonth(state.viewMonth, state.viewYear)) / 7).ceil() * 7;

    return Column(
      children: [
        Row(children: [
          for (var i = 0; i < 7; i++)
            Expanded(
              child: Text(weekdays[i],
                  textAlign: TextAlign.center,
                  style: TextStyle(fontWeight: FontWeight.w600, color: i == 6 ? primary : context.lichColors.muted)),
            ),
        ]),
        const SizedBox(height: AppSpacing.xs),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: total,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 7, childAspectRatio: 0.85),
          itemBuilder: (context, i) {
            final info = ref.watch(dayInfoProvider(jdToDate(startJd + i)));
            return DayCell(
              info: info,
              holidays: holidaysRepo?.holidaysOf(info.solar, info.lunar, info.jd) ?? const [],
              inMonth: info.solar.month == state.viewMonth,
              isSunday: i % 7 == 6,
              isToday: info.solar == today,
              isSelected: info.solar == state.selected,
              onTap: () => ref.read(calendarProvider.notifier).select(info.solar),
            );
          },
        ),
      ],
    );
  }
}
