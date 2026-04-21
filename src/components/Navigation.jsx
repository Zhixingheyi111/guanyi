// 顶部模式导航：问道 / 学易

const S = {
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginBottom: '2.5rem',
  },
  button: {
    background: 'transparent',
    border: 'none',
    padding: '0.3rem 0.2rem',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '0.95rem',
    letterSpacing: '0.15em',
    cursor: 'pointer',
  },
  active: {
    color: '#fff',
    borderBottom: '1px solid #fff',
  },
  inactive: {
    color: '#666',
    borderBottom: '1px solid transparent',
  },
};

export default function Navigation({ currentMode, onModeChange }) {
  const btnStyle = (mode) => ({
    ...S.button,
    ...(currentMode === mode ? S.active : S.inactive),
  });

  return (
    <nav style={S.nav}>
      <button style={btnStyle('divination')} onClick={() => onModeChange('divination')}>
        🌿 问道
      </button>
      <button style={btnStyle('study')} onClick={() => onModeChange('study')}>
        📖 学易
      </button>
    </nav>
  );
}
