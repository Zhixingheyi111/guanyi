// 梅花易数「结果展示」——本卦象头 + 体用 + 变卦 + AI 解读。
// 同时服务两种场景：
//   1. 现场起卦（MeiHua.jsx）：savedReading 为 null，QuickReading 调 AI 并经
//      onResult 回写记录。
//   2. 历史回看（App.jsx 路由）：传入 savedReading，QuickReading 直接展示存档解读。
import QuickReading from './QuickReading';
import { fortuneUI as F, FORTUNE_ANIM } from './fortuneUI';
import { updateDivinationRecord } from '../../utils/storage';

// 梅花结果区专属样式
const S = {
  triagramRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--space-6)',
    marginTop: 'var(--space-4)',
    marginBottom: 'var(--space-4)',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
  },
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
  questionRecall: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    fontStyle: 'italic',
    lineHeight: 1.7,
    marginBottom: 'var(--space-4)',
  },
};

function HexagramCard({ hex }) {
  if (!hex) {
    return (
      <div style={F.variantBox}>
        <span style={{ color: 'var(--ink-whisper)' }}>本卦：数据缺失</span>
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

export default function MeiHuaResult({
  ben,
  variant,
  upperBagua,
  lowerBagua,
  changingPositionName,
  changingPositions,
  tiyong,
  question,
  savedReading = null,
  recordId,
  onRestart,
  onBack,
}) {
  return (
    <div style={F.result}>
      <style>{FORTUNE_ANIM}</style>

      {onBack && (
        <button style={F.backBtn} onClick={onBack}>← 返回历史</button>
      )}

      {onBack && question && (
        <div style={S.questionRecall}>当时问：{question}</div>
      )}

      <HexagramCard hex={ben} />

      {upperBagua && lowerBagua && (
        <div style={S.triagramRow}>
          <span>上 {upperBagua.symbol} {upperBagua.name}（{upperBagua.num}）</span>
          <span>下 {lowerBagua.symbol} {lowerBagua.name}（{lowerBagua.num}）</span>
        </div>
      )}

      {changingPositionName && (
        <div style={F.changingNote}>动 · {changingPositionName}</div>
      )}

      {variant && (
        <div style={F.variantBox}>
          <span style={F.variantSymbol}>{variant.symbol}</span>
          变卦 · {variant.name}
        </div>
      )}

      {tiyong && (
        <div style={S.tiyongCard}>
          <div style={S.tiyongTitle}>体用之论</div>
          <div style={S.tiyongRow}>
            <div style={S.tiyongSlot}>
              <div style={S.tiyongRole}>体 · 我</div>
              <div style={S.tiyongBaguaSymbol}>{tiyong.tiBagua.symbol}</div>
              <div style={S.tiyongBaguaName}>{tiyong.tiBagua.name}</div>
              <div style={S.tiyongElement}>{tiyong.tiBagua.elementName}</div>
            </div>
            <div style={S.tiyongSlot}>
              <div style={S.tiyongRole}>用 · 事</div>
              <div style={S.tiyongBaguaSymbol}>{tiyong.yongBagua.symbol}</div>
              <div style={S.tiyongBaguaName}>{tiyong.yongBagua.name}</div>
              <div style={S.tiyongElement}>{tiyong.yongBagua.elementName}</div>
            </div>
          </div>
          <div style={S.tiyongRelation}>
            {tiyong.relationLabel}
            <span style={S.tiyongNature}>{tiyong.nature}</span>
          </div>
          <div style={S.tiyongMeaning}>{tiyong.meaning}</div>
        </div>
      )}

      {ben && (
        <QuickReading
          scenario={{
            method: 'meihua',
            benHex: ben,
            changingPositions,
            variantHex: variant,
            tiyong,
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
