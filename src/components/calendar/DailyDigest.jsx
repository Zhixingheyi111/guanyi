// 今日卡片：节气 + 今日一爻 + 学习进度
// 全局每日仪式区，在 Navigation 之上，所有 mode 都能看见
// 数据来源：jieqi.js + dailyYao.js + lessons.js + storage.js
import { useState } from 'react';
import { getCurrentJieqi, isJieqiDay } from '../../data/jieqi';
import { getDailyYao, formatYaoName } from '../../data/dailyYao';
import { getHexagramById } from '../../data/hexagrams';
import { lessons } from '../../data/lessons';
import {
  getLessonsRead,
  getCachedDailyYaoReading,
  setCachedDailyYaoReading,
} from '../../utils/storage';
import { interpretDailyYao } from '../../utils/claudeApi';
import { getLunarInfo } from '../../utils/lunar';

const S = {
  card: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4) var(--space-4)',
    marginBottom: 'var(--space-5)',
    fontFamily: 'var(--font-serif)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    gap: 'var(--space-2)',
    paddingBottom: 'var(--space-3)',
    borderBottom: '1px dashed var(--paper-edge)',
    marginBottom: 'var(--space-3)',
  },
  dateText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink)',
    letterSpacing: 'var(--track-xwide)',
  },
  jieqiText: {
    fontSize: 'var(--text-sm)',
    color: 'var(--vermilion-deep)',
    letterSpacing: 'var(--track-wide)',
    fontWeight: 500,
  },
  jieqiTodayBadge: {
    display: 'inline-block',
    padding: '0.05rem 0.4rem',
    marginLeft: '0.4rem',
    background: 'var(--vermilion)',
    color: 'var(--paper)',
    fontSize: '0.7rem',
    borderRadius: '8px',
    letterSpacing: '0.05em',
    fontWeight: 'normal',
  },
  calendarBtn: {
    padding: '0.35rem 0.8rem',
    background: 'var(--paper)',
    border: '1px solid var(--vermilion)',
    color: 'var(--vermilion)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-xs)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
    minHeight: '30px',
    whiteSpace: 'nowrap',
    marginLeft: 'auto',
  },
  calendarBtnActive: {
    background: 'var(--vermilion)',
    color: 'var(--paper)',
  },
  yaoSection: {
    marginBottom: 'var(--space-3)',
  },
  yaoLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: '0.3rem',
  },
  yaoLine: {
    fontSize: 'var(--text-base)',
    color: 'var(--ink)',
    letterSpacing: '0.02em',
    lineHeight: 1.85,
  },
  yaoHex: {
    color: 'var(--ink-soft)',
    fontWeight: 500,
  },
  yaoText: {
    fontStyle: 'italic',
  },
  meaningBox: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    lineHeight: 1.85,
    background: 'var(--paper)',
    borderLeft: '3px solid var(--gold, #b8860b)',
    padding: '0.5rem 0.8rem',
    margin: '0.5rem 0',
  },
  translationBox: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-light)',
    lineHeight: 1.8,
    fontStyle: 'italic',
    paddingLeft: '0.5rem',
    margin: '0.3rem 0',
    letterSpacing: '0.01em',
  },
  hexLink: {
    background: 'none',
    border: 'none',
    padding: 0,
    color: 'inherit',
    cursor: 'pointer',
    font: 'inherit',
    textAlign: 'inherit',
    textDecoration: 'underline',
    textUnderlineOffset: '4px',
    textDecorationStyle: 'dotted',
    textDecorationColor: 'var(--ink-whisper)',
  },
  progressLine: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    paddingTop: 'var(--space-3)',
    borderTop: '1px dashed var(--paper-edge)',
  },
  progressLink: {
    color: 'var(--vermilion)',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    letterSpacing: 'var(--track-wide)',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
  // AI 小解相关
  aiButtonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 'var(--space-2)',
  },
  aiButton: {
    padding: '0.35rem 0.85rem',
    background: 'transparent',
    border: '1px solid var(--vermilion)',
    color: 'var(--vermilion)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-xs)',
    letterSpacing: 'var(--track-wide)',
    cursor: 'pointer',
    borderRadius: 'var(--radius-md)',
    minHeight: '32px',
  },
  aiButtonDisabled: { opacity: 0.5, cursor: 'wait' },
  aiReading: {
    background: 'var(--paper)',
    border: '1px solid var(--paper-edge)',
    borderLeft: '3px solid var(--vermilion)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3) var(--space-4)',
    marginTop: 'var(--space-3)',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink)',
    lineHeight: 1.9,
    whiteSpace: 'pre-wrap',
    letterSpacing: '0.01em',
  },
  aiReadingLabel: {
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-xwide)',
    marginBottom: '0.4rem',
  },
  aiYiLine: {
    marginTop: '0.8em',
    color: 'var(--vermilion-deep)',
    fontWeight: 500,
  },
  aiJiLine: {
    marginTop: '0.25em',
    color: 'var(--vermilion-deep)',
    fontWeight: 500,
  },
  aiError: {
    fontSize: 'var(--text-xs)',
    color: 'var(--vermilion-deep)',
    marginTop: '0.4rem',
    textAlign: 'right',
  },
};

// 公历日期转中文简写："5月14日"
function formatDateZh(date) {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

// 找下一课该读的（按 order 升序，第一个未读的）
function findNextLesson() {
  const read = getLessonsRead();
  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  return sorted.find(l => !read.has(l.id)) || null;
}

// 找上次读到的课（最大 order 的已读）
function findLastReadLesson() {
  const read = getLessonsRead();
  const readLessons = lessons.filter(l => read.has(l.id));
  if (readLessons.length === 0) return null;
  return readLessons.reduce((max, l) => (l.order > max.order ? l : max), readLessons[0]);
}

export default function DailyDigest({ onJumpToLesson, onJumpToHexagram, calendarOpen, onToggleCalendar }) {
  // mount 时算一次：Date.now() 在 useState initializer 中允许
  const [now] = useState(() => new Date());
  const { jieqi, daysSinceStart } = getCurrentJieqi(now);
  const isJieqi = isJieqiDay(now);

  const { hexagramId, yaoIndex } = getDailyYao(now);
  const hex = getHexagramById(hexagramId);

  let yaoName = '?';
  let yaoOriginal = '';
  let yaoTranslation = '';
  if (hex) {
    yaoName = formatYaoName(hex.binary || '000000', yaoIndex);
    const yao = hex.yaoci?.[yaoIndex];
    if (yao) {
      yaoOriginal = yao.original || '';
      yaoTranslation = yao.translation || '';
    }
  }

  const lunar = getLunarInfo(now);

  const lastRead = findLastReadLesson();
  const nextLesson = findNextLesson();
  const progressTarget = lastRead || nextLesson;

  // AI 小解：mount 时读缓存，按钮触发调 API
  const [aiReading, setAiReading] = useState(() =>
    hex ? getCachedDailyYaoReading(now, hexagramId, yaoIndex) : null
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  const handleAskAi = async () => {
    if (!hex) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const text = await interpretDailyYao({
        hex, yaoIndex, yaoOriginal, yaoTranslation, jieqiName: jieqi.name,
      });
      setAiReading(text);
      setCachedDailyYaoReading(now, hexagramId, yaoIndex, text);
    } catch (e) {
      setAiError(e.message || 'AI 解读暂未取得');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div style={S.card}>
      <div style={S.header}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <span style={S.dateText}>
            {formatDateZh(now)}
            <span style={{ marginLeft: '0.5em', color: 'var(--ink-light)', fontSize: 'var(--text-xs)', letterSpacing: 'var(--track-wide)' }}>
              农历{lunar.lunarMonthStr}{lunar.lunarDayStr}
            </span>
          </span>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--ink-whisper)', letterSpacing: 'var(--track-wide)' }}>
            {lunar.ganzhiYear}年 · {lunar.ganzhiDay}日 · 属{lunar.shengxiao}
          </span>
        </div>
        <span style={S.jieqiText}>
          {jieqi.name}
          {isJieqi
            ? <span style={S.jieqiTodayBadge}>今日</span>
            : daysSinceStart > 0 && <span style={{ marginLeft: '0.4rem', color: 'var(--ink-light)' }}>后 {daysSinceStart} 天</span>
          }
        </span>
        {onToggleCalendar && (
          <button
            type="button"
            style={{
              ...S.calendarBtn,
              ...(calendarOpen ? S.calendarBtnActive : null),
            }}
            onClick={onToggleCalendar}
          >
            {calendarOpen ? '收起整月 ▴' : '看整月 ▾'}
          </button>
        )}
      </div>

      <div style={S.yaoSection}>
        <div style={S.yaoLabel}>今日一爻</div>
        {hex && (
          <div style={S.yaoLine}>
            {onJumpToHexagram ? (
              <button
                style={{ ...S.hexLink, ...S.yaoHex }}
                onClick={() => onJumpToHexagram(hexagramId)}
                title={`去学易看 ${hex.name}卦`}
              >
                {hex.symbol} {hex.name}
              </button>
            ) : (
              <span style={S.yaoHex}>{hex.symbol} {hex.name}</span>
            )}
            <span style={{ color: 'var(--ink-light)', margin: '0 0.4em' }}>·</span>
            <span>{yaoName}</span>
          </div>
        )}
        {yaoOriginal && (
          <div style={S.meaningBox}>{yaoOriginal}</div>
        )}
        {yaoTranslation && (
          <div style={S.translationBox}>{yaoTranslation}</div>
        )}

        {aiReading ? (
          <div style={S.aiReading}>
            <div style={S.aiReadingLabel}>占者观象</div>
            {aiReading.observation}
            <div style={S.aiYiLine}>今日宜：{aiReading.yi}</div>
            <div style={S.aiJiLine}>今日忌：{aiReading.ji}</div>
          </div>
        ) : aiLoading ? (
          <div style={{ ...S.aiReading, fontStyle: 'italic', color: 'var(--ink-light)' }}>
            占者正在观此爻于今日之象……
          </div>
        ) : (
          <div style={S.aiButtonRow}>
            <button
              style={{ ...S.aiButton, ...(aiLoading ? S.aiButtonDisabled : null) }}
              onClick={handleAskAi}
              disabled={aiLoading}
            >
              请 AI 一解 →
            </button>
          </div>
        )}
        {aiError && <div style={S.aiError}>{aiError}</div>}
      </div>

      {progressTarget && onJumpToLesson && (
        <div style={S.progressLine}>
          {lastRead
            ? <>上次读到：第 {progressTarget.order} 课 · {progressTarget.title}</>
            : <>建议从：第 {progressTarget.order} 课 · {progressTarget.title} 开始</>}
          <span style={{ marginLeft: '0.5rem' }}>
            <button
              style={S.progressLink}
              onClick={() => onJumpToLesson(progressTarget.id)}
            >
              {lastRead ? '继续' : '开始'} →
            </button>
          </span>
        </div>
      )}
    </div>
  );
}
