// 占卜模式容器：灵签（最轻）/ 梅花（轻）/ 铜钱（中） 三个子标签
// 由轻到重排列。各方法的具体起卦实现在子组件里（Phase 1.2-1.4）。
import { useState } from 'react';
import MeiHua from './fortune/MeiHua';
import TongQian from './fortune/TongQian';

const S = {
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--space-5)',
    marginBottom: 'var(--space-5)',
    borderBottom: '1px solid var(--paper-edge)',
  },
  tab: {
    background: 'transparent',
    border: 'none',
    padding: '0.6rem 0.4rem',
    marginBottom: '-1px',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-base)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    minHeight: '44px',
    color: 'var(--ink-light)',
    borderBottom: '2px solid transparent',
    transition: 'color 0.2s ease, border-bottom-color 0.2s ease',
  },
  tabActive: {
    color: 'var(--ink)',
    fontWeight: 500,
    borderBottomColor: 'var(--vermilion)',
  },
  placeholder: {
    textAlign: 'center',
    color: 'var(--ink-light)',
    lineHeight: 2,
    padding: 'var(--space-8) var(--space-4)',
  },
  placeholderTitle: {
    fontSize: 'var(--text-lg)',
    color: 'var(--ink-soft)',
    marginBottom: 'var(--space-3)',
    letterSpacing: 'var(--track-wide)',
  },
  placeholderHint: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
  },
};

const TABS = [
  { id: 'lingqian', label: '灵　签', desc: '观音灵签 · 一键抽签' },
  { id: 'meihua',   label: '梅　花', desc: '梅花易数 · 数字起卦' },
  { id: 'tongqian', label: '铜　钱', desc: '铜钱起卦 · 摇卦六次' },
];

function Placeholder({ title, hint }) {
  return (
    <div style={S.placeholder}>
      <div style={S.placeholderTitle}>{title}</div>
      <div style={S.placeholderHint}>{hint}</div>
      <div style={S.placeholderHint}>此功能即将开放</div>
    </div>
  );
}

export default function Fortune() {
  const [tab, setTab] = useState('lingqian');
  const current = TABS.find(t => t.id === tab);

  return (
    <div>
      <div style={S.tabs} role="tablist">
        {TABS.map(t => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            style={{
              ...S.tab,
              ...(tab === t.id ? S.tabActive : null),
            }}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'meihua' && <MeiHua />}
      {tab === 'tongqian' && <TongQian />}
      {tab === 'lingqian' && <Placeholder title={current.label.replace('　', '')} hint={current.desc} />}
    </div>
  );
}
