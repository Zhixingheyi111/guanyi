// 单卦详情页：做人做事提醒 + 完整经典原文 + 卦笔记
import { getHexagramById } from '../data/hexagrams';
import { getHexagramNote, saveHexagramNote } from '../utils/storage';
import HexagramLifeGuide from './HexagramLifeGuide';
import NoteEditor from './NoteEditor';

const S = {
  page: {
    paddingBottom: 'var(--space-4)',
  },
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
    position: 'relative',
    borderTop: '1px solid var(--paper-edge)',
    borderBottom: '1px solid var(--paper-edge)',
    padding: 'var(--space-5) 0',
    marginBottom: 'var(--space-4)',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '120px minmax(0, 1fr)',
    gap: 'var(--space-5)',
    alignItems: 'center',
  },
  heroMark: {
    minHeight: '166px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'var(--space-3)',
    background: 'rgba(250, 247, 239, 0.7)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-paper)',
  },
  heroNumber: {
    color: 'var(--vermilion)',
    fontSize: 'var(--text-xs)',
    letterSpacing: 'var(--track-wide)',
    writingMode: 'vertical-rl',
    lineHeight: 1.7,
  },
  lineStack: {
    width: '78px',
    display: 'grid',
    gap: '10px',
  },
  fullLine: {
    height: '6px',
    width: '78px',
    background: 'var(--ink)',
    borderRadius: '2px',
  },
  brokenLine: {
    height: '6px',
    width: '78px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '14px',
  },
  halfLine: {
    height: '6px',
    background: 'var(--ink)',
    borderRadius: '2px',
  },
  heroText: {
    minWidth: 0,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--space-2)',
    minWidth: 0,
  },
  symbol: {
    color: 'var(--gold)',
    fontSize: '1.5rem',
    lineHeight: 1,
    flex: '0 0 auto',
  },
  name: {
    color: 'var(--ink)',
    fontSize: '2.45rem',
    lineHeight: 1.08,
    letterSpacing: 0,
    fontWeight: 500,
  },
  pinyin: {
    color: 'var(--vermilion-deep)',
    fontFamily: 'var(--font-ui)',
    fontSize: 'var(--text-md)',
    letterSpacing: 'var(--track-tight)',
    marginTop: 'var(--space-2)',
  },
  trigramRow: {
    display: 'inline-flex',
    alignItems: 'center',
    minHeight: '32px',
    color: 'var(--ink-light)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    marginTop: 'var(--space-3)',
    padding: '0.25rem 0.65rem',
    border: '1px solid var(--paper-edge)',
    borderRadius: '999px',
    background: 'rgba(250, 247, 239, 0.72)',
  },
  heroTheme: {
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.85,
    margin: 'var(--space-4) 0 0',
    paddingTop: 'var(--space-3)',
    borderTop: '1px dashed var(--paper-edge)',
  },
  quickNav: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    gap: 'var(--space-2)',
    marginBottom: 'var(--space-2)',
  },
  quickNavButton: {
    minWidth: 0,
    minHeight: '40px',
    padding: '0.45rem 0.25rem',
    background: 'rgba(250, 247, 239, 0.72)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--ink-soft)',
    cursor: 'pointer',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-normal)',
  },
  section: {
    borderTop: '1px solid var(--paper-edge)',
    paddingTop: 'var(--space-6)',
    marginTop: 'var(--space-6)',
    scrollMarginTop: 'var(--space-5)',
    contentVisibility: 'auto',
    containIntrinsicSize: '1px 520px',
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    marginBottom: 'var(--space-3)',
  },
  sectionTitle: {
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    color: 'var(--ink)',
    fontWeight: 500,
    borderLeft: '3px solid var(--vermilion)',
    paddingLeft: '0.6rem',
    lineHeight: 1.4,
    whiteSpace: 'nowrap',
  },
  sectionRule: {
    height: '1px',
    flex: 1,
    background: 'var(--paper-edge)',
  },
  sectionMeta: {
    color: 'var(--ink-light)',
    fontSize: 'var(--text-xs)',
    letterSpacing: 'var(--track-wide)',
    whiteSpace: 'nowrap',
  },
  original: {
    color: 'var(--ink)',
    fontSize: '1.05rem',
    lineHeight: 2.05,
    margin: 'var(--space-2) 0',
    fontStyle: 'italic',
    letterSpacing: 'var(--track-tight)',
  },
  translation: {
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-base)',
    lineHeight: 1.9,
    margin: 'var(--space-2) 0',
  },
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
  noteKey: {
    color: 'var(--vermilion)',
    fontWeight: 500,
  },
  noteBullet: {
    color: 'var(--ink-whisper)',
    marginRight: '0.25rem',
  },
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
  yaoList: {
    display: 'grid',
    gap: 'var(--space-3)',
  },
  yaoBlock: {
    background: 'rgba(250, 247, 239, 0.72)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
  },
  yaoSummary: {
    listStyle: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-4)',
    cursor: 'pointer',
    minHeight: '58px',
  },
  yaoSummaryText: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    gap: 'var(--space-3)',
  },
  yaoTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.2rem',
    minWidth: 0,
  },
  yaoPosition: {
    fontSize: 'var(--text-base)',
    color: 'var(--ink)',
    letterSpacing: 'var(--track-wide)',
    fontWeight: 500,
  },
  yaoHint: {
    color: 'var(--ink-light)',
    fontSize: 'var(--text-xs)',
    letterSpacing: 'var(--track-wide)',
  },
  yaoContent: {
    padding: '0 var(--space-4) var(--space-4)',
    borderTop: '1px dashed var(--paper-edge)',
  },
  singleYaoLine: {
    height: '4px',
    width: '64px',
    background: 'var(--ink)',
    borderRadius: '2px',
    flex: '0 0 auto',
  },
  singleYaoBroken: {
    display: 'flex',
    gap: '10px',
    width: '64px',
    flex: '0 0 auto',
  },
  singleYaoHalf: {
    height: '4px',
    width: '27px',
    background: 'var(--ink)',
    borderRadius: '2px',
  },
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
    letterSpacing: 'var(--track-wide)',
  },
  subSectionAuthor: {
    fontSize: '0.7rem',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-normal)',
    fontStyle: 'italic',
  },
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

function HexagramDiagram({ binary }) {
  const lines = typeof binary === 'string' ? binary.split('').reverse() : [];
  return (
    <div style={S.lineStack} aria-hidden="true">
      {lines.map((line, index) => {
        if (line === '1') return <div key={index} style={S.fullLine} />;
        return (
          <div key={index} style={S.brokenLine}>
            <div style={S.halfLine} />
            <div style={S.halfLine} />
          </div>
        );
      })}
    </div>
  );
}

function Section({ id, title, meta, children }) {
  return (
    <section id={id} style={S.section}>
      <div style={S.sectionHead}>
        <div style={S.sectionTitle}>{title}</div>
        <div style={S.sectionRule} />
        {meta && <div style={S.sectionMeta}>{meta}</div>}
      </div>
      {children}
    </section>
  );
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

function QuickNav() {
  const items = [
    { id: 'life-guide', label: '导读' },
    { id: 'guaci', label: '卦辞' },
    { id: 'yaoci', label: '六爻' },
    { id: 'notes', label: '笔记' },
  ];

  return (
    <nav style={S.quickNav} aria-label="卦详情章节">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          style={S.quickNavButton}
          onClick={() => scrollToSection(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function YaoBlock({ yao, defaultOpen }) {
  const xx = unwrapXiaoxiang(yao.xiaoxiang);

  return (
    <details style={S.yaoBlock} {...(defaultOpen ? { open: true } : {})}>
      <summary style={S.yaoSummary}>
        <span style={S.yaoSummaryText}>
          <SingleYaoDiagram position={yao.position} />
          <span style={S.yaoTitle}>
            <span style={S.yaoPosition}>{yao.position}</span>
            <span style={S.yaoHint}>爻辞 · 小象</span>
          </span>
        </span>
        <span style={S.yaoHint}>详读</span>
      </summary>

      <div style={S.yaoContent}>
        <div style={S.subSectionHeader}>
          <span style={S.subSectionTitle}>爻辞</span>
          <span style={S.subSectionAuthor}>· 周公</span>
        </div>
        <p style={S.original}>{yao.original}</p>
        {yao.translation && (
          <p style={S.translation}>{yao.translation}</p>
        )}
        <NotesList notes={yao.notes} />

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
    </details>
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
    <div style={S.page}>
      <button style={S.backButton} onClick={onBack}>← 返回六十四卦</button>

      {/* 卦象头部 */}
      <header style={S.header}>
        <div style={S.hero}>
          <div style={S.heroMark}>
            <div style={S.heroNumber}>第{hexagram.id}卦</div>
            <HexagramDiagram binary={hexagram.binary} />
          </div>
          <div style={S.heroText}>
            <div style={S.nameRow}>
              <span style={S.symbol}>{hexagram.symbol}</span>
              <span style={S.name}>{hexagram.name}</span>
            </div>
            {hexagram.pinyin && <div style={S.pinyin}>{hexagram.pinyin}</div>}
            <div style={S.trigramRow}>上{hexagram.upper}　下{hexagram.lower}</div>
            {hexagram.guaci?.original && (
              <p style={S.heroTheme}>{hexagram.guaci.original}</p>
            )}
          </div>
        </div>
      </header>

      <QuickNav />

      <HexagramLifeGuide hexagram={hexagram} />

      {/* 卦辞 */}
      <Section id="guaci" title="卦辞" meta="原文">
        <p style={S.original}>{hexagram.guaci.original}</p>
        {hexagram.guaci.translation && (
          <p style={S.translation}>{hexagram.guaci.translation}</p>
        )}
        <NotesList notes={hexagram.guaci.notes} />
      </Section>

      {/* 彖辞 */}
      {hexagram.tuanci && (
        <Section title="彖传">
          <p style={S.classicText}>{hexagram.tuanci.original}</p>
          {hexagram.tuanci.translation && (
            <p style={S.translation}>{hexagram.tuanci.translation}</p>
          )}
          <NotesList notes={hexagram.tuanci.notes} />
        </Section>
      )}

      {/* 象传 */}
      {hexagram.daxiang && (
        <Section title="象传">
          <p style={S.classicText}>{hexagram.daxiang.original}</p>
          {hexagram.daxiang.translation && (
            <p style={S.translation}>{hexagram.daxiang.translation}</p>
          )}
          <NotesList notes={hexagram.daxiang.notes} />
        </Section>
      )}

      {/* 文言传 */}
      {hasWenyan && (
        <Section title="文言传">
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
        </Section>
      )}

      {/* 六爻详解 */}
      <Section id="yaoci" title="六爻详解" meta={`${hexagram.yaoci.length} 爻`}>
        <div style={S.yaoList}>
          {hexagram.yaoci.map((yao, i) => (
            <YaoBlock key={yao.position || i} yao={yao} defaultOpen={i === 0} />
          ))}
        </div>
      </Section>

      {/* 我的笔记 */}
      <Section id="notes" title="我的笔记">
        <NoteEditor
          key={hexagram.id}
          initialValue={getHexagramNote(hexagram.id)}
          onSave={(v) => saveHexagramNote(hexagram.id, v)}
          placeholder="写下你对这一卦的理解……"
          minHeight="140px"
        />
      </Section>

      {/* 底部返回按钮 */}
      <button style={S.backButtonBottom} onClick={onBack}>← 返回六十四卦</button>
    </div>
  );
}
