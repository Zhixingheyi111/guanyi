// localStorage 封装：起卦历史 + 卦笔记
// 所有 key 以 'guanyi:' 前缀，便于未来迁移或云同步时识别

const KEY_PREFIX            = 'guanyi:';
const DIVINATION_PREFIX     = `${KEY_PREFIX}divination:`;
const DIVINATION_INDEX_KEY  = `${KEY_PREFIX}divination:index`;
const HEXAGRAM_NOTE_PREFIX  = `${KEY_PREFIX}note:hexagram:`;

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

// ---------- 卦笔记（模块 2 使用）----------

export function getHexagramNote(hexagramId) {
  const v = safeGet(HEXAGRAM_NOTE_PREFIX + hexagramId);
  return typeof v === 'string' ? v : '';
}

export function saveHexagramNote(hexagramId, note) {
  return safeSet(HEXAGRAM_NOTE_PREFIX + hexagramId, note);
}
