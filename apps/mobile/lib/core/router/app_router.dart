// =============================================================================
// app_router.dart: khai báo các màn hình và đường dẫn (≈ thư mục app/ của Next.js).
// StatefulShellRoute giữ thanh điều hướng dưới cố định, mỗi tab nhớ trạng thái riêng
// (≈ một layout.tsx dùng chung + các page con).
// Thêm màn hình mới: thêm một StatefulShellBranch (nếu là tab) hoặc GoRoute.
// =============================================================================

import 'package:go_router/go_router.dart';

import '../../features/calendar/screens/calendar_screen.dart';
import '../../features/today/screens/today_screen.dart';
import '../widgets/home_shell.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    StatefulShellRoute.indexedStack(
      builder: (context, state, shell) => HomeShell(shell: shell),
      branches: [
        StatefulShellBranch(routes: [GoRoute(path: '/', builder: (context, state) => const TodayScreen())]),
        StatefulShellBranch(routes: [GoRoute(path: '/lich', builder: (context, state) => const CalendarScreen())]),
      ],
    ),
  ],
);
