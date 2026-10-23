"use client";

// Ô nhập ngày luôn theo dạng dd/mm/yyyy (ô type="date" của trình duyệt đổi định dạng theo
// ngôn ngữ máy nên không dùng). Giá trị gửi đi qua form vẫn là "YYYY-MM-DD" (input ẩn cùng name).
import { useEffect, useRef } from "react";
import { toIso, type SolarDate } from "lich-core";
import { daysInMonth } from "@/lib/vn-date";

interface Props {
  /** Tên field gửi đi (dạng YYYY-MM-DD). Bỏ trống nếu không muốn gửi ngày này qua form. */
  name?: string;
  label: string;
  /** Gọi mỗi khi giá trị đổi: "YYYY-MM-DD" nếu hợp lệ, "" nếu chưa hợp lệ. */
  onValueChange?: (iso: string) => void;
  defaultValue?: SolarDate | null;
  required?: boolean;
  /** Nếu có: điền sẵn giá trị đã lưu trong localStorage (dạng YYYY-MM-DD) khi ô đang trống. */
  storageKey?: string;
  /** Kiểm tra riêng (ví dụ ngày âm lịch). Mặc định: ngày phải tồn tại trong lịch dương. */
  isValid?: (date: SolarDate) => boolean;
  /** Nội dung báo lỗi khi ngày không hợp lệ. */
  errorMessage?: string;
}

const isValidSolar = (d: SolarDate) => d.day <= daysInMonth(d.month, d.year);

const toDisplay = (d: SolarDate) =>
  `${String(d.day).padStart(2, "0")}/${String(d.month).padStart(2, "0")}/${d.year}`;

/** "dd/mm/yyyy" -> {day, month, year} (1900-2100, ngày 1-31), sai định dạng trả về null. */
function parseDisplay(value: string): SolarDate | null {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!m) return null;
  const [day, month, year] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { day, month, year };
}

/** Chỉ giữ chữ số rồi chèn dấu "/" sau ngày và tháng. */
function formatDigits(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);
  return parts.join("/");
}

export function DateInput({
  name,
  label,
  onValueChange,
  defaultValue,
  required,
  storageKey,
  isValid = isValidSolar,
  errorMessage = "Nhập ngày hợp lệ theo dạng dd/mm/yyyy",
}: Props) {
  const textRef = useRef<HTMLInputElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  // Đồng bộ ô hiển thị -> input ẩn, và báo lỗi cho trình duyệt nếu ngày sai
  const sync = () => {
    const text = textRef.current;
    if (!text) return;
    const parsed = parseDisplay(text.value);
    const date = parsed && isValid(parsed) ? parsed : null;
    const iso = date ? toIso(date) : "";
    if (hiddenRef.current) hiddenRef.current.value = iso;
    onValueChange?.(iso);
    text.setCustomValidity(date || (!required && text.value === "") ? "" : errorMessage);
  };

  useEffect(() => {
    if (!storageKey || !textRef.current || textRef.current.value) return;
    try {
      const saved = localStorage.getItem(storageKey); // dạng YYYY-MM-DD
      const m = saved && /^(\d{4})-(\d{2})-(\d{2})$/.exec(saved);
      if (m) {
        textRef.current.value = toDisplay({ day: Number(m[3]), month: Number(m[2]), year: Number(m[1]) });
        sync();
      }
    } catch {
      // Trình duyệt chặn localStorage: bỏ qua
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- chỉ chạy một lần khi mở trang
  }, []);

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium">{label}</span>
      <input
        ref={textRef}
        type="text"
        inputMode="numeric"
        placeholder="dd/mm/yyyy"
        autoComplete="off"
        maxLength={10}
        required={required}
        defaultValue={defaultValue ? toDisplay(defaultValue) : undefined}
        onInput={(e) => {
          e.currentTarget.value = formatDigits(e.currentTarget.value);
          sync();
        }}
        className="rounded-lg border border-line bg-background px-3 py-2 tabular-nums"
      />
      {name && <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue ? toIso(defaultValue) : ""} />}
    </label>
  );
}
