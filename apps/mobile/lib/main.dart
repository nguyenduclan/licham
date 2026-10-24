// =============================================================================
// main.dart: điểm khởi động app (≈ index.tsx gọi ReactDOM.render).
// ProviderScope ≈ <Provider store={...}> bọc toàn app để dùng Riverpod.
// =============================================================================

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'app.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // Edge-to-edge: app vẽ tràn dưới thanh trạng thái / thanh điều hướng (yêu cầu Android 15+).
  // Nội dung tự tránh các vùng này nhờ Scaffold/SafeArea.
  SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
  runApp(const ProviderScope(child: LichAmApp()));
}
