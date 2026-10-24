// =============================================================================
// gio_hoang_dao_grid.dart: lưới 6 giờ hoàng đạo, mỗi ô "Tên giờ" + "(khung giờ)".
// =============================================================================

import 'package:flutter/material.dart';
import 'package:lich_core/lich_core.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_theme.dart';
import '../../../l10n/app_localizations.dart';

class GioHoangDaoGrid extends StatelessWidget {
  /// Chỉ số chi (0 = Tý ...) của các giờ hoàng đạo.
  final List<int> chiList;

  const GioHoangDaoGrid({super.key, required this.chiList});

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    final colors = context.lichColors;
    return GridView.count(
      crossAxisCount: 3,
      shrinkWrap: true, // nằm trong ListView nên không tự cuộn
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: AppSpacing.sm,
      crossAxisSpacing: AppSpacing.sm,
      childAspectRatio: 1.9,
      children: [
        for (final chi in chiList)
          Container(
            decoration: BoxDecoration(color: colors.primarySoft, borderRadius: BorderRadius.circular(AppSpacing.radiusSmall)),
            alignment: Alignment.center,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(diaChi[chi], style: const TextStyle(fontWeight: FontWeight.bold)),
                Text(
                  '(${t.hourRange(chiHourStart(chi), (chiHourStart(chi) + 2) % 24)})',
                  style: TextStyle(fontSize: AppFontSize.small, color: colors.muted),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
