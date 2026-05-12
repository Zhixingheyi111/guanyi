// 占卜模式容器：灵签（最轻）/ 梅花（轻）/ 铜钱（中） 三个子标签
// 由轻到重排列。
import { useState } from 'react';
import MeiHua from './fortune/MeiHua';
import TongQian from './fortune/TongQian';
import LingQian from './fortune/LingQian';

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
};

const TABS = [
  { id: 'lingqian', label: '灵　签' },
  { id: 'meihua',   label: '梅　花' },
  { id: 'tongqian', label: '铜　钱' },
];

export default function Fortune() {
  const [tab, setTab] = useState('lingqian');

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

      {tab === 'lingqian' && <LingQian />}
      {tab === 'meihua'   && <MeiHua />}
      {tab === 'tongqian' && <TongQian />}
    </div>
  );
}
