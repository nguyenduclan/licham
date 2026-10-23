"use client";

// Form nhập thông tin lập lá số. KHÔNG có action: dữ liệu chỉ chuyển cho component cha
// trên trình duyệt, không gửi lên máy chủ, không ghi lên URL.
import { useState, type FormEvent } from "react";
import { lunarToSolar, solarToLunar, type GioiTinh, type SolarDate } from "lich-core";
import { DateInput } from "@/components/date-input";
import { useHydrated } from "@/lib/use-hydrated";

export interface LaSoFormValue {
  date: string; // YYYY-MM-DD
  isLunar: boolean;
  isLeapMonth: boolean;
  hourChi: number;
  gioiTinh: GioiTinh;
  label: string;
}

const GIO = [
  "Tý (23h–1h)", "Sửu (1h–3h)", "Dần (3h–5h)", "Mão (5h–7h)", "Thìn (7h–9h)", "Tỵ (9h–11h)",
  "Ngọ (11h–13h)", "Mùi (13h–15h)", "Thân (15h–17h)", "Dậu (17h–19h)", "Tuất (19h–21h)", "Hợi (21h–23h)",
];

/** Ngày âm (không nhuận) có tồn tại không: đổi sang dương rồi đổi ngược phải ra đúng ngày đó. */
const lunarExists = (d: SolarDate, isLeap = false) => {
  const s = lunarToSolar({ ...d, isLeap });
  if (!s) return false;
  const back = solarToLunar(s);
  return back.day === d.day && back.month === d.month && back.year === d.year && back.isLeap === isLeap;
};

export function LaSoForm({ onSubmit }: { onSubmit: (v: LaSoFormValue) => void }) {
  const [isLunar, setIsLunar] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState("");
  const hydrated = useHydrated(); // khóa nút cho tới khi JS sẵn sàng (tránh trình duyệt tự gửi form)

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // không gửi form đi đâu cả
    const f = new FormData(e.currentTarget);
    const isLeapMonth = isLunar && f.get("nhuan") === "on";
    if (isLunar && isLeapMonth) {
      const [year, month, day] = date.split("-").map(Number);
      if (!lunarExists({ day, month, year }, true)) {
        setError(`Năm ${year} không có tháng ${month} nhuận (hoặc tháng nhuận không có ngày ${day}).`);
        return;
      }
    }
    setError("");
    onSubmit({
      date,
      isLunar,
      isLeapMonth,
      hourChi: Number(f.get("gio")),
      gioiTinh: f.get("gioiTinh") === "nu" ? "nu" : "nam",
      label: String(f.get("label") ?? "").trim().slice(0, 40),
    });
  };

  const field = "rounded-lg border border-line bg-background px-3 py-2";
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <fieldset className="flex flex-wrap gap-4 text-sm">
        <legend className="mb-1 font-medium">Giới tính</legend>
        <label className="flex items-center gap-1.5"><input type="radio" name="gioiTinh" value="nam" defaultChecked /> Nam</label>
        <label className="flex items-center gap-1.5"><input type="radio" name="gioiTinh" value="nu" /> Nữ</label>
      </fieldset>

      <fieldset className="flex flex-wrap gap-4 text-sm">
        <legend className="mb-1 font-medium">Ngày sinh theo</legend>
        <label className="flex items-center gap-1.5">
          <input type="radio" checked={!isLunar} onChange={() => setIsLunar(false)} /> Dương lịch
        </label>
        <label className="flex items-center gap-1.5">
          <input type="radio" checked={isLunar} onChange={() => setIsLunar(true)} /> Âm lịch
        </label>
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <DateInput
          key={isLunar ? "am" : "duong"}
          label={isLunar ? "Ngày sinh (âm lịch)" : "Ngày sinh"}
          required
          onValueChange={setDate}
          isValid={isLunar ? (d) => lunarExists(d) || lunarExists(d, true) : undefined}
          errorMessage={isLunar ? "Ngày âm lịch không tồn tại (tháng âm chỉ có 29 hoặc 30 ngày)" : undefined}
        />
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Giờ sinh</span>
          <select name="gio" defaultValue="6" className={field}>
            {GIO.map((g, i) => <option key={g} value={i}>{g}</option>)}
          </select>
        </label>
      </div>
      {isLunar && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="nhuan" /> Sinh vào tháng nhuận
        </label>
      )}
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Tên gợi nhớ (không bắt buộc, chỉ hiện trên lá số)</span>
        <input name="label" maxLength={40} autoComplete="off" className={field} placeholder="Ví dụ: Lá số của tôi" />
      </label>
      {error && <p className="text-sm text-primary">{error}</p>}
      <button
        type="submit"
        disabled={!hydrated}
        className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-on-primary hover:opacity-90 disabled:opacity-50"
      >
        Lập lá số
      </button>
    </form>
  );
}
