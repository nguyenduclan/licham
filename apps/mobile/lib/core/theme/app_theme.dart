// =============================================================================
// app_theme.dart: ThemeData sáng/tối cho cả app (≈ cấu hình theme của Tailwind).
// Widget lấy màu qua Theme.of(context).colorScheme hoặc context.lichColors (extension bên dưới).
// =============================================================================

import 'package:flutter/material.dart';

import 'app_colors.dart';
import 'app_spacing.dart';

/// Màu riêng của app (không có sẵn trong ColorScheme của Material), có cả bản sáng/tối.
/// ThemeExtension ≈ thêm biến CSS tự định nghĩa vào theme.
class LichColors extends ThemeExtension<LichColors> {
  final Color today;
  final Color dotHacDao;
  final Color muted;
  final Color line;
  final Color primarySoft;
  final Color accent;

  const LichColors({
    required this.today,
    required this.dotHacDao,
    required this.muted,
    required this.line,
    required this.primarySoft,
    required this.accent,
  });

  @override
  LichColors copyWith() => this;

  @override
  LichColors lerp(LichColors? other, double t) => other ?? this;
}

extension LichColorsX on BuildContext {
  /// Cách dùng: context.lichColors.today
  LichColors get lichColors => Theme.of(this).extension<LichColors>()!;
}

ThemeData _build({required bool dark}) {
  final scheme = ColorScheme.fromSeed(
    seedColor: AppColors.brand,
    brightness: dark ? Brightness.dark : Brightness.light,
  ).copyWith(
    primary: dark ? AppColors.primaryDark : AppColors.primary,
    surface: dark ? AppColors.surfaceDark : AppColors.surface,
    onSurface: dark ? AppColors.textDark : AppColors.text,
  );
  return ThemeData(
    colorScheme: scheme,
    scaffoldBackgroundColor: dark ? AppColors.backgroundDark : AppColors.background,
    cardTheme: CardThemeData(
      elevation: 0,
      color: scheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppSpacing.radius),
        side: BorderSide(color: dark ? AppColors.lineDark : AppColors.line),
      ),
    ),
    // Cử chỉ "quay lại" kiểu mới của Android (predictive back): xem trước màn hình phía sau khi vuốt
    pageTransitionsTheme: const PageTransitionsTheme(
      builders: {TargetPlatform.android: PredictiveBackPageTransitionsBuilder()},
    ),
    extensions: [
      LichColors(
        today: dark ? AppColors.todayDark : AppColors.today,
        dotHacDao: dark ? AppColors.dotHacDaoDark : AppColors.dotHacDao,
        muted: dark ? AppColors.mutedDark : AppColors.muted,
        line: dark ? AppColors.lineDark : AppColors.line,
        primarySoft: dark ? AppColors.primarySoftDark : AppColors.primarySoft,
        accent: AppColors.accent,
      ),
    ],
  );
}

final ThemeData lightTheme = _build(dark: false);
final ThemeData darkTheme = _build(dark: true);
