// 蓍草揲蓍法起卦算法
// 49根蓍草，六爻各经三变，共十八变得一卦

/**
 * 执行一次"变"
 *
 * 揲蓍步骤：
 * 1. 将蓍草随机分为左右两组
 * 2. 从右组取出1根"挂一"，另置
 * 3. 左组以4根为单位计数，余数（余0视为4）
 * 4. 右组（去挂一后）以4根为单位计数，余数（余0视为4）
 * 5. 设除数 = 挂一(1) + 左余 + 右余
 *    第一变：总数49，设除必为 5 或 9（数学必然，见下注）
 *    第二、三变：设除必为 4 或 8
 *
 * 数学原因：左 + (右-1) = 总数-1
 *   左余 + 右余 ≡ (总数-1) mod 4
 *   49-1=48 ≡ 0(mod 4)，故左余+右余=4或8，设除=5或9
 *   后续总数均为 44/40/36/32，减1后 ≡ 3(mod 4)，故左余+右余=3或7，设除=4或8
 *
 * @param {number} total 本次可用蓍草数
 * @returns {{ setAside: number, remaining: number }}
 */
function oneChange(total) {
  // 随机分左右两组，左组至少1根，右组至少1根（保证挂一有草可取）
  const left = Math.floor(Math.random() * (total - 1)) + 1;
  const rightAfterGuaYi = total - left - 1; // 右组去掉挂一后的数量

  // 左余：除以4的余数，余0视为4
  const leftRem = left % 4 === 0 ? 4 : left % 4;

  // 右余：除以4的余数，余0视为4（rightAfterGuaYi可能为0，0%4=0→视为4）
  const rightRem = rightAfterGuaYi % 4 === 0 ? 4 : rightAfterGuaYi % 4;

  const setAside = 1 + leftRem + rightRem;

  return { setAside, remaining: total - setAside };
}

/**
 * 三变得一爻
 *
 * 三变设除总计与爻性的对应关系（传统揲蓍）：
 *   设除总计 13 → 剩余蓍草 36 → 老阳（动爻，阳变阴）  概率 3/16
 *   设除总计 17 → 剩余蓍草 32 → 少阴（静爻）          概率 5/16
 *   设除总计 21 → 剩余蓍草 28 → 少阳（静爻）          概率 5/16
 *   设除总计 25 → 剩余蓍草 24 → 老阴（动爻，阴变阳）  概率 3/16
 *
 * @returns {{ sums: number[], total: number, type: string }}
 */
function threeChanges() {
  let stalks = 49;
  const sums = [];

  for (let i = 0; i < 3; i++) {
    const { setAside, remaining } = oneChange(stalks);
    sums.push(setAside);
    stalks = remaining;
  }

  const total = sums[0] + sums[1] + sums[2];

  const typeMap = {
    13: 'old_yang',   // 老阳：动爻，此爻阳变阴
    17: 'young_yin',  // 少阴：静爻
    21: 'young_yang', // 少阳：静爻
    25: 'old_yin',    // 老阴：动爻，此爻阴变阳
  };

  return { sums, total, type: typeMap[total] };
}

/**
 * 起卦主函数：模拟蓍草揲蓍法，得出六爻
 *
 * @returns {{
 *   yaoTypes: string[],          // 6条爻的类型，index 0 = 初爻
 *   binary: string,              // 本卦二进制（阳=1，阴=0）
 *   changingPositions: number[], // 动爻位置数组（index 0 = 初爻）
 *   process: object[]            // 起卦过程详情
 * }}
 */
export function generateHexagram() {
  const yaoTypes = [];
  const process = [];

  // 六爻，index 0 = 初爻（最下），index 5 = 上爻（最上）
  for (let i = 0; i < 6; i++) {
    const { sums, total, type } = threeChanges();
    yaoTypes.push(type);
    process.push({ yao: i + 1, sums, total, type });
  }

  // 本卦二进制：阳爻（少阳/老阳）→ 1，阴爻（少阴/老阴）→ 0
  const binary = yaoTypes
    .map(t => (t === 'young_yang' || t === 'old_yang') ? '1' : '0')
    .join('');

  // 动爻位置（老阳/老阴为动爻）
  const changingPositions = yaoTypes
    .map((t, i) => (t === 'old_yang' || t === 'old_yin') ? i : -1)
    .filter(i => i !== -1);

  return { yaoTypes, binary, changingPositions, process };
}

/**
 * 测试函数：在终端输出一次完整起卦过程
 */
export function testDivination() {
  console.log('=== 蓍草揲蓍法起卦测试 ===\n');

  const result = generateHexagram();

  const yaoNames = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];
  const typeNames = {
    old_yang:   '老阳 ● 动爻（阳变阴）',
    young_yang: '少阳 — 静爻',
    young_yin:  '少阴 -- 静爻',
    old_yin:    '老阴 ○ 动爻（阴变阳）',
  };

  result.process.forEach(({ yao, sums, total, type }) => {
    console.log(
      `${yaoNames[yao - 1]}：` +
      `三变设除（${sums[0]} + ${sums[1]} + ${sums[2]}）= ${total}` +
      `  →  ${typeNames[type]}`
    );
  });

  console.log('\n本卦二进制（初→上）：', result.binary);
  console.log(
    '动爻位置（0=初爻）：',
    result.changingPositions.length ? result.changingPositions.join(', ') : '无动爻'
  );

  return result;
}
