// =============================================================================
// kinh-dich.ts: bát quái, 64 quẻ Kinh Dịch, lập quẻ từ một dãy số (dùng cho sim).
// Logic giống hệt packages/lich_core/lib/src/kinh_dich.dart.
//
// Quẻ đơn đánh số theo Tiên Thiên: 1 Càn, 2 Đoài, 3 Ly, 4 Chấn, 5 Tốn, 6 Khảm, 7 Cấn, 8 Khôn.
// Hào tính từ dưới lên (hào 1 ở dưới cùng). 1 = hào dương (liền), 0 = hào âm (đứt).
// =============================================================================

export const BAT_QUAI = ['', 'Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn', 'Khôn'] as const;
/** Tượng của quẻ đơn, dùng ghép tên quẻ kép (ví dụ Khảm trên + Chấn dưới = "Thủy Lôi"). */
export const TUONG_QUAI = ['', 'Thiên', 'Trạch', 'Hỏa', 'Lôi', 'Phong', 'Thủy', 'Sơn', 'Địa'] as const;
/** 3 hào [dưới, giữa, trên] của từng quẻ đơn. */
const HAO: number[][] = [[], [1, 1, 1], [1, 1, 0], [1, 0, 1], [1, 0, 0], [0, 1, 1], [0, 1, 0], [0, 0, 1], [0, 0, 0]];

export type QueRating = 'tot' | 'binh' | 'xau';

/** [số thứ tự Văn Vương, quẻ thượng, quẻ hạ, tên ngắn, đánh giá] cho 64 quẻ. */
const QUE_64: [number, number, number, string, QueRating][] = [
  [1, 1, 1, 'Càn', 'tot'], [2, 8, 8, 'Khôn', 'tot'], [3, 6, 4, 'Truân', 'xau'], [4, 7, 6, 'Mông', 'binh'],
  [5, 6, 1, 'Nhu', 'tot'], [6, 1, 6, 'Tụng', 'xau'], [7, 8, 6, 'Sư', 'tot'], [8, 6, 8, 'Tỷ', 'tot'],
  [9, 5, 1, 'Tiểu Súc', 'tot'], [10, 1, 2, 'Lý', 'tot'], [11, 8, 1, 'Thái', 'tot'], [12, 1, 8, 'Bĩ', 'xau'],
  [13, 1, 3, 'Đồng Nhân', 'tot'], [14, 3, 1, 'Đại Hữu', 'tot'], [15, 8, 7, 'Khiêm', 'tot'], [16, 4, 8, 'Dự', 'tot'],
  [17, 2, 4, 'Tùy', 'tot'], [18, 7, 5, 'Cổ', 'xau'], [19, 8, 2, 'Lâm', 'tot'], [20, 5, 8, 'Quan', 'binh'],
  [21, 3, 4, 'Phệ Hạp', 'binh'], [22, 7, 3, 'Bí', 'tot'], [23, 7, 8, 'Bác', 'xau'], [24, 8, 4, 'Phục', 'tot'],
  [25, 1, 4, 'Vô Vọng', 'binh'], [26, 7, 1, 'Đại Súc', 'tot'], [27, 7, 4, 'Di', 'binh'], [28, 2, 5, 'Đại Quá', 'xau'],
  [29, 6, 6, 'Khảm', 'xau'], [30, 3, 3, 'Ly', 'binh'], [31, 2, 7, 'Hàm', 'tot'], [32, 4, 5, 'Hằng', 'tot'],
  [33, 1, 7, 'Độn', 'binh'], [34, 4, 1, 'Đại Tráng', 'tot'], [35, 3, 8, 'Tấn', 'tot'], [36, 8, 3, 'Minh Di', 'xau'],
  [37, 5, 3, 'Gia Nhân', 'tot'], [38, 3, 2, 'Khuê', 'xau'], [39, 6, 7, 'Kiển', 'xau'], [40, 4, 6, 'Giải', 'tot'],
  [41, 7, 2, 'Tổn', 'binh'], [42, 5, 4, 'Ích', 'tot'], [43, 2, 1, 'Quải', 'binh'], [44, 1, 5, 'Cấu', 'xau'],
  [45, 2, 8, 'Tụy', 'tot'], [46, 8, 5, 'Thăng', 'tot'], [47, 2, 6, 'Khốn', 'xau'], [48, 6, 5, 'Tỉnh', 'tot'],
  [49, 2, 3, 'Cách', 'tot'], [50, 3, 5, 'Đỉnh', 'tot'], [51, 4, 4, 'Chấn', 'binh'], [52, 7, 7, 'Cấn', 'binh'],
  [53, 5, 7, 'Tiệm', 'tot'], [54, 4, 2, 'Quy Muội', 'xau'], [55, 4, 3, 'Phong', 'tot'], [56, 3, 7, 'Lữ', 'xau'],
  [57, 5, 5, 'Tốn', 'binh'], [58, 2, 2, 'Đoài', 'tot'], [59, 5, 6, 'Hoán', 'tot'], [60, 6, 2, 'Tiết', 'tot'],
  [61, 5, 2, 'Trung Phu', 'tot'], [62, 4, 7, 'Tiểu Quá', 'xau'], [63, 6, 3, 'Ký Tế', 'tot'], [64, 3, 6, 'Vị Tế', 'binh'],
];

export interface Que {
  /** Số thứ tự 1..64 theo Văn Vương (dùng tra giải nghĩa trong shared/data/sim.json). */
  so: number;
  thuong: number;
  ha: number;
  /** Tên đầy đủ, ví dụ "Sơn Thủy Mông", "Thuần Càn". */
  ten: string;
  rating: QueRating;
}

/** Tra quẻ kép theo quẻ thượng và quẻ hạ (1..8). */
export function queTheoQuai(thuong: number, ha: number): Que {
  const row = QUE_64.find((q) => q[1] === thuong && q[2] === ha)!;
  const [so, , , ngan, rating] = row;
  const ten = thuong === ha ? `Thuần ${ngan}` : `${TUONG_QUAI[thuong]} ${TUONG_QUAI[ha]} ${ngan}`;
  return { so, thuong, ha, ten, rating };
}

/** Quẻ đơn có 3 hào cho trước. */
function quaiTheoHao(hao: number[]): number {
  return HAO.findIndex((h, i) => i > 0 && h[0] === hao[0] && h[1] === hao[1] && h[2] === hao[2]);
}

/** Quẻ biến: đảo hào động (1..6, đếm từ dưới lên). */
export function queBien(que: Que, haoDong: number): Que {
  const hao = [...HAO[que.ha], ...HAO[que.thuong]];
  hao[haoDong - 1] = 1 - hao[haoDong - 1];
  return queTheoQuai(quaiTheoHao(hao.slice(3)), quaiTheoHao(hao.slice(0, 3)));
}

export interface QueSo {
  chu: Que;
  bien: Que;
  haoDong: number;
}

/**
 * Lập quẻ từ dãy chữ số (số điện thoại): tổng nửa đầu chia 8 lấy dư -> quẻ thượng,
 * tổng nửa sau chia 8 lấy dư -> quẻ hạ (dư 0 tính là 8, tức Khôn), tổng cả dãy chia 6
 * lấy dư -> hào động (dư 0 tính là 6). Dãy lẻ: nửa đầu ít hơn 1 số.
 */
export function lapQueTuDaySo(digits: string): QueSo {
  const nums = [...digits].map(Number);
  const mid = Math.floor(nums.length / 2);
  const sum = (a: number[]) => a.reduce((s, n) => s + n, 0);
  const thuong = sum(nums.slice(0, mid)) % 8 || 8;
  const ha = sum(nums.slice(mid)) % 8 || 8;
  const haoDong = sum(nums) % 6 || 6;
  const chu = queTheoQuai(thuong, ha);
  return { chu, bien: queBien(chu, haoDong), haoDong };
}
