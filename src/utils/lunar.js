// 农历 + 黄历 wrapper — 基于 lunar-javascript (6tail, MIT)
//
// 库覆盖 1900-2100 年（约 200 年）的农历换算 + 完整传统黄历数据：
//   农历日/月/年 / 干支 / 生肖 / 24 节气 / 每日宜忌 / 彭祖百忌
//   建除十二神 / 星宿 / 冲煞 / 喜神福神财神方位 / 黄道黑道日
//
// 本 wrapper 只输出我们需要的字段，避免组件直接 import 第三方 API
import { Solar } from 'lunar-javascript';

/**
 * 从公历 Date 取完整黄历信息。
 *
 * @param {Date} date - 任意公历日期
 * @returns {{
 *   // 农历日历
 *   lunarYearStr:   string,    // "二〇二六"
 *   lunarMonthStr:  string,    // "三月" / "闰四月"
 *   lunarDayStr:    string,    // "廿八"
 *   isLeapMonth:    boolean,
 *   // 干支与生肖
 *   ganzhiYear:     string,    // "丙午"
 *   ganzhiMonth:    string,    // "癸巳"
 *   ganzhiDay:      string,    // "戊子"
 *   shengxiao:      string,    // "马"
 *   // 黄历宜忌（数组，传统民俗规则）
 *   yi:             string[],  // ["纳采","嫁娶","祭祀"...]
 *   ji:             string[],  // ["开市","立券"...]
 *   // 冲煞与彭祖
 *   chong:          string,    // "(壬午)马" 表达冲什么
 *   sha:            string,    // "南" 等方位
 *   pengzuGan:      string,    // "戊不受田田主不祥"
 *   pengzuZhi:      string,    // "子不问卜自惹祸殃"
 *   // 建除/星宿/纳音
 *   zhixing:        string,    // "建除满平定执破危成收开闭" 之一
 *   xiu:            string,    // "奎"
 *   xiuLuck:        string,    // "吉" / "凶"
 *   naYin:          string,    // 当日纳音
 *   // 方位
 *   xiShenFang:     string,    // 喜神方位
 *   fuShenFang:     string,    // 福神方位
 *   caiShenFang:    string,    // 财神方位
 *   yangGuiFang:    string,    // 阳贵神方位
 *   yinGuiFang:     string,    // 阴贵神方位
 * }}
 */
export function getLunarInfo(date = new Date()) {
  const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const lunar = solar.getLunar();

  return {
    lunarYearStr:   lunar.getYearInChinese(),
    lunarMonthStr:  (lunar.getMonth() < 0 ? '闰' : '') + lunar.getMonthInChinese() + '月',
    lunarDayStr:    lunar.getDayInChinese(),
    isLeapMonth:    lunar.getMonth() < 0,
    ganzhiYear:     lunar.getYearInGanZhi(),
    ganzhiMonth:    lunar.getMonthInGanZhi(),
    ganzhiDay:      lunar.getDayInGanZhi(),
    shengxiao:      lunar.getYearShengXiao(),
    yi:             lunar.getDayYi() || [],
    ji:             lunar.getDayJi() || [],
    chong:          lunar.getDayChongDesc(),
    sha:            lunar.getDaySha(),
    pengzuGan:      lunar.getPengZuGan(),
    pengzuZhi:      lunar.getPengZuZhi(),
    zhixing:        lunar.getZhiXing(),
    xiu:            lunar.getXiu(),
    xiuLuck:        lunar.getXiuLuck(),
    naYin:          lunar.getDayNaYin(),
    xiShenFang:     lunar.getDayPositionXiDesc(),
    fuShenFang:     lunar.getDayPositionFuDesc(),
    caiShenFang:    lunar.getDayPositionCaiDesc(),
    yangGuiFang:    lunar.getDayPositionYangGuiDesc(),
    yinGuiFang:     lunar.getDayPositionYinGuiDesc(),
  };
}

/**
 * 仅返回农历日字符串（"廿八"等），用于日历格内小字。
 * 月初一返回月名（"三月初一"或"四月"压缩）便于辨识。
 */
export function getLunarDayLabel(date = new Date()) {
  const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
  const lunar = solar.getLunar();
  const day = lunar.getDay();
  if (day === 1) {
    // 月初一显示月份
    return (lunar.getMonth() < 0 ? '闰' : '') + lunar.getMonthInChinese() + '月';
  }
  return lunar.getDayInChinese();
}
