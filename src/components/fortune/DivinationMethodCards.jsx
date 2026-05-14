// 占卜方法导读卡：3 张并列卡（蓍草 / 梅花 / 铜钱），点击展开方法详情
// 让用户进入占卜板块就能看懂每种方式是什么、何时用、怎么算、来历如何
import { useState } from 'react';

const METHODS = [
  {
    id: 'shicao',
    name: '蓍　草',
    tagline: '最庄重 · 18 变 · 心有大事时',
    duration: '约 5 分钟',
    sections: [
      {
        h: '方法',
        p: '取蓍草五十根，留一不用，余四十九根。"分二、挂一、揲四、归奇"四步为一变，三变成一爻，六爻共 18 变。每爻在四营中求得阴阳与动静。',
      },
      {
        h: '何时该用',
        p: '心中有真正难以决断的大事、且愿意静心五分钟。一日一占足矣——《周易·蒙卦》："初筮告，再三渎，渎则不告。"',
      },
      {
        h: '概率',
        p: '老阳 3/16、老阴 3/16、少阳 5/16、少阴 5/16。比例符合《系辞》"四营成易"标准。',
      },
      {
        h: '来历',
        p: '周代起。孔子修《十翼》时已成熟。蓍草为最古老最正统的占卜方式，《系辞》："大衍之数五十，其用四十有九。"',
      },
    ],
  },
  {
    id: 'meihua',
    name: '梅　花',
    tagline: '灵巧 · 数即是象 · 即兴可起',
    duration: '约 1 分钟',
    sections: [
      {
        h: '方法',
        p: '输入两个数字（或当前时辰），按邵雍法推算：上卦=数1除以八的余数、下卦=数2除以八的余数、动爻=两数之和除以六的余数。',
      },
      {
        h: '何时该用',
        p: '心动即占。看到一个数字、想到一时辰、街角一闪念——都可以起卦。最适合突发的、随机的、不必郑重的疑问。',
      },
      {
        h: '体用',
        p: '动爻所在的卦为"用"，另一卦为"体"。体为我、用为事；体生用为耗、用生体为得；体克用为我胜、用克体为我难。',
      },
      {
        h: '来历',
        p: '北宋邵雍（康节先生）创立。本意"数即是象，心动即占"——把日常的数字、时辰转化为卦象，使占卜随时随地可行。',
      },
    ],
  },
  {
    id: 'tongqian',
    name: '铜　钱',
    tagline: '日常 · 摇 6 次 · 仪式简洁',
    duration: '约 2 分钟',
    sections: [
      {
        h: '方法',
        p: '三枚铜钱同摇，按正反数求当爻阴阳和动否。三正为老阳（动）、三反为老阴（动）、两正一反为少阴、一正两反为少阳。重复 6 次成一卦。',
      },
      {
        h: '何时该用',
        p: '日常想问的事。不必如蓍草那样庄重，但比梅花更有仪式感。三枚同摇是关键，象征天地人三才同应。',
      },
      {
        h: '概率',
        p: '阳/阴 各 3/8、老阳/老阴 各 1/8。比蓍草更易得动爻，节奏明快。',
      },
      {
        h: '来历',
        p: '宋代以后简化蓍草而来。《火珠林》是此法的著名经典，相传由南宋麻衣道者所传。铜钱可用任意硬币代替；要点是同时投、公平摇。',
      },
    ],
  },
];

const S = {
  // 容器：3 张卡片网格，移动端纵向堆叠
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-5)',
  },
  // 卡片本体（折叠状态）
  card: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4)',
    cursor: 'pointer',
    transition: 'border-color 0.2s ease, background 0.2s ease',
    fontFamily: 'var(--font-serif)',
    color: 'var(--ink-soft)',
    textAlign: 'left',
    width: '100%',
    minHeight: '44px',
  },
  cardActive: {
    background: 'var(--paper)',
    borderColor: 'var(--vermilion)',
  },
  cardName: {
    fontSize: 'var(--text-md)',
    fontWeight: 500,
    color: 'var(--ink)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: 'var(--space-2)',
  },
  cardTagline: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    lineHeight: 1.6,
    marginBottom: 'var(--space-2)',
  },
  cardDuration: {
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
  },
  // 展开区：放在 grid 之下，跨满宽
  expanded: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderLeft: '3px solid var(--vermilion)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-5)',
    marginBottom: 'var(--space-5)',
    animation: 'method-fade-in 0.3s ease',
  },
  expandedTitle: {
    fontSize: 'var(--text-lg)',
    fontWeight: 500,
    color: 'var(--ink)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: 'var(--space-2)',
  },
  expandedTagline: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-light)',
    fontStyle: 'italic',
    marginBottom: 'var(--space-4)',
    letterSpacing: 'var(--track-wide)',
  },
  section: {
    marginBottom: 'var(--space-4)',
  },
  sectionH: {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--vermilion-deep)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-2)',
  },
  sectionP: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink)',
    lineHeight: 1.9,
    letterSpacing: '0.01em',
  },
  closeButton: {
    display: 'inline-block',
    marginTop: 'var(--space-3)',
    padding: '0.4rem 1rem',
    background: 'transparent',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
  },
};

export default function DivinationMethodCards() {
  // null = 全部折叠；'shicao'/'meihua'/'tongqian' = 展开对应方法
  const [expanded, setExpanded] = useState(null);

  const expandedMethod = expanded ? METHODS.find(m => m.id === expanded) : null;

  return (
    <>
      <style>{`
        @keyframes method-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={S.grid}>
        {METHODS.map(m => (
          <button
            key={m.id}
            style={{
              ...S.card,
              ...(expanded === m.id ? S.cardActive : null),
            }}
            onClick={() => setExpanded(expanded === m.id ? null : m.id)}
            aria-expanded={expanded === m.id}
            aria-controls={`method-${m.id}-detail`}
          >
            <div style={S.cardName}>{m.name}</div>
            <div style={S.cardTagline}>{m.tagline}</div>
            <div style={S.cardDuration}>{m.duration}</div>
          </button>
        ))}
      </div>

      {expandedMethod && (
        <div id={`method-${expandedMethod.id}-detail`} style={S.expanded}>
          <div style={S.expandedTitle}>{expandedMethod.name}</div>
          <div style={S.expandedTagline}>{expandedMethod.tagline} · {expandedMethod.duration}</div>
          {expandedMethod.sections.map((s, i) => (
            <div key={i} style={S.section}>
              <div style={S.sectionH}>{s.h}</div>
              <div style={S.sectionP}>{s.p}</div>
            </div>
          ))}
          <button
            style={S.closeButton}
            onClick={() => setExpanded(null)}
          >
            收起
          </button>
        </div>
      )}
    </>
  );
}
