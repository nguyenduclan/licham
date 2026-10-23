// Tiện ích hiển thị cho trang sim phong thủy (tính toán chính nằm ở lich-core).
import { BAT_QUAI, NGU_HANH, type Que } from "lich-core";
export type { KetQuaSim } from "lich-core";

/** "Cấn trên, Khảm dưới" */
export const batQuaiOf = (q: Que) => `${BAT_QUAI[q.thuong]} trên, ${BAT_QUAI[q.ha]} dưới`;

export const tenHanh = (hanh: number) => NGU_HANH[hanh];
