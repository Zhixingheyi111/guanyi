// 梅花易数子组件：数字起卦 / 时间起卦
// 本组件不调 LLM；AI 解读在 Phase 1.5 (A5) 接入。
import { useState } from 'react';
import { generateByNumbers, generateByTime } from '../../utils/meiHua';
import { getHexagramIdByBinary } from '../../data/hexagramIndex';
import { getHexagramById } from '../../data/hexagrams';
import QuickReading from './QuickReading';

const S = {
  intro: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-5)',
    lineHeight: 1.8,
  },
  modeRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--space-4)',
    marginBottom: 'var(--space-5)',
  },
  modeBtn: {
    background: 'transparent',
    border: '1px solid var(--paper-edge)',
    padding: '0.45rem 1rem',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    minHeight: '40px',
    color: 'var(--ink-light)',
    borderRadius: 'var(--radius-md)',
    transition: 'all 0.2s ease',
  },
  modeBtnActive: {
    color: 'var(--ink)',
    background: 'var(--paper-soft)',
    borderColor: 'var(--ink-soft)',
  },
  formCard: {
    padding: 'var(--space-5) var(--space-4)',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-5)',
  },
  formRow: {
    display: 'flex',
    gap: 'var(--space-3)',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 'var(--space-4)',
  },
  label: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    letterSpacing: 'var(--track-wide)',
  },
  input: {
    width: '90px',
    padding: '0.5rem 0.75rem',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-base)',
    background: 'var(--paper)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--ink)',
    textAlign: 'center',
    minHeight: '44px',
  },
  primaryBtn: {
    display: 'block',
    margin: '0 auto',
    padding: '0.6rem 1.8rem',
    background: 'var(--ink)',
    color: 'var(--paper)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-base)',
    letterSpacing: 'var(--track-xwide)',
    cursor: 'pointer',
    minHeight: '44px',
    transition: 'opacity 0.2s ease',
  },
  primaryBtnDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  hint: {
    textAlign: 'center',
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-whisper)',
    marginTop: 'var(--space-3)',
    letterSpacing: 'var(--track-wide)',
  },
  errorMsg: {
    color: 'var(--vermilion-deep)',
    fontSize: 'var(--text-sm)',
    textAlign: 'center',
    marginTop: 'var(--space-3)',
  },
  result: {
    animation: 'meihua-fade-in 0.5s ease',
  },
  resultHeader: {
    textAlign: 'center',
    marginBottom: 'var(--space-5)',
  },
  hexagramSymbol: {
    fontSize: '4rem',
    lineHeight: 1,
    color: 'var(--ink)',
    marginBottom: 'var(--space-2)',
  },
  hexagramName: {
    fontSize: 'var(--text-xl)',
    color: 'var(--ink)',
    letterSpacing: 'var(--track-hero)',
    paddingLeft: '0.5em',
  },
  triagramRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--space-6)',
    marginTop: 'var(--space-4)',
    marginBottom: 'var(--space-4)',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
  },
  changingNote: {
    textAlign: 'center',
    color: 'var(--vermilion)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-5)',
  },
  guaciBox: {
    padding: 'var(--space-4)',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-4)',
    lineHeight: 1.9,
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-base)',
  },
  variantBox: {
    padding: 'var(--space-4)',
    background: 'var(--paper-deep)',
    border: '1px dashed var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-4)',
    textAlign: 'center',
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
  },
  // 体用分析卡片
  tiyongCard: {
    padding: 'var(--space-4)',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderLeft: '3px solid var(--vermilion)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-4)',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    lineHeight: 1.85,
  },
  tiyongTitle: {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--vermilion-deep)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-2)',
  },
  tiyongRow: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: 'var(--space-3)',
    flexWrap: 'wrap',
    marginBottom: 'var(--space-3)',
    paddingBottom: 'var(--space-3)',
    borderBottom: '1px dashed var(--paper-edge)',
  },
  tiyongSlot: {
    textAlign: 'center',
    flex: '1 1 auto',
    minWidth: '110px',
  },
  tiyongRole: {
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: 'var(--space-1)',
  },
  tiyongBaguaSymbol: {
    fontSize: 'var(--text-2xl)',
    color: 'var(--ink)',
    lineHeight: 1,
  },
  tiyongBaguaName: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink)',
    letterSpacing: 'var(--track-wide)',
    marginTop: 'var(--space-1)',
  },
  tiyongElement: {
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    marginTop: 'var(--space-1)',
  },
  tiyongRelation: {
    textAlign: 'center',
    fontSize: 'var(--text-base)',
    color: 'var(--ink)',
    letterSpacing: 'var(--track-wide)',
    fontWeight: 500,
    marginBottom: 'var(--space-2)',
  },
  tiyongNature: {
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    marginLeft: 'var(--space-2)',
    background: 'var(--vermilion)',
    color: 'var(--paper)',
    fontSize: 'var(--text-xs)',
    borderRadius: 'var(--radius-sm)',
    letterSpacing: 'var(--track-wide)',
    verticalAlign: 'middle',
  },
  tiyongMeaning: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    fontStyle: 'italic',
    lineHeight: 1.8,
  },
  variantSymbol: {
    fontSize: '2rem',
    marginRight: 'var(--space-2)',
    verticalAlign: 'middle',
    color: 'var(--ink)',
  },
  questionLabel: {
    display: 'block',
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-2)',
  },
  questionInput: {
    display: 'block',
    width: '100%',
    maxWidth: '420px',
    margin: '0 auto var(--space-5)',
    padding: '0.6rem 0.9rem',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-base)',
    lineHeight: 1.7,
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical',
    minHeight: '60px',
  },
  resetBtn: {
    display: 'block',
    margin: '0 auto',
    padding: '0.5rem 1.5rem',
    background: 'transparent',
    border: '1px solid var(--paper-edge)',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
    minHeight: '44px',
  },
};

function HexagramCard({ hexId, label }) {
  if (!hexId) {
    return (
      <div style={S.variantBox}>
        <span style={{ color: 'var(--ink-whisper)' }}>{label}：未匹配到卦</span>
      </div>
    );
  }
  const hex = getHexagramById(hexId);
  if (!hex) {
    return (
      <div style={S.variantBox}>
        <span style={{ color: 'var(--ink-whisper)' }}>{label}：数据缺失</span>
      </div>
    );
  }
  return (
    <div>
      <div style={S.resultHeader}>
        <div style={S.hexagramSymbol}>{hex.symbol}</div>
        <div style={S.hexagramName}>{hex.name}</div>
      </div>
      {hex.guaci?.original && (
        <div style={S.guaciBox}>{hex.guaci.original}</div>
      )}
    </div>
  );
}

export default function MeiHua() {
  const [mode, setMode] = useState('numbers');  // 'numbers' | 'time'
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const reset = () => {
    setResult(null);
    setError(null);
    setNum1('');
    setNum2('');
    // 不清空 question：允许同一问题反复起卦
  };

  const castNumbers = () => {
    setError(null);
    try {
      const r = generateByNumbers(num1, num2);
      setResult(r);
    } catch (e) {
      setError(e.message);
    }
  };

  const castTime = () => {
    setError(null);
    try {
      const r = generateByTime(new Date());
      setResult(r);
    } catch (e) {
      setError(e.message);
    }
  };

  if (result) {
    const benId     = getHexagramIdByBinary(result.binary);
    const variantId = getHexagramIdByBinary(result.variantBinary);
    const ben       = benId ? getHexagramById(benId) : null;
    const variant   = variantId ? getHexagramById(variantId) : null;

    return (
      <div style={S.result}>
        <style>{`
          @keyframes meihua-fade-in {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <HexagramCard hexId={benId} label="本卦" />

        <div style={S.triagramRow}>
          <span>上 {result.upperBagua.symbol} {result.upperBagua.name}（{result.upperBagua.num}）</span>
          <span>下 {result.lowerBagua.symbol} {result.lowerBagua.name}（{result.lowerBagua.num}）</span>
        </div>

        <div style={S.changingNote}>
          动 · {result.changingPositionName}
        </div>

        {variant && (
          <div style={S.variantBox}>
            <span style={S.variantSymbol}>{variant.symbol}</span>
            变卦 · {variant.name}
          </div>
        )}

        {result.tiyong && (
          <div style={S.tiyongCard}>
            <div style={S.tiyongTitle}>体用之论</div>
            <div style={S.tiyongRow}>
              <div style={S.tiyongSlot}>
                <div style={S.tiyongRole}>体 · 我</div>
                <div style={S.tiyongBaguaSymbol}>{result.tiyong.tiBagua.symbol}</div>
                <div style={S.tiyongBaguaName}>{result.tiyong.tiBagua.name}</div>
                <div style={S.tiyongElement}>{result.tiyong.tiBagua.elementName}</div>
              </div>
              <div style={S.tiyongSlot}>
                <div style={S.tiyongRole}>用 · 事</div>
                <div style={S.tiyongBaguaSymbol}>{result.tiyong.yongBagua.symbol}</div>
                <div style={S.tiyongBaguaName}>{result.tiyong.yongBagua.name}</div>
                <div style={S.tiyongElement}>{result.tiyong.yongBagua.elementName}</div>
              </div>
            </div>
            <div style={S.tiyongRelation}>
              {result.tiyong.relationLabel}
              <span style={S.tiyongNature}>{result.tiyong.nature}</span>
            </div>
            <div style={S.tiyongMeaning}>{result.tiyong.meaning}</div>
          </div>
        )}

        {ben && (
          <QuickReading
            scenario={{
              method: 'meihua',
              benHex: ben,
              changingPositions: result.changingPositions,
              variantHex: variant,
              tiyong: result.tiyong,
            }}
            question={question}
          />
        )}

        <button style={S.resetBtn} onClick={reset}>
          重新起卦
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={S.intro}>
        梅花易数 · 邵雍传<br />
        心动则占，数即是象
      </div>

      <label style={S.questionLabel} htmlFor="meihua-question">心中所惑（可选）</label>
      <textarea
        id="meihua-question"
        style={S.questionInput}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="问什么..."
        rows={2}
      />

      <div style={S.modeRow}>
        <button
          style={{ ...S.modeBtn, ...(mode === 'numbers' ? S.modeBtnActive : null) }}
          onClick={() => setMode('numbers')}
        >
          数字起卦
        </button>
        <button
          style={{ ...S.modeBtn, ...(mode === 'time' ? S.modeBtnActive : null) }}
          onClick={() => setMode('time')}
        >
          时间起卦
        </button>
      </div>

      {mode === 'numbers' && (
        <div style={S.formCard}>
          <div style={S.formRow}>
            <span style={S.label}>第一数</span>
            <input
              type="number"
              min="1"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              style={S.input}
              inputMode="numeric"
            />
            <span style={S.label}>第二数</span>
            <input
              type="number"
              min="1"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              style={S.input}
              inputMode="numeric"
            />
          </div>
          <button
            style={{
              ...S.primaryBtn,
              ...(!num1 || !num2 ? S.primaryBtnDisabled : null),
            }}
            onClick={castNumbers}
            disabled={!num1 || !num2}
          >
            起　卦
          </button>
          <div style={S.hint}>任意正整数皆可，例如 12 与 7</div>
          {error && <div style={S.errorMsg}>{error}</div>}
        </div>
      )}

      {mode === 'time' && (
        <div style={S.formCard}>
          <button style={S.primaryBtn} onClick={castTime}>
            取此刻 · 起卦
          </button>
          <div style={S.hint}>以公历年月日时为据</div>
          {error && <div style={S.errorMsg}>{error}</div>}
        </div>
      )}
    </div>
  );
}
