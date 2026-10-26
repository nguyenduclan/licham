// Nội dung "Câu hỏi thường gặp" của từng trang (hiện trên trang + JSON-LD FAQPage).
// Sửa câu chữ ở đây, không cần sửa component. Câu trả lời nên ngắn, trả lời thẳng ngay câu đầu
// để Google/AI trích dẫn được.
import type { FaqItem } from "./seo";

export const FAQ_TRANG_CHU: FaqItem[] = [
  {
    q: "Ngày hoàng đạo là gì?",
    a: "Ngày hoàng đạo là ngày do một trong 6 thần tốt cai quản: Thanh Long, Minh Đường, Kim Quỹ, Thiên Đức, Ngọc Đường, Tư Mệnh. Ngày do 6 thần xấu (Thiên Hình, Chu Tước, Bạch Hổ, Thiên Lao, Nguyên Vũ, Câu Trận) cai quản là ngày hắc đạo. Dân gian thường chọn ngày hoàng đạo để làm việc lớn.",
  },
  {
    q: "Giờ hoàng đạo là gì?",
    a: "Một ngày có 12 canh giờ, mỗi canh giờ dài 2 tiếng và mang tên một địa chi (Tý, Sửu, Dần...). Trong đó có 6 giờ hoàng đạo là giờ tốt để khởi sự, 6 giờ còn lại là giờ hắc đạo.",
  },
  {
    q: "Vì sao lịch âm có tháng nhuận?",
    a: "Năm âm lịch 12 tháng ngắn hơn năm dương lịch khoảng 11 ngày, nên khoảng 3 năm lại thêm một tháng nhuận để lịch âm khớp với mùa. Năm nhuận âm lịch có 13 tháng.",
  },
  {
    q: "Lịch âm Việt Nam có giống lịch âm Trung Quốc không?",
    a: "Cách tính giống nhau nhưng lịch Việt Nam tính theo giờ Việt Nam (UTC+7), còn lịch Trung Quốc theo UTC+8. Vì vậy có năm ngày mùng 1 hoặc Tết của hai nước lệch nhau một ngày.",
  },
];

export const FAQ_XEM_NGAY: FaqItem[] = [
  {
    q: "Xem ngày tốt xấu dựa vào những yếu tố nào?",
    a: "Trang xem ngày dựa trên ngày hoàng đạo/hắc đạo, trực của ngày (Thập Nhị Kiến Trừ), sao chiếu ngày (Nhị Thập Bát Tú), Khổng Minh Lục Diệu, các ngày kỵ (Nguyệt kỵ, Tam Nương, Dương Công Kỵ Nhật) và tuổi xung khắc với ngày.",
  },
  {
    q: "Ngày Nguyệt kỵ là ngày nào?",
    a: "Nguyệt kỵ là các ngày mùng 5, 14 và 23 âm lịch hằng tháng. Dân gian có câu \"mùng năm, mười bốn, hai ba, đi chơi cũng lỗ nữa là đi buôn\".",
  },
  {
    q: "Ngày Tam Nương là ngày nào?",
    a: "Ngày Tam Nương gồm mùng 3, 7, 13, 18, 22 và 27 âm lịch hằng tháng. Theo dân gian nên tránh cưới hỏi, khai trương, xuất hành vào những ngày này.",
  },
  {
    q: "Làm sao biết một ngày có hợp tuổi mình không?",
    a: "Nhập năm sinh âm lịch vào ô xem tuổi. Trang sẽ kiểm tra ngày đó có xung với tuổi bạn (lục xung), có phạm Tam Sát hay không và ngũ hành của ngày có hợp mệnh bạn không.",
  },
];

export const FAQ_LA_SO: FaqItem[] = [
  {
    q: "Lập lá số tử vi cần những thông tin gì?",
    a: "Cần ngày tháng năm sinh (dương lịch hoặc âm lịch), giờ sinh và giới tính. Giới tính dùng để xác định chiều của đại vận.",
  },
  {
    q: "Không nhớ chính xác giờ sinh thì có lập được lá số không?",
    a: "Vẫn lập được nhưng kém chính xác. Giờ sinh quyết định vị trí cung Mệnh và cung Thân, nên sai một canh giờ (2 tiếng) là cả lá số thay đổi. Nếu không chắc, hãy hỏi lại gia đình hoặc xem giấy chứng sinh.",
  },
  {
    q: "Đại vận trong lá số tử vi là gì?",
    a: "Đại vận là các giai đoạn 10 năm của cuộc đời. Mỗi đại vận ứng với một cung trên lá số, đi thuận hoặc nghịch tùy theo giới tính và năm sinh âm hay dương.",
  },
  {
    q: "Ngày giờ sinh của tôi có bị lưu lại không?",
    a: "Không. Lá số được tính ngay trên trình duyệt, ngày giờ sinh không gửi lên máy chủ. Chỉ khi bạn bấm \"Lưu trên máy này\" thì lá số mới được lưu trong trình duyệt của bạn, và có thể xóa bất cứ lúc nào.",
  },
];

export const FAQ_SIM: FaqItem[] = [
  {
    q: "Sim phong thủy được chấm điểm như thế nào?",
    a: "Số điện thoại được chấm trên thang 10 theo ngũ hành của các chữ số so với mệnh của bạn, sự cân bằng âm dương (số chẵn, số lẻ), tổng nút và quẻ Kinh Dịch của dãy số. Cách chấm do trang tự xây dựng từ quan niệm phổ biến, chỉ mang tính tham khảo.",
  },
  {
    q: "Mỗi chữ số thuộc hành gì?",
    a: "Theo cách phổ biến ở Việt Nam: 0 và 1 thuộc Thủy; 2, 5, 8 thuộc Thổ; 3 và 4 thuộc Mộc; 6 và 7 thuộc Kim; 9 thuộc Hỏa.",
  },
  {
    q: "Số điện thoại tôi nhập có bị gửi đi đâu không?",
    a: "Không. Số điện thoại và ngày sinh chỉ được xử lý trên trình duyệt của bạn, không gửi hay lưu trên máy chủ.",
  },
];

export const FAQ_DOI_NGAY: FaqItem[] = [
  {
    q: "Đổi ngày sinh âm lịch để làm gì?",
    a: "Nhiều thủ tục, giấy tờ dùng ngày dương lịch, còn cúng giỗ, xem tuổi, lập lá số lại dùng ngày âm lịch.",
  },
  {
    q: "Sinh vào tháng nhuận thì đổi thế nào?",
    a: "Tick ô \"Tháng nhuận\" khi đổi âm sang dương. Nếu năm đó không có tháng nhuận như bạn nhập, công cụ sẽ báo lỗi.",
  },
  {
    q: "Công cụ đổi ngày chính xác đến năm nào?",
    a: "Công cụ đã được kiểm tra từ năm 1900 đến 2100, gồm các ngày Tết và tháng nhuận.",
  },
];
