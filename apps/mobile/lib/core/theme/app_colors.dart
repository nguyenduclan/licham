// =============================================================================
// app_colors.dart: TOÀN BỘ màu của app (giống biến CSS trong globals.css của web).
// Muốn đổi màu chủ đạo: sửa ở đây là đổi cả app.
// =============================================================================

import 'package:flutter/material.dart';

class AppColors {
  AppColors._(); // không tạo instance, chỉ dùng hằng số (≈ một object const trong JS)

  // Giao diện sáng
  static const brand = Color(0xFF8A1C1C); // đỏ sẫm của logo LAL
  static const primary = Color(0xFFB91C1C); // đỏ son: chấm hoàng đạo, Chủ nhật, ngày lễ
  static const primarySoft = Color(0xFFFBEAEA);
  static const accent = Color(0xFFB7791F); // vàng đồng
  static const background = Color(0xFFFDF8F1);
  static const surface = Color(0xFFFFFFFF);
  static const line = Color(0xFFEADFCE);
  static const text = Color(0xFF2B1D16);
  static const muted = Color(0xFF7A6A5E);
  static const today = Color(0xFFFDEBCF); // nền ô hôm nay
  static const dotHacDao = Color(0xFFA8A29E); // chấm ngày hắc đạo

  // Giao diện tối
  static const primaryDark = Color(0xFFF05252);
  static const primarySoftDark = Color(0xFF3B1F1F);
  static const backgroundDark = Color(0xFF17110E);
  static const surfaceDark = Color(0xFF221A16);
  static const lineDark = Color(0xFF3A2E27);
  static const textDark = Color(0xFFF3E9DF);
  static const mutedDark = Color(0xFFB3A294);
  static const todayDark = Color(0xFF3D2C17);
  static const dotHacDaoDark = Color(0xFF6B625C);
}
