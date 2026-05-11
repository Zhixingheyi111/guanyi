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
1. 事实和解读分离：卦名、卦符、卦辞、爻辞从本地数据库读取，AI 只负责解读分析
2. AI 不生成卦符卦名原文：避免混淆错误
3. src/data/ 修改前必须问我：核心资产

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

## 行为准则

### 必须做的
1. 遇到不确定停下来问
2. 改文件前先说计划
3. 中文沟通，中文注释
4. 完成任务时报告：做了什么、改了哪些文件、需要我注意什么

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
