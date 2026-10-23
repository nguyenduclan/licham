// =============================================================================
// gen-sim-cases.ts: sinh shared/sim_cases.json từ bản TypeScript, để kiểm tra bản Dart
// chấm điểm sim GIỐNG HỆT. Tính đúng được kiểm bằng các mốc tính tay trong test.
// Chạy (từ thư mục gốc repo): npm run gen:sim -w lich-core
// =============================================================================

import { writeFileSync } from 'node:fs';
import { chamDiemSim, goiYDuoiSo } from '../src';

// Số điện thoại mẫu (giả, chỉ để test): đủ các kiểu đuôi đẹp/xấu và đầu số các nhà mạng
const numbers = [
  '0912345678', '0988886868', '0903396879', '0868123456', '0377777777', '0789393939', '0912121212',
  '0933445566', '0901101102', '0981991994', '0904934953', '0975123454', '0353535353', '0866666688',
  '0987654321', '0700000000', '0399799979', '0839383838', '0562468246', '0918899999', '0123456789',
  '0945678910', '0369258147', '0902468024', '0889135791', '0777888999', '0948494949', '0853531313',
];
const years = [1960, 1974, 1985, 1992, 2000, 2010];

const cases = numbers.flatMap((digits, i) => {
  const lunarYear = years[i % years.length];
  const r = chamDiemSim(digits, lunarYear);
  return [{
    digits, lunarYear,
    menh: r.menh, nguHanh: r.nguHanh, amDuong: r.amDuong, tongNut: r.tongNut,
    que: { chu: r.que.chu.so, bien: r.que.bien.so, haoDong: r.que.haoDong, ten: r.que.chu.ten, score: r.que.score },
    boSo: r.boSo, total: r.total, verdict: r.verdict,
  }];
});

const goiY = years.map((lunarYear) => ({ lunarYear, duoi: goiYDuoiSo(lunarYear) }));

writeFileSync(
  new URL('../../../shared/sim_cases.json', import.meta.url),
  `{\n  "description": "Kết quả chấm điểm sim để kiểm tra bản Dart khớp bản TS. Sinh bởi packages/lich-core/scripts/gen-sim-cases.ts - KHÔNG sửa tay.",\n  "cases": [\n${cases
    .map((c) => '    ' + JSON.stringify(c))
    .join(',\n')}\n  ],\n  "goiY": [\n${goiY.map((g) => '    ' + JSON.stringify(g)).join(',\n')}\n  ]\n}\n`,
);
console.log(`Đã ghi ${cases.length} ca chấm điểm, ${goiY.length} ca gợi ý -> shared/sim_cases.json`);
