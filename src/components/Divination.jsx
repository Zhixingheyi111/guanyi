import { useState } from 'react';
import DivinationHistory from './DivinationHistory';

const S = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  inputBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.15rem',
    color: '#eee',
    letterSpacing: '0.08em',
    lineHeight: '1.6',
    margin: '0 0 1.25rem',
  },
  textarea: {
    width: '100%',
    minHeight: '200px',
    background: '#111',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#fff',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '1rem',
    padding: '0.85rem',
    resize: 'vertical',
    outline: 'none',
    lineHeight: '1.7',
  },
  hint: {
    color: '#888',
    fontSize: '0.85rem',
    lineHeight: '1.7',
    margin: '0.75rem 0 0',
  },
  exampleToggle: {
    background: 'transparent',
    border: 'none',
    padding: '0.4rem 0',
    color: '#888',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '0.85rem',
    letterSpacing: '0.05em',
    textAlign: 'left',
    cursor: 'pointer',
    textDecoration: 'underline',
    textDecorationColor: '#444',
    textUnderlineOffset: '4px',
    alignSelf: 'flex-start',
    marginTop: '1rem',
    minHeight: '32px',
  },
  exampleText: {
    color: '#999',
    fontSize: '0.9rem',
    lineHeight: '1.85',
    margin: '0.75rem 0 0',
    paddingLeft: '0.85rem',
    borderLeft: '2px solid #333',
  },
  button: {
    alignSelf: 'flex-end',
    padding: '0.6rem 2rem',
    background: 'transparent',
    border: '1px solid #fff',
    color: '#fff',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '1rem',
    letterSpacing: '0.2em',
    cursor: 'pointer',
    minHeight: '44px',
  },
  status: {
    color: '#aaa',
    fontSize: '0.9rem',
    letterSpacing: '0.05em',
    textAlign: 'center',
    padding: '1rem 0',
  },
  footer: {
    color: '#555',
    fontSize: '0.8rem',
    letterSpacing: '0.15em',
    textAlign: 'center',
    marginTop: '4rem',
    marginBottom: 0,
  },
};

const EXAMPLE_TEXT = '我最近收到一份工作邀约，待遇比现在好很多，但需要离开生活了五年的城市。我犹豫的是钱重要还是熟悉的人际网络重要？是这个工作本身吸引我，还是我只是想逃离当下？';

export default function Divination({ question, setQuestion, onSubmit, loading, onViewHistory }) {
  const [showExample, setShowExample] = useState(false);

  return (
    <div style={S.wrapper}>
      {/* placeholder 颜色用伪元素，inline style 不支持，所以局部注入一段 style */}
      <style>{`
        .guanyi-question-input::placeholder { color: #555; }
      `}</style>

      <DivinationHistory onView={onViewHistory} />

      <div style={S.inputBlock}>
        <p style={S.title}>你此刻面对什么处境？</p>

        <textarea
          className="guanyi-question-input"
          style={S.textarea}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="在此描述..."
          disabled={loading}
        />

        <p style={S.hint}>
          💡 易经不是占卜，是一面镜子。描述你的处境与挣扎，让卦象帮你看见自己。
        </p>

        <button
          type="button"
          style={S.exampleToggle}
          onClick={() => setShowExample(v => !v)}
        >
          {showExample ? '📖 收起示例' : '📖 看一个示例'}
        </button>

        {showExample && (
          <p style={S.exampleText}>{EXAMPLE_TEXT}</p>
        )}
      </div>

      <button
        style={{
          ...S.button,
          opacity: loading || !question.trim() ? 0.4 : 1,
          cursor: loading || !question.trim() ? 'default' : 'pointer',
        }}
        onClick={onSubmit}
        disabled={loading || !question.trim()}
      >
        {loading ? '占卜中…' : '开始起卦'}
      </button>

      {loading && (
        <p style={S.status}>蓍草正在揲数，易经正在为您解读…</p>
      )}

      <p style={S.footer}>"善易者不卜" — 子曰</p>
    </div>
  );
}
