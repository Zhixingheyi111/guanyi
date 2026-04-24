// 入门课程目录：9 课线性学习，带已读标记
import { lessons } from '../data/lessons';
import { getLessonsRead } from '../utils/storage';

const S = {
  header: {
    marginBottom: 'var(--space-5)',
  },
  subtitle: {
    fontSize: 'var(--text-sm)',
    color: 'var(--ink-light)',
    letterSpacing: 'var(--track-wide)',
    margin: 0,
    lineHeight: 1.8,
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-3)',
  },
  item: {
    background: 'var(--paper-soft)',
    border: '1px solid var(--paper-edge)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-3) var(--space-4)',
    cursor: 'pointer',
    transition: 'border-color 0.15s, background 0.15s, transform 0.15s',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    fontFamily: 'var(--font-serif)',
  },
  itemPlaceholder: {
    cursor: 'default',
    opacity: 0.55,
  },
  orderBadge: {
    flexShrink: 0,
    width: '2.25rem',
    height: '2.25rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: '1px solid var(--paper-edge)',
    color: 'var(--ink-soft)',
    fontSize: 'var(--text-md)',
    fontWeight: 500,
    background: 'var(--paper)',
  },
  orderBadgeRead: {
    background: 'var(--ink)',
    color: 'var(--paper)',
    borderColor: 'var(--ink)',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: 'var(--ink)',
    fontSize: 'var(--text-md)',
    letterSpacing: 'var(--track-wide)',
    fontWeight: 500,
    margin: 0,
    lineHeight: 1.5,
  },
  intro: {
    color: 'var(--ink-light)',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.7,
    margin: '0.25rem 0 0',
  },
  tag: {
    flexShrink: 0,
    fontSize: '0.7rem',
    color: 'var(--ink-whisper)',
    letterSpacing: 'var(--track-wide)',
    padding: '0.15rem 0.55rem',
    border: '1px solid var(--paper-edge)',
    borderRadius: '2px',
    background: 'var(--paper)',
  },
  tagRead: {
    color: 'var(--wuxing-wood)',
    borderColor: 'var(--wuxing-wood)',
  },
  tagComing: {
    color: 'var(--ink-whisper)',
    fontStyle: 'italic',
  },
};

export default function LessonList({ onSelectLesson }) {
  const readSet = getLessonsRead();

  return (
    <div>
      <div style={S.header}>
        <p style={S.subtitle}>
          九课循序，从「易经是什么」讲到「怎么读懂一卦」。每课三五分钟。
        </p>
      </div>

      <ul style={S.list}>
        {lessons.map(lesson => {
          const isPlaceholder = lesson.placeholder;
          const isRead        = readSet.has(lesson.id);

          const itemStyle = {
            ...S.item,
            ...(isPlaceholder ? S.itemPlaceholder : null),
          };

          const badgeStyle = {
            ...S.orderBadge,
            ...(isRead ? S.orderBadgeRead : null),
          };

          const handleClick = () => {
            if (!isPlaceholder) onSelectLesson(lesson.id);
          };

          const handleEnter = (e) => {
            if (isPlaceholder) return;
            e.currentTarget.style.borderColor = 'var(--ink-light)';
            e.currentTarget.style.background = 'var(--paper)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          };
          const handleLeave = (e) => {
            e.currentTarget.style.borderColor = 'var(--paper-edge)';
            e.currentTarget.style.background = 'var(--paper-soft)';
            e.currentTarget.style.transform = 'none';
          };

          return (
            <li
              key={lesson.id}
              style={itemStyle}
              onClick={handleClick}
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              <div style={badgeStyle}>{lesson.order}</div>
              <div style={S.textBlock}>
                <p style={S.title}>{lesson.title}</p>
                <p style={S.intro}>{lesson.intro}</p>
              </div>
              {isPlaceholder ? (
                <span style={{ ...S.tag, ...S.tagComing }}>待写</span>
              ) : isRead ? (
                <span style={{ ...S.tag, ...S.tagRead }}>已读</span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
