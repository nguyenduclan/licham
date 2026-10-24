// =============================================================================
// day_cell.dart: một ô trong lịch tháng: ngày dương + chấm hoàng/hắc đạo + ngày âm.
// Giống apps/web/src/components/calendar/day-cell.tsx (bản điện thoại gọn hơn).
// =============================================================================

import 'package:flutter/material.dart';
import 'package:lich_core/lich_core.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_theme.dart';
import '../../../data/holiday_repository.dart';

class DayCell extends StatelessWidget {
  final DayInfo info;
  final List<Holiday> holidays;
  final bool inMonth;
  final bool isSunday;
  final bool isToday;
  final bool isSelected;
  final VoidCallback onTap;

  const DayCell({
    super.key,
    required this.info,
    required this.holidays,
    required this.inMonth,
    required this.isSunday,
    required this.isToday,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final colors = context.lichColors;
    final primary = Theme.of(context).colorScheme.primary;
    final lunar = info.lunar;
    final redSolar = inMonth && (isSunday || holidays.isNotEmpty);
    final redLunar = inMonth && (lunar.day == 1 || lunar.day == 15 || holidays.any((h) => h.isLunar));
    final lunarLabel = lunar.day == 1 ? '${lunar.day}/${lunar.month}${lunar.isLeap ? 'N' : ''}' : '${lunar.day}';

    return Opacity(
      opacity: inMonth ? 1 : 0.4,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppSpacing.radiusSmall),
        child: Container(
          decoration: BoxDecoration(
            color: isToday ? colors.today : null,
            border: isSelected ? Border.all(color: primary, width: 2) : null,
            borderRadius: BorderRadius.circular(AppSpacing.radiusSmall),
          ),
          padding: const EdgeInsets.all(AppSpacing.xs),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(children: [
                Text('${info.solar.day}',
                    style: TextStyle(fontSize: 17, fontWeight: FontWeight.w600, color: redSolar ? primary : null)),
                const SizedBox(width: 3),
                CircleAvatar(radius: 3, backgroundColor: info.isHoangDao ? primary : colors.dotHacDao),
              ]),
              const Spacer(),
              Text(
                lunarLabel,
                textAlign: TextAlign.right,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: redLunar ? FontWeight.w600 : FontWeight.normal,
                  color: redLunar ? primary : colors.muted,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
