// 梅花易数子组件：数字起卦 / 时间起卦
// 起卦后存入起卦历史；结果展示与历史回看共用 MeiHuaResult。
import { useState } from 'react';
import { generateByNumbers, generateByTime } from '../../utils/meiHua';
import { getHexagramIdByBinary } from '../../data/hexagramIndex';
import { getHexagramById } from '../../data/hexagrams';
import { generateDivinationId, saveDivinationRecord } from '../../utils/storage';
import MeiHuaResult from './MeiHuaResult';
import { fortuneUI as F, METHOD_META } from './fortuneUI';

const META = METHOD_META.meihua;

// 梅花起卦表单专属样式，外壳样式见 fortuneUI
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
};

export default function MeiHua() {
  const [mode, setMode] = useState('numbers');  // 'numbers' | 'time'
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [question, setQuestion] = useState('');
  // cast：{ ben, variant, upperBagua, lowerBagua, changingPositionName, changingPositions, tiyong, recordId }
  const [cast, setCast] = useState(null);
  const [error, setError] = useState(null);

  const reset = () => {
    setCast(null);
    setError(null);
    setNum1('');
    setNum2('');
    // 不清空 question：允许同一问题反复起卦
  };

  // 起卦成功 → 解析卦象 → 存入起卦历史 → 进入结果态
  const applyResult = (r) => {
    const benId     = getHexagramIdByBinary(r.binary);
    const variantId = getHexagramIdByBinary(r.variantBinary);
    const ben       = benId ? getHexagramById(benId) : null;
    const variant   = variantId ? getHexagramById(variantId) : null;

    const recordId = generateDivinationId();
    saveDivinationRecord({
      id: recordId,
      timestamp: Date.now(),
      method: 'meihua',
      question,
      benGua: ben,
      bianGua: variant,
      changingPositions: r.changingPositions,
      meihua: {
        upperBagua: r.upperBagua,
        lowerBagua: r.lowerBagua,
        changingPositionName: r.changingPositionName,
        tiyong: r.tiyong,
      },
      quickReading: null,
      coreAdvice: '',
      userNote: '',
    });

    setCast({
      ben,
      variant,
      upperBagua: r.upperBagua,
      lowerBagua: r.lowerBagua,
      changingPositionName: r.changingPositionName,
      changingPositions: r.changingPositions,
      tiyong: r.tiyong,
      recordId,
    });
  };

  const castNumbers = () => {
    setError(null);
    try {
      applyResult(generateByNumbers(num1, num2));
    } catch (e) {
      setError(e.message);
    }
  };

  const castTime = () => {
    setError(null);
    try {
      applyResult(generateByTime(new Date()));
    } catch (e) {
      setError(e.message);
    }
  };

  if (cast) {
    return (
      <MeiHuaResult
        ben={cast.ben}
        variant={cast.variant}
        upperBagua={cast.upperBagua}
        lowerBagua={cast.lowerBagua}
        changingPositionName={cast.changingPositionName}
        changingPositions={cast.changingPositions}
        tiyong={cast.tiyong}
        question={question}
        recordId={cast.recordId}
        onRestart={reset}
      />
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
