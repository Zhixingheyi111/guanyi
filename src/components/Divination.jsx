import DivinationHistory from './DivinationHistory';

const S = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  label: {
    fontSize: '1rem',
    color: '#ccc',
    letterSpacing: '0.1em',
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    background: '#111',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#fff',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '1rem',
    padding: '0.75rem',
    resize: 'vertical',
    outline: 'none',
    lineHeight: '1.7',
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
};

export default function Divination({ question, setQuestion, onSubmit, loading, onViewHistory }) {
  return (
    <div style={S.wrapper}>
      <DivinationHistory onView={onViewHistory} />
      <p style={S.label}>请将您的问题告知易经：</p>
      <textarea
        style={S.textarea}
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="例如：我是否应该接受这份工作邀约？"
        disabled={loading}
      />
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
        <p style={S.status}>蓍草正在揲数，易经大师正在为您解读…</p>
      )}
    </div>
  );
}
