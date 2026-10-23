// =============================================================================
// sim.ts: chấm điểm số điện thoại theo phong thủy và gợi ý số hợp mệnh.
// Logic giống hệt packages/lich_core/lib/src/sim.dart.
//
// Thang 10 điểm: ngũ hành hợp mệnh 3 + âm dương 2 + tổng nút 2 + quẻ Kinh Dịch 2
// + bộ số (có bộ đẹp +1, mỗi bộ xấu -1), kẹp trong 0..10.
// Ngũ hành của chữ số theo cách phổ biến ở VN: 0,1 Thủy; 2,5,8 Thổ; 3,4 Mộc; 6,7 Kim; 9 Hỏa.
// =============================================================================

import { DIA_CHI, THIEN_CAN } from './can-chi';
import { napAm, napAmHanh, napAmIndex } from './hoang-dao';
import { lapQueTuDaySo, type QueSo } from './kinh-dich';

/** Ngũ hành (chỉ số theo NGU_HANH: Kim 0, Thủy 1, Mộc 2, Hỏa 3, Thổ 4) của chữ số 0..9. */
export const HANH_CHU_SO = [1, 1, 4, 2, 2, 4, 0, 0, 4, 3];

export type BoSoDep =
  | 'locPhat' | 'thanTai' | 'ongDia' | 'phatPhat' | 'locLoc' | 'truongCuu'
  | 'tuQuy' | 'tamHoa' | 'sanhTien' | 'taxi' | 'lapKep' | 'docNhat' | 'namSinh';
export type BoSoXau = 'bonChin' | 'namBa' | 'duoiTu';
export type SimVerdict = 'ratTot' | 'tot' | 'kha' | 'trungBinh' | 'xau';

/** Chuẩn hóa số điện thoại Việt Nam: bỏ dấu cách/chấm/gạch, đổi +84/84 thành 0. Sai trả về null. */
export function chuanHoaSoDienThoai(input: string): string | null {
  let s = input.replace(/[\s.\-()]/g, '');
  if (s.startsWith('+84')) s = '0' + s.slice(3);
  else if (/^84\d{9}$/.test(s)) s = '0' + s.slice(2);
  return /^0\d{9}$/.test(s) ? s : null;
}

/** Mệnh (nạp âm) và hành của người sinh năm âm lịch `lunarYear`. */
export function menhTheoNam(lunarYear: number): { canChi: string; napAm: string; hanh: number } {
  const can = (lunarYear + 6) % 10;
  const chi = (lunarYear + 8) % 12;
  return { canChi: `${THIEN_CAN[can]} ${DIA_CHI[chi]}`, napAm: napAm(can, chi), hanh: napAmHanh(napAmIndex(can, chi)) };
}

/** Chữ số hợp mệnh (cùng hành hoặc sinh ra mệnh) và chữ số nên hạn chế (khắc mệnh). */
export function chuSoTheoMenh(hanh: number): { hop: number[]; khac: number[] } {
  const hop: number[] = [];
  const khac: number[] = [];
  HANH_CHU_SO.forEach((h, digit) => {
    if (h === hanh || (h + 1) % 5 === hanh) hop.push(digit);
    else if ((h + 2) % 5 === hanh) khac.push(digit);
  });
  return { hop, khac };
}

/** Tìm các bộ số đẹp / xấu trong 6 số cuối (riêng tứ quý, sảnh, năm sinh... xét ở đuôi). */
export function timBoSo(digits: string): { dep: BoSoDep[]; xau: BoSoXau[] } {
  const tail = digits.slice(-6);
  const end = (n: number) => digits.slice(-n);
  const same = (s: string) => [...s].every((c) => c === s[0]);
  const dep: BoSoDep[] = [];
  if (tail.includes('68') || tail.includes('86')) dep.push('locPhat');
  if (tail.includes('39') || tail.includes('79')) dep.push('thanTai');
  if (tail.includes('38') || tail.includes('78')) dep.push('ongDia');
  if (tail.includes('88')) dep.push('phatPhat');
  if (tail.includes('66')) dep.push('locLoc');
  if (tail.includes('99')) dep.push('truongCuu');
  if (same(end(4))) dep.push('tuQuy');
  else if (same(end(3))) dep.push('tamHoa');
  const e3 = [...end(3)].map(Number);
  if (e3[1] === e3[0] + 1 && e3[2] === e3[1] + 1) dep.push('sanhTien');
  const e4 = end(4);
  const e6 = end(6);
  if ((e4[0] === e4[2] && e4[1] === e4[3] && e4[0] !== e4[1]) || (e6.slice(0, 3) === e6.slice(3) && !same(e6))) dep.push('taxi');
  if (e4[0] === e4[1] && e4[2] === e4[3] && e4[0] !== e4[2]) dep.push('lapKep');
  if (e4 === '1102') dep.push('docNhat');
  const year = Number(e4);
  if (year >= 1950 && year <= 2030) dep.push('namSinh');

  const xau: BoSoXau[] = [];
  if (tail.includes('49')) xau.push('bonChin');
  if (tail.includes('53')) xau.push('namBa');
  if (digits.endsWith('4')) xau.push('duoiTu');
  return { dep, xau };
}

const half = (x: number) => Math.round(x * 2) / 2;
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

export interface KetQuaSim {
  digits: string;
  menh: ReturnType<typeof menhTheoNam>;
  nguHanh: { score: number; hop: number; khac: number };
  amDuong: { score: number; chan: number; le: number };
  tongNut: { score: number; nut: number };
  que: QueSo & { score: number };
  boSo: { score: number; dep: BoSoDep[]; xau: BoSoXau[] };
  total: number;
  verdict: SimVerdict;
}

/** Chấm điểm số `digits` (đã chuẩn hóa) cho người sinh năm âm lịch `lunarYear`. */
export function chamDiemSim(digits: string, lunarYear: number): KetQuaSim {
  const nums = [...digits].map(Number);
  const menh = menhTheoNam(lunarYear);
  const { hop, khac } = chuSoTheoMenh(menh.hanh);
  const soHop = nums.filter((d) => hop.includes(d)).length;
  const soKhac = nums.filter((d) => khac.includes(d)).length;
  const nguHanh = { score: half(clamp((3 * (soHop - soKhac)) / nums.length, 0, 3)), hop: soHop, khac: soKhac };

  const chan = nums.filter((d) => d % 2 === 0).length;
  const le = nums.length - chan;
  const lech = Math.abs(chan - le);
  const amDuong = { score: lech <= 2 ? 2 : lech <= 4 ? 1 : 0, chan, le };

  const nut = nums.reduce((s, d) => s + d, 0) % 10 || 10;
  const tongNut = { score: nut >= 9 ? 2 : nut >= 7 ? 1 : 0, nut };

  const queSo = lapQueTuDaySo(digits);
  const que = { ...queSo, score: queSo.chu.rating === 'tot' ? 2 : queSo.chu.rating === 'binh' ? 1 : 0 };

  const bo = timBoSo(digits);
  const boSo = { score: (bo.dep.length > 0 ? 1 : 0) - bo.xau.length, ...bo };

  const total = clamp(nguHanh.score + amDuong.score + tongNut.score + que.score + boSo.score, 0, 10);
  const verdict: SimVerdict = total >= 8 ? 'ratTot' : total >= 6.5 ? 'tot' : total >= 5 ? 'kha' : total >= 3.5 ? 'trungBinh' : 'xau';
  return { digits, menh, nguHanh, amDuong, tongNut, que, boSo, total, verdict };
}

/** Các đuôi số đẹp phổ biến, dùng để lọc gợi ý theo mệnh. */
const DUOI_DEP = [
  '68', '86', '88', '66', '99', '39', '79', '38', '78', '6868', '8686', '6688', '8866', '8668', '6886',
  '3939', '7979', '3838', '7878', '1368', '5678', '6789', '2468', '1102', '2828', '5858', '8888', '6666',
  '9999', '5555', '7777', '3333', '1111', '0000', '2222', '4444', '3456', '1234', '2345', '0123',
];

/** Gợi ý đuôi số mà MỌI chữ số đều hợp mệnh (cùng hành hoặc sinh mệnh). Tối đa `limit` đuôi. */
export function goiYDuoiSo(lunarYear: number, limit = 12): string[] {
  const { hop } = chuSoTheoMenh(menhTheoNam(lunarYear).hanh);
  return DUOI_DEP.filter((s) => [...s].every((c) => hop.includes(Number(c)))).slice(0, limit);
}
