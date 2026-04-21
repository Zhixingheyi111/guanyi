// 单卦详情页：完整经典原文 + 问学
import { getHexagramById } from '../data/hexagrams';
import StudyChat from './StudyChat';

const S = {
  backButton: {
    background: 'transparent',
    border: 'none',
    color: '#888',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    padding: '0.3rem 0',
    marginBottom: '1.5rem',
  },
  backButtonBottom: {
    display: 'block',
    width: '100%',
    marginTop: '2rem',
    padding: '0.6rem',
    background: 'transparent',
    border: '1px solid #555',
    color: '#aaa',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    letterSpacing: '0.15em',
    cursor: 'pointer',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  nameRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    gap: '0.75rem',
  },
  symbol: {
    fontSize: '3rem',
    lineHeight: 1,
  },
  name: {
    fontSize: '2rem',
    letterSpacing: '0.2em',
  },
  pinyin: {
    fontSize: '0.85rem',
    color: '#888',
    letterSpacing: '0.1em',
    marginTop: '0.5rem',
    fontStyle: 'italic',
  },
  trigramRow: {
    fontSize: '0.85rem',
    color: '#888',
    letterSpacing: '0.15em',
    marginTop: '1rem',
  },
  // 分节
  section: {
    borderTop: '1px solid #333',
    paddingTop: '1.5rem',
    marginTop: '1.5rem',
  },
  sectionTitle: {
    fontSize: '0.85rem',
    letterSpacing: '0.25em',
    color: '#aaa',
    marginBottom: '0.75rem',
  },
  original: {
    color: '#ddd',
    fontSize: '1rem',
    lineHeight: '2',
    margin: '0.5rem 0',
    fontStyle: 'italic',
  },
  translation: {
    color: '#bbb',
    fontSize: '0.9rem',
    lineHeight: '1.8',
    margin: '0.5rem 0',
  },
  classicText: {
    color: '#ccc',
    fontSize: '0.95rem',
    lineHeight: '2',
    margin: '0.5rem 0',
  },
  notesList: {
    listStyle: 'none',
    padding: 0,
    margin: '0.5rem 0 0.75rem',
  },
  noteItem: {
    color: '#888',
    fontSize: '0.85rem',
    lineHeight: '1.7',
    margin: '0.2rem 0',
  },
  noteKey: {
    color: '#aaa',
  },
  // 文言传小节
  wenyanPart: {
    borderLeft: '2px solid #333',
    paddingLeft: '0.9rem',
    margin: '1rem 0',
  },
  wenyanSection: {
    fontSize: '0.85rem',
    color: '#aaa',
    letterSpacing: '0.15em',
    marginBottom: '0.5rem',
  },
  // 爻详解
  yaoBlock: {
    background: '#111',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '1rem 1.1rem',
    marginBottom: '1rem',
  },
  yaoTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  yaoPosition: {
    fontSize: '1rem',
    color: '#ddd',
    letterSpacing: '0.15em',
  },
  singleYaoLine: {
    height: '3px',
    width: '70px',
    background: '#ccc',
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
    background: '#ccc',
    borderRadius: '1px',
  },
  subLabel: {
    fontSize: '0.75rem',
    color: '#888',
    letterSpacing: '0.15em',
    marginTop: '0.75rem',
    marginBottom: '0.3rem',
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
          ▪ <span style={S.noteKey}>{key}</span>：{value}
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

// ── 主组件 ─────────────────────────────────────────────────────────────────

export default function HexagramDetail({ hexagramId, onBack }) {
  const hexagram = getHexagramById(hexagramId);
  if (!hexagram) {
    return (
      <div>
        <button style={S.backButton} onClick={onBack}>← 返回六十四卦</button>
        <p style={{ color: '#888' }}>未找到该卦</p>
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
        <div style={S.sectionTitle}>📜 卦辞</div>
        <p style={S.original}>{hexagram.guaci.original}</p>
        {hexagram.guaci.translation && (
          <p style={S.translation}>{hexagram.guaci.translation}</p>
        )}
        <NotesList notes={hexagram.guaci.notes} />
      </div>

      {/* 彖辞 */}
      {hexagram.tuanci && (
        <div style={S.section}>
          <div style={S.sectionTitle}>📜 彖辞</div>
          <p style={S.original}>{hexagram.tuanci.original}</p>
          {hexagram.tuanci.translation && (
            <p style={S.translation}>{hexagram.tuanci.translation}</p>
          )}
          <NotesList notes={hexagram.tuanci.notes} />
        </div>
      )}

      {/* 象传 */}
      {hexagram.daxiang && (
        <div style={S.section}>
          <div style={S.sectionTitle}>📜 象传</div>
          <p style={S.original}>{hexagram.daxiang.original}</p>
          {hexagram.daxiang.translation && (
            <p style={S.translation}>{hexagram.daxiang.translation}</p>
          )}
          <NotesList notes={hexagram.daxiang.notes} />
        </div>
      )}

      {/* 文言传 */}
      {hasWenyan && (
        <div style={S.section}>
          <div style={S.sectionTitle}>📜 文言传</div>
          {hexagram.wenyan.parts.map((part, i) => (
            <div key={i} style={S.wenyanPart}>
              <div style={S.wenyanSection}>{part.section}</div>
              <p style={S.original}>{part.original}</p>
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
        <div style={S.sectionTitle}>📜 六爻详解</div>
        {hexagram.yaoci.map((yao, i) => (
          <div key={i} style={S.yaoBlock}>
            <div style={S.yaoTitle}>
              <span style={S.yaoPosition}>{yao.position}</span>
              <SingleYaoDiagram position={yao.position} />
            </div>
            <p style={S.original}>{yao.original}</p>
            {yao.xiaoxiang && (
              <>
                <div style={S.subLabel}>小象</div>
                <p style={{ ...S.classicText, margin: 0 }}>{yao.xiaoxiang}</p>
              </>
            )}
            {yao.translation && (
              <>
                <div style={S.subLabel}>白话</div>
                <p style={{ ...S.translation, margin: 0 }}>{yao.translation}</p>
              </>
            )}
            <NotesList notes={yao.notes} />
          </div>
        ))}
      </div>

      {/* 问学 */}
      <div style={S.section}>
        <div style={S.sectionTitle}>📖 问学</div>
        <StudyChat hexagram={hexagram} />
      </div>

      {/* 底部返回按钮 */}
      <button style={S.backButtonBottom} onClick={onBack}>← 返回六十四卦</button>
    </div>
  );
}
