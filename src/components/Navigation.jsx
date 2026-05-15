// 顶部模式导航：今日 / 占卜 / 学易
//  - 今日：DailyDigest（节气/农历/干支/今日一爻/AI 解读/学习进度）+ Calendar 月历
//  - 占卜：含 3 sub-tab——蓍草（庄重）/ 梅花（轻便）/ 铜钱（日常）
//  - 学易：入门 9 课 + 占卜方法 3 课 + 词典 + 64 卦

const S = {
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--space-6)',
    marginBottom: 'var(--space-5)',
  },
  button: {
    background: 'transparent',
    border: 'none',
    padding: '0.6rem 0.9rem',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-md)',
    letterSpacing: 'var(--track-xwide)',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'color 0.2s ease, border-bottom-color 0.2s ease',
    // 占位以保持激活/非激活时总高度一致
    borderBottom: '1px solid transparent',
  },
  active: {
    color: 'var(--ink)',
    fontWeight: 500,
    borderBottomColor: 'var(--vermilion)',
  },
  inactive: {
    color: 'var(--ink-light)',
    fontWeight: 400,
  },
};

export default function Navigation({ currentMode, onModeChange }) {
  const btnStyle = (mode) => ({
    ...S.button,
    ...(currentMode === mode ? S.active : S.inactive),
  });

  return (
    <nav style={S.nav} aria-label="模式切换">
      <button style={btnStyle('today')} onClick={() => onModeChange('today')}>
        今日
      </button>
      <button style={btnStyle('divination')} onClick={() => onModeChange('divination')}>
        占卜
      </button>
      <button style={btnStyle('study')} onClick={() => onModeChange('study')}>
        学易
      </button>
    </nav>
  );
}
