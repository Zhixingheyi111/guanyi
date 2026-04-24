// 单条词条详情页：术语 + 定义 + 详解 + 相关词
import { useEffect } from 'react';
import { getGlossaryEntry, CATEGORIES } from '../data/glossary';

const S = {
  backButton: {
    background: 'transparent',
    border: 'none',
    color: 'var(--ink-light)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    padding: '0.6rem 0',
    marginBottom: 'var(--space-4)',
    minHeight: '44px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 'var(--space-5)',
  },
  categoryTag: {
    display: 'inline-block',
    fontSize: '0.7rem',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
    padding: '0.15rem 0.55rem',
    border: '1px solid var(--paper-edge)',
    borderRadius: '2px',
    background: 'var(--paper-soft)',
    marginBottom: 'var(--space-3)',
  },
  term: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 500,
    letterSpacing: 'var(--track-wide)',
    color: 'var(--ink)',
    margin: 0,
    lineHeight: 1.3,
  },
  pinyin: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
    marginTop: 'var(--space-2)',
    fontStyle: 'italic',
  },
  short: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderLeft: '3px solid var(--vermilion)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4)',
    color: 'var(--ink)',
    fontSize: 'var(--text-base)',
    lineHeight: 1.9,
    margin: 'var(--space-4) 0',
    letterSpacing: '0.01em',
  },
  longSection: {
    marginTop: 'var(--space-5)',
  },
  longLabel: {
    fontSize: '0.75rem',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: 'var(--space-3)',
  },
  longP: {
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-base)',
    lineHeight: 1.95,
    margin: 'var(--space-3) 0',
    letterSpacing: '0.01em',
  },
  relatedSection: {
    marginTop: 'var(--space-8)',
    paddingTop: 'var(--space-5)',
    borderTop: '1px solid var(--paper-edge)',
  },
  relatedLabel: {
    fontSize: '0.75rem',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: 'var(--space-3)',
  },
  relatedRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-2)',
  },
  termChip: {
    display: 'inline-block',
    padding: '0.35rem 0.75rem',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-sm)',
    cursor: 'pointer',
    fontFamily: 'var(--font-serif)',
    letterSpacing: 'var(--track-normal)',
    transition: 'border-color 0.15s, color 0.15s',
  },
};

export default function GlossaryEntry({ termId, onBack, onSelectTerm }) {
  const entry = getGlossaryEntry(termId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [termId]);

  if (!entry) {
    return (
      <div>
        <button style={S.backButton} onClick={onBack}>← 返回词典</button>
        <p style={{ color: 'var(--ink-light)' }}>未找到此词条：{termId}</p>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === entry.category);

  return (
    <div>
      <button style={S.backButton} onClick={onBack}>← 返回词典</button>

      <div style={S.header}>
        {category && <div style={S.categoryTag}>{category.name}</div>}
        <h1 style={S.term}>{entry.term}</h1>
        {entry.pinyin && <div style={S.pinyin}>{entry.pinyin}</div>}
      </div>

      <div style={S.short}>{entry.short}</div>

      {entry.long?.length > 0 && (
        <div style={S.longSection}>
          <div style={S.longLabel}>详　解</div>
          {entry.long.map((para, i) => (
            <p key={i} style={S.longP}>{para}</p>
          ))}
        </div>
      )}

      {entry.related?.length > 0 && (
        <div style={S.relatedSection}>
          <div style={S.relatedLabel}>相关词条</div>
          <div style={S.relatedRow}>
            {entry.related.map(relId => {
              const rel = getGlossaryEntry(relId);
              if (!rel) return null;
              return (
                <span
                  key={relId}
                  style={S.termChip}
                  onClick={() => onSelectTerm(relId)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--vermilion)';
                    e.currentTarget.style.color = 'var(--vermilion)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--paper-edge)';
                    e.currentTarget.style.color = 'var(--ink-soft)';
                  }}
                >
                  {rel.term}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
