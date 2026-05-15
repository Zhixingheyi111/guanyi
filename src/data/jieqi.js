// 24 节气 × 十二消息卦（"辟卦"/"卦气说"）
//
// 数据来源（全部公版）：
//   - 24 节气配 12 消息卦的对应来自汉代孟喜、京房创立的"卦气说"
//   - 每月一辟卦，对应该月的"中气"（节气下半）；上半"节气"作为该卦的过渡
//   - 解读自录，参考 公版《周易·序卦传》《系辞》+ 朱熹《周易本义》
//
// 公历日期采用 30 年平均近似（每年立春日实际是 2/3-5，本表用 2/4）。
// 用户感知误差 0-2 天可接受；不引入农历算法库。
//
// 字段：
//   - name        节气名
//   - month, day  公历近似日（用 new Date(year, month-1, day) 比较）
//   - hexagramId  对应消息卦（1-64 通行本卦序）
//   - role        'main' = 中气，正配此卦；'transition' = 节气前半，过渡到此卦
//   - meaning     30-60 字 卦象与节气的对应描述

export const JIEQI = [
  // 春
  { name: '立春', month: 2,  day: 4,  hexagramId: 19, role: 'transition',
    meaning: '阳气始升地表，万物将动。临卦"刚浸而长"，元亨利贞，正其时也。' },
  { name: '雨水', month: 2,  day: 19, hexagramId: 11, role: 'main',
    meaning: '雨水滋润，天地相交。泰卦"小往大来"，三阳开泰之象，万物滋生。' },
  { name: '惊蛰', month: 3,  day: 6,  hexagramId: 11, role: 'transition',
    meaning: '春雷惊百虫，泰意延续。天地交泰、阴阳和畅，蛰虫始振。' },
  { name: '春分', month: 3,  day: 21, hexagramId: 34, role: 'main',
    meaning: '昼夜均、寒暑平。大壮卦四阳上承，刚长之时，正动莫如顺天而行。' },
  { name: '清明', month: 4,  day: 5,  hexagramId: 34, role: 'transition',
    meaning: '气清景明，大壮渐盛。生机蓬勃但不可恃强而骄。' },
  { name: '谷雨', month: 4,  day: 20, hexagramId: 43, role: 'main',
    meaning: '雨生百谷。夬卦"刚决柔"，五阳决一阴，决断之时。' },

  // 夏
  { name: '立夏', month: 5,  day: 5,  hexagramId: 43, role: 'transition',
    meaning: '阳气大盛，夬卦余势。万物渐长，决意成形。' },
  { name: '小满', month: 5,  day: 21, hexagramId: 1,  role: 'main',
    meaning: '麦穗渐满。乾卦"飞龙在天"，纯阳之时，刚健不息。' },
  { name: '芒种', month: 6,  day: 6,  hexagramId: 1,  role: 'transition',
    meaning: '麦熟禾播，乾道极盛。亢龙之诫已隐：盛极思变。' },
  { name: '夏至', month: 6,  day: 21, hexagramId: 44, role: 'main',
    meaning: '阳至而阴生。姤卦"女壮，勿用取女"——一阴始萌，盛极反衰之机。' },
  { name: '小暑', month: 7,  day: 7,  hexagramId: 44, role: 'transition',
    meaning: '暑气始盛，姤意延续。一阴渐长，外阳未减，需慎。' },
  { name: '大暑', month: 7,  day: 23, hexagramId: 33, role: 'main',
    meaning: '暑热极盛，阴渐胜。遁卦"小利贞"，君子见几而退，远小人。' },

  // 秋
  { name: '立秋', month: 8,  day: 8,  hexagramId: 33, role: 'transition',
    meaning: '凉意初萌，遁势续行。退而养正，待时而起。' },
  { name: '处暑', month: 8,  day: 23, hexagramId: 12, role: 'main',
    meaning: '暑气止息，天地不交。否卦"不利君子贞"——闭塞之时，俭德辟难。' },
  { name: '白露', month: 9,  day: 8,  hexagramId: 12, role: 'transition',
    meaning: '寒气凝露，否意未消。阴长阳消，宜守不宜进。' },
  { name: '秋分', month: 9,  day: 23, hexagramId: 20, role: 'main',
    meaning: '昼夜复均。观卦"中正以观天下"，反躬自省、明察事理之时。' },
  { name: '寒露', month: 10, day: 8,  hexagramId: 20, role: 'transition',
    meaning: '露水寒冷，观意持续。仰观俯察，明辨进退。' },
  { name: '霜降', month: 10, day: 23, hexagramId: 23, role: 'main',
    meaning: '霜始降，万物剥落。剥卦"不利有攸往"——五阴剥一阳，守静待春。' },

  // 冬
  { name: '立冬', month: 11, day: 7,  hexagramId: 23, role: 'transition',
    meaning: '阳气潜藏，剥势仍盛。万物收敛入土，君子蛰伏。' },
  { name: '小雪', month: 11, day: 22, hexagramId: 2,  role: 'main',
    meaning: '雪未盛而阴极至。坤卦"厚德载物"，纯阴之时，柔顺含弘。' },
  { name: '大雪', month: 12, day: 7,  hexagramId: 2,  role: 'transition',
    meaning: '雪盛地寒，坤德至极。万物归藏，候一阳来复。' },
  { name: '冬至', month: 12, day: 22, hexagramId: 24, role: 'main',
    meaning: '阴极而阳生。复卦"七日来复"——天地之心见于此，万物之机藏于此。' },
  { name: '小寒', month: 1,  day: 6,  hexagramId: 24, role: 'transition',
    meaning: '寒未极而阳已动。复意延续，一阳渐升于地下。' },
  { name: '大寒', month: 1,  day: 20, hexagramId: 19, role: 'main',
    meaning: '寒至极而春将临。临卦"刚浸而长"，二阳渐进，万物欲发。' },
];

const JIEQI_BY_NAME = Object.fromEntries(JIEQI.map(j => [j.name, j]));

/**
 * 根据公历日期返回当下处于的节气（最近一个已经过去的节气）。
 *
 * @param {Date} date - 任意公历日期
 * @returns {{
 *   jieqi: typeof JIEQI[number],
 *   daysSinceStart: number,   // 距该节气开始过了几天
 * }}
 */
export function getCurrentJieqi(date = new Date()) {
  const year  = date.getFullYear();
  const month = date.getMonth() + 1;
  const day   = date.getDate();

  // 转换到"年内排序"（month-major）便于二分
  const dateKey = month * 100 + day;

  // 找当年节气中"开始日 ≤ 今天"的最后一个
  // 注意：小寒（1/6）和大寒（1/20）属于当年；冬至（12/22）属于上年
  let current = null;
  let bestKey = -Infinity;
  for (const jq of JIEQI) {
    const jqKey = jq.month * 100 + jq.day;
    if (jqKey <= dateKey && jqKey > bestKey) {
      current = jq;
      bestKey = jqKey;
    }
  }

  // 若 1 月初的某天还在小寒之前 → 节气应是上一年的冬至
  if (!current) {
    current = JIEQI_BY_NAME['冬至'];
    // 距冬至（去年 12/22）的天数
    const lastDongZhi = new Date(year - 1, 11, 22);
    const days = Math.floor((date - lastDongZhi) / 86400000);
    return { jieqi: current, daysSinceStart: Math.max(0, days) };
  }

  const startDate = new Date(year, current.month - 1, current.day);
  const days = Math.floor((date - startDate) / 86400000);
  return { jieqi: current, daysSinceStart: Math.max(0, days) };
}

/**
 * 给定的公历日期是否恰好是节气当日（用于日历高亮）。
 */
export function isJieqiDay(date = new Date()) {
  const month = date.getMonth() + 1;
  const day   = date.getDate();
  return JIEQI.find(j => j.month === month && j.day === day) || null;
}

/**
 * 返回某年所有节气的具体 Date 对象（用于日历视图遍历）。
 */
export function getJieqiDatesInYear(year) {
  return JIEQI.map(j => ({
    ...j,
    date: new Date(year, j.month - 1, j.day),
  }));
}

export function getJieqiByName(name) {
  return JIEQI_BY_NAME[name] || null;
}
