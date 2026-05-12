// 铜钱起卦子组件：摇 6 次三钱，逐爻揭示动画
// 本组件不调 LLM；AI 解读在 Phase 1.5 (A5) 接入。
import { useState, useRef } from 'react';
import { castTongQian } from '../../utils/tongQian';
import { getHexagramIdByBinary } from '../../data/hexagramIndex';
import { getHexagramById } from '../../data/hexagrams';
import QuickReading from './QuickReading';

const REVEAL_INTERVAL_MS = 1200;
const POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

const S = {
  intro: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-5)',
    lineHeight: 1.8,
  },
  startBtn: {
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
  yaoColumn: {
    display: 'flex',
    flexDirection: 'column-reverse', // 自下而上：DOM 顺序 0..5 视觉从下到上
    gap: 'var(--space-2)',
    margin: '0 auto var(--space-5)',
    maxWidth: '360px',
    padding: 'var(--space-4)',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
  },
  yaoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    minHeight: '44px',
  },
  yaoLabel: {
    width: '3em',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
  },
  yaoLine: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '12px',
  },
  yaoLineYang: {
    width: '100%',
    height: '4px',
    background: 'var(--ink)',
  },
  yaoLineYin: {
    width: '100%',
    height: '4px',
    background:
      'linear-gradient(to right, var(--ink) 0%, var(--ink) 40%, transparent 40%, transparent 60%, var(--ink) 60%, var(--ink) 100%)',
  },
  yaoNote: {
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
    minWidth: '5em',
    textAlign: 'right',
  },
  yaoNoteChanging: {
    color: 'var(--vermilion)',
  },
  // 摇钱中的占位
  yaoSlotPending: {
    flex: 1,
    height: '12px',
    background: 'transparent',
    borderTop: '1px dashed var(--paper-edge)',
  },
  yaoSlotCasting: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--space-1)',
  },
  coin: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: 'var(--paper)',
    border: '1.5px solid var(--ink-soft)',
    animation: 'tongqian-spin 0.5s linear infinite',
  },
  // 结果区
  resultHeader: {
    textAlign: 'center',
    marginBottom: 'var(--space-4)',
    animation: 'tongqian-fade-in 0.6s ease',
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
  changingNote: {
    textAlign: 'center',
    color: 'var(--vermilion)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-4)',
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

function YaoRow({ index, yao, isCasting }) {
  const label = POSITION_NAMES[index];

  if (!yao) {
    return (
      <div style={S.yaoRow}>
        <span style={S.yaoLabel}>{label}</span>
        {isCasting ? (
          <div style={S.yaoSlotCasting}>
            <div style={S.coin} />
            <div style={{ ...S.coin, animationDelay: '0.1s' }} />
            <div style={{ ...S.coin, animationDelay: '0.2s' }} />
          </div>
        ) : (
          <div style={S.yaoSlotPending} />
        )}
        <span style={S.yaoNote}>{isCasting ? '摇' : ''}</span>
      </div>
    );
  }

  return (
    <div style={S.yaoRow}>
      <span style={S.yaoLabel}>{label}</span>
      <div style={S.yaoLine}>
        <div style={yao.isYang ? S.yaoLineYang : S.yaoLineYin} />
      </div>
      <span style={{
        ...S.yaoNote,
        ...(yao.isChanging ? S.yaoNoteChanging : null),
      }}>
        {yao.label}{yao.isChanging ? ' · 动' : ''}
      </span>
    </div>
  );
}

export default function TongQian() {
  const [phase, setPhase] = useState('idle'); // idle | casting | done
  const [revealedYaos, setRevealedYaos] = useState([]); // 0-6
  const [result, setResult] = useState(null);
  const [question, setQuestion] = useState('');
  const timerRef = useRef(null);

  const reset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setPhase('idle');
    setRevealedYaos([]);
    setResult(null);
    // 保留 question
  };

  const start = () => {
    const full = castTongQian();
    setResult(full);
    setRevealedYaos([]);
    setPhase('casting');

    let i = 0;
    timerRef.current = setInterval(() => {
      setRevealedYaos(prev => [...prev, full.yaos[i]]);
      i++;
      if (i >= 6) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setTimeout(() => setPhase('done'), 700);
      }
    }, REVEAL_INTERVAL_MS);
  };

  // 渲染 6 行（从下到上：column-reverse；DOM 是 index 0..5）
  const renderYaoColumn = () => {
    const rows = [];
    for (let i = 0; i < 6; i++) {
      const yao = revealedYaos[i];
      const isCasting = phase === 'casting' && i === revealedYaos.length;
      rows.push(<YaoRow key={i} index={i} yao={yao} isCasting={isCasting} />);
    }
    return rows;
  };

  if (phase === 'idle') {
    return (
      <div>
        <div style={S.intro}>
          铜钱起卦 · 火珠林<br />
          三钱六摇，问询所惑
        </div>
        <label style={S.questionLabel} htmlFor="tongqian-question">心中所惑（可选）</label>
        <textarea
          id="tongqian-question"
          style={S.questionInput}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="问什么..."
          rows={2}
        />
        <button style={S.startBtn} onClick={start}>
          开　始
        </button>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        @keyframes tongqian-spin {
          0%   { transform: rotateX(0deg); }
          50%  { transform: rotateX(180deg); }
          100% { transform: rotateX(360deg); }
        }
        @keyframes tongqian-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={S.intro}>
        {phase === 'casting' ? '摇钱中...' : '六爻已成'}
      </div>

      <div style={S.yaoColumn}>
        {renderYaoColumn()}
      </div>

      {phase === 'done' && result && (() => {
        const benId = getHexagramIdByBinary(result.binary);
        const variantId = result.changingPositions.length > 0
          ? getHexagramIdByBinary(result.variantBinary)
          : null;
        const ben = benId ? getHexagramById(benId) : null;
        const variant = variantId ? getHexagramById(variantId) : null;
        const changingNames = result.changingPositions.map(i => POSITION_NAMES[i]).join('、');

        return (
          <div>
            {ben && (
              <div style={S.resultHeader}>
                <div style={S.hexagramSymbol}>{ben.symbol}</div>
                <div style={S.hexagramName}>{ben.name}</div>
              </div>
            )}

            {ben?.guaci?.original && (
              <div style={S.guaciBox}>{ben.guaci.original}</div>
            )}

            {result.changingPositions.length > 0 && (
              <div style={S.changingNote}>
                动 · {changingNames}
              </div>
            )}

            {variant && (
              <div style={S.variantBox}>
                <span style={S.variantSymbol}>{variant.symbol}</span>
                变卦 · {variant.name}
              </div>
            )}

            {result.changingPositions.length === 0 && (
              <div style={{ ...S.variantBox, color: 'var(--ink-whisper)' }}>
                六爻无动 · 静卦
              </div>
            )}

            {ben && (
              <QuickReading
                scenario={{
                  method: 'tongqian',
                  benHex: ben,
                  changingPositions: result.changingPositions,
                  variantHex: variant,
                }}
                question={question}
              />
            )}

            <button style={S.resetBtn} onClick={reset}>
              重新起卦
            </button>
          </div>
        );
      })()}

      {phase === 'casting' && (
        <button style={S.resetBtn} onClick={reset}>
          取消
        </button>
      )}
    </div>
  );
}
