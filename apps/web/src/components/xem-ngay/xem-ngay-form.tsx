"use client";

// Form nhập ngày sinh -> chuyển sang trang /xem-ngay-tot-xau?ngay=...&sinh=...
// Ngày sinh được nhớ trong trình duyệt (localStorage) để lần sau khỏi nhập lại.
import Form from "next/form";
import { useEffect, useRef } from "react";
import { toIso, type SolarDate } from "lich-core";

const STORAGE_KEY = "licham:ngaySinh";

export function XemNgayForm({ date, birth }: { date: SolarDate; birth?: SolarDate | null }) {
  const birthRef = useRef<HTMLInputElement>(null);

  // Điền lại ngày sinh đã lưu (chỉ chạy trên trình duyệt)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && birthRef.current && !birthRef.current.value) birthRef.current.value = saved;
    } catch {
      // Trình duyệt chặn localStorage: bỏ qua
    }
  }, []);

  const remember = () => {
    try {
      if (birthRef.current?.value) localStorage.setItem(STORAGE_KEY, birthRef.current.value);
    } catch {
      // bỏ qua
    }
  };

  return (
    <Form action="/xem-ngay-tot-xau" onSubmit={remember} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Ngày sinh của bạn (dương lịch)</span>
          <input
            ref={birthRef}
            type="date"
            name="sinh"
            required
            min="1900-01-01"
            max="2100-12-31"
            defaultValue={birth ? toIso(birth) : undefined}
            className="rounded-lg border border-line bg-background px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Ngày cần xem</span>
          <input
            type="date"
            name="ngay"
            required
            min="1900-01-01"
            max="2100-12-31"
            defaultValue={toIso(date)}
            className="rounded-lg border border-line bg-background px-3 py-2"
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-on-primary hover:opacity-90"
      >
        Xem ngày tốt xấu
      </button>
    </Form>
  );
}
