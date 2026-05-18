// 铜钱起卦「结果展示」——爻列 + 本卦象头 + 变卦 + AI 解读。
// 同时服务两种场景：
//   1. 现场起卦（TongQian.jsx）：摇钱动画结束后渲染本组件，savedReading 为 null。
//   2. 历史回看（App.jsx 路由）：传入 savedReading，QuickReading 直接展示存档解读。
// YaoColumn 同时被 TongQian.jsx 的摇钱动画复用（传 castingIndex 控制占位/摇钱态）。
import QuickReading from './QuickReading';
import { fortuneUI as F, FORTUNE_ANIM } from './fortuneUI';
import { updateDivinationRecord } from '../../utils/storage';

const POSITION_NAMES = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

// 铜钱爻列专属样式
const S = {
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
  questionRecall: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    fontStyle: 'italic',
    lineHeight: 1.7,
    marginBottom: 'var(--space-4)',
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

// 六爻列：yaos 为长度 6 的数组（元素为 yao 对象或 null）。
// castingIndex 指出当前正在摇的爻 index（摇钱动画用），-1 表示无。
export function YaoColumn({ yaos = [], castingIndex = -1 }) {
  const rows = [];
  for (let i = 0; i < 6; i++) {
    rows.push(
      <YaoRow key={i} index={i} yao={yaos[i] || null} isCasting={i === castingIndex} />,
    );
  }
  return <div style={S.yaoColumn}>{rows}</div>;
}

export default function TongQianResult({
  ben,
  variant,
  yaos,
  changingPositions = [],
  question,
  savedReading = null,
  recordId,
  onRestart,
  onBack,
}) {
  const changingNames = changingPositions.map(i => POSITION_NAMES[i]).join('、');

  return (
    <div style={F.result}>
      <style>{FORTUNE_ANIM}</style>

      {onBack && (
        <button style={F.backBtn} onClick={onBack}>← 返回历史</button>
      )}

      {onBack && question && (
        <div style={S.questionRecall}>当时问：{question}</div>
      )}

      {yaos && <YaoColumn yaos={yaos} />}

      {ben && (
        <div style={F.resultHeader}>
          <div style={F.hexagramSymbol}>{ben.symbol}</div>
          <div style={F.hexagramName}>{ben.name}</div>
        </div>
      )}

      {ben?.guaci?.original && (
        <div style={F.guaciBox}>{ben.guaci.original}</div>
      )}

      {changingPositions.length > 0 && (
        <div style={F.changingNote}>动 · {changingNames}</div>
      )}

      {variant && (
        <div style={F.variantBox}>
          <span style={F.variantSymbol}>{variant.symbol}</span>
          变卦 · {variant.name}
        </div>
      )}

      {changingPositions.length === 0 && (
        <div style={{ ...F.variantBox, color: 'var(--ink-whisper)' }}>
          六爻无动 · 静卦
        </div>
      )}

      {ben && (
        <QuickReading
          scenario={{
            method: 'tongqian',
            benHex: ben,
            changingPositions,
            variantHex: variant,
          }}
          question={question}
          savedReading={savedReading}
          onResult={recordId
            ? (data) => updateDivinationRecord(recordId, {
                quickReading: data,
                coreAdvice: data.coreAdvice,
              })
            : undefined}
        />
      )}

      {onRestart && (
        <button style={F.resetBtn} onClick={onRestart}>重新起卦</button>
      )}
    </div>
  );
}
