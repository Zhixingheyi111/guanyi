// 农历 + 黄历轻量 wrapper。
// 不依赖第三方包：用浏览器内建 Chinese calendar 取得农历年月日，
// 再用本地算法补足页面展示需要的干支与生肖。

const GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHENGXIAO_BY_ZHI = {
  子: '鼠',
  丑: '牛',
  寅: '虎',
  卯: '兔',
  辰: '龙',
  巳: '蛇',
  午: '马',
  未: '羊',
  申: '猴',
  酉: '鸡',
  戌: '狗',
  亥: '猪',
};

const CHINESE_DIGITS = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const MONTH_NUMBER = {
  正: 1,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
  冬: 11,
  腊: 12,
  臘: 12,
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;
// 公历 1970-01-01 为辛巳日，辛巳是六十甲子 0-based 第 17 位。
const DAY_GANZHI_REFERENCE_INDEX = 17;

const chineseCalendarFormatter = new Intl.DateTimeFormat('zh-u-ca-chinese', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function mod(n, m) {
  return ((n % m) + m) % m;
}

function toDate(date) {
  return date instanceof Date ? date : new Date(date);
}

function getChineseCalendarParts(date) {
  const parts = chineseCalendarFormatter.formatToParts(date);
  return parts.reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});
}

function toChineseYear(year) {
  return String(year)
    .split('')
    .map((d) => CHINESE_DIGITS[Number(d)] || d)
    .join('');
}

function toLunarDayText(dayValue) {
  if (!dayValue) return '';
  if (Number.isNaN(Number(dayValue))) return String(dayValue);

  const day = Number(dayValue);
  if (day <= 0 || day > 30) return String(dayValue);
  if (day <= 10) return day === 10 ? '初十' : `初${CHINESE_DIGITS[day]}`;
  if (day < 20) return `十${CHINESE_DIGITS[day - 10]}`;
  if (day === 20) return '二十';
  if (day < 30) return `廿${CHINESE_DIGITS[day - 20]}`;
  return '三十';
}

function parseLunarMonthNumber(monthStr) {
  if (!monthStr) return null;
  const clean = monthStr.replace(/[闰閏月]/g, '');
  if (MONTH_NUMBER[clean]) return MONTH_NUMBER[clean];
  if (clean.startsWith('十')) {
    const tail = clean.slice(1);
    return 10 + (MONTH_NUMBER[tail] || 0);
  }
  return MONTH_NUMBER[clean[0]] || null;
}

function getGanzhiYearByNumber(year) {
  const index = mod(Number(year) - 4, 60);
  return `${GAN[index % 10]}${ZHI[index % 12]}`;
}

function getGanzhiDay(date) {
  const utcDay = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const referenceDay = Date.UTC(1970, 0, 1);
  const dayOffset = Math.round((utcDay - referenceDay) / MS_PER_DAY);
  const index = mod(DAY_GANZHI_REFERENCE_INDEX + dayOffset, 60);
  return `${GAN[index % 10]}${ZHI[index % 12]}`;
}

function getGanzhiMonth(yearGanzhi, lunarMonthStr) {
  const monthNumber = parseLunarMonthNumber(lunarMonthStr);
  const yearGanIndex = GAN.indexOf(yearGanzhi?.[0]);
  if (!monthNumber || yearGanIndex < 0) return '—';

  const firstMonthStemByYearStem = {
    0: 2, // 甲年正月起丙寅；己同
    5: 2,
    1: 4, // 乙、庚起戊寅
    6: 4,
    2: 6, // 丙、辛起庚寅
    7: 6,
    3: 8, // 丁、壬起壬寅
    8: 8,
    4: 0, // 戊、癸起甲寅
    9: 0,
  };

  const stemIndex = mod(firstMonthStemByYearStem[yearGanIndex] + monthNumber - 1, 10);
  const branchIndex = mod(monthNumber + 1, 12); // 正月为寅
  return `${GAN[stemIndex]}${ZHI[branchIndex]}`;
}

function getShengxiao(yearGanzhi) {
  const zhi = yearGanzhi?.[1];
  return SHENGXIAO_BY_ZHI[zhi] || '';
}

/**
 * 从公历 Date 取页面展示所需的农历信息。
 *
 * 注：传统黄历宜忌、星宿、纳音等原先来自第三方库；当前轻量实现
 * 不臆造这些民俗数据，统一返回空数组或占位符。
 */
export function getLunarInfo(date = new Date()) {
  const d = toDate(date);
  const parts = getChineseCalendarParts(d);
  const relatedYear = parts.relatedYear || d.getFullYear();
  const yearGanzhi = parts.yearName || getGanzhiYearByNumber(relatedYear);
  const lunarMonthStr = parts.month || `${d.getMonth() + 1}月`;

  return {
    lunarYearStr: toChineseYear(relatedYear),
    lunarMonthStr,
    lunarDayStr: toLunarDayText(parts.day || d.getDate()),
    isLeapMonth: lunarMonthStr.startsWith('闰') || lunarMonthStr.startsWith('閏'),
    ganzhiYear: yearGanzhi,
    ganzhiMonth: getGanzhiMonth(yearGanzhi, lunarMonthStr),
    ganzhiDay: getGanzhiDay(d),
    shengxiao: getShengxiao(yearGanzhi),
    yi: [],
    ji: [],
    chong: '—',
    sha: '—',
    pengzuGan: '',
    pengzuZhi: '',
    zhixing: '—',
    xiu: '—',
    xiuLuck: '',
    naYin: '—',
    xiShenFang: '—',
    fuShenFang: '—',
    caiShenFang: '—',
    yangGuiFang: '—',
    yinGuiFang: '—',
  };
}

/**
 * 仅返回农历日字符串（"廿八"等），用于日历格内小字。
 * 月初一返回月名（如"三月"或"闰四月"）便于辨识。
 */
export function getLunarDayLabel(date = new Date()) {
  const d = toDate(date);
  const parts = getChineseCalendarParts(d);
  if (Number(parts.day) === 1) {
    return parts.month || `${d.getMonth() + 1}月`;
  }
  return toLunarDayText(parts.day || d.getDate());
}
