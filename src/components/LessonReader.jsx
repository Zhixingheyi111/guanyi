// 单课阅读器：渲染结构化课程内容 + 相关词/示例卦 + 上下课导航
import { useEffect } from 'react';
import { getLessonById, getLessonByOrder } from '../data/lessons';
import { getHexagramById } from '../data/hexagrams';
import { markLessonRead } from '../utils/storage';

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
    marginBottom: 'var(--space-6)',
  },
  courseNo: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: 'var(--space-2)',
  },
  title: {
    fontSize: 'var(--text-xl)',
    fontWeight: 500,
    letterSpacing: 'var(--track-wide)',
    color: 'var(--ink)',
    margin: 0,
    lineHeight: 1.4,
  },
  intro: {
    color: 'var(--ink-light)',
    fontSize: 'var(--text-sm)',
    marginTop: 'var(--space-3)',
    letterSpacing: 'var(--track-normal)',
    fontStyle: 'italic',
  },
  content: {
    marginTop: 'var(--space-4)',
  },
  h: {
    fontSize: 'var(--text-md)',
    fontWeight: 500,
    color: 'var(--ink)',
    letterSpacing: 'var(--track-wide)',
    marginTop: 'var(--space-6)',
    marginBottom: 'var(--space-3)',
    borderLeft: '3px solid var(--vermilion)',
    paddingLeft: '0.6rem',
    lineHeight: 1.4,
  },
  p: {
    color: 'var(--ink)',
    fontSize: 'var(--text-base)',
    lineHeight: 1.95,
    margin: 'var(--space-3) 0',
    letterSpacing: '0.01em',
  },
  termHighlight: {
    color: 'var(--vermilion)',
    cursor: 'pointer',
    padding: '0 0.1em',
    borderBottom: '1px dashed var(--vermilion)',
    fontWeight: 500,
  },
  quote: {
    borderLeft: '3px solid var(--gold)',
    paddingLeft: 'var(--space-4)',
    margin: 'var(--space-5) 0',
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-base)',
    lineHeight: 1.95,
    fontStyle: 'italic',
  },
  quoteFrom: {
    display: 'block',
    marginTop: 'var(--space-2)',
    color: 'var(--ink-light)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    fontStyle: 'normal',
  },
  ul: {
    listStyle: 'none',
    padding: 0,
    margin: 'var(--space-3) 0',
  },
  li: {
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-base)',
    lineHeight: 1.95,
    margin: 'var(--space-2) 0',
    paddingLeft: 'var(--space-4)',
    position: 'relative',
  },
  liBullet: {
    position: 'absolute',
    left: '0.5rem',
    color: 'var(--vermilion)',
  },
  note: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderLeft: '3px solid var(--wuxing-wood)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3) var(--space-4)',
    margin: 'var(--space-5) 0',
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.85,
    fontStyle: 'italic',
  },
  // 底部链接区
  linksSection: {
    marginTop: 'var(--space-8)',
    paddingTop: 'var(--space-5)',
    borderTop: '1px solid var(--paper-edge)',
  },
  linksLabel: {
    fontSize: '0.75rem',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: 'var(--space-2)',
  },
  linksRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-2)',
    marginBottom: 'var(--space-4)',
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
  guaChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.35rem',
    padding: '0.35rem 0.75rem',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--ink)',
    fontSize: 'var(--text-sm)',
    cursor: 'pointer',
    fontFamily: 'var(--font-serif)',
    letterSpacing: 'var(--track-normal)',
  },
  // 上一课/下一课
  navRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--space-3)',
    marginTop: 'var(--space-6)',
  },
  navButton: {
    padding: 'var(--space-3)',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-normal)',
    cursor: 'pointer',
    textAlign: 'left',
    minHeight: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '0.2rem',
  },
  navButtonDisabled: {
    opacity: 0.35,
    cursor: 'default',
  },
  navArrow: {
    fontSize: '0.7rem',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
  },
  navTitle: {
    color: 'var(--ink)',
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
  },
};

// 渲染段落里的 content 数组（支持字符串和 {term} 对象）
function RenderInline({ content, onTermClick }) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return null;
  return content.map((node, i) => {
    if (typeof node === 'string') return node;
    if (node && typeof node === 'object' && node.term) {
      return (
        <span
          key={i}
          style={S.termHighlight}
          onClick={(e) => { e.stopPropagation(); onTermClick(node.term); }}
        >
          {node.label || node.term}
        </span>
      );
    }
    return null;
  });
}

function Section({ section, onTermClick }) {
  switch (section.type) {
    case 'h':
      return <h3 style={S.h}>{section.content}</h3>;
    case 'p':
      return (
        <p style={S.p}>
          <RenderInline content={section.content} onTermClick={onTermClick} />
        </p>
      );
    case 'quote':
      return (
        <blockquote style={S.quote}>
          {section.content}
          {section.from && <span style={S.quoteFrom}>—　{section.from}</span>}
        </blockquote>
      );
    case 'ul':
      return (
        <ul style={S.ul}>
          {section.items.map((item, i) => (
            <li key={i} style={S.li}>
              <span style={S.liBullet}>·</span>
              {item}
            </li>
          ))}
        </ul>
      );
    case 'note':
      return <div style={S.note}>{section.content}</div>;
    default:
      return null;
  }
}

export default function LessonReader({ lessonId, onBack, onSelectLesson, onSelectTerm, onSelectHexagram }) {
  const lesson = getLessonById(lessonId);

  // 打开课程即标记为已读
  useEffect(() => {
    const l = getLessonById(lessonId);
    if (l && !l.placeholder) {
      markLessonRead(l.id);
    }
    // 打开新课程时滚到顶部
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [lessonId]);

  if (!lesson) {
    return (
      <div>
        <button style={S.backButton} onClick={onBack}>← 返回入门</button>
        <p style={{ color: 'var(--ink-light)' }}>课程不存在</p>
      </div>
    );
  }

  const prev = getLessonByOrder(lesson.order - 1);
  const next = getLessonByOrder(lesson.order + 1);

  const exampleGuas = (lesson.exampleHexagrams || [])
    .map(id => getHexagramById(id))
    .filter(Boolean);

  return (
    <div>
      <button style={S.backButton} onClick={onBack}>← 返回入门</button>

      <div style={S.header}>
        <div style={S.courseNo}>第　{lesson.order}　课</div>
        <h1 style={S.title}>{lesson.title}</h1>
        <div style={S.intro}>{lesson.intro}</div>
      </div>

      {lesson.placeholder ? (
        <div style={{ ...S.note, textAlign: 'center', fontStyle: 'italic' }}>
          此课尚在撰写中……
        </div>
      ) : (
        <div style={S.content}>
          {lesson.sections.map((section, i) => (
            <Section key={i} section={section} onTermClick={onSelectTerm} />
          ))}
        </div>
      )}

      {/* 相关词条 + 示例卦 */}
      {(lesson.relatedTerms?.length > 0 || exampleGuas.length > 0) && (
        <div style={S.linksSection}>
          {lesson.relatedTerms?.length > 0 && (
            <>
              <div style={S.linksLabel}>相关词条</div>
              <div style={S.linksRow}>
                {lesson.relatedTerms.map(termId => (
                  <span
                    key={termId}
                    style={S.termChip}
                    onClick={() => onSelectTerm(termId)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--vermilion)';
                      e.currentTarget.style.color = 'var(--vermilion)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--paper-edge)';
                      e.currentTarget.style.color = 'var(--ink-soft)';
                    }}
                  >
                    {termId}
                  </span>
                ))}
              </div>
            </>
          )}

          {exampleGuas.length > 0 && (
            <>
              <div style={S.linksLabel}>示例卦</div>
              <div style={S.linksRow}>
                {exampleGuas.map(gua => (
                  <span
                    key={gua.id}
                    style={S.guaChip}
                    onClick={() => onSelectHexagram(gua.id)}
                  >
                    <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{gua.symbol}</span>
                    {gua.name}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 上一课 / 下一课 */}
      <div style={S.navRow}>
        {prev ? (
          <button
            style={S.navButton}
            onClick={() => onSelectLesson(prev.id)}
          >
            <span style={S.navArrow}>← 上一课</span>
            <span style={S.navTitle}>{prev.title}</span>
          </button>
        ) : (
          <div style={{ ...S.navButton, ...S.navButtonDisabled }}>
            <span style={S.navArrow}>← 上一课</span>
            <span style={{ ...S.navTitle, color: 'var(--ink-whisper)' }}>—　已是首课</span>
          </div>
        )}

        {next ? (
          <button
            style={{ ...S.navButton, textAlign: 'right' }}
            onClick={() => onSelectLesson(next.id)}
          >
            <span style={{ ...S.navArrow, textAlign: 'right' }}>下一课 →</span>
            <span style={S.navTitle}>{next.title}</span>
          </button>
        ) : (
          <div style={{ ...S.navButton, ...S.navButtonDisabled, textAlign: 'right' }}>
            <span style={{ ...S.navArrow, textAlign: 'right' }}>下一课 →</span>
            <span style={{ ...S.navTitle, color: 'var(--ink-whisper)' }}>已是末课　—</span>
          </div>
        )}
      </div>
    </div>
  );
}

