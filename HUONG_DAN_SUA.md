# Hướng dẫn cài đặt & sửa dự án Lịch Âm

> Tài liệu này được cập nhật sau mỗi bước phát triển. Các mục ghi *(bổ sung ở bước sau)* sẽ được viết khi phần đó có code.

## 1. Cấu trúc repo

```
licham/
├─ apps/
│  ├─ mobile/            # App Flutter (Android)              (bổ sung ở bước sau)
│  └─ web/               # Next.js: website + API             (bổ sung ở bước sau)
├─ packages/
│  ├─ lich_core/         # Lõi lịch âm bản Dart (cho Flutter)
│  └─ lich-core/         # Lõi lịch âm bản TypeScript (cho web)
├─ shared/
│  ├─ test_cases.json    # Bộ test chung, cả 2 bản phải pass 100%
│  └─ tools/generate-test-cases.ps1   # Script sinh test_cases.json
└─ HUONG_DAN_SUA.md
```

## 2. Cài đặt môi trường (Windows)

| Công cụ | Cách cài | Kiểm tra |
|---|---|---|
| Node.js LTS (≥ 20) | `winget install OpenJS.NodeJS.LTS` | `node -v` |
| Flutter SDK (stable) | Tải zip tại <https://docs.flutter.dev/get-started/install/windows>, giải nén vào `C:\src\flutter`, thêm `C:\src\flutter\bin` vào biến môi trường PATH | `flutter --version` |
| Android Studio | <https://developer.android.com/studio> (cần để có Android SDK + máy ảo) | `flutter doctor` |
| VS Code extension | "Dart" và "Flutter" (của Dart Code) | — |

Sau khi cài Flutter, chạy `flutter doctor` và làm theo các mục còn báo ❌ (thường là `flutter doctor --android-licenses`).
Flutter đã có sẵn Dart, không cần cài Dart riêng.

## 3. Module lõi lịch âm

### Chạy test

```powershell
# Bản Dart
cd packages/lich_core
dart pub get
dart test

# Bản TypeScript (chạy từ thư mục gốc repo)
npm install
npm run test:core
```

Cả hai phải báo **pass toàn bộ**. Nếu một bản fail mà bản kia pass, nghĩa là hai bản đã lệch logic. So sánh hàm tương ứng giữa hai bản (tên file và tên hàm giống nhau, chỉ khác `snake_case.dart` và `kebab-case.ts`).

### File nào làm gì

| Dart (`packages/lich_core/lib/src/`) | TypeScript (`packages/lich-core/src/`) | Nội dung |
|---|---|---|
| `models.dart` | `types.ts` | Kiểu `SolarDate`, `LunarDate` |
| `julian_day.dart` | `julian-day.ts` | Đổi ngày dương lịch ↔ số ngày Julius |
| `astronomy.dart` | `astronomy.ts` | Tính sóc (trăng mới), kinh độ mặt trời. **Không sửa** |
| `lunar_calendar.dart` | `lunar-calendar.ts` | Dương ↔ âm, tháng nhuận, độ dài tháng |
| `can_chi.dart` | `can-chi.ts` | Can chi, tiết khí, giờ hoàng đạo |
| `hoang_dao.dart` | `hoang-dao.ts` | Nạp âm (mệnh ngày), thần ngày → hoàng/hắc đạo, tuổi xung |
| `xem_ngay.dart` | `xem-ngay.ts` | Thập nhị trực, Nhị thập bát tú, ngày kỵ (Nguyệt kỵ, Nguyệt tận, Tam Nương, Dương Công) |
| `xuat_hanh.dart` | `xuat-hanh.ts` | Lục Diệu, giờ Lý Thuần Phong, Hỷ/Tài/Hạc thần |
| `tu_vi.dart` | `tu-vi.ts` | Lập lá số tử vi: 12 cung, Cục, 14 chính tinh, phụ tinh, Tứ Hóa, Tràng Sinh, đại vận. Test: `shared/tu_vi_cases.json` (sinh từ bản TS bằng `npm run gen:tu-vi -w lich-core`, bản Dart phải khớp) |
| `kinh_dich.dart` | `kinh-dich.ts` | Bát quái, bảng 64 quẻ (tên, đánh giá tốt/bình/xấu), lập quẻ từ dãy số, quẻ biến |
| `sim.dart` | `sim.ts` | Chấm điểm sim (thang 10), tìm bộ số đẹp/xấu, gợi ý đuôi số hợp mệnh. Test: `shared/sim_cases.json` (sinh bằng `npm run gen:sim -w lich-core`) |
| `tuoi.dart` | `tuoi.ts` | Tam hợp, lục hợp, xung, hình, hại, phá, Tam Sát; chấm điểm ngày theo tuổi (`danhGiaTuoi`) |
| `day_info.dart` | `day-info.ts` | Gom mọi thông tin của 1 ngày (`DayInfo.fromSolar` / `getDayInfo`) |

### Cách dùng

```dart
// Flutter
import 'package:lich_core/lich_core.dart';
final info = DayInfo.fromSolar(SolarDate.fromDateTime(DateTime.now()));
print('${info.lunar.day}/${info.lunar.month} – ngày ${info.canChiDay}');
```

```ts
// Next.js
import { getDayInfo, solarFromDate } from 'lich-core';
const info = getDayInfo(solarFromDate(new Date()));
```

> Next.js cần khai báo `transpilePackages: ['lich-core']` trong `next.config.ts` vì package xuất thẳng file `.ts` (sẽ cấu hình sẵn ở bước làm web).

### Muốn sửa X thì sửa ở đâu

| Muốn… | Sửa ở đâu |
|---|---|
| Thêm/sửa test case | **Không sửa tay** `test_cases.json`. Sửa phần "Sinh test case" trong `shared/tools/generate-test-cases.ps1` rồi chạy `npm run gen:test-cases` |
| Thêm mốc đối chiếu (Tết, tháng nhuận đã biết chắc) | Bảng `$knownTet` / `$knownLeap` trong `generate-test-cases.ps1`. Script sẽ dừng nếu mốc sai |
| Đổi tên hiển thị can/chi/tiết khí | `can_chi.dart` **và** `can-chi.ts`, sau đó cập nhật mảng `$CAN`/`$CHI`/`$TIET_KHI` trong script và sinh lại test |
| Sửa thuật toán | Sửa **cả 3 bản** (Dart, TS, PowerShell), sinh lại test, chạy test cả 2 package |

### Lưu ý về độ chính xác

- Lịch tính theo giờ Việt Nam (UTC+7), nên một số năm Tết lệch với lịch Trung Quốc (UTC+8): 1968, 1985, 2007, 2030.
- Năm 2033 nhuận **tháng 11**, một trường hợp đặc biệt đã được kiểm tra.
- Phạm vi đảm bảo: 1900–2100.

## 4. Chạy website Next.js (`apps/web`)

```powershell
# Từ thư mục gốc repo (lần đầu: npm install)
npm run dev:web
# Mở http://localhost:3000 — sửa code là trang tự cập nhật
```

> Nếu PowerShell báo `npm.ps1 cannot be loaded because running scripts is disabled`: chạy một lần
> `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`, hoặc gõ `npm.cmd` thay cho `npm`.

| File | Nội dung |
|---|---|
| `src/app/page.tsx` | Trang chủ (tiêu đề + lịch) |
| `src/app/layout.tsx` | Khung HTML chung, font, tiêu đề/mô tả SEO |
| `src/app/globals.css` | **Toàn bộ màu sắc** (sáng + tối) |
| `src/components/calendar/calendar-app.tsx` | State tháng đang xem / ngày đang chọn, nút chuyển tháng |
| `src/components/calendar/month-grid.tsx` | Lưới lịch tháng (ngày dương + ngày âm) |
| `src/components/calendar/day-detail.tsx` | Thẻ chi tiết ngày: can chi, tiết khí, giờ hoàng đạo |
| `src/lib/vn-date.ts` | "Hôm nay" theo giờ Việt Nam, tên thứ, số ngày trong tháng |

| Muốn… | Sửa ở đâu |
|---|---|
| Đổi màu chủ đạo | `--primary`, `--accent`… trong `globals.css` (có 2 khối: sáng và tối) |
| Đổi màu chấm hắc đạo / nền ô hôm nay | `--dot-hac`, `--today` trong `globals.css` (chấm hoàng đạo dùng `--primary`) |
| Thêm / sửa ngày lễ | `shared/data/holidays.json` (dùng chung web + app). `dayOff: true` = ngày nghỉ, tô đỏ |
| Sửa giao diện 1 ô lịch | `src/components/calendar/day-cell.tsx` |
| Sửa câu giải nghĩa (Bành Tổ, Lục Diệu, 28 sao, trực, ngày kỵ, câu kết luận theo tuổi) | `shared/data/xem-ngay.json` (dùng chung web + app) |
| Đổi điểm từng yếu tố / ngưỡng Tốt–Xấu khi xét tuổi | `TUOI_FACTOR_SCORE` trong `tuoi.ts` **và** `tuoiFactorScore` trong `tuoi.dart` **và** `$FACTOR_SCORE` trong script sinh test, rồi sinh lại test |
| Sửa giải nghĩa 64 quẻ, ý nghĩa bộ số, câu kết luận sim | `shared/data/sim.json` |
| Thêm bộ số đẹp/xấu mới | Logic nhận diện trong `timBoSo` (`sim.ts` **và** `sim.dart`) + thêm tên/ý nghĩa vào `shared/data/sim.json`, rồi `npm run gen:sim -w lich-core` |
| Đổi thang điểm sim hoặc đánh giá tốt/xấu của quẻ | `sim.ts`/`sim.dart` (`chamDiemSim`), `kinh-dich.ts`/`kinh_dich.dart` (bảng `QUE_64`), rồi sinh lại test |
| Sửa giải nghĩa cung / sao tử vi, câu cảnh báo, câu cam kết bảo mật | `shared/data/tu-vi.json` |
| Sửa quy tắc an sao tử vi | `tu-vi.ts` **và** `tu_vi.dart`, rồi `npm run gen:tu-vi -w lich-core` và chạy test cả 2 bản |
| Giao diện lá số (bàn SVG, form, lưu/xóa) | `src/components/tu-vi/` (bàn: `la-so-board.tsx`), lưu trữ: `src/lib/tu-vi-storage.ts` |
| Đổi màu / chữ logo, favicon, ảnh chia sẻ | Sửa biến đầu file `shared/tools/generate-icons.ps1` rồi chạy `powershell -ExecutionPolicy Bypass -File shared/tools/generate-icons.ps1`; sửa cùng màu trong `src/components/logo.tsx` và `src/app/icon.svg` |
| Đổi tên website, mô tả SEO chung | `src/lib/site.ts` |
| Header bảo mật, CSP (danh sách tên miền được phép) | `apps/web/next.config.ts`. Gắn dịch vụ ngoài (AdSense, Analytics…) phải thêm tên miền của họ vào CSP, nếu không trình duyệt sẽ chặn |
| Đặt tên miền thật (canonical, sitemap, robots) | Copy `apps/web/.env.example` thành `.env.local`, điền `NEXT_PUBLIC_SITE_URL` |
| Thêm trang vào sitemap | `src/app/sitemap.ts` |
| **Mỗi đầu năm:** đổi các năm có trang lịch ngày/tháng/năm dựng sẵn + đưa vào sitemap | `SEO_YEARS` trong `src/lib/site.ts` (giữ năm trước, năm nay, năm sau) |
| Sửa nội dung trang lịch theo ngày / tháng / năm | `src/components/lich-am/day-page.tsx`, `month-page.tsx`, `year-page.tsx`; mô tả tiết khí: `shared/data/tiet-khi.json` |
| Sửa công cụ đổi ngày âm dương | `src/components/doi-ngay/doi-ngay-app.tsx`, trang: `src/app/doi-ngay-am-duong/page.tsx` |
| Sửa chân trang, trang 404 | `src/components/site-footer.tsx`, `src/app/not-found.tsx` |
| Thêm mục menu đầu trang | Mảng `NAV` trong `src/components/site-header.tsx` |
| Sửa trang Xem ngày tốt xấu | `src/app/xem-ngay-tot-xau/page.tsx`, các mục trong `src/components/xem-ngay/` |
| Đổi tiêu đề / mô tả hiện trên Google | `metadata` trong `layout.tsx` |
| Tuần bắt đầu từ Chủ Nhật | `leadingBlanks` trong `month-grid.tsx` và mảng `WEEKDAYS_SHORT` |

> Lưu ý Next.js 16: config đang bật `cacheComponents`. Mọi chỗ dùng `new Date()` phải đặt sau `io()` (xem `calendar-app.tsx`), nếu không ngày sẽ bị "đóng băng" lúc build.

## 4b. App Flutter (`apps/mobile`)

### Chạy app trên điện thoại Android
1. Trên điện thoại: **Cài đặt → Giới thiệu điện thoại → bấm 7 lần vào "Số hiệu bản tạo"** để bật *Tùy chọn nhà phát triển*,
   rồi vào *Tùy chọn nhà phát triển* bật **Gỡ lỗi USB**.
2. Cắm cáp USB vào máy tính, trên điện thoại bấm **Cho phép** gỡ lỗi.
3. Chạy:
```powershell
cd D:\code\licham\apps\mobile
flutter devices          # phải thấy tên điện thoại
flutter run              # cài bản debug và chạy (sửa code -> bấm r để tải lại nóng)
flutter build apk --release   # tạo file APK để cài thử: build\app\outputs\flutter-apk\app-release.apk
```

### Cấu trúc
```
lib/
  main.dart, app.dart        # khởi động app, theme, ngôn ngữ, router
  core/theme/                # TOÀN BỘ màu, khoảng cách, cỡ chữ
  core/router/               # các màn hình và đường dẫn (go_router)
  core/widgets/home_shell.dart   # thanh điều hướng dưới
  data/                      # đọc nội dung JSON trong assets/data
  l10n/app_vi.arb            # TOÀN BỘ chữ hiển thị
  features/today/            # màn Hôm nay: screens/, widgets/, providers/
  features/calendar/         # màn Lịch tháng
assets/data/                 # bản copy của shared/data (không sửa trực tiếp ở đây)
```

### Package đã dùng và lý do
| Package | Lý do |
|---|---|
| `flutter_riverpod` | Quản lý state phổ biến nhất, an toàn kiểu dữ liệu; dùng cách cơ bản (`Provider`, `NotifierProvider`), **không** sinh code |
| `go_router` | Router chính thức của nhóm Flutter, khai báo đường dẫn giống web |
| `flutter_localizations`, `intl` | Bộ đa ngôn ngữ chính thức của Flutter/Dart |
| `lich_core` | Lõi lịch âm của chính dự án (cùng logic với web) |

### Muốn sửa X thì sửa ở đâu
| Muốn… | Sửa ở đâu |
|---|---|
| Đổi màu chủ đạo, màu chấm hoàng/hắc đạo | `lib/core/theme/app_colors.dart` |
| Đổi khoảng cách, bo góc, cỡ chữ | `lib/core/theme/app_spacing.dart` |
| Sửa / thêm chữ hiển thị | `lib/l10n/app_vi.arb` (thêm khóa mới rồi dùng `AppLocalizations.of(context).tenKhoa`) |
| Thêm ngày lễ, sửa giải nghĩa | Sửa `shared/data/*.json` rồi chạy `powershell -ExecutionPolicy Bypass -File shared/tools/sync-mobile-data.ps1` |
| Đổi biểu tượng app | Sửa và chạy `shared/tools/generate-icons.ps1` (tạo luôn icon Android) |
| Thêm màn hình / tab mới | `lib/core/router/app_router.dart` + thư mục mới trong `lib/features/` |
| Đổi tên app, minSdk/targetSdk, mã định danh app | `android/app/src/main/AndroidManifest.xml` (tên), `android/app/build.gradle.kts` (SDK, `applicationId`) |

## 5. Các thao tác sửa thường gặp *(bổ sung ở bước sau)*

Đổi màu chủ đạo, thêm ngày lễ, thêm bài văn khấn, sửa chữ hiển thị (l10n)…

## 6. Build APK/AAB và phát hành lên Google Play *(bổ sung ở bước sau)*
