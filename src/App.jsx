import { useState } from 'react';
import Divination from './components/Divination';
import Reading from './components/Reading';
import Navigation from './components/Navigation';
import Study from './components/Study';
import Fortune from './components/Fortune';
import Bagua from './components/Bagua';
import Seal from './components/Seal';
import DailyDigest from './components/calendar/DailyDigest';
import Calendar from './components/calendar/Calendar';
import { generateHexagram } from './utils/divination';
import { calculateTransformations } from './utils/transformations';
import { getHexagramIdByBinary } from './data/hexagramIndex';
import { getHexagramById } from './data/hexagrams';
import { interpretHexagrams } from './utils/claudeApi';
import {
  generateDivinationId,
  saveDivinationRecord,
  getDivinationRecord,
} from './utils/storage';

const S = {
  // 外层：深宣纸色，微微的径向渐变让中心略亮，视觉上提示"焦点在中间"
  page: {
    minHeight: '100vh',
    backgroundColor: 'var(--paper-deep)',
    backgroundImage:
      'radial-gradient(ellipse at center top, rgba(245, 241, 232, 0.7) 0%, rgba(237, 230, 214, 0.1) 60%, rgba(221, 212, 190, 0) 100%)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-serif)',
    display: 'flex',
    justifyContent: 'center',
    padding: 'var(--space-6) var(--space-4)',
    position: 'relative',
    overflow: 'hidden', // 防止水印溢出造成横向滚动
  },
  // 主内容卡片：浅宣纸色，软阴影浮于深宣纸之上，如一张信笺铺桌
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: '620px',
    background: 'var(--paper)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-paper)',
    padding: 'var(--space-6) var(--space-5) var(--space-8)',
    // 细微纸边，增强"一张纸"的质感
    border: '1px solid var(--paper-edge)',
    overflow: 'hidden', // 让水印裁在卡片内
  },
  // 八卦水印：卡片内部居中，巨大低透明度，轻微慢转
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    opacity: 0.055, // 足够淡，不干扰阅读
    zIndex: 0,
  },
  // 内容层：必须显式抬升到水印之上
  content: {
    position: 'relative',
    zIndex: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 'var(--space-4)',
    marginBottom: 'var(--space-2)',
    position: 'relative',
  },
  // 装饰占位，让印章和标题视觉居中（标题两侧各有元素对称）
  headerSpacer: {
    width: '44px',
    height: '44px',
    flexShrink: 0,
  },
  brandTitle: {
    fontSize: 'var(--text-2xl)',
    fontWeight: 500,
    letterSpacing: 'var(--track-hero)',
    color: 'var(--ink)',
    margin: 0,
    paddingLeft: '0.5em', // 补 letter-spacing 造成的末尾视觉偏移
    lineHeight: 1.2,
  },
  brandSlogan: {
    textAlign: 'center',
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
    marginTop: 'var(--space-2)',
    marginBottom: 'var(--space-5)',
  },
  // 卷首引语：水墨分隔线之下、tab 之上的引文
  epigraph: {
    textAlign: 'center',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    margin: '0 0 var(--space-5)',
  },
  error: {
    color: 'var(--vermilion-deep)',
    fontSize: '0.9rem',
    lineHeight: 1.7,
    padding: 'var(--space-4)',
    border: '1px solid var(--vermilion)',
    borderRadius: 'var(--radius-md)',
    marginBottom: 'var(--space-5)',
    background: 'var(--paper-soft)',
  },
  notReady: {
    textAlign: 'center',
    color: 'var(--ink-light)',
    lineHeight: 2,
    padding: 'var(--space-6) 0',
  },
  resetButton: {
    display: 'block',
    margin: 'var(--space-5) auto 0',
    padding: '0.5rem 1.5rem',
    background: 'transparent',
    border: '1px solid var(--paper-edge)',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-serif)',
    fontSize: '0.9rem',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
  },
};

// 水墨干笔分隔线：一笔带点飞白的墨痕，两端渐隐
function InkSeparator() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'var(--space-4) 0 var(--space-6)',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 300 8"
        width="70%"
        height="8"
        preserveAspectRatio="none"
        style={{ color: 'var(--ink)' }}
      >
        {/* 主笔 */}
        <path
          d="M 20 4 Q 90 2.6 150 3.8 T 280 4"
          stroke="currentColor"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />
        {/* 副笔，制造"枯笔"层次 */}
        <path
          d="M 45 4.3 Q 140 3 170 4.6 T 260 4.2"
          stroke="currentColor"
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
          opacity="0.3"
        />
        {/* 中心小点，像一滴墨 */}
        <circle cx="150" cy="3.8" r="1.1" fill="currentColor" opacity="0.5" />
      </svg>
    </div>
  );
}

export default function App() {
  // 模式：today（今日：节气/农历/一爻/学习进度+月历）/ divination / study
  // 2026-05-15 起加 today 顶层 mode，把 DailyDigest+Calendar 从全局移入
  const [mode, setMode] = useState('today');

  // 问道模式的原有状态
  const [question, setQuestion]         = useState('');
  const [hexagrams, setHexagrams]       = useState(null);
  const [changingPositions, setChanging] = useState([]);
  const [interpretation, setInterpret]  = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [notReady, setNotReady]         = useState(false);

  // 查看历史详情
  const [viewingHistoryId, setViewingHistoryId] = useState(null);
  const [currentRecordId,  setCurrentRecordId]  = useState(null);

  // 学易 deep link：DailyDigest 点击"今日一爻"卦名时跳到该卦详情
  // 用 { hexagramId, ts } 触发 Study 组件 key 变化 → unmount + 新 mount 用 initial 值
  const [studyDeepLink, setStudyDeepLink] = useState(null);

  // 月历展开（在 today mode 内默认展开；其他 mode 不渲染月历）
  const [calendarOpen, setCalendarOpen] = useState(true);

  const reset = () => {
    setQuestion('');
    setHexagrams(null);
    setChanging([]);
    setInterpret(null);
    setError(null);
    setNotReady(false);
    setCurrentRecordId(null);
  };

  // 学易模式的所有子路由（课程/词条/卦详情）都封装在 Study 组件内部，
  // 模式切换时 Study 会 unmount，内部状态自然重置，这里不用手动清理
  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setViewingHistoryId(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setNotReady(false);
    setLoading(true);

    try {
      const result = generateHexagram();
      const { binary, changingPositions: cp } = result;

      const transforms = calculateTransformations(binary, cp);

      const resolve = (bin) => {
        if (!bin) return null;
        const id = getHexagramIdByBinary(bin);
        return id ? getHexagramById(id) : null;
      };

      const hexagramsData = {
        benGua:  resolve(transforms.benGua),
        zongGua: resolve(transforms.zongGua),
        cuoGua:  resolve(transforms.cuoGua),
        huGua:   resolve(transforms.huGua),
        bianGua: resolve(transforms.bianGua),
      };

      const interp = await interpretHexagrams({
        question,
        hexagrams: hexagramsData,
        changingPositions: cp,
      });

      setHexagrams(hexagramsData);
      setChanging(cp);
      setInterpret(interp);

      const newId = generateDivinationId();
      saveDivinationRecord({
        id: newId,
        timestamp: Date.now(),
        question,
        benGua:  hexagramsData.benGua,
        zongGua: hexagramsData.zongGua,
        cuoGua:  hexagramsData.cuoGua,
        huGua:   hexagramsData.huGua,
        bianGua: hexagramsData.bianGua,
        changingPositions: cp,
        interpretation: interp,
        userNote: '',
      });
      setCurrentRecordId(newId);

    } catch (err) {
      setError(err.message || '未知错误');
    } finally {
      setLoading(false);
    }
  };

  // 蓍草 sub-tab 内容（提交问题 / 5 层卦象 / Reading / 历史详情）
  const buildShicaoSlot = () => {
    if (viewingHistoryId) {
      const record = getDivinationRecord(viewingHistoryId);
      if (!record) {
        return (
          <div style={S.notReady}>
            <p>这条记录已消失</p>
            <button style={S.resetButton} onClick={() => setViewingHistoryId(null)}>
              返回
            </button>
          </div>
        );
      }
      return (
        <Reading
          question={record.question}
          hexagrams={{
            benGua:  record.benGua,
            zongGua: record.zongGua,
            cuoGua:  record.cuoGua,
            huGua:   record.huGua,
            bianGua: record.bianGua,
          }}
          changingPositions={record.changingPositions}
          interpretation={record.interpretation}
          recordId={viewingHistoryId}
          initialNote={record.userNote || ''}
          onBack={() => setViewingHistoryId(null)}
        />
      );
    }

    if (interpretation && hexagrams) {
      return (
        <Reading
          question={question}
          hexagrams={hexagrams}
          changingPositions={changingPositions}
          interpretation={interpretation}
          recordId={currentRecordId}
          initialNote=""
          onRestart={reset}
        />
      );
    }
    if (notReady) {
      return (
        <div style={S.notReady}>
          <p>此次起出的卦数据尚待补充</p>
          <p style={{ fontSize: '0.85rem' }}>当前只支持乾卦测试，请重新起卦</p>
          <button style={S.resetButton} onClick={reset}>重新起卦</button>
        </div>
      );
    }
    return (
      <Divination
        question={question}
        setQuestion={setQuestion}
        onSubmit={handleSubmit}
        loading={loading}
        onViewHistory={setViewingHistoryId}
      />
    );
  };

  const handleJumpToHexagram = (id) => {
    setStudyDeepLink({ hexagramId: id, ts: Date.now() });
    setMode('study');
    setViewingHistoryId(null);
  };

  const renderContent = () => {
    if (mode === 'today') {
      return (
        <>
          <DailyDigest
            onJumpToLesson={() => setMode('study')}
            onJumpToHexagram={handleJumpToHexagram}
            calendarOpen={calendarOpen}
            onToggleCalendar={() => setCalendarOpen(v => !v)}
          />
          {calendarOpen && (
            <Calendar onJumpToHexagram={handleJumpToHexagram} />
          )}
        </>
      );
    }

    if (mode === 'study') {
      // key={ts} 让每次 deep link 重新 mount Study，使 initialHexagramId 生效
      const studyKey = studyDeepLink?.ts || 'default';
      return <Study key={studyKey} initialHexagramId={studyDeepLink?.hexagramId} />;
    }

    // mode === 'divination'：占卜模式（蓍草 / 梅花 / 铜钱）
    return <Fortune shicaoSlot={buildShicaoSlot()} />;
  };

  return (
    <div style={S.page}>
      {/* 全局样式：水印慢转动画 */}
      <style>{`
        @keyframes guanyi-watermark-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .guanyi-watermark {
          animation: guanyi-watermark-spin 180s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .guanyi-watermark { animation: none; }
        }
      `}</style>

      <main style={S.card}>
        {/* 极淡的先天八卦水印，卡片中心缓慢旋转 */}
        <div className="guanyi-watermark" style={S.watermark}>
          <Bagua variant="watermark" size={Math.min(520, window.innerWidth * 0.95)} />
        </div>

        <div style={S.content}>
          {/* 品牌标题区：左侧朱砂印 + 居中标题 + 右侧对称占位 */}
          <div style={S.header}>
            <Seal size={44} character="观" />
            <h1 style={S.brandTitle}>观　易</h1>
            <div style={S.headerSpacer} aria-hidden="true" />
          </div>
          <div style={S.brandSlogan}>观易 · 见自己</div>

          {/* 水墨分隔线 */}
          <InkSeparator />

          {/* 卷首引语 */}
          <p style={S.epigraph}>天行健，君子以自强不息</p>

          {/* 模式导航 */}
          <Navigation currentMode={mode} onModeChange={handleModeChange} />

          {error && <div style={S.error}>{error}</div>}

          {renderContent()}
        </div>
      </main>
    </div>
  );
}
