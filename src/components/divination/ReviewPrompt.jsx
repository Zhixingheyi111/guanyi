// 占卜复盘表单（Phase 易经-A4 护城河）
// 用户在占卜后 7+ 天写一段"那件事后来怎样了"+ 自评 → AI 综合反思
// 形成长期可见的"我的占卜日记"，是任何 AI 占卜对手没做的差异化
import { useState } from 'react';
import { reflectFortune } from '../../utils/claudeApi';

const S = {
  card: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderLeft: '3px solid var(--vermilion)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4) var(--space-4)',
    marginTop: 'var(--space-3)',
    fontFamily: 'var(--font-serif)',
  },
  title: {
    fontSize: 'var(--text-sm)',
    fontWeight: 500,
    color: 'var(--vermilion-deep)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-3)',
  },
  question: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    fontStyle: 'italic',
    marginBottom: 'var(--space-3)',
    lineHeight: 1.7,
  },
  label: {
    display: 'block',
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
    marginBottom: 'var(--space-2)',
  },
  textarea: {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: '0.6rem 0.8rem',
    background: 'var(--paper)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink)',
    lineHeight: 1.7,
    minHeight: '80px',
    resize: 'vertical',
    outline: 'none',
    marginBottom: 'var(--space-4)',
  },
  ratingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--space-2)',
    marginBottom: 'var(--space-4)',
  },
  ratingButtons: {
    display: 'flex',
    gap: '0.4rem',
  },
  ratingBtn: {
    width: '36px',
    height: '36px',
    background: 'var(--paper)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  ratingBtnActive: {
    background: 'var(--vermilion)',
    color: 'var(--paper)',
    borderColor: 'var(--vermilion)',
  },
  ratingLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
  },
  actions: {
    display: 'flex',
    gap: 'var(--space-3)',
    justifyContent: 'flex-end',
  },
  btnPrimary: {
    padding: '0.5rem 1.2rem',
    background: 'var(--ink)',
    color: 'var(--paper)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    minHeight: '40px',
  },
  btnPrimaryDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  btnSecondary: {
    padding: '0.5rem 1rem',
    background: 'transparent',
    border: '1px solid var(--paper-edge)',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    minHeight: '40px',
    borderRadius: 'var(--radius-md)',
  },
  loading: {
    textAlign: 'center',
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-sm)',
    padding: 'var(--space-3) 0',
    fontStyle: 'italic',
  },
  reflectionBox: {
    background: 'var(--paper)',
    border: '1px solid var(--paper-edge)',
    borderLeft: '3px solid var(--gold)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4)',
    marginTop: 'var(--space-4)',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink)',
    lineHeight: 1.95,
    whiteSpace: 'pre-wrap',
    letterSpacing: '0.01em',
  },
  reflectionTitle: {
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: 'var(--space-2)',
  },
  errorMsg: {
    color: 'var(--vermilion-deep)',
    fontSize: 'var(--text-sm)',
    marginTop: 'var(--space-2)',
  },
};

const RATING_LABELS = ['', '完全不准', '不太准', '部分应验', '较准', '非常准'];

export default function ReviewPrompt({ record, onSubmit, onCancel }) {
  const [userReply, setUserReply]     = useState('');
  const [selfRating, setSelfRating]   = useState(3);
  const [phase, setPhase]             = useState('editing');  // 'editing' | 'loading' | 'reflecting' | 'error'
  const [reflection, setReflection]   = useState(null);
  const [error, setError]             = useState(null);

  // 在 mount 时算一次：Date.now() 在 useState 初始化函数中调用是允许的
  const [daysElapsed] = useState(() =>
    Math.floor((Date.now() - record.timestamp) / 86400000)
  );
  const canSubmit = userReply.trim().length >= 3 && phase === 'editing';

  const handleSubmit = async () => {
    setPhase('loading');
    setError(null);
    try {
      const aiText = await reflectFortune({ record, userReply, selfRating, daysElapsed });
      setReflection(aiText);
      setPhase('reflecting');
    } catch (e) {
      setError(e.message || 'AI 反思生成失败');
      setPhase('error');
    }
  };

  const handleSave = () => {
    onSubmit({
      userReply,
      selfRating,
      aiReflection: reflection,
      reviewedAt: Date.now(),
    });
  };

  const handleSaveWithoutAI = () => {
    onSubmit({
      userReply,
      selfRating,
      aiReflection: null,
      reviewedAt: Date.now(),
    });
  };

  return (
    <div style={S.card}>
      <div style={S.title}>复盘 · 占卦 {daysElapsed} 天后</div>
      <div style={S.question}>
        当时问：{record.question || '（未明示）'}
      </div>

      <label style={S.label} htmlFor="review-reply">那件事后来怎样了？</label>
      <textarea
        id="review-reply"
        style={S.textarea}
        value={userReply}
        onChange={(e) => setUserReply(e.target.value)}
        placeholder="老老实实写一段。是按卦象走的、还是另有发展？"
        rows={4}
        disabled={phase === 'loading' || phase === 'reflecting'}
      />

      <div style={S.ratingRow}>
        <span style={S.label}>原卦准不准</span>
        <div style={S.ratingButtons} role="radiogroup">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              role="radio"
              aria-checked={selfRating === n}
              aria-label={`${n} 分 ${RATING_LABELS[n]}`}
              style={{
                ...S.ratingBtn,
                ...(selfRating === n ? S.ratingBtnActive : null),
              }}
              onClick={() => setSelfRating(n)}
              disabled={phase === 'loading' || phase === 'reflecting'}
            >
              {n}
            </button>
          ))}
        </div>
        <span style={S.ratingLabel}>{RATING_LABELS[selfRating]}</span>
      </div>

      {phase === 'editing' && (
        <div style={S.actions}>
          <button style={S.btnSecondary} onClick={onCancel}>取消</button>
          <button
            style={{ ...S.btnPrimary, ...(!canSubmit ? S.btnPrimaryDisabled : null) }}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            请 AI 反思一下
          </button>
        </div>
      )}

      {phase === 'loading' && (
        <div style={S.loading}>占者正在回看你的描述与原卦……</div>
      )}

      {phase === 'reflecting' && reflection && (
        <>
          <div style={S.reflectionBox}>
            <div style={S.reflectionTitle}>占者的反思</div>
            {reflection}
          </div>
          <div style={{ ...S.actions, marginTop: 'var(--space-4)' }}>
            <button style={S.btnSecondary} onClick={onCancel}>暂不保存</button>
            <button style={S.btnPrimary} onClick={handleSave}>保存此次复盘</button>
          </div>
        </>
      )}

      {phase === 'error' && (
        <>
          <div style={S.errorMsg}>{error}</div>
          <div style={{ ...S.actions, marginTop: 'var(--space-3)' }}>
            <button style={S.btnSecondary} onClick={onCancel}>取消</button>
            <button style={S.btnSecondary} onClick={() => setPhase('editing')}>
              重试 AI 反思
            </button>
            <button style={S.btnPrimary} onClick={handleSaveWithoutAI}>
              不要 AI 反思，仅保存
            </button>
          </div>
        </>
      )}
    </div>
  );
}
