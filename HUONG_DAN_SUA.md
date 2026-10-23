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
| Sửa trang Xem ngày tốt xấu | `src/app/xem-ngay-tot-xau/page.tsx`, các mục trong `src/components/xem-ngay/` |
| Đổi tiêu đề / mô tả hiện trên Google | `metadata` trong `layout.tsx` |
| Tuần bắt đầu từ Chủ Nhật | `leadingBlanks` trong `month-grid.tsx` và mảng `WEEKDAYS_SHORT` |

> Lưu ý Next.js 16: config đang bật `cacheComponents`. Mọi chỗ dùng `new Date()` phải đặt sau `io()` (xem `calendar-app.tsx`), nếu không ngày sẽ bị "đóng băng" lúc build.

## 4b. Chạy app Flutter *(bổ sung ở bước sau)*

## 5. Các thao tác sửa thường gặp *(bổ sung ở bước sau)*

Đổi màu chủ đạo, thêm ngày lễ, thêm bài văn khấn, sửa chữ hiển thị (l10n)…

## 6. Build APK/AAB và phát hành lên Google Play *(bổ sung ở bước sau)*
