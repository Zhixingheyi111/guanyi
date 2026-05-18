// 梅花易数子组件：数字起卦 / 时间起卦
// 外壳样式（引导卡 / 输入 / 象头 / 重新起卦）取自 fortuneUI，与蓍草、铜钱统一。
import { useState } from 'react';
import { generateByNumbers, generateByTime } from '../../utils/meiHua';
import { getHexagramIdByBinary } from '../../data/hexagramIndex';
import { getHexagramById } from '../../data/hexagrams';
import QuickReading from './QuickReading';
import { fortuneUI as F, FORTUNE_ANIM, METHOD_META } from './fortuneUI';

const META = METHOD_META.meihua;

// 梅花专属样式（体用论 / 起卦表单），外壳样式见 fortuneUI
const S = {
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
  triagramRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--space-6)',
    marginTop: 'var(--space-4)',
    marginBottom: 'var(--space-4)',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
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
};

function HexagramCard({ hexId, label }) {
  if (!hexId) {
    return (
      <div style={F.variantBox}>
        <span style={{ color: 'var(--ink-whisper)' }}>{label}：未匹配到卦</span>
      </div>
    );
  }
  const hex = getHexagramById(hexId);
  if (!hex) {
    return (
      <div style={F.variantBox}>
        <span style={{ color: 'var(--ink-whisper)' }}>{label}：数据缺失</span>
      </div>
    );
  }
  return (
    <div>
      <div style={F.resultHeader}>
        <div style={F.hexagramSymbol}>{hex.symbol}</div>
        <div style={F.hexagramName}>{hex.name}</div>
      </div>
      {hex.guaci?.original && (
        <div style={F.guaciBox}>{hex.guaci.original}</div>
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
      <div style={F.result}>
        <style>{FORTUNE_ANIM}</style>

        <HexagramCard hexId={benId} label="本卦" />

        <div style={S.triagramRow}>
          <span>上 {result.upperBagua.symbol} {result.upperBagua.name}（{result.upperBagua.num}）</span>
          <span>下 {result.lowerBagua.symbol} {result.lowerBagua.name}（{result.lowerBagua.num}）</span>
        </div>

        <div style={F.changingNote}>
          动 · {result.changingPositionName}
        </div>

        {variant && (
          <div style={F.variantBox}>
            <span style={F.variantSymbol}>{variant.symbol}</span>
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

        <button style={F.resetBtn} onClick={reset}>
          重新起卦
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* 引导卡 */}
      <div style={F.introCard}>
        <div style={F.introDesc}>
          {META.desc1}<br />
          {META.desc2}
        </div>
        <div style={F.introMeta}>{META.meta}</div>
      </div>

      {/* 心中所惑输入 */}
      <label style={F.questionLabel} htmlFor="meihua-question">心中所惑（可选）</label>
      <textarea
        id="meihua-question"
        style={F.questionInput}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="问什么..."
        rows={2}
      />

      {/* 起卦动作 */}
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
              ...F.primaryBtn,
              ...(!num1 || !num2 ? F.primaryBtnDisabled : null),
            }}
            onClick={castNumbers}
            disabled={!num1 || !num2}
          >
            起　卦
          </button>
          <div style={{ ...F.hint, marginTop: 'var(--space-3)' }}>任意正整数皆可，例如 12 与 7</div>
          {error && <div style={F.errorMsg}>{error}</div>}
        </div>
      )}

      {mode === 'time' && (
        <div style={S.formCard}>
          <button style={F.primaryBtn} onClick={castTime}>
            取此刻 · 起卦
          </button>
          <div style={{ ...F.hint, marginTop: 'var(--space-3)' }}>以公历年月日时为据</div>
          {error && <div style={F.errorMsg}>{error}</div>}
        </div>
      )}
    </div>
  );
}
