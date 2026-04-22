import { useState, useEffect } from 'react';
import { getDivinationRecords, deleteDivinationRecord } from '../utils/storage';

const S = {
  container: { marginBottom: '1.25rem' },
  trigger: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '0.6rem 0.9rem',
    color: '#aaa',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '0.9rem',
    letterSpacing: '0.1em',
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
    background: '#d4a24c',
    color: '#000',
    borderRadius: '10px',
    padding: '0.05rem 0.5rem',
    fontSize: '0.72rem',
    letterSpacing: '0.05em',
    fontWeight: 'bold',
  },
  arrow: { color: '#666', fontSize: '0.8rem' },
  drawer: {
    marginTop: '0.4rem',
    border: '1px solid #333',
    borderRadius: '4px',
    background: '#0b0b0b',
    overflow: 'hidden',
  },
  empty: {
    textAlign: 'center',
    color: '#666',
    padding: '1.25rem',
    fontSize: '0.85rem',
    letterSpacing: '0.05em',
  },
  item: {
    borderBottom: '1px solid #222',
    padding: '0.75rem 0.9rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  itemLast: { borderBottom: 'none' },
  timestamp: {
    color: '#666',
    fontSize: '0.75rem',
    letterSpacing: '0.05em',
  },
  question: {
    color: '#ccc',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  guaLine: {
    color: '#aaa',
    fontSize: '0.85rem',
    letterSpacing: '0.05em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    flexWrap: 'wrap',
  },
  guaSymbol: { fontSize: '1.15rem', lineHeight: 1 },
  arrowBetween: { color: '#555' },
  changingHint: {
    color: '#d4a24c',
    fontSize: '0.75rem',
    marginLeft: '0.1rem',
  },
  noChanging: {
    color: '#555',
    fontSize: '0.75rem',
    marginLeft: '0.1rem',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '0.3rem',
  },
  btnView: {
    padding: '0.4rem 1rem',
    background: 'transparent',
    border: '1px solid #555',
    color: '#ccc',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    minHeight: '36px',
  },
  btnDelete: {
    padding: '0.4rem 1rem',
    background: 'transparent',
    border: '1px solid #553333',
    color: '#b66',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    minHeight: '36px',
  },
};

function formatTimestamp(ts) {
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function DivinationHistory({ onView }) {
  const [open, setOpen]       = useState(false);
  const [records, setRecords] = useState(() => getDivinationRecords());

  // 每次展开抽屉时重新读取，避免其他页面新增后看不到
  useEffect(() => {
    if (open) setRecords(getDivinationRecords());
  }, [open]);

  const handleDelete = (id) => {
    if (!window.confirm('删除这条起卦记录？此操作不可撤销。')) return;
    deleteDivinationRecord(id);
    setRecords(getDivinationRecords());
  };

  const count = records.length;

  return (
    <div style={S.container}>
      <button style={S.trigger} onClick={() => setOpen(o => !o)}>
        <span style={S.triggerLabel}>
          📜 起卦历史
          {count > 0 && <span style={S.badge}>{count}</span>}
        </span>
        <span style={S.arrow}>{open ? '▲' : '▼'}</span>
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
