// 六十四卦网格列表：学易模式首屏
import { hexagrams } from '../data/hexagrams';

const S = {
  title: {
    fontSize: '1.1rem',
    letterSpacing: '0.3em',
    textAlign: 'center',
    color: '#ccc',
    marginBottom: '1.5rem',
    fontWeight: 'normal',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
    gap: '0.5rem',
  },
  cell: {
    background: '#111',
    border: '1px solid #333',
    borderRadius: '4px',
    padding: '0.6rem 0.3rem',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background 0.15s, border-color 0.15s',
  },
  cellHover: {
    background: '#1a1a1a',
    borderColor: '#555',
  },
  symbol: {
    fontSize: '1.75rem',
    lineHeight: 1,
    color: '#fff',
  },
  name: {
    fontSize: '0.9rem',
    color: '#ddd',
    letterSpacing: '0.1em',
    marginTop: '0.35rem',
  },
  id: {
    fontSize: '0.7rem',
    color: '#666',
    marginTop: '0.2rem',
    letterSpacing: '0.05em',
  },
};

function Cell({ hexagram, onClick }) {
  // 用内联事件处理 hover，避免引入 CSS 文件
  const handleEnter = (e) => Object.assign(e.currentTarget.style, S.cellHover);
  const handleLeave = (e) => {
    e.currentTarget.style.background = S.cell.background;
    e.currentTarget.style.borderColor = S.cell.border.split(' ')[2];
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
