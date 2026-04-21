import { useState } from 'react';

const S = {
  section: {
    borderTop: '1px solid #333',
    paddingTop: '1.5rem',
    marginTop: '1.5rem',
  },
  sectionTitle: {
    fontSize: '0.75rem',
    letterSpacing: '0.25em',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
  },
  guaHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.75rem',
    marginBottom: '0.5rem',
  },
  guaName: {
    fontSize: '1.5rem',
    letterSpacing: '0.15em',
  },
  guaSymbol: {
    fontSize: '2.5rem',
    lineHeight: 1,
  },
  original: {
    color: '#aaa',
    fontSize: '0.9rem',
    lineHeight: '1.8',
    margin: '0.5rem 0',
    fontStyle: 'italic',
  },
  translation: {
    color: '#bbb',
    fontSize: '0.9rem',
    lineHeight: '1.8',
    margin: '0.5rem 0',
  },
  notesList: {
    margin: '0.5rem 0 0.75rem',
    paddingLeft: '0.25rem',
  },
  noteItem: {
    color: '#888',
    fontSize: '0.85rem',
    lineHeight: '1.7',
    margin: '0.15rem 0',
  },
  noteKey: {
    color: '#aaa',
  },
  subTitle: {
    fontSize: '0.75rem',
    letterSpacing: '0.2em',
    color: '#888',
    marginBottom: '0.4rem',
  },
  classicBlock: {
    borderLeft: '2px solid #333',
    paddingLeft: '0.75rem',
    margin: '1rem 0',
  },
  classicText: {
    color: '#aaa',
    fontSize: '0.9rem',
    lineHeight: '1.9',
    margin: 0,
  },
  interpretation: {
    color: '#e8e8e8',
    fontSize: '1rem',
    lineHeight: '1.9',
    margin: '0.5rem 0',
  },
  yaoBlock: {
    background: '#111',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '0.75rem 1rem',
    marginBottom: '0.75rem',
  },
  yaoBlockChanging: {
    borderLeft: '2px solid #d4a24c',
  },
  yaoHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
    cursor: 'pointer',
    userSelect: 'none',
  },
  yaoArrow: {
    color: '#666',
    fontSize: '0.75rem',
    width: '0.75rem',
    display: 'inline-block',
  },
  yaoTitle: {
    fontSize: '0.85rem',
    color: '#aaa',
    letterSpacing: '0.1em',
    whiteSpace: 'nowrap',
  },
  yaoOriginalInline: {
    color: '#aaa',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    lineHeight: '1.6',
    flex: 1,
  },
  yaoBody: {
    marginTop: '0.6rem',
    paddingTop: '0.6rem',
    borderTop: '1px dashed #2a2a2a',
  },
  yaoChangingHint: {
    color: '#d4a24c',
    fontSize: '0.8rem',
    lineHeight: '1.6',
    margin: '0 0 0.6rem',
    letterSpacing: '0.05em',
  },
  sideGuaRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  sideGuaItem: {
    background: '#111',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '0.75rem 1rem',
  },
  sideDivider: {
    border: 0,
    borderTop: '1px solid #2a2a2a',
    margin: '0.6rem 0',
  },
  adviceGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  adviceItem: {
    background: '#111',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '0.75rem 1rem',
  },
  adviceLabel: {
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    color: '#888',
    marginBottom: '0.4rem',
  },
  adviceText: {
    fontSize: '0.95rem',
    color: '#e8e8e8',
    lineHeight: '1.8',
  },
  resetButton: {
    display: 'block',
    width: '100%',
    marginTop: '2rem',
    padding: '0.6rem',
    background: 'transparent',
    border: '1px solid #555',
    color: '#aaa',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '0.9rem',
    letterSpacing: '0.15em',
    cursor: 'pointer',
  },
};

function NotesList({ notes }) {
  if (!notes || typeof notes !== 'object') return null;
  const entries = Object.entries(notes);
  if (entries.length === 0) return null;
  return (
    <ul style={{ ...S.notesList, listStyle: 'none', padding: 0 }}>
      {entries.map(([key, value]) => (
        <li key={key} style={S.noteItem}>
          ▪ <span style={S.noteKey}>{key}</span>：{value}
        </li>
      ))}
    </ul>
  );
}

function YaoItem({ yao, index, isChanging }) {
  const [open, setOpen] = useState(isChanging);
  const blockStyle = isChanging
    ? { ...S.yaoBlock, ...S.yaoBlockChanging }
    : S.yaoBlock;
  return (
    <div style={blockStyle}>
      <div style={S.yaoHeader} onClick={() => setOpen(o => !o)}>
        <span style={S.yaoArrow}>{open ? '▾' : '▸'}</span>
        <span style={S.yaoTitle}>
          {isChanging ? '⚡ ' : ''}{yao.position}（第 {index + 1} 爻）
        </span>
        <span style={S.yaoOriginalInline}>{yao.original}</span>
      </div>
      {open && (
        <div style={S.yaoBody}>
          {isChanging && (
            <p style={S.yaoChangingHint}>
              ⚡ 此爻为动爻，详细解读见上方本卦解读
            </p>
          )}
          <div style={S.subTitle}>小象</div>
          <p style={{ ...S.classicText, marginBottom: '0.6rem' }}>{yao.xiaoxiang}</p>
          {yao.translation && (
            <>
              <div style={S.subTitle}>白话</div>
              <p style={{ ...S.translation, margin: '0 0 0.4rem' }}>{yao.translation}</p>
            </>
          )}
          <NotesList notes={yao.notes} />
        </div>
      )}
    </div>
  );
}

function GuaRow({ label, guaData, interpretation }) {
  if (!guaData) return null;
  return (
    <div style={S.sideGuaItem}>
      <div style={S.sectionTitle}>{label}</div>
      <div style={S.guaHeader}>
        <span style={{ fontSize: '1.5rem' }}>{guaData.symbol}</span>
        <span style={{ letterSpacing: '0.1em' }}>{guaData.name}</span>
      </div>
      {guaData.guaci?.original && (
        <p style={{ ...S.original, fontSize: '0.85rem', margin: '0.3rem 0' }}>
          {guaData.guaci.original}
        </p>
      )}
      {guaData.daxiang && (
        <p style={{ ...S.classicText, fontSize: '0.85rem', margin: '0.3rem 0' }}>
          {guaData.daxiang}
        </p>
      )}
      {interpretation && (
        <>
          <hr style={S.sideDivider} />
          <p style={{ ...S.interpretation, fontSize: '0.9rem', margin: 0 }}>{interpretation}</p>
        </>
      )}
    </div>
  );
}

export default function Reading({ question, hexagrams, changingPositions, interpretation, onReset }) {
  const { benGua, zongGua, cuoGua, huGua, bianGua } = hexagrams;
  const { comprehensiveAdvice } = interpretation;

  return (
    <div>
      {/* 问题 */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={S.sectionTitle}>您的问题</div>
        <p style={{ color: '#ccc', lineHeight: '1.7', margin: 0 }}>{question}</p>
      </div>

      {/* 本卦 */}
      <div style={S.section}>
        <div style={S.sectionTitle}>本卦 · 当下处境</div>
        <div style={S.guaHeader}>
          <span style={S.guaSymbol}>{benGua.symbol}</span>
          <span style={S.guaName}>{benGua.name}</span>
        </div>
        <p style={S.original}>{benGua.guaci.original}</p>
        {benGua.guaci.translation && (
          <p style={S.translation}>{benGua.guaci.translation}</p>
        )}
        <NotesList notes={benGua.guaci.notes} />

        {benGua.tuanci && (
          <div style={S.classicBlock}>
            <div style={S.subTitle}>彖传</div>
            <p style={S.classicText}>{benGua.tuanci}</p>
          </div>
        )}

        {benGua.daxiang && (
          <div style={S.classicBlock}>
            <div style={S.subTitle}>大象</div>
            <p style={S.classicText}>{benGua.daxiang}</p>
          </div>
        )}

        <p style={S.interpretation}>{interpretation.benGuaInterpretation}</p>
      </div>

      {/* 六爻 */}
      <div style={S.section}>
        <div style={S.sectionTitle}>
          六爻{changingPositions.length > 0 && ` · ${changingPositions.length} 动爻`}
        </div>
        {benGua.yaoci.map((yao, index) => (
          <YaoItem
            key={index}
            yao={yao}
            index={index}
            isChanging={changingPositions.includes(index)}
          />
        ))}
      </div>

      {/* 综卦 / 错卦 */}
      <div style={S.section}>
        <div style={S.sectionTitle}>综卦 · 错卦</div>
        <div style={S.sideGuaRow}>
          <GuaRow label="综卦 · 对方视角" guaData={zongGua} interpretation={interpretation.zongGuaInterpretation} />
          <GuaRow label="错卦 · 欠缺互补" guaData={cuoGua} interpretation={interpretation.cuoGuaInterpretation} />
        </div>
      </div>

      {/* 互卦 / 变卦 */}
      <div style={S.section}>
        <div style={S.sectionTitle}>互卦 · 变卦</div>
        <div style={S.sideGuaRow}>
          <GuaRow label="互卦 · 内在结构" guaData={huGua} interpretation={interpretation.huGuaInterpretation} />
          {bianGua
            ? <GuaRow label="变卦 · 发展趋势" guaData={bianGua} interpretation={interpretation.bianGuaInterpretation} />
            : <div style={S.sideGuaItem}>
                <div style={S.sectionTitle}>变卦 · 发展趋势</div>
                <p style={{ color: '#555', fontSize: '0.9rem', margin: 0 }}>无动爻，卦象不变</p>
              </div>
          }
        </div>
      </div>

      {/* 综合建议 */}
      <div style={S.section}>
        <div style={S.sectionTitle}>综合建议</div>
        <div style={S.adviceGrid}>
          <div style={S.adviceItem}>
            <div style={S.adviceLabel}>当下应做</div>
            <p style={{ ...S.adviceText, margin: 0 }}>{comprehensiveAdvice.currentAction}</p>
          </div>
          <div style={S.adviceItem}>
            <div style={S.adviceLabel}>需要警惕</div>
            <p style={{ ...S.adviceText, margin: 0 }}>{comprehensiveAdvice.warnings}</p>
          </div>
          <div style={S.adviceItem}>
            <div style={S.adviceLabel}>需要补足</div>
            <p style={{ ...S.adviceText, margin: 0 }}>{comprehensiveAdvice.supplement}</p>
          </div>
          <div style={S.adviceItem}>
            <div style={S.adviceLabel}>未来走向</div>
            <p style={{ ...S.adviceText, margin: 0 }}>{comprehensiveAdvice.futureDirection}</p>
          </div>
        </div>
      </div>

      <button style={S.resetButton} onClick={onReset}>重新起卦</button>
    </div>
  );
}
