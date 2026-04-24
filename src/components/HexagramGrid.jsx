// 六十四卦网格列表：学易模式首屏
import { hexagrams } from '../data/hexagrams';

const S = {
  title: {
    fontSize: 'var(--text-md)',
    letterSpacing: 'var(--track-xwide)',
    textAlign: 'center',
    color: 'var(--ink-soft)',
    marginTop: 0,
    marginBottom: 'var(--space-5)',
    fontWeight: 500,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
    gap: 'var(--space-2)',
  },
  cell: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    padding: '0.7rem 0.3rem 0.5rem',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s',
    fontFamily: 'var(--font-serif)',
  },
  cellHover: {
    background: 'var(--paper)',
    borderColor: 'var(--ink-light)',
    transform: 'translateY(-1px)',
    boxShadow: 'var(--shadow-paper)',
  },
  symbol: {
    fontSize: '1.75rem',
    lineHeight: 1,
    color: 'var(--ink)',
  },
  name: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink)',
    letterSpacing: 'var(--track-wide)',
    marginTop: '0.35rem',
    fontWeight: 500,
  },
  id: {
    fontSize: '0.7rem',
    color: 'var(--ink-whisper)',
    marginTop: '0.2rem',
    letterSpacing: 'var(--track-normal)',
  },
};

function Cell({ hexagram, onClick }) {
  const handleEnter = (e) => {
    Object.assign(e.currentTarget.style, S.cellHover);
  };
  const handleLeave = (e) => {
    e.currentTarget.style.background = S.cell.background;
    e.currentTarget.style.borderColor = 'var(--paper-edge)';
    e.currentTarget.style.transform = 'none';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div
      style={S.cell}
      onClick={() => onClick(hexagram.id)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div style={S.symbol}>{hexagram.symbol}</div>
      <div style={S.name}>{hexagram.name}</div>
      <div style={S.id}>{String(hexagram.id).padStart(2, '0')}</div>
    </div>
  );
}

export default function HexagramGrid({ onSelectHexagram }) {
  return (
    <div>
      <h2 style={S.title}>六 十 四 卦</h2>
      <div style={S.grid}>
        {hexagrams.map(h => (
          <Cell key={h.id} hexagram={h} onClick={onSelectHexagram} />
        ))}
      </div>
    </div>
  );
}
