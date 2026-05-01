// 单卦详情页：完整经典原文 + 卦笔记 + 问学
import { getHexagramById } from '../data/hexagrams';
import { getHexagramNote, saveHexagramNote } from '../utils/storage';
import StudyChat from './StudyChat';
import NoteEditor from './NoteEditor';

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
  backButtonBottom: {
    display: 'block',
    width: '100%',
    marginTop: 'var(--space-6)',
    padding: 'var(--space-3)',
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
  header: {
    textAlign: 'center',
    marginBottom: 'var(--space-6)',
  },
  nameRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    gap: 'var(--space-3)',
  },
  symbol: {
    fontSize: '3rem',
    lineHeight: 1,
    color: 'var(--ink)',
  },
  name: {
    fontSize: '2rem',
    letterSpacing: 'var(--track-xwide)',
    color: 'var(--ink)',
    fontWeight: 500,
  },
  pinyin: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
    marginTop: '0.5rem',
    fontStyle: 'italic',
  },
  trigramRow: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
    marginTop: 'var(--space-4)',
  },
  // 分节
  section: {
    borderTop: '1px solid var(--paper-edge)',
    paddingTop: 'var(--space-5)',
    marginTop: 'var(--space-5)',
  },
  sectionTitle: {
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-xwide)',
    color: 'var(--ink)',
    marginBottom: 'var(--space-3)',
    fontWeight: 500,
    // 左侧加一道朱砂竖线，像古籍的"节标"
    borderLeft: '3px solid var(--vermilion)',
    paddingLeft: '0.6rem',
    lineHeight: 1.4,
  },
  // 经典原文：墨色、衬线、可读性优先
  original: {
    color: 'var(--ink)',
    fontSize: 'var(--text-base)',
    lineHeight: 2,
    margin: 'var(--space-2) 0',
    fontStyle: 'italic',
    letterSpacing: 'var(--track-tight)',
  },
  // 白话翻译：比原文稍淡，但仍可读
  translation: {
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-base)',
    lineHeight: 1.9,
    margin: 'var(--space-2) 0',
  },
  // 象辞大段文字：用正文颜色，保持可读
  classicText: {
    color: 'var(--ink-soft)',
    fontSize: '0.95rem',
    lineHeight: 2,
    margin: 'var(--space-2) 0',
  },
  notesList: {
    listStyle: 'none',
    padding: 0,
    margin: 'var(--space-3) 0 var(--space-2)',
  },
  noteItem: {
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.8,
    margin: '0.25rem 0',
  },
  // 关键字用朱砂色点亮
  noteKey: {
    color: 'var(--vermilion)',
    fontWeight: 500,
  },
  noteBullet: {
    color: 'var(--ink-whisper)',
    marginRight: '0.25rem',
  },
  // 文言传小节
  wenyanPart: {
    borderLeft: '2px solid var(--gold)',
    paddingLeft: 'var(--space-3)',
    margin: 'var(--space-4) 0',
  },
  wenyanSection: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-2)',
    fontWeight: 500,
  },
  // 爻详解卡片：浅宣纸底 + 墨色边框
  yaoBlock: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4) var(--space-4)',
    marginBottom: 'var(--space-4)',
  },
  yaoTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-3)',
    paddingBottom: 'var(--space-2)',
    borderBottom: '1px dashed var(--paper-edge)',
  },
  yaoPosition: {
    fontSize: 'var(--text-base)',
    color: 'var(--ink)',
    letterSpacing: 'var(--track-wide)',
    fontWeight: 500,
  },
  singleYaoLine: {
    height: '3px',
    width: '70px',
    background: 'var(--ink)',
    borderRadius: '1px',
  },
  singleYaoBroken: {
    display: 'flex',
    gap: '10px',
    width: '70px',
  },
  singleYaoHalf: {
    height: '3px',
    width: '30px',
    background: 'var(--ink)',
    borderRadius: '1px',
  },
  // 小象、白话等小标签（保留为旧用途；新结构用 subSection*）
  subLabel: {
    display: 'inline-block',
    fontSize: '0.7rem',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
    marginTop: 'var(--space-3)',
    marginBottom: 'var(--space-1)',
    padding: '0.1rem 0.45rem',
    border: '1px solid var(--paper-edge)',
    borderRadius: '2px',
    background: 'var(--paper)',
  },
  // 爻内分区（爻辞·周公 / 小象·孔子）
  subSectionHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--space-2)',
    marginTop: 'var(--space-3)',
    marginBottom: 'var(--space-2)',
    paddingBottom: 'var(--space-1)',
    borderBottom: '1px dashed var(--paper-edge)',
  },
  subSectionTitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink)',
    fontWeight: 500,
    letterSpacing: 'var(--track-xwide)',
  },
  subSectionAuthor: {
    fontSize: '0.7rem',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-normal)',
    fontStyle: 'italic',
  },
  // 爻内分隔（爻辞 ↔ 小象 之间）
  yaoInnerDivider: {
    height: 0,
    borderTop: '1px solid var(--paper-edge)',
    margin: 'var(--space-4) calc(-1 * var(--space-4))',
  },
};

// ── 内部辅助组件 ───────────────────────────────────────────────────────────

function NotesList({ notes }) {
  if (!notes || typeof notes !== 'object') return null;
  const entries = Object.entries(notes);
  if (entries.length === 0) return null;
  return (
    <ul style={S.notesList}>
      {entries.map(([key, value]) => (
        <li key={key} style={S.noteItem}>
          <span style={S.noteBullet}>·</span>
          <span style={S.noteKey}>{key}</span>
          <span style={{ color: 'var(--ink-light)' }}>：</span>
          {value}
        </li>
      ))}
    </ul>
  );
}

// 单爻图：通过 position 首字判断阴阳（九=阳、六=阴）
function SingleYaoDiagram({ position }) {
  const isYang = position.includes('九');
  if (isYang) return <div style={S.singleYaoLine} />;
  return (
    <div style={S.singleYaoBroken}>
      <div style={S.singleYaoHalf} />
      <div style={S.singleYaoHalf} />
    </div>
  );
}

// 兼容老 string 格式与新 {original, translation} 对象格式
function unwrapXiaoxiang(x) {
  if (!x) return null;
  if (typeof x === 'string') return { original: x, translation: null };
  return x;
}

// ── 主组件 ─────────────────────────────────────────────────────────────────

export default function HexagramDetail({ hexagramId, onBack }) {
  const hexagram = getHexagramById(hexagramId);
  if (!hexagram) {
    return (
      <div>
        <button style={S.backButton} onClick={onBack}>← 返回六十四卦</button>
        <p style={{ color: 'var(--ink-light)' }}>未找到该卦</p>
      </div>
    );
  }

  const hasWenyan = hexagram.wenyan?.parts?.length > 0;

  return (
    <div>
      <button style={S.backButton} onClick={onBack}>← 返回六十四卦</button>

      {/* 卦象头部 */}
      <div style={S.header}>
        <div style={S.nameRow}>
          <span style={S.symbol}>{hexagram.symbol}</span>
          <span style={S.name}>{hexagram.name}</span>
        </div>
        {hexagram.pinyin && <div style={S.pinyin}>{hexagram.pinyin}</div>}
        <div style={S.trigramRow}>上{hexagram.upper}　下{hexagram.lower}</div>
      </div>

      {/* 卦辞 */}
      <div style={S.section}>
        <div style={S.sectionTitle}>卦　辞</div>
        <p style={S.original}>{hexagram.guaci.original}</p>
        {hexagram.guaci.translation && (
          <p style={S.translation}>{hexagram.guaci.translation}</p>
        )}
        <NotesList notes={hexagram.guaci.notes} />
      </div>

      {/* 彖辞 */}
      {hexagram.tuanci && (
        <div style={S.section}>
          <div style={S.sectionTitle}>彖　传</div>
          <p style={S.classicText}>{hexagram.tuanci.original}</p>
          {hexagram.tuanci.translation && (
            <p style={S.translation}>{hexagram.tuanci.translation}</p>
          )}
          <NotesList notes={hexagram.tuanci.notes} />
        </div>
      )}

      {/* 象传 */}
      {hexagram.daxiang && (
        <div style={S.section}>
          <div style={S.sectionTitle}>象　传</div>
          <p style={S.classicText}>{hexagram.daxiang.original}</p>
          {hexagram.daxiang.translation && (
            <p style={S.translation}>{hexagram.daxiang.translation}</p>
          )}
          <NotesList notes={hexagram.daxiang.notes} />
        </div>
      )}

      {/* 文言传 */}
      {hasWenyan && (
        <div style={S.section}>
          <div style={S.sectionTitle}>文　言　传</div>
          {hexagram.wenyan.parts.map((part, i) => (
            <div key={i} style={S.wenyanPart}>
              <div style={S.wenyanSection}>{part.section}</div>
              <p style={S.classicText}>{part.original}</p>
              {part.translation && (
                <p style={S.translation}>{part.translation}</p>
              )}
              <NotesList notes={part.notes} />
            </div>
          ))}
        </div>
      )}

      {/* 六爻详解 */}
      <div style={S.section}>
        <div style={S.sectionTitle}>六　爻　详　解</div>
        {hexagram.yaoci.map((yao, i) => {
          const xx = unwrapXiaoxiang(yao.xiaoxiang);
          return (
            <div key={i} style={S.yaoBlock}>
              <div style={S.yaoTitle}>
                <span style={S.yaoPosition}>{yao.position}</span>
                <SingleYaoDiagram position={yao.position} />
              </div>

              {/* 爻辞 · 周公 */}
              <div style={S.subSectionHeader}>
                <span style={S.subSectionTitle}>爻辞</span>
                <span style={S.subSectionAuthor}>· 周公</span>
              </div>
              <p style={S.original}>{yao.original}</p>
              {yao.translation && (
                <p style={S.translation}>{yao.translation}</p>
              )}
              <NotesList notes={yao.notes} />

              {/* 小象 · 孔子 */}
              {xx?.original && (
                <>
                  <div style={S.yaoInnerDivider} />
                  <div style={S.subSectionHeader}>
                    <span style={S.subSectionTitle}>小象</span>
                    <span style={S.subSectionAuthor}>· 孔子</span>
                  </div>
                  <p style={S.classicText}>{xx.original}</p>
                  {xx.translation && (
                    <p style={S.translation}>{xx.translation}</p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 我的笔记 */}
      <div style={S.section}>
        <div style={S.sectionTitle}>我　的　笔　记</div>
        <NoteEditor
          key={hexagram.id}
          initialValue={getHexagramNote(hexagram.id)}
          onSave={(v) => saveHexagramNote(hexagram.id, v)}
          placeholder="写下你对这一卦的理解……"
          minHeight="140px"
        />
      </div>

      {/* 问学 */}
      <div style={S.section}>
        <div style={S.sectionTitle}>问　学</div>
        <StudyChat hexagram={hexagram} />
      </div>

      {/* 底部返回按钮 */}
      <button style={S.backButtonBottom} onClick={onBack}>← 返回六十四卦</button>
    </div>
  );
}
