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

// 先天八卦对应五行（梅花易数体用论的基础）
//   乾、兑：金  ｜  震、巽：木  ｜  坎：水  ｜  离：火  ｜  坤、艮：土
const BAGUA_ELEMENT = {
  1: 'metal', 2: 'metal',  // 乾 兑
  3: 'fire',                // 离
  4: 'wood',  5: 'wood',   // 震 巽
  6: 'water',               // 坎
  7: 'earth', 8: 'earth',  // 艮 坤
};

const ELEMENT_NAMES = {
  metal: '金', wood: '木', water: '水', fire: '火', earth: '土',
};

const POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

// 五行生克关系
//   生：木→火→土→金→水→木
//   克：木→土→水→火→金→木
const GENERATES = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood',
};
const OVERCOMES = {
  wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood',
};

/**
 * 判定体用关系
 *
 * 梅花易数核心：动爻所在卦为"用"（所问之事），不动卦为"体"（问卦者自己）。
 * 体用之间的五行生克决定吉凶倾向。
 *
 * @param {number} upperNum - 上卦先天数 1-8
 * @param {number} lowerNum - 下卦先天数 1-8
 * @param {number} changingIndex - 动爻 0-indexed（0=初爻在下卦最下）
 * @returns {{
 *   tiPosition: 'upper'|'lower',
 *   yongPosition: 'upper'|'lower',
 *   tiBagua: {num, name, symbol, element, elementName},
 *   yongBagua: {num, name, symbol, element, elementName},
 *   relation: 'tiSheng-yong'|'yongSheng-ti'|'tiKe-yong'|'yongKe-ti'|'bihe',
 *   relationLabel: '体生用'|'用生体'|'体克用'|'用克体'|'比和',
 *   nature: '耗'|'得'|'胜'|'难'|'稳',
 *   meaning: string,  // 一句白话解释
 * }}
 */
export function analyzeTiyong(upperNum, lowerNum, changingIndex) {
  // 动爻在下卦（0-2）还是上卦（3-5）
  const yongPosition = changingIndex < 3 ? 'lower' : 'upper';
  const tiPosition   = yongPosition === 'lower' ? 'upper' : 'lower';

  const yongNum = yongPosition === 'lower' ? lowerNum : upperNum;
  const tiNum   = tiPosition === 'lower' ? lowerNum : upperNum;

  const yongElement = BAGUA_ELEMENT[yongNum];
  const tiElement   = BAGUA_ELEMENT[tiNum];

  // 判定关系
  let relation, relationLabel, nature, meaning;
  if (tiElement === yongElement) {
    relation = 'bihe';
    relationLabel = '比和';
    nature = '稳';
    meaning = '体用同行，气类相近，主稳定持守';
  } else if (GENERATES[tiElement] === yongElement) {
    relation = 'tiSheng-yong';
    relationLabel = '体生用';
    nature = '耗';
    meaning = '我助事而泄气，主耗损、付出多于回报';
  } else if (GENERATES[yongElement] === tiElement) {
    relation = 'yongSheng-ti';
    relationLabel = '用生体';
    nature = '得';
    meaning = '事助我而得益，主获利、外来助力';
  } else if (OVERCOMES[tiElement] === yongElement) {
    relation = 'tiKe-yong';
    relationLabel = '体克用';
    nature = '胜';
    meaning = '我能克制事，主能控、可成但需用力';
  } else {
    relation = 'yongKe-ti';
    relationLabel = '用克体';
    nature = '难';
    meaning = '事克我而受困，主阻滞、外力压身';
  }

  return {
    tiPosition,
    yongPosition,
    tiBagua: {
      num: tiNum,
      name: BAGUA_NAMES[tiNum],
      symbol: BAGUA_SYMBOLS[tiNum],
      element: tiElement,
      elementName: ELEMENT_NAMES[tiElement],
    },
    yongBagua: {
      num: yongNum,
      name: BAGUA_NAMES[yongNum],
      symbol: BAGUA_SYMBOLS[yongNum],
      element: yongElement,
      elementName: ELEMENT_NAMES[yongElement],
    },
    relation,
    relationLabel,
    nature,
    meaning,
  };
}

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
  const tiyong = analyzeTiyong(upperNum, lowerNum, changingIndex);

  return {
    method,
    inputs,
    upperBagua: {
      num: upperNum,
      name: BAGUA_NAMES[upperNum],
      symbol: BAGUA_SYMBOLS[upperNum],
      element: BAGUA_ELEMENT[upperNum],
      elementName: ELEMENT_NAMES[BAGUA_ELEMENT[upperNum]],
    },
    lowerBagua: {
      num: lowerNum,
      name: BAGUA_NAMES[lowerNum],
      symbol: BAGUA_SYMBOLS[lowerNum],
      element: BAGUA_ELEMENT[lowerNum],
      elementName: ELEMENT_NAMES[BAGUA_ELEMENT[lowerNum]],
    },
    binary,
    variantBinary,
    changingPositions: [changingIndex],     // 0-indexed，与现有 divination.js 约定一致
    changingPositionName: POSITION_NAMES[changingIndex],
    tiyong,                                  // 体用分析（梅花易数特有）
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
