// 每日一爻：公历日期 → 384 爻索引（64 卦 × 6 爻）
//
// 设计原则：
// - 同一天所有用户看到同一爻（不个性化），形成"今日易经"集体感
// - 384 天一循环（约 1 年 19 天）
// - 用 epoch 总天数 mod 384 作为索引；起点是一个固定的"基准日"
// - 卦序按通行本 1-64（与 hexagrams.js 一致）

// 基准日：1970-01-01 UTC 这天 = 索引 0（即乾卦初九）
// 选这个原点是因为 Date.now() 的天数计算最简单
const DAY_MS = 24 * 3600 * 1000;
const CYCLE  = 384;

/**
 * 把公历日期映射到 [0, 384) 的爻索引。
 * 用 UTC 天数避免时区漂移导致同一历日两个不同索引。
 */
function dateToIndex(date = new Date()) {
  // 以本地日期的零点为准，再转 UTC 天数
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days  = Math.floor(local.getTime() / DAY_MS);
  return ((days % CYCLE) + CYCLE) % CYCLE;
}

/**
 * 给定日期，返回该日对应的卦 id 与爻位（0-indexed）。
 *
 * @param {Date} date
 * @returns {{
 *   hexagramId: number,   // 1-64 (通行本卦序)
 *   yaoIndex:   number,   // 0=初爻, 5=上爻
 *   cycleIndex: number,   // 0-383
 * }}
 */
export function getDailyYao(date = new Date()) {
  const cycleIndex = dateToIndex(date);
  const hexagramId = Math.floor(cycleIndex / 6) + 1;
  const yaoIndex   = cycleIndex % 6;
  return { hexagramId, yaoIndex, cycleIndex };
}

const YAO_POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

/**
 * 把爻索引（0-5）转为传统称谓"初九"/"六二" 等。
 * 需要给定爻的阴阳（从对应卦的 binary 中取）。
 *
 * @param {string} binary - 6 位卦象二进制，index 0 = 初爻
 * @param {number} yaoIndex - 0-5
 * @returns {string} 如 "初九" / "六二"
 */
export function formatYaoName(binary, yaoIndex) {
  if (typeof binary !== 'string' || binary.length !== 6) return YAO_POSITION_NAMES[yaoIndex] || '?';
  const isYang = binary[yaoIndex] === '1';
  // 初/二/三/四/五/上
  const order = ['初', '二', '三', '四', '五', '上'];
  // 阳爻=九、阴爻=六
  const sex   = isYang ? '九' : '六';
  // 初爻和上爻习惯写"初九/初六" "上九/上六"；中间四爻写"九二/六三"等
  if (yaoIndex === 0) return `${order[0]}${sex}`;
  if (yaoIndex === 5) return `${order[5]}${sex}`;
  return `${sex}${order[yaoIndex]}`;
}

/**
 * 给定日期范围内的所有"每日爻"列表（用于日历视图）。
 *
 * @param {Date} startDate
 * @param {Date} endDate （含）
 */
export function getDailyYaosInRange(startDate, endDate) {
  const result = [];
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end    = new Date(endDate.getFullYear(),   endDate.getMonth(),   endDate.getDate());
  while (cursor <= end) {
    result.push({
      date: new Date(cursor),
      ...getDailyYao(cursor),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}
