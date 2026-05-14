// localStorage 封装：起卦历史 + 卦笔记
// 所有 key 以 'guanyi:' 前缀，便于未来迁移或云同步时识别

const KEY_PREFIX            = 'guanyi:';
const DIVINATION_PREFIX     = `${KEY_PREFIX}divination:`;
const DIVINATION_INDEX_KEY  = `${KEY_PREFIX}divination:index`;
const HEXAGRAM_NOTE_PREFIX  = `${KEY_PREFIX}note:hexagram:`;
const LESSONS_READ_KEY      = `${KEY_PREFIX}lessons:read`;

// ---------- 低层工具 ----------

function safeGet(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? null : JSON.parse(raw);
  } catch (e) {
    console.error('[storage] 读取失败', key, e);
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('[storage] 写入失败', key, e);
    return false;
  }
}

function safeRemove(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error('[storage] 删除失败', key, e);
  }
}

// ---------- 起卦历史 ----------

// 生成 id：YYYYMMDD-HHMMSS
export function generateDivinationId(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

function getIndex() {
  const v = safeGet(DIVINATION_INDEX_KEY);
  return Array.isArray(v) ? v : [];
}

function setIndex(ids) {
  safeSet(DIVINATION_INDEX_KEY, ids);
}

// 保存一次起卦（新记录置顶）
export function saveDivinationRecord(record) {
  if (!record || !record.id) return false;
  const ok = safeSet(DIVINATION_PREFIX + record.id, record);
  if (!ok) return false;
  const index = getIndex().filter(id => id !== record.id);
  index.unshift(record.id);
  setIndex(index);
  return true;
}

// 读取所有起卦（按时间倒序）
export function getDivinationRecords() {
  const index = getIndex();
  const records = [];
  for (const id of index) {
    const r = safeGet(DIVINATION_PREFIX + id);
    if (r) records.push(r);
  }
  return records;
}

export function getDivinationRecord(id) {
  return safeGet(DIVINATION_PREFIX + id);
}

export function deleteDivinationRecord(id) {
  safeRemove(DIVINATION_PREFIX + id);
  setIndex(getIndex().filter(x => x !== id));
}

export function updateDivinationNote(id, note) {
  const record = getDivinationRecord(id);
  if (!record) return false;
  record.userNote = note;
  return safeSet(DIVINATION_PREFIX + id, record);
}

/**
 * 保存某条占卜记录的复盘信息（Phase 易经-A4 引入）。
 * followUp 字段结构：
 *   {
 *     askedAt: '7day' | '30day' | null,    // 系统何时弹出追问（用户主动复盘时为 null）
 *     userReply: string,                    // 用户描述"那件事后来怎样了"
 *     selfRating: 1|2|3|4|5,                // 用户对此卦的准确度自评（1=完全不准，5=非常准）
 *     aiReflection: string|null,            // AI 基于原卦+原问+后续 综合反思（可选生成）
 *     reviewedAt: number,                    // 复盘提交时间戳
 *   }
 */
export function updateDivinationFollowUp(id, followUp) {
  const record = getDivinationRecord(id);
  if (!record) return false;
  record.followUp = { ...(record.followUp || {}), ...followUp };
  return safeSet(DIVINATION_PREFIX + id, record);
}

/**
 * 找出"待复盘"的占卜记录。规则：
 *   - 占卜后 ≥7 天但 <30 天，且尚未复盘 → askedAt='7day'
 *   - 占卜后 ≥30 天，且尚未复盘 → askedAt='30day'
 *   - 已复盘的不返回
 * 返回按"该复盘了多久"排序的数组（最该复盘的在前）。
 */
export function getPendingReviewRecords(now = Date.now()) {
  const records = getDivinationRecords();
  const result = [];
  const SEVEN_DAYS  = 7  * 24 * 3600 * 1000;
  const THIRTY_DAYS = 30 * 24 * 3600 * 1000;

  for (const r of records) {
    if (!r.timestamp) continue;
    if (r.followUp?.reviewedAt) continue;  // 已复盘的跳过

    const age = now - r.timestamp;
    if (age >= THIRTY_DAYS) {
      result.push({ record: r, suggestedTag: '30day', age });
    } else if (age >= SEVEN_DAYS) {
      result.push({ record: r, suggestedTag: '7day', age });
    }
  }

  // 越老的越前（30 天的优先于 7 天的）
  result.sort((a, b) => b.age - a.age);
  return result;
}

/**
 * 统计：用户的占卜准确度分布。
 * 用于"我的占卜日记"页面显示"上个月 5 卦准了 3 个"等信息。
 */
export function getDivinationStats(daysAgo = 30, now = Date.now()) {
  const cutoff = now - daysAgo * 24 * 3600 * 1000;
  const records = getDivinationRecords().filter(r => r.timestamp >= cutoff);
  const reviewed = records.filter(r => r.followUp?.reviewedAt);
  const ratings = reviewed.map(r => r.followUp.selfRating).filter(x => x >= 1 && x <= 5);
  const accurate = ratings.filter(x => x >= 4).length;
  return {
    totalCount: records.length,
    reviewedCount: reviewed.length,
    accurateCount: accurate,           // 自评 4-5 = 较准/非常准
    averageRating: ratings.length
      ? ratings.reduce((s, x) => s + x, 0) / ratings.length
      : null,
    daysAgo,
  };
}

// ---------- 卦笔记（模块 2 使用）----------

export function getHexagramNote(hexagramId) {
  const v = safeGet(HEXAGRAM_NOTE_PREFIX + hexagramId);
  return typeof v === 'string' ? v : '';
}

export function saveHexagramNote(hexagramId, note) {
  return safeSet(HEXAGRAM_NOTE_PREFIX + hexagramId, note);
}

// ---------- 入门课程进度 ----------

// 返回一个已读课程 id 的 Set
export function getLessonsRead() {
  const v = safeGet(LESSONS_READ_KEY);
  return new Set(Array.isArray(v) ? v : []);
}

export function markLessonRead(lessonId) {
  const set = getLessonsRead();
  set.add(lessonId);
  return safeSet(LESSONS_READ_KEY, Array.from(set));
}

export function isLessonRead(lessonId) {
  return getLessonsRead().has(lessonId);
}
