// Server component: tính "hôm nay" theo giờ Việt Nam cho TỪNG request rồi render lịch.
// Nhờ vậy HTML trả về đã chứa lịch tháng + thông tin ngày (Google đọc được ngay),
// thay vì chỉ có khung "đang tải" chờ JavaScript chạy.
import { io } from "next/cache";
import { todayInVietnam } from "@/lib/vn-date";
import { CalendarApp } from "./calendar-app";

export async function HomeCalendar() {
  await io(); // giá trị theo từng request, không chụp vào trang tĩnh lúc build (yêu cầu của cacheComponents)
  return <CalendarApp today={todayInVietnam()} />;
}
