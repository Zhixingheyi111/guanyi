import { useState } from 'react';
import DivinationHistory from './DivinationHistory';
import Bagua from './Bagua';

const S = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-6)',
  },
  intro: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    lineHeight: 1.8,
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
    minHeight: '110px',
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
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 0,
    boxShadow: 'var(--shadow-paper)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease, border-color 0.3s ease',
    position: 'relative',
  },
  baguaButtonHover: {
    transform: 'scale(1.03)',
    boxShadow: 'var(--shadow-lift)',
  },
  // 就绪态：textarea 有内容时，按钮边框加深，提示用户"可以叩卦了"
  baguaButtonReady: {
    borderColor: 'var(--ink-soft)',
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
};

export default function Divination({ question, setQuestion, onSubmit, loading, onViewHistory }) {
  const [hovering, setHovering] = useState(false);

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

        /* 八卦按钮就绪态：textarea 有内容时，缓慢呼吸式光晕，暗示可点击 */
        @keyframes guanyi-bagua-pulse {
          0%, 100% { box-shadow: var(--shadow-paper); }
          50%      { box-shadow: var(--shadow-lift), 0 0 14px rgba(120, 90, 60, 0.18); }
        }
        .guanyi-bagua-ready {
          animation: guanyi-bagua-pulse 2.6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .guanyi-bagua-loading,
          .guanyi-bagua-ready { animation: none; }
        }
      `}</style>

      <div style={S.intro}>
        蓍草揲数 · 大衍之数<br />
        心有大事 · 一日一占
      </div>

      <DivinationHistory onView={onViewHistory} />

      <div style={S.inputBlock}>
        <p style={S.title}>你此刻面对什么处境？</p>

        <textarea
          className="guanyi-question-input"
          style={S.textarea}
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="易经不是占卜，是一面镜子。在此描述你的处境与挣扎……"
          disabled={loading}
        />
      </div>

      {/* 八卦起卦按钮：圆形八卦图本身即为按钮。canSubmit 时呼吸光晕暗示可点 */}
      <div style={S.baguaButtonWrap}>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          aria-label={loading ? '起卦中' : '点击起卦'}
          className={canSubmit && !loading ? 'guanyi-bagua-ready' : undefined}
          style={{
            ...S.baguaButton,
            ...(canSubmit ? S.baguaButtonReady : null),
            ...(canSubmit && hovering ? S.baguaButtonHover : null),
            opacity: !canSubmit && !loading ? 0.4 : 1,
            cursor: canSubmit ? 'pointer' : 'default',
          }}
        >
          <div className={loading ? 'guanyi-bagua-loading' : undefined}>
            <Bagua variant="button" size={105} />
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
    </div>
  );
}
