// 占卜专用的 AI 解读卡：mount 时调用 interpretFortune 一次，展示精简结果
// 三种占卜方法（梅花/铜钱/灵签）共用此组件
import { useState, useEffect } from 'react';
import { interpretFortune } from '../../utils/claudeApi';

const S = {
  wrap: {
    padding: 'var(--space-4)',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-5)',
    animation: 'quickreading-fade-in 0.5s ease',
  },
  label: {
    fontSize: 'var(--text-xs)',
    color: 'var(--vermilion)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: 'var(--space-2)',
    textTransform: 'uppercase',
  },
  coreAdvice: {
    fontSize: 'var(--text-base)',
    color: 'var(--ink)',
    lineHeight: 1.95,
    letterSpacing: '0.04em',
    marginBottom: 'var(--space-4)',
  },
  yijiRow: {
    display: 'flex',
    gap: 'var(--space-3)',
    flexWrap: 'wrap',
  },
  yijiCard: {
    flex: '1 1 140px',
    padding: 'var(--space-3)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--paper)',
    border: '1px solid var(--paper-edge)',
    minWidth: 0,
  },
  yijiLabel: {
    fontSize: 'var(--text-xs)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: 'var(--space-1)',
    fontWeight: 500,
  },
  yiLabel: {
    color: 'var(--wuxing-wood)',
  },
  jiLabel: {
    color: 'var(--vermilion)',
  },
  yijiText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    lineHeight: 1.8,
  },
  loading: {
    padding: 'var(--space-5) var(--space-4)',
    textAlign: 'center',
    color: 'var(--ink-light)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    border: '1px dashed var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-5)',
  },
  loadingDot: {
    display: 'inline-block',
    animation: 'quickreading-dot 1.4s infinite ease-in-out both',
  },
  error: {
    padding: 'var(--space-4)',
    border: '1px solid var(--vermilion)',
    background: 'var(--paper-soft)',
    color: 'var(--vermilion-deep)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-5)',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.7,
  },
};

const ANIM = `
  @keyframes quickreading-fade-in {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes quickreading-dot {
    0%, 80%, 100% { opacity: 0.2; }
    40% { opacity: 1; }
  }
`;

export default function QuickReading({ scenario, question }) {
  const [state, setState] = useState({ status: 'loading' });

  // 输入是 mount 时的快照，本组件挂载即触发一次 AI 调用，永不重跑
  // 初始 state 已经是 'loading'，所以不需要在 effect 里再 setState（React 19 严格模式禁止）
  // setState 在 then/catch 的 promise 回调里是异步触发，符合规则
  useEffect(() => {
    let cancelled = false;
    interpretFortune({ scenario, question })
      .then(data => {
        if (!cancelled) setState({ status: 'ok', data });
      })
      .catch(err => {
        if (!cancelled) setState({ status: 'error', message: err.message || '解读失败' });
      });
    return () => { cancelled = true; };
    // 故意只在 mount 时跑一次，scenario/question 是 mount 快照
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.status === 'loading') {
    return (
      <div style={S.loading}>
        <style>{ANIM}</style>
        卦象在心 · 解读中
        <span style={{ ...S.loadingDot, animationDelay: '0s' }}>·</span>
        <span style={{ ...S.loadingDot, animationDelay: '0.2s' }}>·</span>
        <span style={{ ...S.loadingDot, animationDelay: '0.4s' }}>·</span>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div style={S.error}>
        AI 解读暂未取得：{state.message}
      </div>
    );
  }

  const { coreAdvice, yi, ji } = state.data;

  return (
    <div style={S.wrap}>
      <style>{ANIM}</style>
      <div style={S.label}>AI · 占　解</div>
      <div style={S.coreAdvice}>{coreAdvice}</div>
      <div style={S.yijiRow}>
        {yi && (
          <div style={S.yijiCard}>
            <div style={{ ...S.yijiLabel, ...S.yiLabel }}>宜</div>
            <div style={S.yijiText}>{yi}</div>
          </div>
        )}
        {ji && (
          <div style={S.yijiCard}>
            <div style={{ ...S.yijiLabel, ...S.jiLabel }}>忌</div>
            <div style={S.yijiText}>{ji}</div>
          </div>
        )}
      </div>
    </div>
  );
}
