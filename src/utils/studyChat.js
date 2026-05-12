// 学习聊天 API：向 LLM 请教单卦相关问题（DeepSeek 直连，OpenAI 兼容协议）
// 支持 4 位作者 persona + 选中文本追问（Phase 1.6-1.10）
// 二期将扩展 book 参数支持论语等其他经典

import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/v1/chat/completions`;
const MODEL   = 'deepseek-chat';

// ── Persona 定义 ────────────────────────────────────────────────────────────

export const PERSONAS = {
  confucius: {
    id: 'confucius',
    name: '孔子',
    fullName: '孔丘',
    era: '春秋',
    selfRef: '丘',
    voice:
      '你是孔子（孔丘），春秋末期儒家创始人，亦为《周易》"十翼"的编订者。' +
      '你的特点：温润如玉、述而不作、引古喻今、答问以启发为先。',
    style:
      '行文常引《论语》《十翼》语意，喜用反问令对方自省。' +
      '不下断语，重在使学者"知其然亦知其所以然"。' +
      '自称"丘"，称对方"汝"或"君"。',
  },
  wenwang: {
    id: 'wenwang',
    name: '文王',
    fullName: '周文王（姬昌）',
    era: '商末周初',
    selfRef: '昌',
    voice:
      '你是周文王（姬昌），演卦之人。羑里被囚之中，推演六十四卦，作卦辞、爻辞。' +
      '你的特点：象数兼通、辞约义丰、深谙世事变化。',
    style:
      '解卦以象与辞为主，强调卦辞、爻辞本身的暗示。' +
      '不抽象哲思，直陈卦象所示的处境与时机。' +
      '自称"昌"，常说"此卦之象..."或"爻辞云..."。',
  },
  shaoyong: {
    id: 'shaoyong',
    name: '邵雍',
    fullName: '邵雍（康节先生）',
    era: '北宋',
    selfRef: '尧夫',
    voice:
      '你是邵雍（号康节先生），北宋象数派大家，《皇极经世》《梅花易数》的作者。' +
      '你的特点：数即是象，心动即占，擅长以数理推演事物变化。',
    style:
      '解卦着重"数"与"机"——什么时机、什么数理结构。' +
      '常说"心动则数生""时与数会"等。' +
      '自称"尧夫"，言语清明、有禅趣。',
  },
  zhuxi: {
    id: 'zhuxi',
    name: '朱熹',
    fullName: '朱熹（朱文公）',
    era: '南宋',
    selfRef: '熹',
    voice:
      '你是朱熹，南宋理学集大成者，著《周易本义》。' +
      '你的特点：以理学诠经，重义理而不废象数，严谨而温厚。',
    style:
      '常区分"本义"与"程子之说"，述而有所择。' +
      '注重格物致知，从卦象中寻天理之自然。' +
      '自称"熹"，语言端正、考究。',
  },
};

export const DEFAULT_PERSONA = 'confucius';

// ── Prompt 构建辅助 ────────────────────────────────────────────────────────

function formatNotes(notes) {
  if (!notes || Object.keys(notes).length === 0) return null;
  return Object.entries(notes).map(([k, v]) => `「${k}」${v}`).join('；');
}

function formatYaoci(yaoci) {
  if (!yaoci || yaoci.length === 0) return '（无）';
  return yaoci.map(yao => {
    const parts = [
      `  ${yao.position}：${yao.original}`,
      `    释义：${yao.translation}`,
    ];
    const xx = yao.xiaoxiang;
    if (xx) {
      const xxOriginal = typeof xx === 'string' ? xx : xx.original;
      const xxTranslation = typeof xx === 'object' ? xx.translation : null;
      if (xxOriginal) parts.push(`    小象：${xxOriginal}`);
      if (xxTranslation) parts.push(`    小象释义：${xxTranslation}`);
    }
    const notes = formatNotes(yao.notes);
    if (notes) parts.push(`    字词注：${notes}`);
    return parts.join('\n');
  }).join('\n');
}

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

function buildHexagramReference(hexagram) {
  const guaciNotes = formatNotes(hexagram.guaci.notes);
  const wenyanText = formatWenyan(hexagram.wenyan);

  const lines = [
    `当前正在研读：${hexagram.name}卦（${hexagram.symbol}）`,
    '',
    `以下是这一卦的完整经典原文（来自《周易》通行本），仅供你查阅，不需要复述：`,
    '',
    '【卦辞】',
    `  原文：${hexagram.guaci.original}`,
    `  翻译：${hexagram.guaci.translation}`,
  ];
  if (guaciNotes) lines.push(`  字词注：${guaciNotes}`);

  if (hexagram.tuanci) {
    lines.push('', '【彖辞】', `  原文：${hexagram.tuanci.original}`);
    if (hexagram.tuanci.translation) lines.push(`  翻译：${hexagram.tuanci.translation}`);
    const t = formatNotes(hexagram.tuanci.notes);
    if (t) lines.push(`  字词注：${t}`);
  }
  if (hexagram.daxiang) {
    lines.push('', '【象传】', `  原文：${hexagram.daxiang.original}`);
    if (hexagram.daxiang.translation) lines.push(`  翻译：${hexagram.daxiang.translation}`);
    const d = formatNotes(hexagram.daxiang.notes);
    if (d) lines.push(`  字词注：${d}`);
  }

  lines.push('', '【六爻爻辞】', formatYaoci(hexagram.yaoci));

  if (wenyanText) {
    lines.push('', '【文言传】', wenyanText);
  }

  return lines.join('\n');
}

/**
 * 构建 system prompt：persona 身份 + 卦数据 + 行为约束
 */
function buildSystemPrompt({ persona, hexagram, selectedText, book }) {
  const p = PERSONAS[persona] || PERSONAS[DEFAULT_PERSONA];

  // book 当前固定 yijing；二期接入论语等时此处分支
  if (book !== 'yijing') {
    throw new Error(`book "${book}" 尚未支持，本期仅支持 'yijing'`);
  }

  const lines = [
    p.voice,
    '',
    p.style,
    '',
    '---',
    '',
    buildHexagramReference(hexagram),
  ];

  if (selectedText && selectedText.trim()) {
    lines.push(
      '',
      '---',
      '',
      `# 来访者特别想问的一句`,
      '',
      `"${selectedText.trim()}"`,
      '',
      '请围绕这句话回答，结合上下文与你的视角说明它的意涵与可发挥之处。',
    );
  }

  lines.push(
    '',
    '---',
    '',
    '回答之时谨守：',
    '1. 严格基于以上原文，不编造经文',
    '2. 引用原文时保证准确',
    '3. 以你的视角说话，但不固守门户之见——若他派之说更精确，可承认',
    '4. 不做吉凶断言；启发对方自省',
    `5. 自称"${p.selfRef}"，或以"我"指代；不自称"大师""圣贤"`,
    '6. 用中文自然段落作答，不用 Markdown，段落用空行分隔',
    '7. 不重复对方已经看到的卦辞、爻辞原文——直接说你看到的内涵或问题',
    '8. 回答控制在 3-6 段，每段 2-4 句；要言不烦',
    '9. 若用户问题与易经无关，礼貌引回',
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
 *   hexagram: object,
 *   history: { role: 'user'|'assistant', content: string }[],
 *   userMessage: string,
 *   persona?: 'confucius'|'wenwang'|'shaoyong'|'zhuxi',  // default confucius
 *   selectedText?: string,                                // 用户选中的文本（来自 SelectionPopover）
 *   book?: 'yijing',                                      // 二期扩展用，本期固定 'yijing'
 * }} input
 *
 * @returns {Promise<string>}
 */
export async function sendStudyMessage({
  hexagram,
  history,
  userMessage,
  persona = DEFAULT_PERSONA,
  selectedText = null,
  book = 'yijing',
}) {
  const appSecret = import.meta.env.VITE_APP_SECRET;
  if (!appSecret) throw new Error('密钥配置错误');

  const systemPrompt = buildSystemPrompt({ persona, hexagram, selectedText, book });
  const messages = [
    { role: 'system', content: systemPrompt },
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

  const text = response.data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('回复格式异常');
  }
  return text;
}
