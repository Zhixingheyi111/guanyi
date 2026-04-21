import { useState } from 'react';
import Divination from './components/Divination';
import Reading from './components/Reading';
import { generateHexagram } from './utils/divination';
import { calculateTransformations } from './utils/transformations';
import { getHexagramIdByBinary } from './data/hexagramIndex';
import { getHexagramById } from './data/hexagrams';
import { interpretHexagrams } from './utils/claudeApi';

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
  title: {
    fontSize: '1.5rem',
    fontWeight: 'normal',
    letterSpacing: '0.4em',
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#fff',
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
  const [question, setQuestion]         = useState('');
  const [hexagrams, setHexagrams]       = useState(null);
  const [changingPositions, setChanging] = useState([]);
  const [interpretation, setInterpret]  = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [notReady, setNotReady]         = useState(false);

  const reset = () => {
    setQuestion('');
    setHexagrams(null);
    setChanging([]);
    setInterpret(null);
    setError(null);
    setNotReady(false);
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

      // 4. 暂时只支持乾卦：若本卦不是乾卦则提示重新起卦
      if (!hexagramsData.benGua || hexagramsData.benGua.id !== 1) {
        setNotReady(true);
        setLoading(false);
        return;
      }

      // 5. 调用 Claude API 解读
      const interp = await interpretHexagrams({
        question,
        hexagrams: hexagramsData,
        changingPositions: cp,
      });

      setHexagrams(hexagramsData);
      setChanging(cp);
      setInterpret(interp);

    } catch (err) {
      setError(err.message || '未知错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.page}>
      <div style={S.container}>
        <h1 style={S.title}>易 经 问 道</h1>

        {error && <div style={S.error}>{error}</div>}

        {interpretation && hexagrams ? (
          <Reading
            question={question}
            hexagrams={hexagrams}
            changingPositions={changingPositions}
            interpretation={interpretation}
            onReset={reset}
          />
        ) : notReady ? (
          <div style={S.notReady}>
            <p>此次起出的卦数据尚待补充</p>
            <p style={{ fontSize: '0.85rem' }}>当前只支持乾卦测试，请重新起卦</p>
            <button style={S.resetButton} onClick={reset}>重新起卦</button>
          </div>
        ) : (
          <Divination
            question={question}
            setQuestion={setQuestion}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
