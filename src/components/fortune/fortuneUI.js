// 三种占卜（蓍草 / 梅花 / 铜钱）共用的「外壳」样式。
//
// 统一框架（用户 2026-05-17 确认）：
//   引导卡 → 心中所惑输入 → 起卦动作 → 本卦象头 → 方法专属中段 → AI 解读 → 重新起卦
//
// 本文件只放共用的外壳样式与动画字符串；
// 各方法专属的中段（蓍草五层 / 梅花体用 / 铜钱摇钱动画）样式仍由各组件自管。

export const fortuneUI = {
  // ——— 引导卡 ———
  introCard: {
    textAlign: 'center',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4)',
    marginBottom: 'var(--space-5)',
  },
  introDesc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    lineHeight: 1.95,
  },
  introMeta: {
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
    marginTop: 'var(--space-2)',
  },

  // ——— 心中所惑输入 ———
  questionLabel: {
    display: 'block',
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-2)',
  },
  questionInput: {
    display: 'block',
    width: '100%',
    margin: '0 auto var(--space-5)',
    padding: '0.7rem 0.9rem',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-base)',
    lineHeight: 1.85,
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical',
    minHeight: '90px',
  },

  // ——— 起卦动作区 ———
  castArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-5)',
  },
  primaryBtn: {
    display: 'block',
    margin: '0 auto',
    padding: '0.7rem 2rem',
    background: 'var(--ink)',
    color: 'var(--paper)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-base)',
    letterSpacing: 'var(--track-xwide)',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'opacity 0.2s ease',
  },
  primaryBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  hint: {
    textAlign: 'center',
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
  },
  errorMsg: {
    color: 'var(--vermilion-deep)',
    fontSize: 'var(--text-sm)',
    textAlign: 'center',
    marginTop: 'var(--space-3)',
  },

  // ——— 本卦象头 ———
  result: { animation: 'fortune-fade-in 0.5s ease' },
  resultHeader: {
    textAlign: 'center',
    marginBottom: 'var(--space-4)',
    animation: 'fortune-fade-in 0.6s ease',
  },
  hexagramSymbol: {
    fontSize: '4rem',
    lineHeight: 1,
    color: 'var(--ink)',
    marginBottom: 'var(--space-2)',
  },
  hexagramName: {
    fontSize: 'var(--text-xl)',
    color: 'var(--ink)',
    letterSpacing: 'var(--track-hero)',
    paddingLeft: '0.5em',
  },
  guaciBox: {
    padding: 'var(--space-4)',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-4)',
    lineHeight: 1.9,
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-base)',
  },
  changingNote: {
    textAlign: 'center',
    color: 'var(--vermilion)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-4)',
  },
  variantBox: {
    padding: 'var(--space-4)',
    background: 'var(--paper-deep)',
    border: '1px dashed var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-4)',
    textAlign: 'center',
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
  },
  variantSymbol: {
    fontSize: '2rem',
    marginRight: 'var(--space-2)',
    verticalAlign: 'middle',
    color: 'var(--ink)',
  },

  // ——— 重新起卦 / 返回 ———
  resetBtn: {
    display: 'block',
    margin: 'var(--space-5) auto 0',
    padding: '0.5rem 1.5rem',
    background: 'transparent',
    border: '1px solid var(--paper-edge)',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
    minHeight: '44px',
  },
  backBtn: {
    display: 'inline-block',
    marginBottom: 'var(--space-4)',
    padding: '0.5rem 1rem',
    background: 'transparent',
    border: '1px solid var(--paper-edge)',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    minHeight: '44px',
    borderRadius: 'var(--radius-md)',
  },
};

// 共用淡入动画。各组件在结果区 <style> 注入一次即可。
export const FORTUNE_ANIM = `
  @keyframes fortune-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @media (prefers-reduced-motion: reduce) {
    .fortune-no-motion { animation: none !important; }
  }
`;

// 占卜方法元信息：引导卡文案 + 历史记录里的方法标签
export const METHOD_META = {
  shicao:   { label: '蓍草', desc1: '蓍草揲数 · 大衍之数', desc2: '心有大事 · 一日一占', meta: '最庄重 · 约 5 分钟' },
  meihua:   { label: '梅花', desc1: '梅花易数 · 邵雍传',   desc2: '心动则占，数即是象', meta: '最灵巧 · 约 1 分钟' },
  tongqian: { label: '铜钱', desc1: '铜钱起卦 · 火珠林',   desc2: '三钱六摇，问询所惑', meta: '最日常 · 约 2 分钟' },
};
