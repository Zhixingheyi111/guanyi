import { useState } from 'react';
import NoteEditor from './NoteEditor';
import { updateDivinationNote } from '../utils/storage';

// 五行色 → 五层卦象：每一层卦象都有自己的气质
// 本卦（当下）= 土（赭黄，立足点）
// 互卦（内核）= 木（竹青，生发）
// 变卦（未来）= 火（朱砂，方向）
// 综卦（对面）= 金（月白偏灰，反观）
// 错卦（阴阳反转）= 水（玄墨，对立）
const WUXING_COLORS = {
  ben:  'var(--wuxing-earth)',
  hu:   'var(--wuxing-wood)',
  bian: 'var(--wuxing-fire)',
  zong: 'var(--wuxing-metal)',
  cuo:  'var(--wuxing-water)',
};

const S = {
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
    borderLeft: '3px solid var(--vermilion)',
    paddingLeft: '0.6rem',
    lineHeight: 1.4,
  },
  guaHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-2)',
  },
  guaName: {
    fontSize: '1.5rem',
    letterSpacing: 'var(--track-wide)',
    color: 'var(--ink)',
    fontWeight: 500,
  },
  guaSymbol: {
    fontSize: '2.5rem',
    lineHeight: 1,
    color: 'var(--ink)',
  },
  original: {
    color: 'var(--ink)',
    fontSize: 'var(--text-base)',
    lineHeight: 2,
    margin: 'var(--space-2) 0',
    fontStyle: 'italic',
  },
  translation: {
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-base)',
    lineHeight: 1.9,
    margin: 'var(--space-2) 0',
  },
  notesList: {
    margin: 'var(--space-2) 0 var(--space-3)',
    paddingLeft: 0,
    listStyle: 'none',
  },
  noteItem: {
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.8,
    margin: '0.15rem 0',
  },
  noteKey: {
    color: 'var(--vermilion)',
    fontWeight: 500,
  },
  noteBullet: {
    color: 'var(--ink-whisper)',
    marginRight: '0.25rem',
  },
  subTitle: {
    display: 'inline-block',
    fontSize: '0.7rem',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: 'var(--space-1)',
    padding: '0.1rem 0.45rem',
    border: '1px solid var(--paper-edge)',
    borderRadius: '2px',
    background: 'var(--paper-soft)',
  },
  // 爻内分区头（爻辞·周公 / 小象·孔子），与 HexagramDetail 一致
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
  yaoInnerDivider: {
    height: 0,
    borderTop: '1px solid var(--paper-edge)',
    margin: 'var(--space-3) calc(-1 * var(--space-4))',
  },
  classicBlock: {
    borderLeft: '2px solid var(--paper-edge)',
    paddingLeft: 'var(--space-3)',
    margin: 'var(--space-4) 0',
  },
  classicText: {
    color: 'var(--ink-soft)',
    fontSize: '0.95rem',
    lineHeight: 2,
    margin: 0,
  },
  interpretation: {
    color: 'var(--ink)',
    fontSize: 'var(--text-base)',
    lineHeight: 1.9,
    margin: 'var(--space-3) 0',
  },
  // 爻卡
  yaoBlock: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3) var(--space-4)',
    marginBottom: 'var(--space-3)',
  },
  // 动爻高亮：左侧朱砂竖线
  yaoBlockChanging: {
    borderLeft: '3px solid var(--vermilion)',
  },
  yaoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    cursor: 'pointer',
    userSelect: 'none',
    minHeight: '44px',
    padding: '0.25rem 0',
  },
  yaoArrow: {
    color: 'var(--ink-light)',
    fontSize: '0.7rem',
    width: '0.75rem',
    display: 'inline-block',
  },
  yaoTitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink)',
    letterSpacing: 'var(--track-wide)',
    whiteSpace: 'nowrap',
    fontWeight: 500,
  },
  yaoOriginalInline: {
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-sm)',
    fontStyle: 'italic',
    lineHeight: 1.6,
    flex: 1,
  },
  yaoBody: {
    marginTop: 'var(--space-2)',
    paddingTop: 'var(--space-2)',
    borderTop: '1px dashed var(--paper-edge)',
  },
  yaoChangingHint: {
    color: 'var(--vermilion-deep)',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.6,
    margin: '0 0 var(--space-2)',
    letterSpacing: 'var(--track-normal)',
    fontStyle: 'italic',
  },
  // 侧卦网格
  sideGuaRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 'var(--space-3)',
  },
  // 单个侧卦卡片：浅纸底 + 左侧 4px 五行色带，让五层有层次
  sideGuaItem: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderLeftWidth: '4px',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3) var(--space-4)',
  },
  sideGuaItemEmpty: {
    background: 'var(--paper-soft)',
    border: '1px dashed var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3) var(--space-4)',
  },
  sideLabel: {
    fontSize: '0.75rem',
    letterSpacing: 'var(--track-xwide)',
    color: 'var(--ink-soft)',
    marginBottom: 'var(--space-2)',
    fontWeight: 500,
  },
  sideDivider: {
    border: 0,
    borderTop: '1px solid var(--paper-edge)',
    margin: 'var(--space-2) 0',
  },
  // 综合建议
  adviceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 'var(--space-3)',
  },
  adviceItem: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3) var(--space-4)',
  },
  adviceLabel: {
    fontSize: '0.75rem',
    letterSpacing: 'var(--track-wide)',
    color: 'var(--ink-light)',
    marginBottom: 'var(--space-2)',
    fontWeight: 500,
  },
  adviceText: {
    fontSize: '0.95rem',
    color: 'var(--ink)',
    lineHeight: 1.8,
  },
  resetButton: {
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
  backButton: {
    display: 'inline-block',
    marginBottom: 'var(--space-4)',
    padding: '0.5rem 1rem',
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
  question: {
    color: 'var(--ink)',
    lineHeight: 1.85,
    margin: 0,
    fontSize: 'var(--text-base)',
    padding: 'var(--space-3) var(--space-4)',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    fontStyle: 'italic',
  },
};

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

// 兼容老 string 格式与新 {original, translation} 对象格式
function unwrapXiaoxiang(x) {
  if (!x) return null;
  if (typeof x === 'string') return { original: x, translation: null };
  return x;
}

function YaoItem({ yao, index, isChanging }) {
  const [open, setOpen] = useState(isChanging);
  const blockStyle = isChanging
    ? { ...S.yaoBlock, ...S.yaoBlockChanging }
    : S.yaoBlock;
  const xx = unwrapXiaoxiang(yao.xiaoxiang);
  return (
    <div style={blockStyle}>
      <div style={S.yaoHeader} onClick={() => setOpen(o => !o)}>
        <span style={S.yaoArrow}>{open ? '▾' : '▸'}</span>
        <span style={S.yaoTitle}>
          {isChanging ? '动· ' : ''}{yao.position}（第 {index + 1} 爻）
        </span>
        <span style={S.yaoOriginalInline}>{yao.original}</span>
      </div>
      {open && (
        <div style={S.yaoBody}>
          {isChanging && (
            <p style={S.yaoChangingHint}>
              此爻为动爻，详细解读见上方本卦解读
            </p>
          )}

          {/* 爻辞 · 周公 */}
          <div style={S.subSectionHeader}>
            <span style={S.subSectionTitle}>爻辞</span>
            <span style={S.subSectionAuthor}>· 周公</span>
          </div>
          <p style={{ ...S.original, margin: '0.25rem 0 var(--space-2)' }}>{yao.original}</p>
          {yao.translation && (
            <p style={{ ...S.translation, margin: '0.25rem 0 var(--space-2)' }}>{yao.translation}</p>
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
              <p style={{ ...S.classicText, margin: '0.25rem 0 var(--space-2)' }}>{xx.original}</p>
              {xx.translation && (
                <p style={{ ...S.translation, margin: '0.25rem 0 var(--space-2)' }}>{xx.translation}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// 五层卦象侧卡：label + 卦名 + 卦辞/象传 + AI 解读
// wuxingKey 用于决定左侧色带颜色
function GuaRow({ label, guaData, interpretation, wuxingKey }) {
  if (!guaData) return null;
  const itemStyle = {
    ...S.sideGuaItem,
    borderLeftColor: WUXING_COLORS[wuxingKey] || 'var(--paper-edge)',
  };
  return (
    <div style={itemStyle}>
      <div style={S.sideLabel}>{label}</div>
      <div style={S.guaHeader}>
        <span style={{ fontSize: '1.75rem', color: 'var(--ink)' }}>{guaData.symbol}</span>
        <span style={{ letterSpacing: 'var(--track-wide)', color: 'var(--ink)', fontWeight: 500, fontSize: '1.1rem' }}>
          {guaData.name}
        </span>
      </div>
      {guaData.guaci?.original && (
        <p style={{ ...S.original, fontSize: '0.9rem', margin: 'var(--space-2) 0', lineHeight: 1.85 }}>
          {guaData.guaci.original}
        </p>
      )}
      {guaData.daxiang?.original && (
        <p style={{ ...S.classicText, fontSize: '0.85rem', margin: 'var(--space-2) 0', lineHeight: 1.85 }}>
          {guaData.daxiang.original}
        </p>
      )}
      {interpretation && (
        <>
          <hr style={S.sideDivider} />
          <p style={{ ...S.interpretation, fontSize: '0.95rem', margin: 0 }}>{interpretation}</p>
        </>
      )}
    </div>
  );
}

export default function Reading({
  question,
  hexagrams,
  changingPositions,
  interpretation,
  onRestart,
  onBack,
  recordId,
  initialNote = '',
}) {
  const { benGua, zongGua, cuoGua, huGua, bianGua } = hexagrams;
  const { comprehensiveAdvice } = interpretation;

  return (
    <div>
      {onBack && (
        <button style={S.backButton} onClick={onBack}>← 返回历史</button>
      )}

      {/* 问题 */}
      <div style={{ marginBottom: 'var(--space-5)' }}>
        <div style={S.sectionTitle}>您的问题</div>
        <p style={S.question}>{question}</p>
      </div>

      {/* 本卦（土色） */}
      <div
        style={{
          ...S.section,
          borderLeft: `4px solid ${WUXING_COLORS.ben}`,
          borderTop: 'none',
          paddingLeft: 'var(--space-4)',
          marginTop: 'var(--space-5)',
          paddingTop: 'var(--space-3)',
        }}
      >
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

        {benGua.tuanci?.original && (
          <div style={S.classicBlock}>
            <div style={S.subTitle}>彖传</div>
            <p style={{ ...S.classicText, marginTop: '0.25rem' }}>{benGua.tuanci.original}</p>
            {benGua.tuanci.translation && (
              <p style={{ ...S.translation, fontSize: '0.9rem', marginTop: 'var(--space-2)' }}>
                {benGua.tuanci.translation}
              </p>
            )}
          </div>
        )}

        {benGua.daxiang?.original && (
          <div style={S.classicBlock}>
            <div style={S.subTitle}>象传</div>
            <p style={{ ...S.classicText, marginTop: '0.25rem' }}>{benGua.daxiang.original}</p>
            {benGua.daxiang.translation && (
              <p style={{ ...S.translation, fontSize: '0.9rem', marginTop: 'var(--space-2)' }}>
                {benGua.daxiang.translation}
              </p>
            )}
          </div>
        )}

        <p style={S.interpretation}>{interpretation.benGuaInterpretation}</p>
      </div>

      {/* 六爻 */}
      <div style={S.section}>
        <div style={S.sectionTitle}>
          六爻{changingPositions.length > 0 && `　·　${changingPositions.length} 动爻`}
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

      {/* 综卦（金） / 错卦（水） */}
      <div style={S.section}>
        <div style={S.sectionTitle}>综卦　·　错卦</div>
        <div style={S.sideGuaRow}>
          <GuaRow
            label="综卦 · 对方视角"
            guaData={zongGua}
            interpretation={interpretation.zongGuaInterpretation}
            wuxingKey="zong"
          />
          <GuaRow
            label="错卦 · 欠缺互补"
            guaData={cuoGua}
            interpretation={interpretation.cuoGuaInterpretation}
            wuxingKey="cuo"
          />
        </div>
      </div>

      {/* 互卦（木） / 变卦（火） */}
      <div style={S.section}>
        <div style={S.sectionTitle}>互卦　·　变卦</div>
        <div style={S.sideGuaRow}>
          <GuaRow
            label="互卦 · 内在结构"
            guaData={huGua}
            interpretation={interpretation.huGuaInterpretation}
            wuxingKey="hu"
          />
          {bianGua
            ? <GuaRow
                label="变卦 · 发展趋势"
                guaData={bianGua}
                interpretation={interpretation.bianGuaInterpretation}
                wuxingKey="bian"
              />
            : <div style={S.sideGuaItemEmpty}>
                <div style={S.sideLabel}>变卦 · 发展趋势</div>
                <p style={{ color: 'var(--ink-light)', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>
                  无动爻，卦象不变
                </p>
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

      {/* 反思笔记 */}
      {recordId && (
        <div style={S.section}>
          <div style={S.sectionTitle}>我的反思</div>
          <NoteEditor
            key={recordId}
            initialValue={initialNote}
            onSave={(v) => updateDivinationNote(recordId, v)}
            placeholder="这一卦给你什么启发？"
            minHeight="140px"
          />
        </div>
      )}

      {onRestart && (
        <button style={S.resetButton} onClick={onRestart}>重新起卦</button>
      )}
    </div>
  );
}
