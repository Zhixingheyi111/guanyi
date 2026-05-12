// 观音灵签数据（Phase 1.4 原型版本）
//
// ⚠️ 重要：此为 5 签原型，**非权威 100 签版本**。诗文为概括性表达，
//    不直接对应历代任何一个传世版本。100 签的完整、版本明确的数据，
//    将在 Phase 1 后期由用户确认来源（建议参照通行民间公版）后补全。
//    详见 SOURCES.md。
//
// 等级体系（由高到低）：
//   上上签 / 上吉签 / 中吉签 / 中平签 / 中下签 / 下下签
//
// 每签字段：
//   id          签号 (1-100)
//   level       等级
//   title       签题（多为历史人物或典故名）
//   poem        四句诗（每句 7 言）
//   interpretation 解读（白话）
//   advice      建议

export const LINGQIAN_PROTOTYPE = [
  {
    id: 1,
    level: '上上',
    title: '钟离成道',
    poem: [
      '开天辟地作良缘',
      '吉日良时万事全',
      '若得此签非小可',
      '人行忠正帝王宣',
    ],
    interpretation:
      '此签大吉。谋事可成，求财得利，婚姻和合，出行平安，病者渐愈。然福至而骄则失，宜守谦德。',
    advice: '心怀正念，行事坦荡。福至时勿生骄气，乃可常保。',
  },
  {
    id: 17,
    level: '上吉',
    title: '子牙弃官',
    poem: [
      '当头明月照楼台',
      '凡事清吉甚和谐',
      '正是中秋逢闰月',
      '更逢新喜事重排',
    ],
    interpretation:
      '此签上吉。运势开朗如月当头，所谋之事可成，喜事将至。然喜事重叠之中宜辨主次，勿因小失大。',
    advice: '把握时机，主次分明。新喜降临之时，更要稳住根本。',
  },
  {
    id: 50,
    level: '中平',
    title: '苏小卿月夜泛茶船',
    poem: [
      '清水池中藕一枝',
      '芬芳气味自然奇',
      '不愁日后无良果',
      '只待开花暂忍迟',
    ],
    interpretation:
      '此签中平。所谋之事尚未到时，如莲藕未开。然根基已立，气味自然。须耐心等待，不可强求。',
    advice: '时机未到，宜守不宜进。守住本心，自有花开果熟之日。',
  },
  {
    id: 76,
    level: '中下',
    title: '韩信弃楚归汉',
    poem: [
      '不愁前路无相识',
      '只惧崎岖步不前',
      '若得贵人重指引',
      '蓬山弱水也安然',
    ],
    interpretation:
      '此签中下。眼前道路坎坷，独行难以为继。然贵人将至，若能放下己见、虚心听取，仍可化险为夷。',
    advice: '广交良友，谦虚求教。不要因路难而停步，等待贵人之助。',
  },
  {
    id: 100,
    level: '下下',
    title: '李广不封',
    poem: [
      '十年勤苦在寒窗',
      '昼夜思量上举场',
      '一旦时来颜色改',
      '可怜锦衣未还乡',
    ],
    interpretation:
      '此签下下。功业虽勤，时不予人，所求之事难以一时成就。然此非力之过，乃时也命也。宜暂歇锋芒，反求诸己。',
    advice: '不强求外境，回视内心。挫折是时节使然，养精蓄锐，待时而动。',
  },
];

// 等级 → 颜色（用于 UI 着色）
export const LEVEL_COLOR = {
  上上: 'var(--vermilion-deep)',
  上吉: 'var(--vermilion)',
  中吉: 'var(--ink)',
  中平: 'var(--ink-soft)',
  中下: 'var(--ink-light)',
  下下: 'var(--ink-whisper)',
};

export function pickRandomSign() {
  const idx = Math.floor(Math.random() * LINGQIAN_PROTOTYPE.length);
  return LINGQIAN_PROTOTYPE[idx];
}

export function getSignById(id) {
  return LINGQIAN_PROTOTYPE.find(s => s.id === id) || null;
}
