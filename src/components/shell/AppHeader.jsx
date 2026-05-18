// 紧凑固定头部 —— 取代原先每屏重复的「大标题 + slogan + 分隔线 + 引语」巨块
//  - 约 52px 高，居中显示当前 tab 名，左侧小号朱砂印
//  - 适配 iPhone 顶部安全区（刘海）
import Seal from '../Seal';

const S = {
  bar: {
    display: 'flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '52px',
    padding: '0 var(--space-4)',
    paddingTop: 'env(safe-area-inset-top, 0px)',
    boxSizing: 'content-box',
    background: 'var(--paper)',
    borderBottom: '1px solid var(--paper-edge)',
    zIndex: 'var(--z-appbar)',
  },
  title: {
    margin: 0,
    fontSize: 'var(--text-lg)',
    fontWeight: 500,
    letterSpacing: 'var(--track-xwide)',
    color: 'var(--ink)',
    paddingLeft: 'var(--track-xwide)', // 补 letter-spacing 末尾偏移
  },
  spacer: { width: '30px', flexShrink: 0 },
};

const TITLES = {
  today:      '今日',
  divination: '占卜',
  study:      '学易',
  calendar:   '日历',
};

export default function AppHeader({ mode }) {
  return (
    <header style={S.bar}>
      <Seal size={30} character="观" />
      <h1 style={S.title}>{TITLES[mode] || '观易'}</h1>
      <div style={S.spacer} aria-hidden="true" />
    </header>
  );
}
