// =============================================================================
// calendar_screen.dart: màn "Lịch tháng": thanh chọn tháng + lưới tháng + chi tiết ngày đang chọn.
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_theme.dart';
import '../../../l10n/app_localizations.dart';
import '../../today/widgets/day_detail_card.dart';
import '../providers/calendar_provider.dart';
import '../widgets/month_grid.dart';

class CalendarScreen extends ConsumerWidget {
  const CalendarScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final t = AppLocalizations.of(context);
    final state = ref.watch(calendarProvider);
    final notifier = ref.read(calendarProvider.notifier); // read: chỉ gọi hàm, không cần vẽ lại khi đổi

    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          children: [
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppSpacing.md),
                child: Column(children: [
                  Row(children: [
                    IconButton(
                      tooltip: t.previousMonth,
                      onPressed: () => notifier.shiftMonth(-1),
                      icon: const Icon(Icons.chevron_left),
                    ),
                    Expanded(
                      child: Column(children: [
                        Text(t.monthTitle(state.viewMonth, state.viewYear),
                            style: const TextStyle(fontSize: AppFontSize.title, fontWeight: FontWeight.w600)),
                        TextButton(onPressed: notifier.goToday, child: Text(t.today)),
                      ]),
                    ),
                    IconButton(tooltip: t.nextMonth, onPressed: () => notifier.shiftMonth(1), icon: const Icon(Icons.chevron_right)),
                  ]),
                  const MonthGrid(),
                  const SizedBox(height: AppSpacing.sm),
                  _Legend(hoangDao: t.legendHoangDao, hacDao: t.legendHacDao),
                ]),
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            DayDetailCard(date: state.selected),
          ],
        ),
      ),
    );
  }
}

class _Legend extends StatelessWidget {
  final String hoangDao;
  final String hacDao;
  const _Legend({required this.hoangDao, required this.hacDao});

  @override
  Widget build(BuildContext context) {
    final style = TextStyle(fontSize: AppFontSize.small, color: context.lichColors.muted);
    return Row(mainAxisAlignment: MainAxisAlignment.center, children: [
      CircleAvatar(radius: 4, backgroundColor: Theme.of(context).colorScheme.primary),
      const SizedBox(width: 6),
      Text(hoangDao, style: style),
      const SizedBox(width: AppSpacing.lg),
      CircleAvatar(radius: 4, backgroundColor: context.lichColors.dotHacDao),
      const SizedBox(width: 6),
      Text(hacDao, style: style),
    ]);
  }
}
