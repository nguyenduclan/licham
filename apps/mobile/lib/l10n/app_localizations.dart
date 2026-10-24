import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_vi.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[Locale('vi')];

  /// No description provided for @appTitle.
  ///
  /// In vi, this message translates to:
  /// **'Lịch Âm LAL'**
  String get appTitle;

  /// No description provided for @navToday.
  ///
  /// In vi, this message translates to:
  /// **'Hôm nay'**
  String get navToday;

  /// No description provided for @navCalendar.
  ///
  /// In vi, this message translates to:
  /// **'Lịch tháng'**
  String get navCalendar;

  /// No description provided for @lunarDate.
  ///
  /// In vi, this message translates to:
  /// **'Ngày {day} tháng {month}{leap} năm {canChiYear}'**
  String lunarDate(Object day, Object month, Object leap, Object canChiYear);

  /// No description provided for @leapSuffix.
  ///
  /// In vi, this message translates to:
  /// **' (nhuận)'**
  String get leapSuffix;

  /// No description provided for @dayLabel.
  ///
  /// In vi, this message translates to:
  /// **'Ngày'**
  String get dayLabel;

  /// No description provided for @monthLabel.
  ///
  /// In vi, this message translates to:
  /// **'Tháng'**
  String get monthLabel;

  /// No description provided for @yearLabel.
  ///
  /// In vi, this message translates to:
  /// **'Năm'**
  String get yearLabel;

  /// No description provided for @napAm.
  ///
  /// In vi, this message translates to:
  /// **'Mệnh ngày'**
  String get napAm;

  /// No description provided for @hoangDao.
  ///
  /// In vi, this message translates to:
  /// **'Ngày hoàng đạo'**
  String get hoangDao;

  /// No description provided for @hacDao.
  ///
  /// In vi, this message translates to:
  /// **'Ngày hắc đạo'**
  String get hacDao;

  /// No description provided for @tuoiXung.
  ///
  /// In vi, this message translates to:
  /// **'Tuổi xung'**
  String get tuoiXung;

  /// No description provided for @tietKhi.
  ///
  /// In vi, this message translates to:
  /// **'Tiết khí'**
  String get tietKhi;

  /// No description provided for @gioHoangDao.
  ///
  /// In vi, this message translates to:
  /// **'Giờ hoàng đạo'**
  String get gioHoangDao;

  /// No description provided for @hourRange.
  ///
  /// In vi, this message translates to:
  /// **'{start}h–{end}h'**
  String hourRange(Object start, Object end);

  /// No description provided for @monthTitle.
  ///
  /// In vi, this message translates to:
  /// **'Tháng {month} / {year}'**
  String monthTitle(Object month, Object year);

  /// No description provided for @today.
  ///
  /// In vi, this message translates to:
  /// **'Hôm nay'**
  String get today;

  /// No description provided for @previousMonth.
  ///
  /// In vi, this message translates to:
  /// **'Tháng trước'**
  String get previousMonth;

  /// No description provided for @nextMonth.
  ///
  /// In vi, this message translates to:
  /// **'Tháng sau'**
  String get nextMonth;

  /// No description provided for @legendHoangDao.
  ///
  /// In vi, this message translates to:
  /// **'Hoàng đạo'**
  String get legendHoangDao;

  /// No description provided for @legendHacDao.
  ///
  /// In vi, this message translates to:
  /// **'Hắc đạo'**
  String get legendHacDao;

  /// No description provided for @weekdays.
  ///
  /// In vi, this message translates to:
  /// **'Thứ Hai|Thứ Ba|Thứ Tư|Thứ Năm|Thứ Sáu|Thứ Bảy|Chủ Nhật'**
  String get weekdays;

  /// No description provided for @weekdaysShort.
  ///
  /// In vi, this message translates to:
  /// **'T2|T3|T4|T5|T6|T7|CN'**
  String get weekdaysShort;

  /// No description provided for @referenceNote.
  ///
  /// In vi, this message translates to:
  /// **'Nội dung xem ngày chỉ mang tính tham khảo.'**
  String get referenceNote;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['vi'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'vi':
      return AppLocalizationsVi();
  }

  throw FlutterError(
    'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
    'an issue with the localizations generation tool. Please file an issue '
    'on GitHub with a reproducible sample app and the gen-l10n configuration '
    'that was used.',
  );
}
