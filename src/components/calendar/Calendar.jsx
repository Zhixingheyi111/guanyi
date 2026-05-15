// 月历视图：4 种 overlay 可独立开关
// - 节气 × 卦象（红印）
// - 占卜过的日子（墨点）
// - 学习过的日子（金点）
// - 今日（外圆圈）
//
// 数据全部本地（jieqi.js / dailyYao.js / storage.js），零 AI 调用。
import { useMemo, useState } from 'react';
import { isJieqiDay } from '../../data/jieqi';
import { getDailyYao, formatYaoName } from '../../data/dailyYao';
import { getHexagramById } from '../../data/hexagrams';
import { getDivinationRecords, getLessonReadRecords } from '../../utils/storage';
import { getLunarDayLabel, getLunarInfo } from '../../utils/lunar';

const S = {
  card: {
    background: 'var(--paper)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-4)',
    marginTop: 'var(--space-3)',
    fontFamily: 'var(--font-serif)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'var(--space-4)',
  },
  navBtn: {
    background: 'transparent',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-sm)',
    width: '34px',
    height: '34px',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-base)',
    cursor: 'pointer',
    padding: 0,
  },
  monthLabel: {
    fontSize: 'var(--text-base)',
    color: 'var(--ink)',
    letterSpacing: 'var(--track-wide)',
    fontWeight: 500,
  },
  toggleRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 'var(--space-2)',
    justifyContent: 'center',
    marginBottom: 'var(--space-4)',
  },
  toggle: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.25rem 0.6rem',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: '14px',
    cursor: 'pointer',
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-soft)',
    fontFamily: 'var(--font-serif)',
    letterSpacing: 'var(--track-wide)',
    minHeight: '28px',
  },
  toggleActive: {
    background: 'var(--paper)',
    color: 'var(--ink)',
    borderColor: 'var(--ink-soft)',
  },
  toggleDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '2px',
    background: 'var(--paper-edge)',
    padding: '1px',
    borderRadius: 'var(--radius-sm)',
  },
  weekDay: {
    background: 'var(--paper-soft)',
    padding: '0.4rem 0',
    textAlign: 'center',
    fontSize: 'var(--text-xs)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
    fontFamily: 'var(--font-serif)',
  },
  day: {
    background: 'var(--paper)',
    padding: '0.35rem',
    minHeight: '52px',
    fontFamily: 'var(--font-serif)',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '2px',
    position: 'relative',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
  },
  dayOtherMonth: {
    color: 'var(--ink-whisper)',
    background: 'var(--paper-deep)',
  },
  dayToday: {
    outline: '2px solid var(--vermilion)',
    outlineOffset: '-2px',
    color: 'var(--ink)',
    fontWeight: 500,
  },
  dayNum: { fontSize: 'var(--text-sm)', lineHeight: 1 },
  lunarDay: {
    fontSize: '0.62rem',
    color: 'var(--ink-light)',
    lineHeight: 1,
    letterSpacing: 0,
  },
  lunarMonthFirst: {
    color: 'var(--vermilion-deep)',
    fontWeight: 500,
  },
  jieqiTag: {
    fontSize: '0.6rem',
    color: 'var(--vermilion)',
    letterSpacing: '0.05em',
    lineHeight: 1,
  },
  dotRow: {
    display: 'flex',
    gap: '2px',
    height: '6px',
    alignItems: 'center',
  },
  dotDivination: {
    width: '5px', height: '5px', borderRadius: '50%',
    background: 'var(--ink)',
  },
  dotLesson: {
    width: '5px', height: '5px', borderRadius: '50%',
    background: 'var(--gold, #b8860b)',
  },
  // 选中日详情面板
  detailPanel: {
    marginTop: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-4)',
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderLeft: '3px solid var(--ink-soft)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-soft)',
    lineHeight: 1.85,
  },
  detailTitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink)',
    fontWeight: 500,
    letterSpacing: 'var(--track-wide)',
    marginBottom: '0.4rem',
  },
  detailRow: { margin: '0.2rem 0' },
};

const WEEK_DAYS = ['一', '二', '三', '四', '五', '六', '日'];

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatDateKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function Calendar({ onJumpToHexagram }) {
  // 当前显示的月份（首日）
  const [monthAnchor, setMonthAnchor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // 4 种 overlay 的开关
  const [showJieqi,      setShowJieqi]      = useState(true);
  const [showDivination, setShowDivination] = useState(true);
  const [showLesson,     setShowLesson]     = useState(true);
  const [showYao,        setShowYao]        = useState(false);  // 每日爻：默认关（标记太多看不清）

  // 选中日期（点击展开详情）
  const [selected, setSelected] = useState(null);  // Date | null

  // 今日（mount 时算一次）
  const [todayKey] = useState(() => formatDateKey(new Date()));

  // 加载占卜+学习数据。monthAnchor 是"刷新键"（切月时重新读 storage）
  const { divinationByDay, lessonByDay } = useMemo(() => {
    const divs = getDivinationRecords();
    const lessons = getLessonReadRecords();
    const dMap = new Map();
    const lMap = new Map();
    for (const r of divs) {
      if (!r.timestamp) continue;
      const k = formatDateKey(new Date(r.timestamp));
      const list = dMap.get(k) || [];
      list.push(r);
      dMap.set(k, list);
    }
    for (const r of lessons) {
      if (!r.readAt) continue;
      const k = formatDateKey(new Date(r.readAt));
      const list = lMap.get(k) || [];
      list.push(r);
      lMap.set(k, list);
    }
    return { divinationByDay: dMap, lessonByDay: lMap };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthAnchor]);

  // 构造月历单元格（含上下月填充使首列对齐周一）
  const cells = useMemo(() => {
    const firstDay = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), 1);
    // JavaScript getDay(): 0=周日 .. 6=周六；本 App 用周一作首列
    const dayOfWeek = (firstDay.getDay() + 6) % 7;  // 周一=0..周日=6
    const daysInMonth = new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 0).getDate();
    const result = [];

    // 前置填充（上月尾部）
    for (let i = dayOfWeek; i > 0; i--) {
      const d = new Date(firstDay);
      d.setDate(d.getDate() - i);
      result.push({ date: d, currentMonth: false });
    }
    // 当月
    for (let i = 1; i <= daysInMonth; i++) {
      result.push({
        date: new Date(monthAnchor.getFullYear(), monthAnchor.getMonth(), i),
        currentMonth: true,
      });
    }
    // 后置填充补成 6 行 × 7 列 = 42（或 5 × 7 = 35）
    const target = result.length <= 35 ? 35 : 42;
    while (result.length < target) {
      const last = result[result.length - 1].date;
      const d = new Date(last);
      d.setDate(d.getDate() + 1);
      result.push({ date: d, currentMonth: false });
    }
    return result;
  }, [monthAnchor]);

  const goPrev = () => {
    setMonthAnchor(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() - 1, 1));
    setSelected(null);
  };
  const goNext = () => {
    setMonthAnchor(new Date(monthAnchor.getFullYear(), monthAnchor.getMonth() + 1, 1));
    setSelected(null);
  };
  const goToday = () => {
    const now = new Date();
    setMonthAnchor(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelected(now);
  };

  return (
    <div style={S.card}>
      <div style={S.header}>
        <button style={S.navBtn} onClick={goPrev} aria-label="上一月">‹</button>
        <button
          type="button"
          onClick={goToday}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-serif)',
            ...S.monthLabel,
          }}
          title="回到本月"
        >
          {monthAnchor.getFullYear()} 年 {monthAnchor.getMonth() + 1} 月
        </button>
        <button style={S.navBtn} onClick={goNext} aria-label="下一月">›</button>
      </div>

      <div style={S.toggleRow}>
        <Toggle on={showJieqi}      onChange={setShowJieqi}      dot="vermilion"  label="节气" />
        <Toggle on={showDivination} onChange={setShowDivination} dot="ink"        label="占卜" />
        <Toggle on={showLesson}     onChange={setShowLesson}     dot="gold"       label="学易" />
        <Toggle on={showYao}        onChange={setShowYao}        dot="none"       label="每日爻" />
      </div>

      <div style={S.grid}>
        {WEEK_DAYS.map(w => (
          <div key={w} style={S.weekDay}>{w}</div>
        ))}
        {cells.map((cell, idx) => {
          const dKey = formatDateKey(cell.date);
          const isToday = dKey === todayKey;
          const jq = showJieqi ? isJieqiDay(cell.date) : null;
          const hasDiv = showDivination && divinationByDay.has(dKey);
          const hasLes = showLesson     && lessonByDay.has(dKey);

          // 每日爻（仅在 showYao 开时显示；空间不够，只显示卦名首字）
          // 未来日期不剧透——"今日一爻"是每天打开 App 才揭晓的仪式
          let yaoLabel = '';
          if (showYao && cell.currentMonth && dKey <= todayKey) {
            const { hexagramId } = getDailyYao(cell.date);
            const hex = getHexagramById(hexagramId);
            if (hex) yaoLabel = hex.name[0];
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setSelected(cell.date)}
              style={{
                ...S.day,
                ...(cell.currentMonth ? null : S.dayOtherMonth),
                ...(isToday ? S.dayToday : null),
                ...(selected && formatDateKey(selected) === dKey ? { background: 'var(--paper-soft)' } : null),
              }}
              aria-label={`${cell.date.getMonth() + 1}月${cell.date.getDate()}日`}
            >
              <span style={S.dayNum}>{cell.date.getDate()}</span>
              {cell.currentMonth && (() => {
                const lunarLabel = getLunarDayLabel(cell.date);
                const isMonthFirst = lunarLabel.endsWith('月');
                return (
                  <span style={{
                    ...S.lunarDay,
                    ...(isMonthFirst ? S.lunarMonthFirst : null),
                  }}>{lunarLabel}</span>
                );
              })()}
              {jq && cell.currentMonth && (
                <span style={S.jieqiTag}>{jq.name}</span>
              )}
              {yaoLabel && cell.currentMonth && (
                <span style={{ fontSize: '0.6rem', color: 'var(--ink-light)', lineHeight: 1 }}>{yaoLabel}</span>
              )}
              <div style={S.dotRow}>
                {hasDiv && <span style={S.dotDivination} />}
                {hasLes && <span style={S.dotLesson} />}
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <DayDetailPanel
          date={selected}
          divinations={divinationByDay.get(formatDateKey(selected)) || []}
          lessons={lessonByDay.get(formatDateKey(selected)) || []}
          onJumpToHexagram={onJumpToHexagram}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function Toggle({ on, onChange, dot, label }) {
  const dotStyle = {
    ...S.toggleDot,
    background: dot === 'vermilion' ? 'var(--vermilion)'
      : dot === 'ink'  ? 'var(--ink)'
      : dot === 'gold' ? 'var(--gold, #b8860b)'
      : 'transparent',
    border: dot === 'none' ? '1px dashed var(--ink-light)' : 'none',
  };
  return (
    <button
      type="button"
      style={{ ...S.toggle, ...(on ? S.toggleActive : null) }}
      onClick={() => onChange(!on)}
      aria-pressed={on}
    >
      <span style={dotStyle} />
      <span>{label}</span>
      <span style={{ color: 'var(--ink-whisper)', fontSize: '0.7rem', marginLeft: '0.2rem' }}>{on ? '✓' : ''}</span>
    </button>
  );
}

function DayDetailPanel({ date, divinations, lessons, onJumpToHexagram, onClose }) {
  const todayKey = formatDateKey(new Date());
  const thisKey = formatDateKey(date);
  const isToday = thisKey === todayKey;
  const isFuture = thisKey > todayKey;  // 未来日不显示每日一爻
  const jq = isJieqiDay(date);
  const { hexagramId, yaoIndex } = getDailyYao(date);
  const hex = getHexagramById(hexagramId);
  const yaoName = hex ? formatYaoName(hex.binary || '000000', yaoIndex) : '';
  const lunar = getLunarInfo(date);

  return (
    <div style={S.detailPanel}>
      <div style={S.detailTitle}>
        {date.getMonth() + 1}月{date.getDate()}日
        <span style={{ marginLeft: '0.4em', color: 'var(--ink-soft)', fontWeight: 'normal' }}>
          · 农历{lunar.lunarMonthStr}{lunar.lunarDayStr}
        </span>
        {isToday && <span style={{ marginLeft: '0.5em', color: 'var(--vermilion)' }}>· 今日</span>}
      </div>

      {/* 干支与生肖 */}
      <div style={S.detailRow}>
        <span style={{ color: 'var(--ink-light)' }}>{lunar.ganzhiYear}年</span>
        <span style={{ color: 'var(--ink-whisper)', margin: '0 0.3em' }}>·</span>
        <span style={{ color: 'var(--ink-light)' }}>{lunar.ganzhiMonth}月</span>
        <span style={{ color: 'var(--ink-whisper)', margin: '0 0.3em' }}>·</span>
        <span style={{ color: 'var(--ink-soft)', fontWeight: 500 }}>{lunar.ganzhiDay}日</span>
        <span style={{ color: 'var(--ink-whisper)', margin: '0 0.3em' }}>·</span>
        <span style={{ color: 'var(--ink-soft)' }}>属{lunar.shengxiao}</span>
      </div>

      {jq && (
        <div style={S.detailRow}>
          <span style={{ color: 'var(--vermilion-deep)', fontWeight: 500 }}>{jq.name}</span>
          <span style={{ color: 'var(--ink-light)', margin: '0 0.4em' }}>·</span>
          <span style={{ color: 'var(--ink-soft)' }}>{jq.meaning}</span>
        </div>
      )}

      {/* 黄历宜忌 */}
      {(lunar.yi.length > 0 || lunar.ji.length > 0) && (
        <div style={{ ...S.detailRow, paddingTop: '0.4em', borderTop: '1px dashed var(--paper-edge)' }}>
          {lunar.yi.length > 0 && (
            <div style={{ marginBottom: '0.2em' }}>
              <span style={{ color: 'var(--vermilion-deep)', fontWeight: 500, marginRight: '0.4em' }}>宜</span>
              <span style={{ color: 'var(--ink)' }}>{lunar.yi.join(' · ')}</span>
            </div>
          )}
          {lunar.ji.length > 0 && (
            <div>
              <span style={{ color: 'var(--vermilion-deep)', fontWeight: 500, marginRight: '0.4em' }}>忌</span>
              <span style={{ color: 'var(--ink)' }}>{lunar.ji.join(' · ')}</span>
            </div>
          )}
        </div>
      )}

      {/* 冲煞 + 建除 + 星宿 + 纳音 */}
      <div style={S.detailRow}>
        <span style={{ color: 'var(--ink-light)', marginRight: '0.5em' }}>冲</span>
        <span style={{ color: 'var(--ink-soft)' }}>{lunar.chong}</span>
        <span style={{ color: 'var(--ink-whisper)', margin: '0 0.5em' }}>·</span>
        <span style={{ color: 'var(--ink-light)', marginRight: '0.5em' }}>煞</span>
        <span style={{ color: 'var(--ink-soft)' }}>{lunar.sha}</span>
      </div>
      <div style={S.detailRow}>
        <span style={{ color: 'var(--ink-light)', marginRight: '0.5em' }}>值</span>
        <span style={{ color: 'var(--ink-soft)' }}>{lunar.zhixing}</span>
        <span style={{ color: 'var(--ink-whisper)', margin: '0 0.5em' }}>·</span>
        <span style={{ color: 'var(--ink-light)', marginRight: '0.5em' }}>宿</span>
        <span style={{ color: 'var(--ink-soft)' }}>{lunar.xiu} {lunar.xiuLuck && `(${lunar.xiuLuck})`}</span>
        <span style={{ color: 'var(--ink-whisper)', margin: '0 0.5em' }}>·</span>
        <span style={{ color: 'var(--ink-light)', marginRight: '0.5em' }}>纳</span>
        <span style={{ color: 'var(--ink-soft)' }}>{lunar.naYin}</span>
      </div>

      {/* 彭祖百忌 */}
      {(lunar.pengzuGan || lunar.pengzuZhi) && (
        <div style={{ ...S.detailRow, fontSize: 'var(--text-xs)', color: 'var(--ink-light)' }}>
          <span style={{ marginRight: '0.4em' }}>彭祖：</span>
          {lunar.pengzuGan}
          {lunar.pengzuGan && lunar.pengzuZhi && '；'}
          {lunar.pengzuZhi}
        </div>
      )}

      {/* 易经今日一爻（未来日子不剧透） */}
      {hex && !isFuture && (
        <div style={{ ...S.detailRow, paddingTop: '0.4em', borderTop: '1px dashed var(--paper-edge)' }}>
          <span style={{ color: 'var(--ink-light)', marginRight: '0.4em' }}>{isToday ? '今日一爻' : '当日一爻'}</span>
          {onJumpToHexagram ? (
            <button
              type="button"
              onClick={() => onJumpToHexagram(hexagramId)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                font: 'inherit',
                color: 'var(--ink)',
                cursor: 'pointer',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                textDecorationStyle: 'dotted',
              }}
            >
              {hex.symbol} {hex.name}
            </button>
          ) : (
            <span style={{ color: 'var(--ink)' }}>{hex.symbol} {hex.name}</span>
          )}
          <span style={{ color: 'var(--ink-light)', margin: '0 0.4em' }}>·</span>
          <span>{yaoName}</span>
        </div>
      )}

      {divinations.length > 0 && (
        <div style={S.detailRow}>
          <span style={{ color: 'var(--ink-light)' }}>占卜 {divinations.length} 次</span>
          {divinations.slice(0, 2).map(d => (
            <span key={d.id} style={{ marginLeft: '0.5em', color: 'var(--ink-soft)' }}>
              · {d.benGua?.name || '?'}{d.bianGua ? `→${d.bianGua.name}` : ''}
            </span>
          ))}
        </div>
      )}

      {lessons.length > 0 && (
        <div style={S.detailRow}>
          <span style={{ color: 'var(--ink-light)' }}>学易 {lessons.length} 课</span>
        </div>
      )}

      <div style={{ textAlign: 'right', marginTop: '0.5em' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--ink-whisper)',
            cursor: 'pointer',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-serif)',
            letterSpacing: 'var(--track-wide)',
          }}
        >
          收起
        </button>
      </div>
    </div>
  );
}

