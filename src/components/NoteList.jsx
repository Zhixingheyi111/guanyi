// 学易「笔记」sub-tab：汇总所有写过笔记的卦
// 数据来源：storage.getAllHexagramNotes()（localStorage 中的卦笔记）
import { getAllHexagramNotes } from '../utils/storage';
import { getHexagramById } from '../data/hexagrams';

const S = {
  intro: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    lineHeight: 1.8,
    marginBottom: 'var(--space-5)',
  },
  empty: {
    textAlign: 'center',
    color: 'var(--ink-light)',
    fontSize: 'var(--text-sm)',
    lineHeight: 2,
    padding: 'var(--space-8) var(--space-4)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
  },
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-3)',
    width: '100%',
    textAlign: 'left',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4)',
    cursor: 'pointer',
    fontFamily: 'var(--font-serif)',
    transition: 'border-color 0.2s ease',
  },
  symbol: {
    fontSize: 'var(--text-xl)',
    lineHeight: 1,
    color: 'var(--ink)',
    flexShrink: 0,
  },
  body: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    fontSize: 'var(--text-base)',
    color: 'var(--ink)',
    fontWeight: 500,
    letterSpacing: 'var(--track-wide)',
    marginBottom: '0.25rem',
  },
  note: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-light)',
    lineHeight: 1.7,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
};

export default function NoteList({ onSelectHexagram }) {
  const notes = getAllHexagramNotes();

  if (notes.length === 0) {
    return (
      <div style={S.empty}>
        <p>还没有笔记。</p>
        <p style={{ fontSize: 'var(--text-xs)' }}>
          在「卦目」翻开任意一卦，详情页底部即可写下你的笔记。
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={S.intro}>
        我的卦笔记 · 共 {notes.length} 则
      </div>
      <div style={S.list}>
        {notes.map(({ hexagramId, note }) => {
          const hex = getHexagramById(hexagramId);
          if (!hex) return null;
          return (
            <button
              key={hexagramId}
              type="button"
              className="guanyi-tap"
              style={S.item}
              onClick={() => onSelectHexagram(hexagramId)}
            >
              <span style={S.symbol}>{hex.symbol}</span>
              <span style={S.body}>
                <span style={S.name}>{hex.name}</span>
                <span style={S.note}>{note}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
