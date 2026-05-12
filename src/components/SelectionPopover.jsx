// 选中文本浮动按钮：用户在原文上选中→定位到选区上方→点击触发回调
// 与 useTextSelection 配合使用

const S = {
  popover: {
    position: 'fixed',
    zIndex: 1000,
    transform: 'translate(-50%, -100%)',
    transition: 'opacity 0.15s ease',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid var(--ink)',
    margin: '0 auto',
  },
  btn: {
    padding: '0.45rem 0.9rem',
    background: 'var(--ink)',
    color: 'var(--paper)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    minHeight: '36px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
    whiteSpace: 'nowrap',
  },
};

export default function SelectionPopover({ selection, label = '问 这一句', onAsk }) {
  if (!selection) return null;
  const { text, rect } = selection;

  // 用 viewport-relative 坐标（fixed 定位）
  const top  = Math.max(rect.top - 12, 8);  // 选区上方 12px，最少离顶 8px
  const left = rect.left + rect.width / 2;

  return (
    <div style={{ ...S.popover, top: `${top}px`, left: `${left}px` }}>
      <button
        style={S.btn}
        onMouseDown={(e) => e.preventDefault()}  // 别让按钮抢走选区
        onClick={() => onAsk(text)}
      >
        {label}
      </button>
      <div style={S.arrow} />
    </div>
  );
}
