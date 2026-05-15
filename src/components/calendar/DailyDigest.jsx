// 今日卡片：节气 + 今日一爻 + 学习进度
// 全局每日仪式区，在 Navigation 之上，所有 mode 都能看见
// 数据来源：jieqi.js + dailyYao.js + lessons.js + storage.js
import { getCurrentJieqi, isJieqiDay } from '../../data/jieqi';
import { getDailyYao, formatYaoName } from '../../data/dailyYao';
import { getHexagramById } from '../../data/hexagrams';
import { lessons } from '../../data/lessons';
import { getLessonsRead } from '../../utils/storage';

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

export default function DailyDigest({ onJumpToLesson }) {
  const now = new Date();
  const { jieqi, daysSinceStart } = getCurrentJieqi(now);
  const isJieqi = isJieqiDay(now);

  const { hexagramId, yaoIndex } = getDailyYao(now);
  const hex = getHexagramById(hexagramId);

  let yaoName = '?';
  let yaoOriginal = '';
  if (hex) {
    yaoName = formatYaoName(hex.binary || '000000', yaoIndex);
    const yao = hex.yaoci?.[yaoIndex];
    if (yao) yaoOriginal = yao.original || '';
  }

  const lastRead = findLastReadLesson();
  const nextLesson = findNextLesson();
  const progressTarget = lastRead || nextLesson;

  return (
    <div style={S.card}>
      <div style={S.header}>
        <span style={S.dateText}>{formatDateZh(now)}</span>
        <span style={S.jieqiText}>
          {jieqi.name}
          {isJieqi
            ? <span style={S.jieqiTodayBadge}>今日</span>
            : daysSinceStart > 0 && <span style={{ marginLeft: '0.4rem', color: 'var(--ink-light)' }}>后 {daysSinceStart} 天</span>
          }
        </span>
      </div>

      <div style={S.yaoSection}>
        <div style={S.yaoLabel}>今日一爻</div>
        {hex && (
          <div style={S.yaoLine}>
            <span style={S.yaoHex}>{hex.symbol} {hex.name}</span>
            <span style={{ color: 'var(--ink-light)', margin: '0 0.4em' }}>·</span>
            <span>{yaoName}</span>
          </div>
        )}
        {yaoOriginal && (
          <div style={S.meaningBox}>{yaoOriginal}</div>
        )}
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
