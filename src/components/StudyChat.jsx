// 学习聊天：向经典问学，与四位作者对话
import { useState, useRef, useEffect } from 'react';
import { sendStudyMessage, PERSONAS, DEFAULT_PERSONA } from '../utils/studyChat';

const PERSONA_ORDER = ['confucius', 'wenwang', 'shaoyong', 'zhuxi'];

const S = {
  container: {
    marginTop: 'var(--space-2)',
  },
  personaRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 'var(--space-2)',
    marginBottom: 'var(--space-3)',
    flexWrap: 'wrap',
  },
  personaBtn: {
    padding: '0.35rem 0.8rem',
    background: 'var(--paper)',
    border: '1px solid var(--paper-edge)',
    color: 'var(--ink-light)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
    minHeight: '36px',
    transition: 'all 0.2s ease',
  },
  personaBtnActive: {
    background: 'var(--ink)',
    color: 'var(--paper)',
    borderColor: 'var(--ink)',
  },
  personaLabel: {
    textAlign: 'center',
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-3)',
  },
  focusBadge: {
    margin: '0 0 var(--space-3)',
    padding: '0.4rem 0.7rem',
    background: 'var(--paper-deep)',
    borderLeft: '3px solid var(--vermilion)',
    borderRadius: 'var(--radius-sm)',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    lineHeight: 1.6,
    display: 'flex',
    alignItems: 'flex-start',
    gap: 'var(--space-2)',
  },
  focusBadgeLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--vermilion)',
    letterSpacing: 'var(--track-xwide)',
    flexShrink: 0,
    paddingTop: '2px',
  },
  focusBadgeClear: {
    background: 'transparent',
    border: 'none',
    color: 'var(--ink-light)',
    cursor: 'pointer',
    fontSize: 'var(--text-xs)',
    marginLeft: 'auto',
    flexShrink: 0,
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
  const [persona, setPersona] = useState(DEFAULT_PERSONA);
  // selectedText 是 Phase 1.10 的接口槽位；1.10 会通过 imperative handle 暴露写入方法
  const [selectedText, setSelectedText] = useState(null);
  const messagesEndRef        = useRef(null);

  const handlePersonaChange = (id) => {
    if (id === persona) return;
    setPersona(id);
    setHistory([]);
    setError(null);
    setSelectedText(null);
  };

  const clearFocus = () => setSelectedText(null);

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
        persona,
        selectedText,
      });
      setHistory(prev => [...prev, { role: 'assistant', content: reply }]);
      // 一次发问后清焦点，下条消息自由问
      setSelectedText(null);
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

  const currentPersona = PERSONAS[persona];

  return (
    <div style={S.container}>
      <div style={S.personaRow} role="tablist" aria-label="选择与之对话的作者">
        {PERSONA_ORDER.map(id => {
          const p = PERSONAS[id];
          return (
            <button
              key={id}
              role="tab"
              aria-selected={persona === id}
              style={{
                ...S.personaBtn,
                ...(persona === id ? S.personaBtnActive : null),
              }}
              onClick={() => handlePersonaChange(id)}
            >
              {p.name}
            </button>
          );
        })}
      </div>
      <div style={S.personaLabel}>
        当下对话：{currentPersona.fullName}（{currentPersona.era}）
      </div>

      {selectedText && (
        <div style={S.focusBadge}>
          <span style={S.focusBadgeLabel}>针对</span>
          <span>「{selectedText}」</span>
          <button style={S.focusBadgeClear} onClick={clearFocus} aria-label="取消针对">
            取消
          </button>
        </div>
      )}

      <div style={S.messages}>
        {history.length === 0 && !loading && (
          <div style={S.hint}>对{hexagram.name}卦有什么疑问？请{currentPersona.name}说一说</div>
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
