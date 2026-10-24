// =============================================================================
// home_shell.dart: khung chung có thanh điều hướng dưới (≈ layout.tsx bọc các tab).
// StatelessWidget ≈ component React không có useState (chỉ nhận props và vẽ).
// =============================================================================

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../l10n/app_localizations.dart';

class HomeShell extends StatelessWidget {
  final StatefulNavigationShell shell;

  const HomeShell({super.key, required this.shell});

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context);
    return Scaffold(
      body: shell, // nội dung của tab đang chọn
      bottomNavigationBar: NavigationBar(
        selectedIndex: shell.currentIndex,
        onDestinationSelected: (i) => shell.goBranch(i, initialLocation: i == shell.currentIndex),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.today_outlined), selectedIcon: const Icon(Icons.today), label: t.navToday),
          NavigationDestination(
            icon: const Icon(Icons.calendar_month_outlined),
            selectedIcon: const Icon(Icons.calendar_month),
            label: t.navCalendar,
          ),
        ],
      ),
    );
  }
}
