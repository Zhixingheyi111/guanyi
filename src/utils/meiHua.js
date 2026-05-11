// 梅花易数算法
//
// 邵雍《梅花易数》先天八卦数：
//   1 乾 ☰   2 兑 ☱   3 离 ☲   4 震 ☳
//   5 巽 ☴   6 坎 ☵   7 艮 ☶   8 坤 ☷
//
// 二进制约定：和 hexagrams.js 一致，index 0 = 初爻（最下），共 6 位
//   - 下卦 = 二进制前 3 位（自下而上）
//   - 上卦 = 二进制后 3 位（自下而上）
//
// 数字起卦：
//   上卦 = num1 mod 8 （0 取 8）
//   下卦 = num2 mod 8
//   动爻 = (num1 + num2) mod 6 （0 取 6），1-6 表示初爻到上爻
//
// 时间起卦（采用公历，避免引入农历库；与传统农历起卦在 mod 8 之后差距有限）：
//   年支 = (year - 4) mod 12 + 1，4 AD = 子年=1
//   月 = 公历月 1-12
//   日 = 公历日 1-31
//   时支 = 子时(23:00-01:00)=1, 丑时=2, ..., 亥时=12
//   上卦 = (年支 + 月 + 日) mod 8
//   下卦 = (年支 + 月 + 日 + 时支) mod 8
//   动爻 = (年支 + 月 + 日 + 时支) mod 6

const BAGUA_BINARY = {
  1: '111', // 乾
  2: '110', // 兑（上爻为阴）
  3: '101', // 离
  4: '100', // 震
  5: '011', // 巽
  6: '010', // 坎
  7: '001', // 艮
  8: '000', // 坤
};

const BAGUA_NAMES = {
  1: '乾', 2: '兑', 3: '离', 4: '震',
  5: '巽', 6: '坎', 7: '艮', 8: '坤',
};

const BAGUA_SYMBOLS = {
  1: '☰', 2: '☱', 3: '☲', 4: '☳',
  5: '☴', 6: '☵', 7: '☶', 8: '☷',
};

const POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

// n mod max，但 0 取 max（梅花易数的传统约定）
function modOrMax(n, max) {
  const r = ((n % max) + max) % max;
  return r === 0 ? max : r;
}

// 翻转二进制字符串某一位（0-indexed）
function flipBit(binary, index) {
  return binary.slice(0, index) + (binary[index] === '1' ? '0' : '1') + binary.slice(index + 1);
}

function buildResult(method, inputs, upperNum, lowerNum, changingPos1Based) {
  const binary = BAGUA_BINARY[lowerNum] + BAGUA_BINARY[upperNum];
  const changingIndex = changingPos1Based - 1;
  const variantBinary = flipBit(binary, changingIndex);

  return {
    method,
    inputs,
    upperBagua: {
      num: upperNum,
      name: BAGUA_NAMES[upperNum],
      symbol: BAGUA_SYMBOLS[upperNum],
    },
    lowerBagua: {
      num: lowerNum,
      name: BAGUA_NAMES[lowerNum],
      symbol: BAGUA_SYMBOLS[lowerNum],
    },
    binary,
    variantBinary,
    changingPositions: [changingIndex],     // 0-indexed，与现有 divination.js 约定一致
    changingPositionName: POSITION_NAMES[changingIndex],
  };
}

export function generateByNumbers(num1, num2) {
  const a = Math.floor(Math.abs(Number(num1)));
  const b = Math.floor(Math.abs(Number(num2)));
  if (!Number.isFinite(a) || !Number.isFinite(b) || a < 1 || b < 1) {
    throw new Error('请输入两个正整数');
  }
  const upperNum = modOrMax(a, 8);
  const lowerNum = modOrMax(b, 8);
  const changing = modOrMax(a + b, 6);
  return buildResult('meihua-numbers', { num1: a, num2: b }, upperNum, lowerNum, changing);
}

export function generateByTime(date = new Date()) {
  const year  = date.getFullYear();
  const month = date.getMonth() + 1;
  const day   = date.getDate();
  const hour  = date.getHours();

  // 年支：4 AD 为子年
  const yearBranch = ((year - 4) % 12 + 12) % 12 + 1;
  // 时支：23:00-01:00 子=1；公式从小时映射
  const hourBranch = Math.floor(((hour + 1) % 24) / 2) + 1;

  const upperSum = yearBranch + month + day;
  const lowerSum = yearBranch + month + day + hourBranch;

  const upperNum = modOrMax(upperSum, 8);
  const lowerNum = modOrMax(lowerSum, 8);
  const changing = modOrMax(lowerSum, 6);

  return buildResult(
    'meihua-time',
    { year, month, day, hour, yearBranch, hourBranch },
    upperNum,
    lowerNum,
    changing,
  );
}
