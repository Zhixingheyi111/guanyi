import { useState, useMemo } from 'react';
import { getDivinationRecords, deleteDivinationRecord } from '../utils/storage';

const S = {
  container: { marginBottom: 'var(--space-5)' },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    padding: '0.6rem 0.9rem',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    minHeight: '44px',
  },
  triggerLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  badge: {
    display: 'inline-block',
    minWidth: '1.25rem',
    textAlign: 'center',
    background: 'var(--vermilion)',
    color: 'var(--paper)',
    borderRadius: '10px',
    padding: '0.05rem 0.5rem',
    fontSize: '0.72rem',
    letterSpacing: '0.05em',
    fontWeight: 'bold',
  },
  arrow: {
    color: 'var(--ink-light)',
    fontSize: '0.7rem',
    transition: 'transform 0.2s ease',
  },
  drawer: {
    marginTop: '0.4rem',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    background: 'var(--paper-soft)',
    overflow: 'hidden',
  },
  empty: {
    textAlign: 'center',
    color: 'var(--ink-light)',
    padding: 'var(--space-5)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-normal)',
  },
  item: {
    borderBottom: '1px solid var(--paper-edge)',
    padding: 'var(--space-3) var(--space-4)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  itemLast: { borderBottom: 'none' },
  timestamp: {
    color: 'var(--ink-light)',
    fontSize: 'var(--text-xs)',
    letterSpacing: 'var(--track-normal)',
  },
  question: {
    color: 'var(--ink)',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.5,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  guaLine: {
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-normal)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexWrap: 'wrap',
  },
  guaSymbol: { fontSize: '1.15rem', lineHeight: 1, color: 'var(--ink)' },
  arrowBetween: { color: 'var(--ink-whisper)' },
  changingHint: {
    color: 'var(--vermilion)',
    fontSize: 'var(--text-xs)',
    marginLeft: '0.1rem',
    letterSpacing: 'var(--track-tight)',
  },
  noChanging: {
    color: 'var(--ink-whisper)',
    fontSize: 'var(--text-xs)',
    marginLeft: '0.1rem',
    letterSpacing: 'var(--track-tight)',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.3rem',
  },
  btnView: {
    padding: '0.45rem 1.1rem',
    background: 'transparent',
    border: '1px solid var(--paper-edge)',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-xs)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    minHeight: '40px',
    borderRadius: 'var(--radius-md)',
  },
  btnDelete: {
    padding: '0.45rem 1.1rem',
    background: 'transparent',
    border: '1px solid var(--paper-edge)',
    color: 'var(--vermilion-deep)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-xs)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    minHeight: '40px',
    borderRadius: 'var(--radius-md)',
  },
};

function formatTimestamp(ts) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DivinationHistory({ onView }) {
  const [open, setOpen] = useState(false);
  // 用 nonce 触发刷新，避免在 effect 里 setState（React 19 严格模式不喜欢）
  // open 变化时 useMemo 也会重算，确保打开抽屉总能看到最新记录
  const [refreshNonce, setRefreshNonce] = useState(0);
  // open + refreshNonce 是"刷新键"而非真实数据依赖，故意触发重算
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const records = useMemo(() => getDivinationRecords(), [open, refreshNonce]);

  const handleDelete = (id) => {
    if (!window.confirm('删除这条起卦记录？此操作不可撤销。')) return;
    deleteDivinationRecord(id);
    setRefreshNonce(n => n + 1);
  };

  const count = records.length;

  return (
    <div style={S.container}>
      <button style={S.trigger} onClick={() => setOpen(o => !o)}>
        <span style={S.triggerLabel}>
          起卦历史
          {count > 0 && <span style={S.badge}>{count}</span>}
        </span>
        <span
          style={{
            ...S.arrow,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ▾
        </span>
      </button>
      {open && (
        <div style={S.drawer}>
          {records.length === 0 ? (
            <div style={S.empty}>尚无历史记录</div>
          ) : records.map((r, i) => {
            const isLast      = i === records.length - 1;
            const itemStyle   = isLast ? { ...S.item, ...S.itemLast } : S.item;
            const hasChanging = r.changingPositions && r.changingPositions.length > 0;
            return (
              <div key={r.id} style={itemStyle}>
                <div style={S.timestamp}>{formatTimestamp(r.timestamp)}</div>
                <div style={S.question}>{r.question || '（无问题）'}</div>
                <div style={S.guaLine}>
                  <span style={S.guaSymbol}>{r.benGua?.symbol}</span>
                  <span>{r.benGua?.name}</span>
                  {hasChanging && r.bianGua && (
                    <>
                      <span style={S.arrowBetween}>→</span>
                      <span style={S.guaSymbol}>{r.bianGua.symbol}</span>
                      <span>{r.bianGua.name}</span>
                    </>
                  )}
                  {hasChanging ? (
                    <span style={S.changingHint}>
                      动爻 {r.changingPositions.map(p => p + 1).join('、')}
                    </span>
                  ) : (
                    <span style={S.noChanging}>· 无动爻</span>
                  )}
                </div>
                <div style={S.actions}>
                  <button style={S.btnView} onClick={() => onView(r.id)}>查看详情</button>
                  <button style={S.btnDelete} onClick={() => handleDelete(r.id)}>删除</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
