// 学习聊天 API：向 Claude 请教单卦相关问题
// 与 claudeApi.js 完全独立，不共享代码，避免耦合

import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/v1/messages`;
const MODEL   = 'claude-sonnet-4-6';

// ── Prompt 构建 ─────────────────────────────────────────────────────────────

function formatNotes(notes) {
  if (!notes || Object.keys(notes).length === 0) return null;
  return Object.entries(notes).map(([k, v]) => `「${k}」${v}`).join('；');
}

// 把六爻爻辞格式化为可读文本
function formatYaoci(yaoci) {
  if (!yaoci || yaoci.length === 0) return '（无）';
  return yaoci.map(yao => {
    const parts = [
      `  ${yao.position}：${yao.original}`,
      `    释义：${yao.translation}`,
    ];
    if (yao.xiaoxiang) parts.push(`    小象：${yao.xiaoxiang}`);
    const notes = formatNotes(yao.notes);
    if (notes) parts.push(`    字词注：${notes}`);
    return parts.join('\n');
  }).join('\n');
}

// 把文言传格式化为可读文本
function formatWenyan(wenyan) {
  if (!wenyan?.parts?.length) return null;
  return wenyan.parts.map(part => {
    const lines = [`  【${part.section}】`, `    原文：${part.original}`];
    if (part.translation) lines.push(`    翻译：${part.translation}`);
    const notes = formatNotes(part.notes);
    if (notes) lines.push(`    字词注：${notes}`);
    return lines.join('\n');
  }).join('\n\n');
}

/**
 * 构建 system prompt：固定模板 + 当前卦完整原文数据
 */
function buildSystemPrompt(hexagram) {
  const guaciNotes = formatNotes(hexagram.guaci.notes);
  const wenyanText = formatWenyan(hexagram.wenyan);

  const lines = [
    `你是一位精通周易的学者，不是算命先生。你的使命是帮助用户学习易经。`,
    `请以"学者"或"研习者"自居，不要自称"大师""圣贤""老师"等尊号；与用户平等切磋、共同研读，而非训导。`,
    ``,
    `当前用户正在学习：${hexagram.name}卦（${hexagram.symbol}）`,
    ``,
    `以下是这一卦的完整经典原文（来自《周易》通行本）：`,
    ``,
    `【卦辞】`,
    `  原文：${hexagram.guaci.original}`,
    `  翻译：${hexagram.guaci.translation}`,
  ];
  if (guaciNotes) lines.push(`  字词注：${guaciNotes}`);

  if (hexagram.tuanci) {
    lines.push('', '【彖辞】', `  原文：${hexagram.tuanci.original}`);
    if (hexagram.tuanci.translation) {
      lines.push(`  翻译：${hexagram.tuanci.translation}`);
    }
    const tuanciNotes = formatNotes(hexagram.tuanci.notes);
    if (tuanciNotes) lines.push(`  字词注：${tuanciNotes}`);
  }
  if (hexagram.daxiang) {
    lines.push('', '【象传】', `  原文：${hexagram.daxiang.original}`);
    if (hexagram.daxiang.translation) {
      lines.push(`  翻译：${hexagram.daxiang.translation}`);
    }
    const daxiangNotes = formatNotes(hexagram.daxiang.notes);
    if (daxiangNotes) lines.push(`  字词注：${daxiangNotes}`);
  }

  lines.push('', '【六爻爻辞】', formatYaoci(hexagram.yaoci));

  if (wenyanText) {
    lines.push('', '【文言传】', wenyanText);
  }

  lines.push(
    '',
    '回答用户问题时请遵守：',
    '1. 严格基于原文回答，不编造',
    '2. 引用原文时保证准确',
    '3. 结合历史典故、哲学思想、现代应用讲解',
    '4. 用研讨、切磋的语气，鼓励用户自己思考',
    '5. 不做吉凶断言',
    '6. 如果用户问的超出易经范围，礼貌引导回学习主题',
    '7. 回答用中文自然段落，不用 Markdown，段落用空行分隔',
    '8. 绝对不要生成或编造任何原文。所有原文都应来自以上提供的内容',
    '9. 不自称"大师""圣贤""老师"，以"学者""研习者"或直接用"我"自称',
  );

  return lines.join('\n');
}

// ── 错误处理 ─────────────────────────────────────────────────────────────────

function handleApiError(error) {
  if (!error.response) {
    throw new Error('网络异常，请检查连接');
  }
  const status = error.response.status;
  if (status === 401) throw new Error('密钥配置错误');
  if (status === 429) throw new Error('请求过于频繁，请稍后再试');
  const msg = error.response.data?.error?.message || error.message;
  throw new Error(`请求失败：${msg}`);
}

// ── 主函数 ───────────────────────────────────────────────────────────────────

/**
 * 发送一条学习消息
 *
 * @param {{
 *   hexagram: object,                           // 完整卦对象
 *   history: { role: 'user'|'assistant', content: string }[],  // 过往对话
 *   userMessage: string                         // 本次用户消息
 * }} input
 *
 * @returns {Promise<string>} 学者的回复文本
 */
export async function sendStudyMessage({ hexagram, history, userMessage }) {
  const appSecret = import.meta.env.VITE_APP_SECRET;
  if (!appSecret) throw new Error('密钥配置错误');

  const systemPrompt = buildSystemPrompt(hexagram);
  const messages = [
    ...history,
    { role: 'user', content: userMessage },
  ];

  let response;
  try {
    response = await axios.post(
      API_URL,
      {
        model: MODEL,
        max_tokens: 2048,
        system: systemPrompt,
        messages,
      },
      {
        headers: {
          'x-app-secret': appSecret,
          'content-type': 'application/json',
        },
      }
    );
  } catch (error) {
    handleApiError(error);
  }

  // 纯文本回复：取第一个 text block
  const textBlock = response.data.content.find(b => b.type === 'text');
  if (!textBlock || !textBlock.text) {
    throw new Error('回复格式异常');
  }
  return textBlock.text;
}
