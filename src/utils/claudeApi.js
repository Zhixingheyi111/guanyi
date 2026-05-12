// LLM API 调用模块（DeepSeek 直连，OpenAI 兼容协议）
// 封装对上游 API 的请求，实现五层卦象的易经解读

import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/v1/chat/completions`;
// 模型 ID 来自 https://platform.deepseek.com/api-docs/pricing/
// 想换模型只改这一行。候选：
//   'deepseek-chat'        DeepSeek-V3 通用版（首选，中文古文表现稳）
//   'deepseek-reasoner'    DeepSeek-R1 推理版（更慢更贵，本场景不需要）
const MODEL   = 'deepseek-chat';

// Tool schema：全部拍平为顶级 string 字段
// 历史教训：嵌套 object 时模型会把子对象序列化成畸形 JSON 字符串塞进来
const INTERPRETATION_TOOL = {
  type: 'function',
  function: {
    name: 'yijing_interpret',
    description: '输出五层卦象的易经解读与综合建议',
    parameters: {
      type: 'object',
      properties: {
        benGuaInterpretation:  { type: 'string', description: '本卦解读：当下处境' },
        zongGuaInterpretation: { type: 'string', description: '综卦解读：对方视角/另一面' },
        cuoGuaInterpretation:  { type: 'string', description: '错卦解读：欠缺与互补' },
        huGuaInterpretation:   { type: 'string', description: '互卦解读：内在结构' },
        bianGuaInterpretation: { type: 'string', description: '变卦解读：发展趋势。若无动爻则可省略' },
        adviceCurrentAction:   { type: 'string', description: '综合建议 - 当下应做' },
        adviceWarnings:        { type: 'string', description: '综合建议 - 需要警惕' },
        adviceSupplement:      { type: 'string', description: '综合建议 - 需要补足' },
        adviceFutureDirection: { type: 'string', description: '综合建议 - 未来走向' },
      },
      required: [
        'benGuaInterpretation',
        'zongGuaInterpretation',
        'cuoGuaInterpretation',
        'huGuaInterpretation',
        'adviceCurrentAction',
        'adviceWarnings',
        'adviceSupplement',
        'adviceFutureDirection',
      ],
    },
  },
};

// ── Prompt 构建辅助函数 ──────────────────────────────────────────────────────

/** 把 notes 对象格式化为可读字符串，例如：「元」始也；「亨」通也 */
function formatNotes(notes) {
  if (!notes || Object.keys(notes).length === 0) return null;
  return Object.entries(notes).map(([k, v]) => `「${k}」${v}`).join('；');
}

/**
 * 格式化单卦数据为 prompt 文本块
 * 包含：卦辞、彖传、大象、爻辞的原文+翻译+注释
 *
 * @param {string}   label            显示标签（本卦/综卦/错卦/互卦/变卦）
 * @param {object}   guaData          卦数据对象
 * @param {object}   options
 * @param {number[]} options.changingPositions  动爻位置（仅本卦传入）
 * @param {number[]} options.bianGuaFrom        变卦来源动爻（仅变卦传入，用于说明来历）
 */
function formatGuaForPrompt(label, guaData, options = {}) {
  if (!guaData) return `【${label}】无（本卦无动爻，无变卦）\n`;

  const { changingPositions = [], bianGuaFrom = null } = options;
  const lines = [];

  // 卦头
  lines.push(`【${label}】${guaData.name}卦（${guaData.symbol}）`);
  if (bianGuaFrom && bianGuaFrom.length > 0) {
    const positions = bianGuaFrom.map(p => `第${p + 1}爻`).join('、');
    lines.push(`（由本卦 ${positions} 动爻翻转而来，代表事情的发展走向）`);
  }

  // 卦辞：原文 + 翻译 + 注释
  lines.push(`\n卦辞原文：${guaData.guaci.original}`);
  lines.push(`卦辞释义：${guaData.guaci.translation}`);
  const guaciNotes = formatNotes(guaData.guaci.notes);
  if (guaciNotes) lines.push(`字词注解：${guaciNotes}`);

  // 彖传
  if (guaData.tuanci?.original) {
    lines.push(`\n彖传：${guaData.tuanci.original}`);
  }

  // 大象
  if (guaData.daxiang?.original) {
    lines.push(`大象：${guaData.daxiang.original}`);
  }

  // 爻辞：本卦只展示动爻（全文），其他卦展示所有爻的白话概要
  if (guaData.yaoci && guaData.yaoci.length > 0) {
    if (changingPositions.length > 0) {
      lines.push('\n动爻爻辞（完整）：');
      changingPositions.forEach(pos => {
        const yao = guaData.yaoci[pos];
        if (!yao) return;
        lines.push(`  ▶ ${yao.position}（第${pos + 1}爻）`);
        lines.push(`    爻辞原文：${yao.original}`);
        lines.push(`    释义：${yao.translation}`);
        const yaoNotes = formatNotes(yao.notes);
        if (yaoNotes) lines.push(`    字词注：${yaoNotes}`);
        // xiaoxiang 兼容老 string 与新 {original, translation} 两种格式
        const xx = yao.xiaoxiang;
        if (xx) {
          const xxOriginal = typeof xx === 'string' ? xx : xx.original;
          const xxTranslation = typeof xx === 'object' ? xx.translation : null;
          if (xxOriginal) lines.push(`    小象：${xxOriginal}`);
          if (xxTranslation) lines.push(`    小象释义：${xxTranslation}`);
        }
      });
    } else {
      // 非本卦：提供所有爻的白话概要，帮助 AI 理解整体卦势
      lines.push('\n各爻概要：');
      guaData.yaoci.forEach(yao => {
        if (yao.position !== '用九' && yao.position !== '用六') {
          lines.push(`  ${yao.position}：${yao.translation}`);
        }
      });
    }
  }

  return lines.join('\n');
}

/**
 * 构建完整 prompt
 */
function buildPrompt(question, hexagrams, changingPositions) {
  const { benGua, zongGua, cuoGua, huGua, bianGua } = hexagrams;

  const guaBlock = [
    formatGuaForPrompt('本卦', benGua, { changingPositions }),
    formatGuaForPrompt('综卦', zongGua),
    formatGuaForPrompt('错卦', cuoGua),
    formatGuaForPrompt('互卦', huGua),
    formatGuaForPrompt('变卦', bianGua, { bianGuaFrom: changingPositions }),
  ].join('\n\n---\n\n');

  return `你以《周易》经典的视角发声，融通象数与义理。你的解卦风格深沉温暖、有智慧感，善于将古老的卦象智慧与当事人的具体处境相结合。不要自称"大师""老师""圣贤"，可以用"经典"或直接以"易经"的视角说话。

你的解读原则：
- 不算命，不做吉凶定论，而是揭示处境的结构与可能性
- 启发当事人看清自己的位置、动力与方向
- 语言深入浅出，避免空洞的套话

重要：你的解读不是在告诉用户"应该"或"不应该"做某事。你是在通过卦象帮用户看见自己处境的多个维度。
避免使用"你应该"、"你不应该"、"建议你"等指令性语言。
改用"易经显示的是这样的处境..."、"卦象提醒的是..."、"这一卦让我们看到..."等观察性、引导性表述。

---

## 提问者的问题

${question}

---

## 五层卦象数据

以下是完整的卦象信息，包含原文、释义与注解，供你深度参考。
⚠️ 重要：这些原文已由系统在界面上单独展示给用户，你的输出中【不要重复任何原文、卦名、卦符】，直接给出你的解读分析。

${guaBlock}

---

## 解读框架

请从以下五个层面分别解读，各有侧重：

- **本卦**：当下处境——提问者此刻身处何种能量场？核心的形势与动力是什么？
- **综卦**：对方视角/事情的另一面——如果换一个角度或换一个当事人来看，会是什么图景？
- **错卦**：欠缺与互补——本卦所缺少的、需要意识到并补足的是什么？
- **互卦**：内在结构——表象之下，事情深处潜藏着怎样的动力与结构？
- **变卦**：发展趋势——若顺此发展，事情将走向何方？（若无动爻则无变卦）

综合建议请覆盖以下四个维度：
1. **当下应做**：基于卦象，现在最重要的行动或态度是什么？
2. **需要警惕**：什么样的倾向或做法可能带来麻烦？
3. **需要补足**：有什么被忽视的资源或视角值得引入？
4. **未来走向**：若按照卦象的指引，事情大致会如何演化？

---

## 输出要求

1. 每层解读 2～4 句，精炼有洞察力
2. 综合建议按四个维度展开，每项 1～3 句
3. 语气：智慧、温暖、直接，如同一位深思熟虑的老师在与你对话
4. 通过 yijing_interpret 工具返回结构化结果。综合建议的四个维度分别填入 adviceCurrentAction / adviceWarnings / adviceSupplement / adviceFutureDirection 这四个独立字段`;
}

// ── 占卜（梅花/铜钱/灵签）的轻量解读 ───────────────────────────────────────

const FORTUNE_TOOL = {
  type: 'function',
  function: {
    name: 'fortune_interpret',
    description: '针对用户问题给出占卜的精简建议',
    parameters: {
      type: 'object',
      properties: {
        valence: {
          type: 'string',
          enum: ['大吉', '小吉', '中性', '小凶', '大凶'],
          description: '此卦/签对所问之事的吉凶倾向。诚实判断，不粉饰也不夸张。',
        },
        coreAdvice: { type: 'string', description: '核心建议，140字以内，紧扣用户问题。首句应反映 valence。' },
        yi:         { type: 'string', description: '宜：一句话。凶卦时常为"暂止/退/守/省"等保守动作。' },
        ji:         { type: 'string', description: '忌：一句话。吉卦时常为"勿骄/勿急/勿过度"等节制提醒。' },
      },
      required: ['valence', 'coreAdvice', 'yi', 'ji'],
    },
  },
};

const HONESTY_DOCTRINE = `
诚实优先（"古之占者，遇凶不讳"）：
- 先在心里判断此卦/签对所问之事的吉凶倾向，填入 valence 字段。
- 若为 大凶 / 小凶（如否、剥、坎、明夷、蹇、困等卦，或下下/中下签），**必须直陈警示，不得粉饰**。coreAdvice 首句应明示困境，避免"机遇也藏在其中"这类廉价反转。
- 若为 大吉 / 小吉，可以传达祥和，但仍要点出潜在风险（易经讲消长：亢龙有悔、否极泰来都是同一道理）。
- 中性卦则客观平实，不夸大不悲观。
- 宁可让来询问者"难受片刻、清醒长久"，也不要给虚假安慰。
- AI 的"帮助本能"在此应该让位于占者的诚实：能帮人最多的，是真话。
`.trim();

function buildFortunePrompt(scenario, question) {
  const q = (question || '').trim() || '（用户未明示问题，请就当下境况通言之）';

  if (scenario.method === 'lingqian') {
    const s = scenario.sign;
    return `你是一位通晓签解之道的解签者。针对来求签者的问题，结合签意给出诚实有古意的解读。

来求签者的问题：${q}

抽得：第${s.id}签 · ${s.level}签 · ${s.title}
签诗：
${s.poem.join('\n')}
传统解读：${s.interpretation}
仙机：${s.advice}

${HONESTY_DOCTRINE}

——签的等级（${s.level}签）已经明示吉凶大方向，你的 valence 应与其一致，但允许"上吉签遇上不合时宜的问题"等具体情境调整。

请通过工具 fortune_interpret 返回四个字段：
- valence：${s.level}签对此问题的吉凶判断（大吉/小吉/中性/小凶/大凶 之一）
- coreAdvice：140字以内。首句明示吉凶倾向。其余围绕用户问题给针对性认知；不复述签诗或传统解读。
- yi：一句话，具体可行
- ji：一句话，明确警示

风格：含蓄但不含糊。可以温和，不能敷衍。不用"你应该/不应该"等指令性词语。`;
  }

  // meihua / tongqian: hexagram-based
  const methodName = scenario.method === 'meihua' ? '梅花易数' : '铜钱起卦';
  const ben = scenario.benHex;
  const cps = scenario.changingPositions || [];
  const variant = scenario.variantHex;

  let yaoBlock = '';
  if (cps.length > 0 && ben?.yaoci) {
    const lines = cps
      .map(i => {
        const y = ben.yaoci[i];
        return y ? `  ${y.position}：${y.original}（${y.translation || ''}）` : '';
      })
      .filter(Boolean)
      .join('\n');
    yaoBlock = `\n动爻：\n${lines}`;
  }

  return `你是一位精通${methodName}的占卜师。针对来问询者的问题，结合卦象给出诚实有古意的解读。

来问询者的问题：${q}

起卦方法：${methodName}
本卦：${ben.name}（${ben.symbol}）
卦辞：${ben.guaci.original}
卦辞释义：${ben.guaci.translation || ''}${yaoBlock}
${variant ? `变卦：${variant.name}（${variant.symbol}）` : '六爻无动 · 静卦'}

${HONESTY_DOCTRINE}

——参考分类（不绝对，仅供 valence 倾向）：
- 偏吉：乾、坤（贞静）、谦、临、泰、大有、咸、恒、损、益、夬、晋、归妹、丰、既济、复 等
- 偏凶：否、剥、坎、明夷、蹇、困、噬嗑（下爻）、贲、师（动盘）、革（过急）等
- 多数卦象其实在 中性 与 小吉/小凶 之间，动爻、变卦决定具体走向

请通过工具 fortune_interpret 返回四个字段：
- valence：此卦对此问题的吉凶判断（大吉/小吉/中性/小凶/大凶 之一）
- coreAdvice：140字以内。首句明示吉凶倾向（如"此卦警示困境"或"此卦小吉，但..."）。其余围绕用户问题给针对性认知，不复述卦辞。
- yi：一句话。凶卦时偏保守动作（暂止/退/守/省/不前）。
- ji：一句话。吉卦时仍要给（勿骄/勿急/勿过度）。

风格：含蓄但不含糊。可以温和，不能敷衍。不用"你应该/不应该"等指令性词语。`;
}

/**
 * 调用 DeepSeek 获取占卜解读（轻量版，相对 interpretHexagrams 五层解读更短）
 *
 * @param {{
 *   scenario: {
 *     method: 'meihua' | 'tongqian' | 'lingqian',
 *     // hexagram methods:
 *     benHex?: object,
 *     changingPositions?: number[],
 *     variantHex?: object | null,
 *     // sign method:
 *     sign?: object,
 *   },
 *   question: string,
 * }} input
 *
 * @returns {Promise<{ coreAdvice: string, yi: string, ji: string }>}
 */
export async function interpretFortune({ scenario, question }) {
  const appSecret = import.meta.env.VITE_APP_SECRET;
  if (!appSecret) throw new Error('密钥配置错误');

  const prompt = buildFortunePrompt(scenario, question);

  let response;
  try {
    response = await axios.post(
      API_URL,
      {
        model: MODEL,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
        tools: [FORTUNE_TOOL],
        tool_choice: 'auto',
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

  const message = response.data.choices?.[0]?.message;
  const toolCall = message?.tool_calls?.[0];

  let parsed;
  if (toolCall?.function?.arguments) {
    try {
      parsed = JSON.parse(toolCall.function.arguments);
    } catch {
      throw new Error('解读失败：tool arguments JSON 解析失败');
    }
  } else if (message?.content) {
    const text = message.content;
    const fenced = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const raw = fenced ? fenced[1] : text.match(/\{[\s\S]*\}/)?.[0];
    if (!raw) throw new Error('解读失败：返回中未找到 JSON');
    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error('解读失败：content JSON 解析失败');
    }
  } else {
    throw new Error('解读失败：返回格式异常');
  }

  return {
    valence: parsed.valence || '中性',
    coreAdvice: parsed.coreAdvice || '',
    yi: parsed.yi || '',
    ji: parsed.ji || '',
  };
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
  throw new Error(`解读失败：${msg}`);
}

// ── 主函数 ───────────────────────────────────────────────────────────────────

/**
 * 调用 Claude API，获取五层卦象的易经解读
 *
 * @param {{
 *   question: string,
 *   hexagrams: {
 *     benGua: object,
 *     zongGua: object,
 *     cuoGua: object,
 *     huGua: object,
 *     bianGua: object | null
 *   },
 *   changingPositions: number[]
 * }} input
 *
 * @returns {Promise<{
 *   benGuaInterpretation: string,
 *   zongGuaInterpretation: string,
 *   cuoGuaInterpretation: string,
 *   huGuaInterpretation: string,
 *   bianGuaInterpretation: string | null,
 *   comprehensiveAdvice: {
 *     currentAction: string,
 *     warnings: string,
 *     supplement: string,
 *     futureDirection: string
 *   }
 * }>}
 */
export async function interpretHexagrams({ question, hexagrams, changingPositions }) {
  const appSecret = import.meta.env.VITE_APP_SECRET;
  if (!appSecret) throw new Error('密钥配置错误');

  const prompt = buildPrompt(question, hexagrams, changingPositions);

  let response;
  try {
    response = await axios.post(
      API_URL,
      {
        model: MODEL,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
        tools: [INTERPRETATION_TOOL],
        // GLM-4.5-Air 等部分免费模型不接受强制 tool_choice，只能 'auto'
        // 配合 prompt 里"必须通过工具返回"的指令，模型基本都会调用工具
        tool_choice: 'auto',
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

  // 从 tool_calls 提取结构化结果（OpenAI 风格：arguments 是 JSON 字符串）
  const message  = response.data.choices?.[0]?.message;
  const toolCall = message?.tool_calls?.[0];
  console.log('[LLM tool_call]', toolCall);
  console.log('[LLM content]',  message?.content);

  let input;
  if (toolCall?.function?.arguments) {
    try {
      input = JSON.parse(toolCall.function.arguments);
    } catch {
      throw new Error('解读失败：tool arguments JSON 解析失败');
    }
  } else if (message?.content) {
    // 兜底：模型没走工具，但可能直接吐了 JSON 文本（带或不带 ```json 代码块）
    const text = message.content;
    const fenced = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const raw    = fenced ? fenced[1] : text.match(/\{[\s\S]*\}/)?.[0];
    if (!raw) throw new Error('解读失败：返回中未找到 JSON');
    try {
      input = JSON.parse(raw);
    } catch {
      throw new Error('解读失败：content JSON 解析失败');
    }
  } else {
    throw new Error('解读失败：返回格式异常');
  }

  // 把扁平的 advice* 字段重组回前端期望的嵌套结构
  const comprehensiveAdvice = {
    currentAction:   input.adviceCurrentAction,
    warnings:        input.adviceWarnings,
    supplement:      input.adviceSupplement,
    futureDirection: input.adviceFutureDirection,
  };

  // 防御性兜底：若将来模型又回到嵌套形态并包成 JSON 字符串，尝试解析
  if (typeof input.comprehensiveAdvice === 'string') {
    try {
      const parsed = JSON.parse(input.comprehensiveAdvice);
      Object.assign(comprehensiveAdvice, parsed);
    } catch {
      // 解析失败则沿用扁平字段的值
    }
  }

  return {
    benGuaInterpretation:  input.benGuaInterpretation,
    zongGuaInterpretation: input.zongGuaInterpretation,
    cuoGuaInterpretation:  input.cuoGuaInterpretation,
    huGuaInterpretation:   input.huGuaInterpretation,
    bianGuaInterpretation: input.bianGuaInterpretation ?? null,
    comprehensiveAdvice,
  };
}
