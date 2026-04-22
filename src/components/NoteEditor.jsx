// 通用笔记编辑器：debounce 自动保存 + 短暂"已保存"提示
// 用在"卦笔记"（学易）与"起卦反思"（问道）两处
import { useState, useEffect, useRef } from 'react';

const DEBOUNCE_MS   = 500;
const SAVED_HINT_MS = 1500;

const S = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  textarea: {
    width: '100%',
    background: '#111',
    border: '1px solid #333',
    borderRadius: '4px',
    color: '#e8e8e8',
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '0.95rem',
    padding: '0.75rem',
    resize: 'vertical',
    outline: 'none',
    lineHeight: '1.8',
    boxSizing: 'border-box',
  },
  footer: {
    textAlign: 'right',
    fontSize: '0.75rem',
    height: '1rem',
    marginTop: '0.35rem',
    transition: 'opacity 0.6s ease',
  },
  saved: { opacity: 1, color: '#6a8' },
  idle:  { opacity: 0 },
};

export default function NoteEditor({
  initialValue = '',
  onSave,
  placeholder  = '',
  minHeight    = '120px',
}) {
  const [value, setValue]             = useState(initialValue);
  const [savedShown, setSavedShown]   = useState(false);

  const saveTimer    = useRef(null);
  const hintTimer    = useRef(null);
  const pendingValue = useRef(null);
  const onSaveRef    = useRef(onSave);
  onSaveRef.current  = onSave;

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    pendingValue.current = v;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      onSaveRef.current(v);
      pendingValue.current = null;
      setSavedShown(true);
      if (hintTimer.current) clearTimeout(hintTimer.current);
      hintTimer.current = setTimeout(() => setSavedShown(false), SAVED_HINT_MS);
    }, DEBOUNCE_MS);
  };

  // 卸载前 flush 未落盘的编辑，避免切换页面丢失最近输入
  useEffect(() => () => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      if (pendingValue.current != null) onSaveRef.current(pendingValue.current);
    }
    if (hintTimer.current) clearTimeout(hintTimer.current);
  }, []);

  return (
    <div style={S.wrapper}>
      <textarea
        style={{ ...S.textarea, minHeight }}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
      <div style={{ ...S.footer, ...(savedShown ? S.saved : S.idle) }}>
        ✓ 已保存
      </div>
    </div>
  );
}
