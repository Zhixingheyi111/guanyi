# 观易 App

## 项目概述
个人使用的易经网页应用，主要在手机使用。
主 slogan："观易 · 见自己"。副 slogan："观天地之变，见生命之常"。

双模式：
- 🌿 问道模式：模拟蓍草起卦 + 五层卦象 + Claude API 解读
- 📖 学易模式：六十四卦浏览 + 经典原文阅读 + 与大师对话学习

## 技术栈
- React 18 + Vite + JavaScript
- 纯 CSS（不用 UI 框架）
- axios（API 调用）
- 部署：GitHub Pages

## 核心原则
1. 事实和解读分离：经文原文（卦辞/爻辞/经典文段）从本地数据库读取，AI 只负责解读分析
2. AI 不生成原文：避免混淆错误
3. **src/data/ 自治添加经典数据**（用户 2026-05-12 授权）：
   - 经文原文：必须用公版（公元 1923 年前作品，无版权风险）
   - 翻译/注释：自录或基于公版古注（朱熹、王弼、郭象等），不抄现代版权译注
   - 每条数据在 `SOURCES.md` 标明：原文版本、翻译来源（自录/某古注）、是否商用
   - **若没把握来源是否公版，stop 问用户**
   - 修改现有数据（如 hexagrams.js）仍需问

## 数据结构（src/data/hexagrams.js）

每卦对象：
{
  id: 1,                    // 1-64，《周易》通行本卦序
  name: "乾",
  symbol: "䷀",
  upper: "乾",
  lower: "乾",
  binary: "111111",         // index 0 = 初爻
  guaci: { original, translation, notes },
  tuanci: "彖曰：...",
  daxiang: "象曰：...",
  yaoci: [                  // index 0 = 初爻
    { position, original, xiaoxiang, translation, notes }
  ]
}

## 自治模式（用户授权 2026-05-11）

**用户已授予全自治权限。** 不要每个 bash / edit / write 都问 allow。
- `.claude/settings.local.json` 设了 `defaultMode: "bypassPermissions"` + 通配 allow
- 只有 `deny` 列表里的操作（rm -rf, git push origin, git reset --hard, sudo, npm install 等）才会被 harness 阻止
- **必须停下来问用户的场景（这些是 hard rules，自治也不能跨过）：**
  1. **修改现有 src/data/* 文件**（hexagrams.js 等 v0.1.0 已有的数据，每次单独问）
  2. **添加经典数据但来源版权不确定**（哪怕一句话）
  3. push 到 GitHub `origin`（任何分支，触发生产部署）
  4. merge 到 main 分支
  5. 安装新依赖（CLAUDE.md 规定）
  6. 不可逆操作（rm -rf 等）
  7. 真正模糊的产品决策（不是技术细节）
  8. 用户主动说"等等"或者明确否决了某做法

- **可以自治做的（用户 2026-05-12 扩展授权）：**
  - 新增 `src/data/classics/*.js`（公版经典原文）
  - 写经典翻译（自录）+ 注释（自录或公版古注引用）
  - 更新 `SOURCES.md` 标明来源（每条数据必须可追溯）
- **不需要停下来问的：** 日常 bash、edit、write、commit、push forgejo、跑 lint/build、读文件、改 tracking 文件、修 bug、log error
- 失败时**自己 /log-error 记录后继续**，不要等用户决定，除非碰到上面 hard rules

## 行为准则

### 必须做的
1. **真正不确定**才停下来问（不是每个小决策；自治模式下默认推进）
2. 改 src/data/* 或动 main / origin 之前先说计划
3. 中文沟通，中文注释
4. 完成任务时报告：做了什么、改了哪些文件、需要用户注意什么

### 不能做的
1. 不装额外依赖
2. 不 push 到 GitHub origin（任何分支，main 自动部署 GitHub Pages）
3. 不写单元测试
4. 不重试超过2次
5. 不执行 rm -rf、git reset --hard 等不可逆命令
6. 不把 API key 写进任何代码文件
7. 不部署到生产环境（除非我明确要求）

### 备份是允许的
- ✅ push 到 `forgejo` remote（nexus.xinle.biz/git/ailearnandgrowth/guanyi）作为进度备份，不触发任何部署
- ❌ push 到 `origin`（GitHub）需用户明确批准

### 关键提醒
⚠️ API key 只能在 .env 文件，绝不进 git，绝不写进代码
⚠️ 部署前必须先讨论 API key 保护方案

## 当前阶段
**每次工作开始前，先读 [`PROJECT.md`](PROJECT.md)** 了解当前 Phase、任务进度、待办事项。
PROJECT.md 是动态进度文件，CLAUDE.md（本文件）是不变的核心规则。

## 上下文接近极限时的交接（用户授权 2026-05-11）

当本 session 上下文快满（看到压缩提示或感觉转动慢）时，**主动生成一段自包含的接班 prompt** 给用户，他们粘到新 chat 即可继续。模板见 [docs/HANDOFF_PROMPT.md](docs/HANDOFF_PROMPT.md)。

也可由用户运行 `/handoff` slash command 主动触发。
