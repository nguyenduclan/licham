// Server component: tính "hôm nay" theo giờ Việt Nam cho TỪNG request rồi render lịch.
// Nhờ vậy HTML trả về đã chứa lịch tháng + thông tin ngày (Google đọc được ngay),
// thay vì chỉ có khung "đang tải" chờ JavaScript chạy.
// Mục hỏi đáp cũng ở đây vì câu "Hôm nay là ngày bao nhiêu âm lịch?" phụ thuộc ngày hôm nay.
import { io } from "next/cache";
import { getDayInfo } from "lich-core";
import { Faq } from "@/components/faq";
import { FAQ_TRANG_CHU } from "@/lib/faq";
import { fmt } from "@/lib/lich-pages";
import { todayInVietnam, WEEKDAYS } from "@/lib/vn-date";
import { CalendarApp } from "./calendar-app";

export async function HomeCalendar() {
  await io(); // giá trị theo từng request, không chụp vào trang tĩnh lúc build (yêu cầu của cacheComponents)
  const today = todayInVietnam();
  const info = getDayInfo(today);
  const homNay = {
    q: "Hôm nay là ngày bao nhiêu âm lịch?",
    a: `Hôm nay ${WEEKDAYS[info.jd % 7]}, ngày ${fmt(today)} dương lịch là ngày ${info.lunar.day}/${info.lunar.month}${
      info.lunar.isLeap ? " (nhuận)" : ""
    } năm ${info.canChiYear} âm lịch, ngày ${info.canChiDay}, là ngày ${info.isHoangDao ? "hoàng đạo" : "hắc đạo"} (${info.thanNgay}).`,
  };
  return (
    <div className="flex flex-col gap-6">
      <CalendarApp today={today} />
      <Faq items={[homNay, ...FAQ_TRANG_CHU]} />
    </div>
  );
}
