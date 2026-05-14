// 经典书架索引：动态聚合 src/data/classics/*.js
// 单本数据按 _schema.md 约定
//
// Phase 2 经典扩展整体暂停（用户 2026-05-13 决策："以易经为主，占卜为辅"）。
// schema 容器保留作未来扩展骨架。一旦恢复，把对应书的 .js 加回 BOOKS 即可。

// import daxue from './daxue';  // Phase 2.0d 暂停

// 顺序 = 书架默认展示顺序
const BOOKS = [
  // daxue,  // Phase 2.0d 暂停
  // 后续添加：
  // zhongyong, lunyu, mengzi,
  // daodejing, zhuangzi,
  // xinjing, jingang, tanjing,
];

const BOOK_MAP = Object.fromEntries(BOOKS.map(b => [b.meta.id, b]));

export function listBooks() {
  return BOOKS.map(b => ({
    id: b.meta.id,
    name: b.meta.name,
    fullName: b.meta.fullName,
    school: b.meta.school,
    era: b.meta.era,
    summary: b.meta.summary,
    persona: b.meta.persona,
    chapterCount: b.chapters.length,
    sectionCount: b.chapters.reduce((s, c) => s + c.sections.length, 0),
  }));
}

export function getBookById(id) {
  return BOOK_MAP[id] || null;
}

export function getSectionById(bookId, sectionId) {
  const book = getBookById(bookId);
  if (!book) return null;
  for (const ch of book.chapters) {
    const s = ch.sections.find(x => x.id === sectionId);
    if (s) return { book, chapter: ch, section: s };
  }
  return null;
}

export function getChapterById(bookId, chapterId) {
  const book = getBookById(bookId);
  if (!book) return null;
  const ch = book.chapters.find(c => c.id === chapterId);
  return ch ? { book, chapter: ch } : null;
}

// 学校（school）分组，用于书架分类
export const SCHOOLS = {
  confucian: { name: '儒家', color: 'var(--wuxing-earth)' },
  daoist:    { name: '道家', color: 'var(--wuxing-wood)' },
  buddhist:  { name: '佛家', color: 'var(--wuxing-metal)' },
};
