// =============================================================================
// day-info.ts: gom toàn bộ thông tin của một ngày vào một object.
// Tương ứng DayInfo.fromSolar bên Dart.
// =============================================================================

import { canChiDay, canChiMonth, canChiYear, gioHoangDao, tietKhi } from './can-chi';
import { isHoangDao, NAP_AM_NAMES, napAmIndexOfDay, THAN_NGAY_NAMES, thanNgayIndex, tuoiXung } from './hoang-dao';
import { jdFromDate } from './julian-day';
import { solarToLunar, VIETNAM_TIME_ZONE } from './lunar-calendar';
import type { LunarDate, SolarDate } from './types';

export interface DayInfo {
  solar: SolarDate;
  lunar: LunarDate;
  /** Số ngày Julius. */
  jd: number;
  canChiDay: string;
  canChiMonth: string;
  canChiYear: string;
  tietKhi: string;
  /** Chỉ số chi (0 = Tý ...) của các giờ hoàng đạo. */
  gioHoangDao: number[];
  /** Mệnh ngày (nạp âm), ví dụ "Đại Lâm Mộc". */
  napAm: string;
  /** Thần trực ngày, ví dụ "Thanh Long". */
  thanNgay: string;
  /** true = ngày hoàng đạo, false = ngày hắc đạo. */
  isHoangDao: boolean;
  /** Các tuổi xung với ngày, ví dụ ["Bính Tuất", "Canh Tuất"]. */
  tuoiXung: string[];
}

/** Tính đầy đủ thông tin cho một ngày dương lịch. */
export function getDayInfo(solar: SolarDate, timeZone = VIETNAM_TIME_ZONE): DayInfo {
  const jd = jdFromDate(solar.day, solar.month, solar.year);
  const lunar = solarToLunar(solar, timeZone);
  return {
    solar,
    lunar,
    jd,
    canChiDay: canChiDay(jd),
    canChiMonth: canChiMonth(lunar.month, lunar.year),
    canChiYear: canChiYear(lunar.year),
    tietKhi: tietKhi(jd, timeZone),
    gioHoangDao: gioHoangDao(jd),
    napAm: NAP_AM_NAMES[napAmIndexOfDay(jd)],
    thanNgay: THAN_NGAY_NAMES[thanNgayIndex(jd, lunar.month)],
    isHoangDao: isHoangDao(jd, lunar.month),
    tuoiXung: tuoiXung(jd),
  };
}
