// 铜钱起卦子组件：摇 6 次三钱，逐爻揭示动画
// 摇钱完成后存入起卦历史；结果展示与历史回看共用 TongQianResult。
import { useState, useRef } from 'react';
import { castTongQian } from '../../utils/tongQian';
import { getHexagramIdByBinary } from '../../data/hexagramIndex';
import { getHexagramById } from '../../data/hexagrams';
import { generateDivinationId, saveDivinationRecord } from '../../utils/storage';
import TongQianResult, { YaoColumn } from './TongQianResult';
import { fortuneUI as F, FORTUNE_ANIM, METHOD_META } from './fortuneUI';

const META = METHOD_META.tongqian;
const REVEAL_INTERVAL_MS = 1200;

const S = {
  status: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-5)',
    lineHeight: 1.8,
  },
};

// 由 castTongQian 结果解析本卦 / 变卦
function resolveGua(result) {
  const benId = getHexagramIdByBinary(result.binary);
  const variantId = result.changingPositions.length > 0
    ? getHexagramIdByBinary(result.variantBinary)
    : null;
  return {
    ben: benId ? getHexagramById(benId) : null,
    variant: variantId ? getHexagramById(variantId) : null,
  };
}

export default function TongQian() {
  const [phase, setPhase] = useState('idle'); // idle | casting | done
  const [progress, setProgress] = useState(0); // 0..6，已揭示的爻数；i===progress 表示该爻正在摇
  const [result, setResult] = useState(null);
  const [recordId, setRecordId] = useState(null);
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
    setRecordId(null);
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
        // 摇钱完成才存历史（中途取消则不留记录）
        const { ben, variant } = resolveGua(full);
        const id = generateDivinationId();
        saveDivinationRecord({
          id,
          timestamp: Date.now(),
          method: 'tongqian',
          question,
          benGua: ben,
          bianGua: variant,
          changingPositions: full.changingPositions,
          tongqian: { yaos: full.yaos },
          quickReading: null,
          coreAdvice: '',
          userNote: '',
        });
        setRecordId(id);
        setTimeout(() => setPhase('done'), 700);
      }
    }, REVEAL_INTERVAL_MS);
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

  // 摇钱中：动画爻列
  if (phase === 'casting') {
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
        <div style={S.status}>摇钱中...</div>
        <YaoColumn
          yaos={result ? result.yaos.map((y, i) => (i < progress ? y : null)) : []}
          castingIndex={progress}
        />
        <button style={F.resetBtn} onClick={reset}>取消</button>
      </div>
    );
  }

  // 摇钱完成：结果展示
  const { ben, variant } = result ? resolveGua(result) : { ben: null, variant: null };
  return (
    <TongQianResult
      ben={ben}
      variant={variant}
      yaos={result?.yaos}
      changingPositions={result?.changingPositions || []}
      question={question}
      recordId={recordId}
      onRestart={reset}
    />
  );
}
