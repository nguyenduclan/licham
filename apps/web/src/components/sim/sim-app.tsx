"use client";

// Form sim phong thủy: số điện thoại (không bắt buộc) + ngày sinh -> chấm điểm và gợi ý.
// QUYỀN RIÊNG TƯ: form không có action, mọi tính toán chạy trên trình duyệt; số điện thoại
// không gửi đi, không ghi lên URL, không lưu. Ngày sinh dùng chung ô đã lưu với trang xem ngày.
import { useRef, useState, type FormEvent } from "react";
import { chamDiemSim, chuanHoaSoDienThoai, solarToLunar, type KetQuaSim } from "lich-core";
import { DateInput } from "@/components/date-input";
import { useHydrated } from "@/lib/use-hydrated";
import { SimGoiY } from "./sim-goi-y";
import { SimResult } from "./sim-result";

const BIRTH_KEY = "licham:ngaySinh";

export function SimApp() {
  const [birthIso, setBirthIso] = useState("");
  const [result, setResult] = useState<{ lunarYear: number; sim: KetQuaSim | null } | null>(null);
  const [error, setError] = useState("");
  const phoneRef = useRef<HTMLInputElement>(null);
  const hydrated = useHydrated();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // không gửi form đi đâu cả
    const phone = (phoneRef.current?.value ?? "").trim();
    const digits = phone ? chuanHoaSoDienThoai(phone) : null;
    if (phone && !digits) {
      setError("Số điện thoại chưa đúng: cần 10 chữ số, bắt đầu bằng 0 (hoặc +84).");
      return;
    }
    const [year, month, day] = birthIso.split("-").map(Number);
    const lunarYear = solarToLunar({ day, month, year }).year;
    setError("");
    setResult({ lunarYear, sim: digits ? chamDiemSim(digits, lunarYear) : null });
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Số điện thoại (không bắt buộc)</span>
              {/* Cố ý KHÔNG đặt name: số điện thoại không bao giờ đi theo form ra ngoài */}
              <input
                ref={phoneRef}
                type="tel"
                inputMode="tel"
                autoComplete="off"
                maxLength={16}
                placeholder="Ví dụ: 0912 345 678"
                className="rounded-lg border border-line bg-background px-3 py-2 tabular-nums"
              />
            </label>
            <DateInput label="Ngày sinh của bạn" required onValueChange={setBirthIso} storageKey={BIRTH_KEY} />
          </div>
          {error && <p className="text-sm text-primary">{error}</p>}
          <button
            type="submit"
            disabled={!hydrated}
            className="rounded-lg bg-primary px-4 py-2.5 font-semibold text-on-primary hover:opacity-90 disabled:opacity-50"
          >
            Xem sim phong thủy
          </button>
          <p className="text-xs text-muted">Bỏ trống số điện thoại nếu chỉ muốn xem gợi ý số hợp tuổi.</p>
        </form>
      </section>

      {result && (
        <div className="grid gap-6 lg:grid-cols-2">
          {result.sim && <SimResult r={result.sim} />}
          <SimGoiY lunarYear={result.lunarYear} />
        </div>
      )}
    </div>
  );
}
