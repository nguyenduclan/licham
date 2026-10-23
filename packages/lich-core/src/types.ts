// Kiểu dữ liệu ngày dương lịch / âm lịch (tương ứng models.dart bên Dart).

/** Ngày dương lịch. Không dùng Date để tránh rắc rối múi giờ. */
export interface SolarDate {
  day: number;
  month: number;
  year: number;
}

/** Ngày âm lịch. `isLeap` = true nếu thuộc tháng nhuận. */
export interface LunarDate {
  day: number;
  month: number;
  year: number;
  isLeap: boolean;
}

/** Dạng "YYYY-MM-DD". */
export function toIso(d: SolarDate): string {
  return `${String(d.year).padStart(4, '0')}-${String(d.month).padStart(2, '0')}-${String(d.day).padStart(2, '0')}`;
}

/** Tạo SolarDate từ Date (theo giờ máy). */
export function solarFromDate(d: Date): SolarDate {
  return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
}
