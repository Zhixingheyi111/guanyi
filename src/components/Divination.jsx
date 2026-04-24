import { useState } from 'react';
import DivinationHistory from './DivinationHistory';
import Bagua from './Bagua';

const S = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-6)',
  },
  inputBlock: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 'var(--text-md)',
    color: 'var(--ink)',
    letterSpacing: '0.08em',
    lineHeight: 1.6,
    margin: '0 0 var(--space-4)',
    fontWeight: 500,
  },
  textarea: {
    width: '100%',
    minHeight: '180px',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-base)',
    padding: 'var(--space-3)',
    resize: 'vertical',
    outline: 'none',
    lineHeight: 1.85,
  },
  hint: {
    color: 'var(--ink-light)',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.8,
    margin: 'var(--space-3) 0 0',
    paddingLeft: 'var(--space-3)',
    borderLeft: '2px solid var(--paper-edge)',
  },
  exampleToggle: {
    background: 'transparent',
    border: 'none',
    padding: '0.4rem 0',
    color: 'var(--ink-light)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-normal)',
    textAlign: 'left',
    cursor: 'pointer',
    textDecoration: 'underline',
    textDecorationColor: 'var(--paper-edge)',
    textUnderlineOffset: '4px',
    alignSelf: 'flex-start',
    marginTop: 'var(--space-4)',
    minHeight: '32px',
  },
  exampleText: {
    color: 'var(--ink-soft)',
    fontSize: '0.9rem',
    lineHeight: 1.95,
    margin: 'var(--space-3) 0 0',
    paddingLeft: 'var(--space-3)',
    borderLeft: '2px solid var(--gold)',
    fontStyle: 'italic',
  },
  // 八卦按钮整体容器
  baguaButtonWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-3)',
    marginTop: 'var(--space-4)',
    marginBottom: 'var(--space-2)',
  },
  // 八卦按钮本身（圆形，可点击）
  baguaButton: {
    width: '168px',
    height: '168px',
    borderRadius: '50%',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
    boxShadow: 'var(--shadow-paper)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease',
    position: 'relative',
  },
  baguaButtonHover: {
    transform: 'scale(1.03)',
    boxShadow: 'var(--shadow-lift)',
  },
  // 按钮下方的提示文字
  buttonLabel: {
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-xwide)',
    margin: 0,
  },
  buttonLabelActive: {
    color: 'var(--vermilion)',
  },
  status: {
    color: 'var(--ink-light)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-normal)',
    textAlign: 'center',
    padding: 'var(--space-2) 0 0',
  },
  footer: {
    color: 'var(--ink-whisper)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    textAlign: 'center',
    marginTop: 'var(--space-8)',
    marginBottom: 0,
  },
};

const EXAMPLE_TEXT = '我最近收到一份工作邀约，待遇比现在好很多，但需要离开生活了五年的城市。我犹豫的是钱重要还是熟悉的人际网络重要？是这个工作本身吸引我，还是我只是想逃离当下？';

export default function Divination({ question, setQuestion, onSubmit, loading, onViewHistory }) {
  const [showExample, setShowExample] = useState(false);
  const [hovering, setHovering]       = useState(false);

  const canSubmit = !loading && question.trim();

  return (
    <div style={S.wrapper}>
      <style>{`
        .guanyi-question-input::placeholder { color: var(--ink-whisper); }
        .guanyi-question-input:focus { border-color: var(--ink-soft); }

        /* 八卦按钮 loading 状态：缓慢自转，象征蓍草揲数进行中 */
        @keyframes guanyi-bagua-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .guanyi-bagua-loading {
          animation: guanyi-bagua-spin 12s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .guanyi-bagua-loading { animation: none; }
        }
      `}</style>

      <DivinationHistory onView={onViewHistory} />

      <div style={S.inputBlock}>
        <p style={S.title}>你此刻面对什么处境？</p>

        <textarea
          className="guanyi-question-input"
          style={S.textarea}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="在此描述……"
          disabled={loading}
        />

        <p style={S.hint}>
          易经不是占卜，是一面镜子。描述你的处境与挣扎，让卦象帮你看见自己。
        </p>

        <button
          type="button"
          style={S.exampleToggle}
          onClick={() => setShowExample(v => !v)}
        >
          {showExample ? '收起示例' : '看一个示例'}
        </button>

        {showExample && (
          <p style={S.exampleText}>{EXAMPLE_TEXT}</p>
        )}
      </div>

      {/* 八卦起卦按钮：圆形八卦图本身即为按钮 */}
      <div style={S.baguaButtonWrap}>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          aria-label={loading ? '起卦中' : '点击起卦'}
          style={{
            ...S.baguaButton,
            ...(canSubmit && hovering ? S.baguaButtonHover : null),
            opacity: !canSubmit && !loading ? 0.4 : 1,
            cursor: canSubmit ? 'pointer' : 'default',
          }}
        >
          <div className={loading ? 'guanyi-bagua-loading' : undefined}>
            <Bagua variant="button" size={150} />
          </div>
        </button>

        <p
          style={{
            ...S.buttonLabel,
            ...(loading ? S.buttonLabelActive : null),
          }}
        >
          {loading ? '蓍草　揲　数　中' : canSubmit ? '　叩　卦　' : '先描述处境'}
        </p>
      </div>

      {loading && (
        <p style={S.status}>易经正在为您解读……</p>
      )}

      <p style={S.footer}>天行健，君子以自强不息</p>
    </div>
  );
}
