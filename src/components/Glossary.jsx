// 通识词典：分组 + 搜索 + 点击进入词条详情
import { useState, useMemo } from 'react';
import { CATEGORIES, glossary, getGlossaryByCategory } from '../data/glossary';

const S = {
  header: {
    marginBottom: 'var(--space-4)',
  },
  subtitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
    margin: 0,
    lineHeight: 1.8,
  },
  searchBox: {
    width: '100%',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-base)',
    padding: 'var(--space-3)',
    outline: 'none',
    marginBottom: 'var(--space-5)',
    letterSpacing: 'var(--track-tight)',
    boxSizing: 'border-box',
  },
  categoryBlock: {
    marginBottom: 'var(--space-5)',
  },
  categoryHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-3)',
    borderLeft: '3px solid var(--vermilion)',
    paddingLeft: '0.6rem',
  },
  categoryName: {
    fontSize: 'var(--text-md)',
    color: 'var(--ink)',
    fontWeight: 500,
    letterSpacing: 'var(--track-xwide)',
    margin: 0,
  },
  categoryDesc: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-normal)',
  },
  count: {
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-whisper)',
    marginLeft: 'auto',
  },
  termGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
    gap: 'var(--space-2)',
  },
  termCard: {
    padding: 'var(--space-3)',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s, transform 0.15s',
    fontFamily: 'var(--font-serif)',
    minHeight: '44px',
  },
  termName: {
    color: 'var(--ink)',
    fontSize: 'var(--text-base)',
    fontWeight: 500,
    letterSpacing: 'var(--track-wide)',
    margin: 0,
  },
  termPinyin: {
    color: 'var(--ink-light)',
    fontSize: 'var(--text-xs)',
    fontStyle: 'italic',
    letterSpacing: 'var(--track-normal)',
    marginTop: '0.15rem',
  },
  empty: {
    textAlign: 'center',
    color: 'var(--ink-light)',
    padding: 'var(--space-6) 0',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-normal)',
  },
};

export default function Glossary({ onSelectTerm }) {
  const [query, setQuery] = useState('');
  const q = query.trim();

  // 搜索时不分组，直接显示匹配结果；无搜索时按分组显示
  const matches = useMemo(() => {
    if (!q) return null;
    const lower = q.toLowerCase();
    return glossary.filter(e =>
      e.term.includes(q) ||
      (e.pinyin && e.pinyin.toLowerCase().includes(lower)) ||
      (e.short && e.short.includes(q))
    );
  }, [q]);

  const byCategory = useMemo(() => getGlossaryByCategory(), []);

  return (
    <div>
      <div style={S.header}>
        <p style={S.subtitle}>
          易经术语精简词典。遇到不认识的词，随时回来查。
        </p>
      </div>

      <input
        type="text"
        style={S.searchBox}
        placeholder="搜索词条……（中文或拼音）"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {q ? (
        // 搜索模式
        <div>
          {matches.length === 0 ? (
            <div style={S.empty}>未找到与「{q}」相关的词条</div>
          ) : (
            <div style={{ ...S.termGrid, marginBottom: 'var(--space-4)' }}>
              {matches.map(entry => (
                <TermCard key={entry.id} entry={entry} onSelect={onSelectTerm} />
              ))}
            </div>
          )}
        </div>
      ) : (
        // 分组浏览模式
        CATEGORIES.map(cat => {
          const entries = byCategory[cat.id] || [];
          if (entries.length === 0) return null;
          return (
            <div key={cat.id} style={S.categoryBlock}>
              <div style={S.categoryHeader}>
                <h3 style={S.categoryName}>{cat.name}</h3>
                <span style={S.categoryDesc}>{cat.description}</span>
                <span style={S.count}>{entries.length}</span>
              </div>
              <div style={S.termGrid}>
                {entries.map(entry => (
                  <TermCard key={entry.id} entry={entry} onSelect={onSelectTerm} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

function TermCard({ entry, onSelect }) {
  const handleEnter = (e) => {
    e.currentTarget.style.borderColor = 'var(--ink-light)';
    e.currentTarget.style.background = 'var(--paper)';
    e.currentTarget.style.transform = 'translateY(-1px)';
  };
  const handleLeave = (e) => {
    e.currentTarget.style.borderColor = 'var(--paper-edge)';
    e.currentTarget.style.background = 'var(--paper-soft)';
    e.currentTarget.style.transform = 'none';
  };
  return (
    <div
      style={S.termCard}
      onClick={() => onSelect(entry.id)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <p style={S.termName}>{entry.term}</p>
      {entry.pinyin && <div style={S.termPinyin}>{entry.pinyin}</div>}
    </div>
  );
}
