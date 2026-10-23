// Lưu lá số tử vi CHỈ trên trình duyệt (localStorage) khi người dùng bấm "Lưu".
// Không gửi lên máy chủ. Mọi thao tác bọc try/catch vì trình duyệt có thể chặn localStorage.
import { useMemo, useSyncExternalStore } from "react";
import type { GioiTinh } from "lich-core";

const KEY = "licham:laSoTuVi";
const CHANGE_EVENT = "licham:laSoTuVi-change";

export interface SavedLaSo {
  id: string;
  /** Tên gợi nhớ người dùng tự đặt (không bắt buộc). */
  label: string;
  /** Ngày sinh dạng YYYY-MM-DD, theo lịch dương hoặc âm (xem isLunar). */
  date: string;
  isLunar: boolean;
  isLeapMonth: boolean;
  hourChi: number;
  gioiTinh: GioiTinh;
}

/** Kiểm tra một mục đọc từ localStorage có đúng định dạng không (dữ liệu có thể bị sửa tay / định dạng cũ). */
function isValidSaved(x: unknown): x is SavedLaSo {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  const m = typeof o.date === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(o.date) : null;
  return (
    typeof o.id === "string" &&
    typeof o.label === "string" &&
    o.label.length <= 40 &&
    m !== null &&
    Number(m[1]) >= 1900 &&
    Number(m[1]) <= 2100 &&
    Number(m[2]) >= 1 &&
    Number(m[2]) <= 12 &&
    Number(m[3]) >= 1 &&
    Number(m[3]) <= 31 &&
    typeof o.isLunar === "boolean" &&
    typeof o.isLeapMonth === "boolean" &&
    Number.isInteger(o.hourChi) &&
    (o.hourChi as number) >= 0 &&
    (o.hourChi as number) <= 11 &&
    (o.gioiTinh === "nam" || o.gioiTinh === "nu")
  );
}

/** Đọc chuỗi JSON đã lưu, chỉ giữ các mục hợp lệ. */
function parseSaved(raw: string | null): SavedLaSo[] {
  try {
    const list: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter(isValidSaved) : [];
  } catch {
    return [];
  }
}

export function loadSaved(): SavedLaSo[] {
  try {
    return parseSaved(localStorage.getItem(KEY));
  } catch {
    return [];
  }
}

function write(list: SavedLaSo[]) {
  try {
    if (list.length) localStorage.setItem(KEY, JSON.stringify(list));
    else localStorage.removeItem(KEY);
  } catch {
    // bỏ qua: không lưu được thì thôi
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function readRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange); // đổi ở tab khác
  window.addEventListener(CHANGE_EVENT, onChange); // đổi ở tab này
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

/** Danh sách lá số đã lưu, tự cập nhật khi lưu/xóa (≈ một "store" nhỏ đọc từ localStorage). */
export function useSavedLaSo(): SavedLaSo[] {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  return useMemo(() => parseSaved(raw), [raw]);
}

export function saveLaSo(item: Omit<SavedLaSo, "id">): SavedLaSo[] {
  const list = [{ ...item, id: `${Date.now()}` }, ...loadSaved()].slice(0, 20);
  write(list);
  return list;
}

export function deleteLaSo(id: string): SavedLaSo[] {
  const list = loadSaved().filter((x) => x.id !== id);
  write(list);
  return list;
}

export function deleteAllLaSo(): SavedLaSo[] {
  write([]);
  return [];
}

/** Xuất phần tử <svg> thành ảnh PNG và tải về máy (xử lý hoàn toàn trên trình duyệt). */
export async function downloadSvgAsPng(svg: SVGSVGElement, fileName: string, width = 2000) {
  const xml = new XMLSerializer().serializeToString(svg);
  const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
  try {
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Không tạo được ảnh"));
      img.src = url;
    });
    const vb = svg.viewBox.baseVal;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = Math.round((width * vb.height) / vb.width);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Trình duyệt không hỗ trợ canvas");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = fileName;
    a.click();
  } finally {
    URL.revokeObjectURL(url);
  }
}
