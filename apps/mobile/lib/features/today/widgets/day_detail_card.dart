// =============================================================================
// day_detail_card.dart: thẻ chi tiết một ngày (dùng ở màn Hôm nay và màn Lịch tháng).
// ConsumerWidget ≈ component React có dùng hook đọc store (ref.watch ≈ useSelector).
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lich_core/lich_core.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/holiday_repository.dart';
import '../../../l10n/app_localizations.dart';
import '../providers/today_provider.dart';
import 'gio_hoang_dao_grid.dart';

class DayDetailCard extends ConsumerWidget {
  final SolarDate date;

  const DayDetailCard({super.key, required this.date});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final t = AppLocalizations.of(context);
    final colors = context.lichColors;
    final primary = Theme.of(context).colorScheme.primary;
    final info = ref.watch(dayInfoProvider(date));
    final holidays = ref.watch(holidayRepositoryProvider).value?.holidaysOf(date, info.lunar, info.jd) ?? const [];
    final weekday = t.weekdays.split('|')[info.jd % 7];

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Text('$weekday · ${t.monthLabel} ${date.month}/${date.year}',
                textAlign: TextAlign.center, style: TextStyle(color: colors.muted)),
            Text('${date.day}',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: AppFontSize.bigDay, fontWeight: FontWeight.bold, color: primary, height: 1.1)),
            Text(
              t.lunarDate(info.lunar.day, info.lunar.month, info.lunar.isLeap ? t.leapSuffix : '', info.canChiYear),
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: AppFontSize.title),
            ),
            if (holidays.isNotEmpty) ...[
              const SizedBox(height: AppSpacing.md),
              Wrap(
                alignment: WrapAlignment.center,
                spacing: AppSpacing.sm,
                runSpacing: AppSpacing.sm,
                children: [for (final h in holidays) Chip(label: Text(h.name), backgroundColor: colors.primarySoft)],
              ),
            ],
            const SizedBox(height: AppSpacing.lg),
            Row(children: [
              _CanChiBox(label: t.dayLabel, value: info.canChiDay),
              _CanChiBox(label: t.monthLabel, value: info.canChiMonth),
              _CanChiBox(label: t.yearLabel, value: info.canChiYear),
            ]),
            const SizedBox(height: AppSpacing.lg),
            _InfoLine(label: t.napAm, value: '${info.napAm} – ${info.isHoangDao ? t.hoangDao : t.hacDao} (${info.thanNgay})',
                dotColor: info.isHoangDao ? primary : colors.dotHacDao),
            _InfoLine(label: t.tuoiXung, value: info.tuoiXung.join(', ')),
            _InfoLine(label: t.tietKhi, value: info.tietKhi),
            const SizedBox(height: AppSpacing.lg),
            Text(t.gioHoangDao, style: TextStyle(fontWeight: FontWeight.w600, color: colors.muted)),
            const SizedBox(height: AppSpacing.sm),
            GioHoangDaoGrid(chiList: info.gioHoangDao),
          ],
        ),
      ),
    );
  }
}

class _CanChiBox extends StatelessWidget {
  final String label;
  final String value;
  const _CanChiBox({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: AppSpacing.xs),
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.sm),
        decoration: BoxDecoration(color: Theme.of(context).scaffoldBackgroundColor, borderRadius: BorderRadius.circular(AppSpacing.radiusSmall)),
        child: Column(children: [
          Text(label, style: TextStyle(fontSize: AppFontSize.small, color: context.lichColors.muted)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600)),
        ]),
      ),
    );
  }
}

class _InfoLine extends StatelessWidget {
  final String label;
  final String value;
  final Color? dotColor;
  const _InfoLine({required this.label, required this.value, this.dotColor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacing.xs),
      child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        if (dotColor != null)
          Padding(
            padding: const EdgeInsets.only(top: 6, right: 6),
            child: CircleAvatar(radius: 4, backgroundColor: dotColor),
          ),
        Expanded(
          child: Text.rich(TextSpan(children: [
            TextSpan(text: '$label: ', style: TextStyle(color: context.lichColors.muted)),
            TextSpan(text: value, style: const TextStyle(fontWeight: FontWeight.w600)),
          ])),
        ),
      ]),
    );
  }
}
