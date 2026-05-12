// 铜钱起卦（火珠林三钱法）
//
// 每爻摇三枚铜钱，正面（字面/阳）记 3，反面（背面/阴）记 2；三钱之和：
//   6  = 三反，老阴（变爻）  → 阴爻，且动
//   7  = 两反一正，少阳     → 阳爻
//   8  = 两正一反，少阴     → 阴爻
//   9  = 三正，老阳（变爻）  → 阳爻，且动
//
// 概率（每爻独立）：6 = 1/8，7 = 3/8，8 = 3/8，9 = 1/8
//
// 摇 6 次得 6 爻，自下而上（第 1 摇 = 初爻，第 6 摇 = 上爻）。
// 二进制约定与 hexagrams.js / meiHua.js 一致：index 0 = 初爻。

function tossCoin() {
  // 1/2 each. 正面（字）= 3 = 阳；反面（幕）= 2 = 阴
  return Math.random() < 0.5 ? 3 : 2;
}

function tossYao() {
  const c1 = tossCoin();
  const c2 = tossCoin();
  const c3 = tossCoin();
  const sum = c1 + c2 + c3;
  // 6 老阴, 7 少阳, 8 少阴, 9 老阳
  const isYang = sum === 7 || sum === 9;
  const isChanging = sum === 6 || sum === 9;
  const labelMap = { 6: '老阴', 7: '少阳', 8: '少阴', 9: '老阳' };
  return {
    coins: [c1, c2, c3],  // 单钱面值 2/3
    sum,
    label: labelMap[sum],
    isYang,
    isChanging,
  };
}

function flipBit(binary, index) {
  return binary.slice(0, index) + (binary[index] === '1' ? '0' : '1') + binary.slice(index + 1);
}

export function castTongQian() {
  const yaos = [];
  for (let i = 0; i < 6; i++) {
    yaos.push(tossYao());
  }
  const binary = yaos.map(y => (y.isYang ? '1' : '0')).join('');
  const changingPositions = yaos
    .map((y, i) => (y.isChanging ? i : -1))
    .filter(i => i >= 0);

  let variantBinary = binary;
  for (const idx of changingPositions) {
    variantBinary = flipBit(variantBinary, idx);
  }

  return {
    method: 'tongqian',
    yaos,           // 6 个，自下而上
    binary,         // 6 位，index 0 = 初爻
    variantBinary,
    changingPositions, // 0-indexed
  };
}
