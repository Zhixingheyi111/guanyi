import { useState } from 'react';
import Divination from './components/Divination';
import Reading from './components/Reading';
import Study from './components/Study';
import Fortune from './components/Fortune';
import Bagua from './components/Bagua';
import AppHeader from './components/shell/AppHeader';
import TabBar from './components/shell/TabBar';
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
  // App 外壳：纵向三段式，桌面端限宽居中如手机框
  app: {
    flex: 1,
    width: '100%',
    maxWidth: '480px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    position: 'relative',
    overflow: 'hidden',
    background: 'var(--paper)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-serif)',
    boxShadow: 'var(--shadow-paper)',
  },
  // 八卦水印：整屏淡固定背景，缓慢旋转
  watermark: {
    position: 'absolute',
    top: '46%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    opacity: 0.05,
    zIndex: 'var(--z-watermark)',
  },
  // 内容视口：固定头与底栏之间，唯一可滚动区
  viewport: {
    position: 'relative',
    flex: 1,
    minHeight: 0,
    zIndex: 'var(--z-content)',
  },
  // 卷首品牌区块（仅今日 tab 顶部）
  frontispiece: {
    textAlign: 'center',
    marginBottom: 'var(--space-5)',
  },
  brandSlogan: {
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
  },
  epigraph: {
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    marginTop: 'var(--space-2)',
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

// 单个 tab 面板：各自独立滚动容器，display 切换（保留各自滚动位置 + 内部状态）
function Panel({ active, children }) {
  return (
    <div
      className={active ? 'guanyi-panel guanyi-panel-enter' : 'guanyi-panel'}
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: 'var(--space-5) var(--space-5) var(--space-8)',
        display: active ? 'block' : 'none',
      }}
    >
      {children}
    </div>
  );
}

// 水墨干笔分隔线：一笔带点飞白的墨痕，两端渐隐
function InkSeparator() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'var(--space-3) 0 0',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 300 8"
        width="55%"
        height="8"
        preserveAspectRatio="none"
        style={{ color: 'var(--ink)' }}
      >
        <path
          d="M 20 4 Q 90 2.6 150 3.8 T 280 4"
          stroke="currentColor"
          strokeWidth="1.3"
          fill="none"
          strokeLinecap="round"
          opacity="0.45"
        />
        <circle cx="150" cy="3.8" r="1.1" fill="currentColor" opacity="0.4" />
      </svg>
    </div>
  );
}

export default function App() {
  // 顶层 tab：today（今日）/ divination（占卜）/ study（学易）/ calendar（日历）
  const [mode, setMode] = useState('today');

  // 问道（蓍草）模式的原有状态
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

  // 学易 deep link：点击某卦名跳到该卦详情（ts 变化触发 Study 重新 mount）
  const [studyDeepLink, setStudyDeepLink] = useState(null);

  const reset = () => {
    setQuestion('');
    setHexagrams(null);
    setChanging([]);
    setInterpret(null);
    setError(null);
    setNotReady(false);
    setCurrentRecordId(null);
  };

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

  // key={ts} 让每次 deep link 重新 mount Study，使 initialHexagramId 生效
  const studyKey = studyDeepLink?.ts || 'default';

  return (
    <div style={S.app}>
      <style>{`
        @keyframes guanyi-watermark-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .guanyi-watermark { animation: guanyi-watermark-spin 180s linear infinite; }
        @keyframes guanyi-panel-enter {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .guanyi-panel-enter { animation: guanyi-panel-enter 0.24s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .guanyi-watermark { animation: none; }
          .guanyi-panel-enter { animation: none; }
        }
      `}</style>

      {/* 整屏淡八卦水印 */}
      <div className="guanyi-watermark" style={S.watermark}>
        <Bagua variant="watermark" size={Math.min(440, window.innerWidth * 0.9)} />
      </div>

      <AppHeader mode={mode} />

      <div style={S.viewport}>
        <Panel active={mode === 'today'}>
          <div style={S.frontispiece}>
            <div style={S.brandSlogan}>观易 · 见自己</div>
            <div style={S.epigraph}>观天地之变，见生命之常</div>
            <InkSeparator />
          </div>
          <DailyDigest
            onJumpToLesson={() => handleModeChange('study')}
            onJumpToHexagram={handleJumpToHexagram}
          />
        </Panel>

        <Panel active={mode === 'divination'}>
          {error && <div style={S.error}>{error}</div>}
          <Fortune shicaoSlot={buildShicaoSlot()} />
        </Panel>

        <Panel active={mode === 'study'}>
          <Study key={studyKey} initialHexagramId={studyDeepLink?.hexagramId} />
        </Panel>

        <Panel active={mode === 'calendar'}>
          <Calendar onJumpToHexagram={handleJumpToHexagram} />
        </Panel>
      </div>

      <TabBar currentMode={mode} onModeChange={handleModeChange} />
    </div>
  );
}
