// 底部 Tab Bar —— 2026 原生 App 标准
//  - 4 项：今日 / 占卜 / 学易 / 日历
//  - 固定底栏，每项 = 水墨线条 SVG 图标 + 文字标签（不用 emoji）
//  - 触控目标 ≥56px，激活项朱砂色 + 顶部细指示条
//  - 适配 iPhone 底部安全区

const S = {
  bar: {
    display: 'flex',
    flexShrink: 0,
    background: 'var(--paper)',
    borderTop: '1px solid var(--paper-edge)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    zIndex: 'var(--z-appbar)',
  },
  item: {
    flex: 1,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    minHeight: '56px',
    padding: '6px 0',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-serif)',
    transition: 'color 0.2s ease',
  },
  label: {
    fontSize: '0.7rem',
    letterSpacing: 'var(--track-wide)',
    lineHeight: 1,
  },
  // 激活项顶部的朱砂指示条
  indicator: {
    position: 'absolute',
    top: 0,
    width: '18px',
    height: '3px',
    borderRadius: '0 0 3px 3px',
    background: 'var(--vermilion)',
  },
};

// —— 水墨线条图标（24×24，currentColor 描边）——
const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

// 今日：日轮
function IconToday() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2.6" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="21.4" />
      <line x1="2.6" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="21.4" y2="12" />
      <line x1="5.3" y1="5.3" x2="7" y2="7" />
      <line x1="17" y1="17" x2="18.7" y2="18.7" />
      <line x1="18.7" y1="5.3" x2="17" y2="7" />
      <line x1="7" y1="17" x2="5.3" y2="18.7" />
    </svg>
  );
}

// 占卜：三爻（卦象）
function IconDivination() {
  return (
    <svg {...iconProps}>
      <line x1="5" y1="8" x2="19" y2="8" />
      <line x1="5" y1="12" x2="10.4" y2="12" />
      <line x1="13.6" y1="12" x2="19" y2="12" />
      <line x1="5" y1="16" x2="19" y2="16" />
    </svg>
  );
}

// 学易：翻开的书
function IconStudy() {
  return (
    <svg {...iconProps}>
      <path d="M12 6.6 C 9.5 5, 6 5, 4 5.9 L 4 17.9 C 6 17, 9.5 17, 12 18.6" />
      <path d="M12 6.6 C 14.5 5, 18 5, 20 5.9 L 20 17.9 C 18 17, 14.5 17, 12 18.6" />
    </svg>
  );
}

// 日历：月历格
function IconCalendar() {
  return (
    <svg {...iconProps}>
      <rect x="4" y="5.5" width="16" height="14.5" rx="2" />
      <line x1="4" y1="10" x2="20" y2="10" />
      <line x1="9" y1="3.4" x2="9" y2="7" />
      <line x1="15" y1="3.4" x2="15" y2="7" />
      <circle cx="9" cy="14" r="0.95" fill="currentColor" stroke="none" />
      <circle cx="13.6" cy="14" r="0.95" fill="currentColor" stroke="none" />
    </svg>
  );
}

const TABS = [
  { id: 'today',      label: '今日', Icon: IconToday },
  { id: 'divination', label: '占卜', Icon: IconDivination },
  { id: 'study',      label: '学易', Icon: IconStudy },
  { id: 'calendar',   label: '日历', Icon: IconCalendar },
];

export default function TabBar({ currentMode, onModeChange }) {
  return (
    <nav style={S.bar} aria-label="主导航">
      {TABS.map((tab) => {
        const active = currentMode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className="guanyi-tap"
            style={{ ...S.item, color: active ? 'var(--vermilion)' : 'var(--ink-light)' }}
            aria-current={active ? 'page' : undefined}
            onClick={() => onModeChange(tab.id)}
          >
            {active && <span style={S.indicator} aria-hidden="true" />}
            <tab.Icon />
            <span style={S.label}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
