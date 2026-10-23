// Nội dung trang Xem ngày tốt xấu: đọc ?ngay=&sinh= rồi hiển thị từng mục.
import { buildXemNgay, content, parseIsoDate } from "@/lib/xem-ngay";
import { todayInVietnam, WEEKDAYS } from "@/lib/vn-date";
import { HourList, Rating, Section } from "./section";
import { TuoiCard } from "./tuoi-card";
import { XemNgayForm } from "./xem-ngay-form";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function KetQua({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const day = parseIsoDate(params.ngay) ?? todayInVietnam();
  const birth = parseIsoDate(params.sinh);
  const d = buildXemNgay(day, birth);
  const { info } = d;

  return (
    <div className="flex flex-col gap-5">
      <header className="text-center">
        <p className="text-muted">
          {WEEKDAYS[info.jd % 7]}, ngày {day.day}/{day.month}/{day.year}
        </p>
        <p className="mt-1 text-xl font-semibold">
          Âm lịch {info.lunar.day}/{info.lunar.month}
          {info.lunar.isLeap && " (nhuận)"} năm {info.canChiYear} · Ngày {info.canChiDay}, tháng {info.canChiMonth}
        </p>
        <p className="mt-2">
          <Rating label={`Ngày ${info.isHoangDao ? "hoàng đạo" : "hắc đạo"} (${info.thanNgay})`} good={info.isHoangDao} />
        </p>
      </header>

      {d.tuoi ? (
        <TuoiCard tuoi={d.tuoi} />
      ) : (
        <Section title="Xem ngày này có hợp tuổi bạn không?">
          <XemNgayForm date={day} />
        </Section>
      )}

      <Section title="Giờ Hoàng Đạo">
        <HourList hours={d.gioHoangDao} />
      </Section>
      <Section title="Giờ Hắc Đạo">
        <HourList hours={d.gioHacDao} />
      </Section>

      <Section title="Các ngày kỵ">
        {d.ngayKy.length === 0 ? (
          <p>Không phạm ngày Nguyệt kỵ, Nguyệt tận, Tam Nương hay Dương Công Kỵ Nhật nào.</p>
        ) : (
          d.ngayKy.map((k) => (
            <p key={k.ten}>
              Phạm <b>{k.ten}</b>: {k.moTa}
            </p>
          ))
        )}
      </Section>

      <Section title="Ngũ hành">
        <p>
          Nạp âm: ngày <b>{info.napAm}</b>, kỵ các tuổi <b>{info.tuoiXung.join(", ")}</b>.
        </p>
        {d.tamSat.length > 0 && (
          <p>
            Tam Sát kỵ mệnh các tuổi <b>{d.tamSat.join(", ")}</b>.
          </p>
        )}
      </Section>

      <Section title="Bành Tổ Bách Kỵ Nhật">
        {d.banhTo.map((b) => (
          <p key={b.cau}>
            <i>&ldquo;{b.cau}&rdquo;</i>: {b.giai}
          </p>
        ))}
      </Section>

      <Section title="Khổng Minh Lục Diệu">
        <p>
          Ngày <b>{d.lucDieu.name}</b> <Rating label={d.lucDieu.danhGia} good={d.lucDieu.tot} />
        </p>
        <p>{d.lucDieu.moTa}</p>
      </Section>

      <Section title="Nhị Thập Bát Tú">
        <p>
          Sao <b>{d.tu.name}</b> ({d.tu.ten}) <Rating label={d.tu.danhGia} good={d.tu.danhGia === "Tốt"} />
        </p>
        <p>
          <span className="text-muted">Nên làm:</span> {d.tu.nen}
        </p>
        <p>
          <span className="text-muted">Kiêng cữ:</span> {d.tu.kieng}
        </p>
      </Section>

      <Section title="Thập Nhị Kiến Trừ">
        <p>
          Trực <b>{d.truc.name}</b> <Rating label={d.truc.danhGia} good={d.truc.danhGia === "Tốt"} />
        </p>
        <p>
          <span className="text-muted">Nên làm:</span> {d.truc.nen}
        </p>
        <p>
          <span className="text-muted">Kiêng cữ:</span> {d.truc.kieng}
        </p>
      </Section>

      <Section title="Hướng xuất hành">
        <p>
          Hướng <b>{d.huong.hyThan}</b> để đón Hỷ Thần, hướng <b>{d.huong.taiThan}</b> để đón Tài Thần.
        </p>
        <p>
          {d.huong.hacThan
            ? `Tránh hướng ${d.huong.hacThan} gặp Hạc Thần (xấu).`
            : "Hạc Thần đang ở trên trời, không cần kiêng hướng nào."}
        </p>
      </Section>

      <Section title="Giờ xuất hành theo Lý Thuần Phong">
        <ul className="flex flex-col gap-3">
          {d.gioXuatHanh.map((g) => (
            <li key={g.capGio}>
              <p>
                <b>{g.capGio}</b> · {g.name} <Rating label={g.danhGia} good={g.tot} />
              </p>
              <p className="text-muted">{g.moTa}</p>
            </li>
          ))}
        </ul>
      </Section>

      <p className="rounded-xl bg-background p-4 text-center text-sm text-muted">⚠ {content.canhBao}</p>
    </div>
  );
}
