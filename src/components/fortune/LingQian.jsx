// 观音灵签子组件：摇签筒抽签 → 显示签诗 + 解读
// 本组件不调 LLM；AI 解读在 Phase 1.5 (A5) 接入。
// 数据当前为 5 签原型，100 签完整数据待补（见 src/data/lingqian.js 注释）。
import { useState, useRef } from 'react';
import { pickRandomSign, LEVEL_COLOR, LINGQIAN_PROTOTYPE } from '../../data/lingqian';
import QuickReading from './QuickReading';

const SHAKE_MS = 1400;

const S = {
  intro: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-5)',
    lineHeight: 1.8,
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
    minHeight: '70px',
  },
  drawBtn: {
    display: 'block',
    margin: '0 auto var(--space-5)',
    padding: '0.7rem 2rem',
    background: 'var(--ink)',
    color: 'var(--paper)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-base)',
    letterSpacing: 'var(--track-xwide)',
    cursor: 'pointer',
    minHeight: '44px',
  },
  // 签筒摇动
  shakeWrap: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '160px',
    marginBottom: 'var(--space-4)',
  },
  shakeBarrel: {
    width: '80px',
    height: '120px',
    border: '2px solid var(--ink)',
    borderRadius: '8px 8px 4px 4px',
    background: 'var(--paper-soft)',
    position: 'relative',
    transformOrigin: 'bottom center',
    animation: 'lingqian-shake 0.25s ease-in-out infinite',
  },
  shakeStick: {
    position: 'absolute',
    top: '-6px',
    left: '50%',
    width: '2px',
    height: '20px',
    background: 'var(--ink)',
    transformOrigin: 'bottom center',
  },
  shakeHint: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-4)',
  },
  // 结果
  result: {
    animation: 'lingqian-fade-in 0.8s ease',
  },
  signHeader: {
    textAlign: 'center',
    marginBottom: 'var(--space-5)',
  },
  signNumber: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-1)',
  },
  signLevel: {
    fontSize: 'var(--text-lg)',
    fontWeight: 500,
    letterSpacing: 'var(--track-hero)',
    paddingLeft: '0.5em',
    marginBottom: 'var(--space-2)',
  },
  signTitle: {
    fontSize: 'var(--text-base)',
    color: 'var(--ink-soft)',
    letterSpacing: 'var(--track-wide)',
  },
  poemBox: {
    margin: '0 auto var(--space-5)',
    maxWidth: '380px',
    padding: 'var(--space-5) var(--space-4)',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
    lineHeight: 2.2,
    color: 'var(--ink)',
    fontSize: 'var(--text-lg)',
    letterSpacing: '0.15em',
  },
  interpretBox: {
    padding: 'var(--space-4)',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-4)',
    lineHeight: 1.9,
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-base)',
  },
  adviceBox: {
    padding: 'var(--space-3) var(--space-4)',
    background: 'var(--paper-deep)',
    borderLeft: '3px solid var(--vermilion)',
    borderRadius: 'var(--radius-sm)',
    marginBottom: 'var(--space-5)',
    color: 'var(--ink)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    lineHeight: 1.9,
  },
  adviceLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--vermilion)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: 'var(--space-1)',
  },
  aiPlaceholder: {
    textAlign: 'center',
    color: 'var(--ink-whisper)',
    fontSize: 'var(--text-sm)',
    padding: 'var(--space-4)',
    border: '1px dashed var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-5)',
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
  prototypeNote: {
    textAlign: 'center',
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-whisper)',
    marginTop: 'var(--space-3)',
    fontStyle: 'italic',
  },
};

export default function LingQian() {
  const [phase, setPhase] = useState('idle'); // idle | shaking | done
  const [question, setQuestion] = useState('');
  const [sign, setSign] = useState(null);
  const timerRef = useRef(null);

  const draw = () => {
    setPhase('shaking');
    const picked = pickRandomSign();
    timerRef.current = setTimeout(() => {
      setSign(picked);
      setPhase('done');
      timerRef.current = null;
    }, SHAKE_MS);
  };

  const reset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPhase('idle');
    setSign(null);
  };

  const styles = (
    <style>{`
      @keyframes lingqian-shake {
        0%   { transform: rotate(-7deg); }
        50%  { transform: rotate(7deg); }
        100% { transform: rotate(-7deg); }
      }
      @keyframes lingqian-fade-in {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );

  if (phase === 'shaking') {
    return (
      <div>
        {styles}
        <div style={S.shakeHint}>摇签中... 心存所问</div>
        <div style={S.shakeWrap}>
          <div style={S.shakeBarrel}>
            <div style={S.shakeStick} />
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'done' && sign) {
    const levelColor = LEVEL_COLOR[sign.level] || 'var(--ink)';
    return (
      <div style={S.result}>
        {styles}
        <div style={S.signHeader}>
          <div style={S.signNumber}>第 {sign.id} 签</div>
          <div style={{ ...S.signLevel, color: levelColor }}>{sign.level}签</div>
          <div style={S.signTitle}>{sign.title}</div>
        </div>

        <div style={S.poemBox}>
          {sign.poem.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>

        <div style={S.interpretBox}>{sign.interpretation}</div>

        <div style={S.adviceBox}>
          <div style={S.adviceLabel}>仙　机</div>
          {sign.advice}
        </div>

        {question.trim() && (
          <div style={{ ...S.interpretBox, fontStyle: 'italic', color: 'var(--ink-whisper)', fontSize: 'var(--text-sm)' }}>
            所问：{question}
          </div>
        )}

        <QuickReading
          scenario={{ method: 'lingqian', sign }}
          question={question}
        />

        <button style={S.resetBtn} onClick={reset}>
          再求一签
        </button>

        <div style={S.prototypeNote}>
          原型版本 · 5 签（完整 100 签数据待补）
        </div>
      </div>
    );
  }

  // idle
  return (
    <div>
      {styles}
      <div style={S.intro}>
        观音灵签 · 求签问运<br />
        心存所惑，摇筒一签
      </div>

      <label style={S.questionLabel} htmlFor="lingqian-question">
        所问之事（可选）
      </label>
      <textarea
        id="lingqian-question"
        style={S.questionInput}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="心中所惑..."
        rows={2}
      />

      <button style={S.drawBtn} onClick={draw}>
        摇筒 · 抽签
      </button>

      <div style={S.prototypeNote}>
        当前为 {LINGQIAN_PROTOTYPE.length} 签原型版本
      </div>
    </div>
  );
}
