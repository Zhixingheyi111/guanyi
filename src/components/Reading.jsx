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
  yaoTitle: {
    fontSize: '0.85rem',
    color: '#aaa',
    letterSpacing: '0.1em',
    marginBottom: '0.4rem',
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

function GuaRow({ label, guaData, interpretation }) {
  if (!guaData) return null;
  return (
    <div style={S.sideGuaItem}>
      <div style={S.sectionTitle}>{label}</div>
      <div style={S.guaHeader}>
        <span style={{ fontSize: '1.5rem' }}>{guaData.symbol}</span>
        <span style={{ letterSpacing: '0.1em' }}>{guaData.name}</span>
      </div>
      {interpretation && (
        <p style={{ ...S.interpretation, fontSize: '0.9rem', margin: 0 }}>{interpretation}</p>
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
        <p style={S.interpretation}>{interpretation.benGuaInterpretation}</p>
      </div>

      {/* 动爻 */}
      {changingPositions.length > 0 && (
        <div style={S.section}>
          <div style={S.sectionTitle}>动爻</div>
          {changingPositions.map(pos => {
            const yao = benGua.yaoci[pos];
            if (!yao) return null;
            return (
              <div key={pos} style={S.yaoBlock}>
                <div style={S.yaoTitle}>{yao.position}（第 {pos + 1} 爻）</div>
                <p style={{ ...S.original, margin: '0 0 0.4rem' }}>{yao.original}</p>
                <p style={{ ...S.interpretation, margin: 0, fontSize: '0.95rem' }}>{yao.xiaoxiang}</p>
              </div>
            );
          })}
        </div>
      )}

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
