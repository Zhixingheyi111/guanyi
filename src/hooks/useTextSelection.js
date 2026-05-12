// 监听容器内的文本选区，返回 {text, rect} 或 null
// 兼容桌面 mouseup 和 iOS Safari 长按选择（依靠 selectionchange + 短延迟）
import { useState, useEffect, useCallback } from 'react';

export function useTextSelection(containerRef) {
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    let timer = null;

    function readSelection() {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setSelection(null);
        return;
      }
      const text = sel.toString().trim();
      if (!text) {
        setSelection(null);
        return;
      }
      // 限定在 container 范围内（如果 container 提供）
      if (containerRef?.current && sel.anchorNode) {
        if (!containerRef.current.contains(sel.anchorNode)) {
          setSelection(null);
          return;
        }
      }
      try {
        const range = sel.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelection({ text, rect });
      } catch {
        setSelection(null);
      }
    }

    // iOS Safari 上 selectionchange 在用户拖动选区时频繁触发；
    // touchend / mouseup 后稍延迟读取，给浏览器一点稳定选区的时间
    function handleSettle() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(readSelection, 80);
    }

    document.addEventListener('selectionchange', readSelection);
    document.addEventListener('mouseup', handleSettle);
    document.addEventListener('touchend', handleSettle);

    return () => {
      if (timer) clearTimeout(timer);
      document.removeEventListener('selectionchange', readSelection);
      document.removeEventListener('mouseup', handleSettle);
      document.removeEventListener('touchend', handleSettle);
    };
  }, [containerRef]);

  const clear = useCallback(() => {
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  }, []);

  return [selection, clear];
}
