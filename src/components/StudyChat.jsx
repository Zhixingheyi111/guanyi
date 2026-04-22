// 学习聊天：向经典问学
import { useState, useRef, useEffect } from 'react';
import { sendStudyMessage } from '../utils/studyChat';

const S = {
  container: {
    marginTop: '0.5rem',
  },
  messages: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
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
  bubbleUser: {
    background: '#1e3a3a',
    color: '#e8e8e8',
    padding: '0.6rem 0.9rem',
    borderRadius: '12px 12px 2px 12px',
    maxWidth: '80%',
    fontSize: '0.9rem',
    lineHeight: '1.7',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  bubbleMaster: {
    background: '#111',
    border: '1px solid #333',
    color: '#e0e0e0',
    padding: '0.75rem 1rem',
    borderRadius: '12px 12px 12px 2px',
    maxWidth: '90%',
    fontSize: '0.95rem',
    lineHeight: '1.9',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  loading: {
    color: '#888',
    fontSize: '0.85rem',
    fontStyle: 'italic',
    padding: '0.5rem 0',
  },
  error: {
    color: '#ff6666',
    fontSize: '0.85rem',
    padding: '0.6rem 0.8rem',
    border: '1px solid #441111',
    borderRadius: '4px',
    marginBottom: '0.75rem',
  },
  inputRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'stretch',
  },
  input: {
    flex: 1,
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#e8e8e8',
    padding: '0.6rem 0.8rem',
    fontFamily: 'inherit',
    // 防止 iOS 聚焦缩放
    fontSize: '1rem',
    resize: 'none',
    outline: 'none',
    minHeight: '44px',
    lineHeight: '1.6',
  },
  sendButton: {
    background: 'transparent',
    border: '1px solid #555',
    color: '#ccc',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    letterSpacing: '0.1em',
    padding: '0 1rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    minHeight: '44px',
  },
  sendButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  hint: {
    color: '#555',
    fontSize: '0.8rem',
    textAlign: 'center',
    padding: '1rem 0',
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
    // 立刻把用户消息加入界面
    setHistory(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const reply = await sendStudyMessage({
        hexagram,
        history,          // 发送时不含本次 userMsg，API 侧会追加
        userMessage: text,
      });
      setHistory(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setError(err.message || '请求失败');
      // 失败时保留用户消息，方便重试
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Enter 发送，Shift+Enter 换行
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
            <div style={S.loading}>思考中…</div>
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
          placeholder="向经典问学…（Enter 发送，Shift+Enter 换行）"
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
