import { useState } from 'react';
import Divination from './components/Divination';
import Reading from './components/Reading';
import Navigation from './components/Navigation';
import HexagramGrid from './components/HexagramGrid';
import HexagramDetail from './components/HexagramDetail';
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
  page: {
    minHeight: '100vh',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: 'Georgia, "Times New Roman", serif',
    display: 'flex',
    justifyContent: 'center',
    padding: '3rem 1.5rem',
  },
  container: {
    width: '100%',
    maxWidth: '600px',
  },
  brand: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  brandTitle: {
    fontSize: '1.75rem',
    fontWeight: 'normal',
    letterSpacing: '0.5em',
    color: '#fff',
    margin: 0,
    // 弥补 letter-spacing 在末尾产生的视觉偏移
    paddingLeft: '0.5em',
  },
  brandSlogan: {
    fontSize: '0.8rem',
    color: '#666',
    letterSpacing: '0.2em',
    marginTop: '0.75rem',
  },
  error: {
    color: '#ff6666',
    fontSize: '0.9rem',
    lineHeight: '1.7',
    padding: '1rem',
    border: '1px solid #441111',
    borderRadius: '4px',
    marginBottom: '1.5rem',
  },
  notReady: {
    textAlign: 'center',
    color: '#888',
    lineHeight: '2',
    padding: '2rem 0',
  },
  resetButton: {
    display: 'block',
    margin: '1.5rem auto 0',
    padding: '0.5rem 1.5rem',
    background: 'transparent',
    border: '1px solid #555',
    color: '#aaa',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '0.9rem',
    letterSpacing: '0.15em',
    cursor: 'pointer',
  },
};

export default function App() {
  // 模式：divination（问道）/ study（学易）
  const [mode, setMode]                         = useState('divination');
  const [selectedHexagramId, setSelectedHexagramId] = useState(null);

  // 问道模式的原有状态
  const [question, setQuestion]         = useState('');
  const [hexagrams, setHexagrams]       = useState(null);
  const [changingPositions, setChanging] = useState([]);
  const [interpretation, setInterpret]  = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [notReady, setNotReady]         = useState(false);

  // 查看历史详情的状态：null = 正常问道；非 null = 从历史中查看
  const [viewingHistoryId, setViewingHistoryId] = useState(null);
  // 当前起卦的记录 id（用于反思笔记写回）
  const [currentRecordId,  setCurrentRecordId]  = useState(null);

  const reset = () => {
    setQuestion('');
    setHexagrams(null);
    setChanging([]);
    setInterpret(null);
    setError(null);
    setNotReady(false);
    setCurrentRecordId(null);
  };

  // 切换模式：清空学易选中卦、历史查看状态，避免残留
  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setSelectedHexagramId(null);
    setViewingHistoryId(null);
  };

  const handleSubmit = async () => {
    setError(null);
    setNotReady(false);
    setLoading(true);

    try {
      // 1. 揲蓍起卦
      const result = generateHexagram();
      const { binary, changingPositions: cp } = result;

      // 2. 计算五层卦象的二进制
      const transforms = calculateTransformations(binary, cp);

      // 3. 二进制 → 卦号 → 完整卦数据
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

      // 4. 调用 Claude API 解读
      const interp = await interpretHexagrams({
        question,
        hexagrams: hexagramsData,
        changingPositions: cp,
      });

      setHexagrams(hexagramsData);
      setChanging(cp);
      setInterpret(interp);

      // 5. 保存起卦历史到 localStorage，并记下 id 供反思笔记写回
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

  // 根据模式渲染主内容
  const renderContent = () => {
    if (mode === 'study') {
      if (selectedHexagramId == null) {
        return <HexagramGrid onSelectHexagram={setSelectedHexagramId} />;
      }
      return (
        <HexagramDetail
          hexagramId={selectedHexagramId}
          onBack={() => setSelectedHexagramId(null)}
        />
      );
    }

    // 查看历史详情（问道模式下）
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

    // 问道模式（divination）
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

  return (
    <div style={S.page}>
      <div style={S.container}>
        {/* 品牌标题区 */}
        <div style={S.brand}>
          <h1 style={S.brandTitle}>观 易</h1>
          <div style={S.brandSlogan}>观易 · 见自己</div>
        </div>

        {/* 模式导航 */}
        <Navigation currentMode={mode} onModeChange={handleModeChange} />

        {error && <div style={S.error}>{error}</div>}

        {renderContent()}
      </div>
    </div>
  );
}
