// 学易模式容器：入门（课程）/ 通识（词典）/ 卦目（64 卦） 三个子标签
// 负责学易模式内所有的子路由（课程详情、词条详情、卦详情）
import { useState } from 'react';
import LessonList from './LessonList';
import LessonReader from './LessonReader';
import Glossary from './Glossary';
import GlossaryEntry from './GlossaryEntry';
import HexagramGrid from './HexagramGrid';
import HexagramDetail from './HexagramDetail';

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
  { id: 'lessons',  label: '入　门' },
  { id: 'glossary', label: '通　识' },
  { id: 'grid',     label: '卦　目' },
];

export default function Study({ initialHexagramId = null }) {
  // 当前子标签——若有 initialHexagramId（来自外部 deep link，如 DailyDigest 跳转），
  // 默认进入"卦目"sub-tab 并直接打开该卦详情
  const [tab, setTab] = useState(initialHexagramId != null ? 'grid' : 'lessons');
  // 详情视图的 id；任一非 null 时，显示对应详情页而非 tabs
  const [lessonId, setLessonId]     = useState(null);
  const [termId, setTermId]         = useState(null);
  const [hexagramId, setHexagramId] = useState(initialHexagramId);

  // 跨 tab 跳转：从课程里点词条，词条的返回应回到课程而非词典
  // 所以记录是谁打开了详情，返回时用对应的"返回目标"
  // 简化做法：打开课程内的词条 → 返回按钮先关词条，露出课程
  // 打开课程内的示例卦 → 返回按钮先关卦，露出课程
  // 即详情之间可栈式开关：详情展示优先级 term > hexagram > lesson > tab

  // 如果打开了词条详情
  if (termId) {
    return (
      <GlossaryEntry
        termId={termId}
        onBack={() => setTermId(null)}
        onSelectTerm={(id) => setTermId(id)}
      />
    );
  }

  // 如果打开了卦详情
  if (hexagramId != null) {
    return (
      <HexagramDetail
        hexagramId={hexagramId}
        onBack={() => setHexagramId(null)}
      />
    );
  }

  // 如果打开了单课详情
  if (lessonId) {
    return (
      <LessonReader
        lessonId={lessonId}
        onBack={() => setLessonId(null)}
        onSelectLesson={(id) => setLessonId(id)}
        onSelectTerm={(id) => setTermId(id)}
        onSelectHexagram={(id) => setHexagramId(id)}
      />
    );
  }

  // 默认：三标签切换
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

      {tab === 'lessons' && (
        <LessonList onSelectLesson={(id) => setLessonId(id)} />
      )}

      {tab === 'glossary' && (
        <Glossary onSelectTerm={(id) => setTermId(id)} />
      )}

      {tab === 'grid' && (
        <HexagramGrid onSelectHexagram={(id) => setHexagramId(id)} />
      )}
    </div>
  );
}
