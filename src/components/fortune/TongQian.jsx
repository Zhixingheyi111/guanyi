// 铜钱起卦子组件：摇 6 次三钱，逐爻揭示动画
// 外壳样式（引导卡 / 输入 / 象头 / 重新起卦）取自 fortuneUI，与蓍草、梅花统一。
import { useState, useRef } from 'react';
import { castTongQian } from '../../utils/tongQian';
import { getHexagramIdByBinary } from '../../data/hexagramIndex';
import { getHexagramById } from '../../data/hexagrams';
import QuickReading from './QuickReading';
import { fortuneUI as F, FORTUNE_ANIM, METHOD_META } from './fortuneUI';

const META = METHOD_META.tongqian;
const REVEAL_INTERVAL_MS = 1200;
const POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

// 铜钱专属样式（摇钱爻列），外壳样式见 fortuneUI
const S = {
  status: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-5)',
    lineHeight: 1.8,
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
  const [progress, setProgress] = useState(0); // 0..6，已揭示的爻数；i===progress 表示该爻正在摇
  const [result, setResult] = useState(null);
  const [question, setQuestion] = useState('');
  const timerRef = useRef(null);

  const reset = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setPhase('idle');
    setProgress(0);
    setResult(null);
    // 保留 question
  };

  const start = () => {
    const full = castTongQian();
    setResult(full);
    setProgress(0);
    setPhase('casting');

    // 用 progress 计数代替 append 模式：单 source of truth = result.yaos[i] 直接渲染
    // 避免之前 setRevealedYaos 多次 append 可能漏最后一次的问题（E006）
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setProgress(i);
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
      const yao = result && i < progress ? result.yaos[i] : null;
      const isCasting = phase === 'casting' && i === progress;
      rows.push(<YaoRow key={i} index={i} yao={yao} isCasting={isCasting} />);
    }
    return rows;
  };

  if (phase === 'idle') {
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
        <label style={F.questionLabel} htmlFor="tongqian-question">心中所惑（可选）</label>
        <textarea
          id="tongqian-question"
          style={F.questionInput}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="问什么..."
          rows={2}
        />

        {/* 起卦动作 */}
        <button style={F.primaryBtn} onClick={start}>
          开　始　摇　卦
        </button>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        ${FORTUNE_ANIM}
        @keyframes tongqian-spin {
          0%   { transform: rotateX(0deg); }
          50%  { transform: rotateX(180deg); }
          100% { transform: rotateX(360deg); }
        }
      `}</style>

      <div style={S.status}>
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
              <div style={F.resultHeader}>
                <div style={F.hexagramSymbol}>{ben.symbol}</div>
                <div style={F.hexagramName}>{ben.name}</div>
              </div>
            )}

            {ben?.guaci?.original && (
              <div style={F.guaciBox}>{ben.guaci.original}</div>
            )}

            {result.changingPositions.length > 0 && (
              <div style={F.changingNote}>
                动 · {changingNames}
              </div>
            )}

            {variant && (
              <div style={F.variantBox}>
                <span style={F.variantSymbol}>{variant.symbol}</span>
                变卦 · {variant.name}
              </div>
            )}

            {result.changingPositions.length === 0 && (
              <div style={{ ...F.variantBox, color: 'var(--ink-whisper)' }}>
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

            <button style={F.resetBtn} onClick={reset}>
              重新起卦
            </button>
          </div>
        );
      })()}

      {phase === 'casting' && (
        <button style={F.resetBtn} onClick={reset}>
          取消
        </button>
      )}
    </div>
  );
}
