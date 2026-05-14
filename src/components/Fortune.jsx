// 占卜模式容器：蓍草（最庄重）/ 梅花（轻便）/ 铜钱（日常） 三个 sub-tab
// 蓍草工作流（输入问题 → 5 层卦象 → AI 解读）由 App.jsx 顶层管 state，
// 这里通过 shicaoSlot prop 嵌入为 sub-tab 内容。
import { useState } from 'react';
import MeiHua from './fortune/MeiHua';
import TongQian from './fortune/TongQian';
import DivinationMethodCards from './fortune/DivinationMethodCards';

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
  { id: 'shicao',   label: '蓍　草' },
  { id: 'meihua',   label: '梅　花' },
  { id: 'tongqian', label: '铜　钱' },
];

export default function Fortune({ shicaoSlot }) {
  const [tab, setTab] = useState('shicao');

  return (
    <div>
      <DivinationMethodCards />

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

      {tab === 'shicao'   && shicaoSlot}
      {tab === 'meihua'   && <MeiHua />}
      {tab === 'tongqian' && <TongQian />}
    </div>
  );
}
