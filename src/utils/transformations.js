// 五层卦象计算：综卦、错卦、互卦、变卦
// 所有函数均以 binary 字符串为输入输出
// binary 约定：index 0 = 初爻（最下爻），index 5 = 上爻（最上爻）

/**
 * 综卦：六爻顺序完全反转
 * 卦象倒过来看，象征事物的对立视角
 * 例："101010" → "010101"
 *
 * @param {string} binary 本卦二进制
 * @returns {string}
 */
export function getZongGua(binary) {
  return binary.split('').reverse().join('');
}

/**
 * 错卦：每一爻阴阳翻转
 * 与本卦阴阳完全相错，象征事物的对立面
 * 例："101010" → "010101"
 *
 * @param {string} binary 本卦二进制
 * @returns {string}
 */
export function getCuoGua(binary) {
  return binary.split('').map(b => b === '1' ? '0' : '1').join('');
}

/**
 * 互卦：取本卦中间四爻，重新组成一卦
 * 互卦下卦 = 本卦第2、3、4爻（binary[1..3]）
 * 互卦上卦 = 本卦第3、4、5爻（binary[2..4]）
 * 象征事物内部潜藏的结构
 * 例：本卦 "101010" → 下卦 "010"，上卦 "101" → 互卦 "010101"
 *
 * @param {string} binary 本卦二进制
 * @returns {string}
 */
export function getHuGua(binary) {
  const lowerTrigram = binary[1] + binary[2] + binary[3]; // 二、三、四爻
  const upperTrigram = binary[2] + binary[3] + binary[4]; // 三、四、五爻
  return lowerTrigram + upperTrigram;
}

/**
 * 变卦：将动爻位置的阴阳翻转
 * 象征本卦变化后的趋势与结果
 * 例：本卦 "101010"，动爻 [1, 4] → 翻转第1、4位 → "111000"
 *
 * @param {string} binary 本卦二进制
 * @param {number[]} changingPositions 动爻位置数组（index 0 = 初爻）
 * @returns {string|null} 无动爻时返回 null
 */
export function getBianGua(binary, changingPositions) {
  if (!changingPositions || changingPositions.length === 0) return null;

  const yao = binary.split('');
  changingPositions.forEach(pos => {
    yao[pos] = yao[pos] === '1' ? '0' : '1';
  });
  return yao.join('');
}

/**
 * 五层卦象计算主函数
 *
 * @param {string} benGuaBinary 本卦二进制（6位，index 0 = 初爻）
 * @param {number[]} changingPositions 动爻位置数组
 * @returns {{
 *   benGua: string,
 *   zongGua: string,
 *   cuoGua: string,
 *   huGua: string,
 *   bianGua: string|null
 * }}
 */
export function calculateTransformations(benGuaBinary, changingPositions) {
  return {
    benGua:  benGuaBinary,
    zongGua: getZongGua(benGuaBinary),
    cuoGua:  getCuoGua(benGuaBinary),
    huGua:   getHuGua(benGuaBinary),
    bianGua: getBianGua(benGuaBinary, changingPositions),
  };
}

/**
 * 测试函数：用本卦 "101010"，动爻 [1, 4] 演示五卦计算结果
 */
export function testTransformations() {
  const benGua = '101010';
  const changingPositions = [1, 4];

  console.log('=== 五层卦象计算测试 ===\n');
  console.log('本卦二进制（index 0 = 初爻）：', benGua);
  console.log('动爻位置：', changingPositions, '\n');

  const result = calculateTransformations(benGua, changingPositions);

  const labels = {
    benGua:  '本卦',
    zongGua: '综卦（六爻反转）',
    cuoGua:  '错卦（阴阳翻转）',
    huGua:   '互卦（中间四爻重组）',
    bianGua: '变卦（动爻翻转）',
  };

  Object.entries(result).forEach(([key, value]) => {
    console.log(`${labels[key]}：${value ?? '无（无动爻）'}`);
  });

  return result;
}
