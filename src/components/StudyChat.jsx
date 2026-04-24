// 学习聊天：向经典问学
import { useState, useRef, useEffect } from 'react';
import { sendStudyMessage } from '../utils/studyChat';

const S = {
  container: {
    marginTop: 'var(--space-2)',
  },
  messages: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-4)',
    minHeight: '80px',
  },
  bubbleRow: {
    display: 'flex',
    width: '100%',
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleRowMaster: {
    justifyContent: 'flex-start',
  },
  // 用户：墨色底（自己说的话 = 自己写在纸上）
  bubbleUser: {
    background: 'var(--ink)',
    color: 'var(--paper)',
    padding: '0.6rem 0.9rem',
    borderRadius: '12px 12px 2px 12px',
    maxWidth: '80%',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.75,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontFamily: 'var(--font-serif)',
    letterSpacing: 'var(--track-tight)',
  },
  // 师者：浅宣纸底（像引述古籍）
  bubbleMaster: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    color: 'var(--ink)',
    padding: '0.75rem 1rem',
    borderRadius: '12px 12px 12px 2px',
    maxWidth: '90%',
    fontSize: 'var(--text-base)',
    lineHeight: 1.95,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    fontFamily: 'var(--font-serif)',
  },
  loading: {
    color: 'var(--ink-light)',
    fontSize: 'var(--text-sm)',
    fontStyle: 'italic',
    padding: 'var(--space-2) 0',
    letterSpacing: 'var(--track-normal)',
  },
  error: {
    color: 'var(--vermilion-deep)',
    fontSize: 'var(--text-sm)',
    padding: 'var(--space-2) var(--space-3)',
    border: '1px solid var(--vermilion)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-3)',
    background: 'var(--paper-soft)',
  },
  inputRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'stretch',
  },
  input: {
    flex: 1,
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--ink)',
    padding: '0.6rem 0.8rem',
    fontFamily: 'var(--font-serif)',
    // 防止 iOS 聚焦缩放
    fontSize: 'var(--text-base)',
    resize: 'none',
    outline: 'none',
    minHeight: '44px',
    lineHeight: 1.7,
  },
  sendButton: {
    background: 'var(--ink)',
    border: '1px solid var(--ink)',
    color: 'var(--paper)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    padding: '0 1.1rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    minHeight: '44px',
    borderRadius: 'var(--radius-md)',
    transition: 'opacity 0.2s ease',
  },
  sendButtonDisabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },
  hint: {
    color: 'var(--ink-light)',
    fontSize: 'var(--text-sm)',
    textAlign: 'center',
    padding: 'var(--space-4) 0',
    letterSpacing: 'var(--track-normal)',
    fontStyle: 'italic',
  },
};

export default function StudyChat({ hexagram }) {
  // key 绑定 hexagram.id，切换卦时组件会 remount，history 自动重置
  const [history, setHistory] = useState([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const messagesEndRef        = useRef(null);

  // 新消息到来时滚动到聊天底部；空状态下不滚，避免打开卦详情就被拽到页尾
  useEffect(() => {
    if (history.length === 0 && !loading) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [history, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setInput('');

    const userMsg = { role: 'user', content: text };
    setHistory(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await sendStudyMessage({
        hexagram,
        history,
        userMessage: text,
      });
      setHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message || '请求失败');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={S.container}>
      <div style={S.messages}>
        {history.length === 0 && !loading && (
          <div style={S.hint}>对{hexagram.name}卦有什么疑问？向经典问学</div>
        )}
        {history.map((msg, i) => (
          <div
            key={i}
            style={{
              ...S.bubbleRow,
              ...(msg.role === 'user' ? S.bubbleRowUser : S.bubbleRowMaster),
            }}
          >
            <div style={msg.role === 'user' ? S.bubbleUser : S.bubbleMaster}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ ...S.bubbleRow, ...S.bubbleRowMaster }}>
            <div style={S.loading}>思考中……</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {error && <div style={S.error}>{error}</div>}

      <div style={S.inputRow}>
        <textarea
          style={S.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="向经典问学……（Enter 发送，Shift+Enter 换行）"
          rows={2}
          disabled={loading}
        />
        <button
          style={{
            ...S.sendButton,
            ...((!input.trim() || loading) ? S.sendButtonDisabled : {}),
          }}
          onClick={handleSend}
          disabled={!input.trim() || loading}
        >
          发送
        </button>
      </div>
    </div>
  );
}
