// =============================================================================
// today_screen.dart: màn "Hôm nay" (≈ một page trong Next.js).
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_theme.dart';
import '../../../l10n/app_localizations.dart';
import '../providers/today_provider.dart';
import '../widgets/day_detail_card.dart';

class TodayScreen extends ConsumerWidget {
  const TodayScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final today = ref.watch(todayProvider);
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          children: [
            DayDetailCard(date: today),
            const SizedBox(height: AppSpacing.md),
            Text(
              AppLocalizations.of(context).referenceNote,
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: AppFontSize.small, color: context.lichColors.muted),
            ),
          ],
        ),
      ),
    );
  }
}
