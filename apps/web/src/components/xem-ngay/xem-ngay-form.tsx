"use client";

// Form nhập ngày sinh -> chuyển sang trang /xem-ngay-tot-xau?ngay=YYYY-MM-DD&nam=YYYY
// Quyền riêng tư: ngày sinh đầy đủ KHÔNG gửi lên URL, chỉ gửi năm sinh âm lịch (đủ để xét tuổi).
// Ngày sinh được nhớ trong trình duyệt (localStorage) để lần sau khỏi nhập lại; có nút xóa.
import Form from "next/form";
import { useRef, useState } from "react";
import { solarToLunar, type SolarDate } from "lich-core";
import { DateInput } from "@/components/date-input";

const STORAGE_KEY = "licham:ngaySinh";

export function XemNgayForm({ date }: { date: SolarDate }) {
  const namRef = useRef<HTMLInputElement>(null);
  const birthIso = useRef("");
  // Tăng key để tạo lại ô ngày sinh (làm trống) sau khi xóa dữ liệu đã lưu
  const [birthKey, setBirthKey] = useState(0);

  // Ngày sinh hợp lệ -> tính năm âm lịch (người sinh trước Tết thuộc năm âm trước)
  const onBirthChange = (iso: string) => {
    birthIso.current = iso;
    if (!namRef.current) return;
    const [year, month, day] = iso.split("-").map(Number);
    namRef.current.value = iso ? String(solarToLunar({ day, month, year }).year) : "";
  };

  const remember = () => {
    try {
      if (birthIso.current) localStorage.setItem(STORAGE_KEY, birthIso.current);
    } catch {
      // Trình duyệt chặn localStorage: bỏ qua
    }
  };

  const forget = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // bỏ qua
    }
    onBirthChange("");
    setBirthKey((k) => k + 1);
  };

  return (
    <Form action="/xem-ngay-tot-xau" onSubmit={remember} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <DateInput
          key={birthKey}
          label="Ngày sinh của bạn"
          onValueChange={onBirthChange}
          required
          storageKey={STORAGE_KEY}
        />
        <DateInput name="ngay" label="Ngày cần xem" defaultValue={date} required />
      </div>
      <input ref={namRef} type="hidden" name="nam" />
      <button
        type="submit"
        className="mt-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-on-primary hover:opacity-90"
      >
        Xem ngày tốt xấu
      </button>
      <button type="button" onClick={forget} className="self-center text-xs text-muted underline hover:text-primary">
        Xóa ngày sinh đã lưu trên trình duyệt này
      </button>
    </Form>
  );
}
