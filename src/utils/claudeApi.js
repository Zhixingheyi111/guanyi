// Claude API 调用模块
// 封装对 Anthropic API 的请求，实现五层卦象的易经解读

import axios from 'axios';

const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL   = 'claude-sonnet-4-5-20250929';

// ── Prompt 构建 ──────────────────────────────────────────────────────────────

/**
 * 将单个卦的关键数据格式化为 prompt 中的文本块
 * 只提供解读所需的语义内容，不要求 AI 重复原文
 */
function formatGuaForPrompt(label, guaData, changingPositions = []) {
  if (!guaData) return `【${label}】无（本卦无动爻）\n`;

  const lines = [`【${label}】${guaData.name}卦（${guaData.symbol}）`];

  // 卦辞白话翻译（原文由前端展示，AI 只需翻译作语义参考）
  lines.push(`卦义：${guaData.guaci.translation}`);

  // 动爻爻辞（仅当有动爻且是本卦时提供）
  if (changingPositions.length > 0) {
    const changingYao = changingPositions.map(pos => {
      const yao = guaData.yaoci[pos];
      return yao ? `  · ${yao.position}（第${pos + 1}爻）：${yao.translation}` : null;
    }).filter(Boolean);

    if (changingYao.length > 0) {
      lines.push('动爻提示：');
      changingYao.forEach(y => lines.push(y));
    }
  }

  return lines.join('\n');
}

/**
 * 构建完整的 prompt
 * 核心原则：提供语义参考 → 要求 AI 输出解读，不重复原文
 */
function buildPrompt(question, hexagrams, changingPositions) {
  const { benGua, zongGua, cuoGua, huGua, bianGua } = hexagrams;

  const guaBlock = [
    formatGuaForPrompt('本卦', benGua, changingPositions),
    formatGuaForPrompt('综卦', zongGua),
    formatGuaForPrompt('错卦', cuoGua),
    formatGuaForPrompt('互卦', huGua),
    formatGuaForPrompt('变卦', bianGua),
  ].join('\n');

  return `你是一位精通《周易》的易经大师，学贯象数义理，解卦深入浅出，善于联系现实情境给出指引。

## 用户问题
${question}

## 卦象信息
以下是这次占卜的五层卦象数据，供你参考解读：

${guaBlock}

## 解读要求

请针对用户的具体问题，从五层卦象角度给出解读。注意：
1. 卦名、卦符、原文已由系统单独展示，**你的回答中不要重复这些内容**
2. 直接给出你的解读和洞见，联系用户的实际情境
3. 语气：智慧而亲切，深入浅出，不要卖弄术语
4. 长度：每层卦象解读 2-4 句，综合建议 3-5 句

## 输出格式

请严格按以下 JSON 格式输出，不要输出任何 JSON 以外的内容：

{
  "benGuaInterpretation": "本卦解读（针对用户问题的核心卦象分析）",
  "zongGuaInterpretation": "综卦解读（事情的另一面或对立视角）",
  "cuoGuaInterpretation": "错卦解读（与本卦相错，揭示深层对立）",
  "huGuaInterpretation": "互卦解读（事情内部潜藏的结构与动力）",
  "bianGuaInterpretation": "变卦解读（事情的走向与结果）",
  "comprehensiveAdvice": "综合建议（结合五卦，对用户问题给出具体可行的指引）"
}

若无变卦（无动爻），"bianGuaInterpretation" 填 null。`;
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
 *   comprehensiveAdvice: string
 * }>}
 */
export async function interpretHexagrams({ question, hexagrams, changingPositions }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('密钥配置错误');

  const prompt = buildPrompt(question, hexagrams, changingPositions);

  let response;
  try {
    response = await axios.post(
      API_URL,
      {
        model: MODEL,
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
      }
    );
  } catch (error) {
    handleApiError(error);
  }

  // 解析 AI 返回的 JSON
  const rawText = response.data.content[0].text.trim();
  try {
    return JSON.parse(rawText);
  } catch {
    // AI 偶尔会在 JSON 外包裹 markdown 代码块，尝试提取
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (jsonMatch) return JSON.parse(jsonMatch[0]);
    throw new Error('解读失败：返回格式异常');
  }
}
