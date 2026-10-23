"use client";

// Trang lập lá số: form -> tính lá số NGAY TRÊN TRÌNH DUYỆT -> bàn lá số + giải nghĩa.
// Lưu (localStorage) chỉ khi người dùng bấm "Lưu"; có nút xóa từng lá số và xóa tất cả.
import { useMemo, useRef, useState } from "react";
import { lapLaSoTuVi, lapLaSoTuViAmLich, type LaSoTuVi } from "lich-core";
import { deleteAllLaSo, deleteLaSo, downloadSvgAsPng, saveLaSo, useSavedLaSo, type SavedLaSo } from "@/lib/tu-vi-storage";
import { LaSoBoard } from "./la-so-board";
import { LaSoDetail } from "./la-so-detail";
import { LaSoForm, type LaSoFormValue } from "./la-so-form";

function build(v: LaSoFormValue): LaSoTuVi {
  const [year, month, day] = v.date.split("-").map(Number);
  return v.isLunar
    ? lapLaSoTuViAmLich({ lunar: { day, month, year, isLeap: v.isLeapMonth }, hourChi: v.hourChi, gioiTinh: v.gioiTinh })
    : lapLaSoTuVi({ day, month, year }, v.hourChi, v.gioiTinh);
}

const btn = "rounded-lg border border-line px-3 py-2 text-sm font-medium hover:bg-primary-soft hover:text-primary";

export function LaSoApp() {
  const [value, setValue] = useState<LaSoFormValue | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [savedMsg, setSavedMsg] = useState("");
  const saved = useSavedLaSo();
  const boardRef = useRef<SVGSVGElement>(null);

  const laSo = useMemo(() => (value ? build(value) : null), [value]);

  const show = (v: LaSoFormValue) => {
    setValue(v);
    setSelected(null); // mặc định chọn cung Mệnh
    setSavedMsg("");
  };

  const openSaved = (s: SavedLaSo) => show({ ...s });

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-6">
        <LaSoForm onSubmit={show} />
      </section>

      {laSo && value && (
        <>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
              <LaSoBoard ref={boardRef} laSo={laSo} selected={selected ?? laSo.menhChi} onSelect={setSelected} title={value.label} />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted">Bấm vào một cung trên lá số để xem giải nghĩa.</p>
              <LaSoDetail cung={laSo.cung[selected ?? laSo.menhChi]} />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className={btn}
              onClick={() => boardRef.current && downloadSvgAsPng(boardRef.current, "la-so-tu-vi.png")}
            >
              Tải ảnh lá số (PNG)
            </button>
            <button
              className={btn}
              onClick={() => {
                saveLaSo({ ...value });
                setSavedMsg("Đã lưu trên trình duyệt này.");
              }}
            >
              Lưu trên máy này
            </button>
            {savedMsg && <span className="text-sm text-muted">{savedMsg}</span>}
          </div>
        </>
      )}

      {saved.length > 0 && (
        <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-bold text-primary">Lá số đã lưu trên máy này</h2>
            <button className="text-xs text-muted underline hover:text-primary" onClick={deleteAllLaSo}>
              Xóa tất cả
            </button>
          </div>
          <ul className="flex flex-col gap-2 text-sm">
            {saved.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2 rounded-lg bg-background px-3 py-2">
                <button className="text-left hover:text-primary" onClick={() => openSaved(s)}>
                  <b>{s.label || "Lá số không tên"}</b>{" "}
                  <span className="text-muted">
                    · {s.date.split("-").reverse().join("/")} {s.isLunar ? "(âm lịch)" : ""} · {s.gioiTinh === "nam" ? "Nam" : "Nữ"}
                  </span>
                </button>
                <button className="text-xs text-muted underline hover:text-primary" onClick={() => deleteLaSo(s.id)}>
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
