# 观易 App · Project Plan

> **跨 session 总控文件。每次开始工作，Claude 必须先读这份文件 + CLAUDE.md。**
>
> - **CLAUDE.md** = 项目核心规则（基本不变）
> - **PROJECT.md** = 当前阶段、4 期路线、安全约束、动态进度（本文件）
> - **CHANGELOG.md** = 版本化变更记录（每个 Phase 一个 entry）
> - **PROGRESS.md** = 时间线工作日志
> - **ERROR_LOG.md** = 失败和教训（确保同样的错误不发生第二次）
> - **SOURCES.md** = 数据来源声明
> - **docs/PRE_MERGE_CHECKLIST.md** = 合并到 main 前必走清单
> - **docs/MOBILE_TEST_SOP.md** = 手机端测试流程
> - **docs/decisions/** = 架构决策记录（ADR）

---

## 远期愿景

**"AI 加持的中国古典百科全书"** —— 从易经出发，扩展到儒/道/佛核心经典，再到童蒙启蒙、诗文，最后到中国历史百科。所有经典都以"原文+AI 解读+与作者对话+段落级追问"为核心交互。

---

## 安全规则（Hard Constraints）

| 动作 | 状态 | 说明 |
|---|---|---|
| 在 worktree 分支编辑 + commit | ✅ 允许 | 当前分支 `claude/naughty-booth-4d532f` |
| `git push forgejo ...` | ✅ 允许 | 进度备份用，不触发任何部署 |
| `git push origin ...`（任何分支） | ❌ 禁止 | 直到 Phase 4 用户明确批准 |
| 修改 main 分支 | ❌ 禁止 | 直到 Phase 4 用户明确批准 |
| 修改 src/data/ | ⚠️ 每次单独询问 | 核心资产 |
| 安装新依赖 | ❌ 禁止 | CLAUDE.md 规定 |
| 改 worker/ | ⚠️ 仅必要 + 告知 | 一期不需要改 |
| .env / API key | ❌ 永不进 git | 任何场景 |
| 写单元测试 | ❌ 不写 | CLAUDE.md 规定 |
| 失败发生时 | ⚠️ 必须 `/log-error` | 写入 ERROR_LOG.md，确保不再犯 |
| 写任何日志/变更条目 | ⚠️ 必须含 `HH:MM TZ` | 不能只写日期；用 `date "+%Y-%m-%d %H:%M %Z"` |
| ACTION_ITEMS.md | ⚠️ 一次只一个 🔄 | 完成后立即移到"已完成" + 写完成时间 |

---

## 工作流命令

| 命令 | 何时用 |
|---|---|
| `/backup` | 任何时候做进度备份（commit + push forgejo） |
| `/checkpoint` | 每个 Phase 完成时（lint+build+commit+tag+push） |
| `/log-error` | 失败发生时（写 ERROR_LOG.md + 防范机制） |
| `/premerge` | Phase 4，merge to main 前（走完整 checklist） |

---

# 全 4 期路线总览

| 期 | 目标 | 工程量 | tag |
|---|---|---|---|
| **Phase 0** | 备份与安全 | 小 ✅ | v0.0.0 |
| **Phase 0.5** | 治理系统建立 | 小 (本期) | v0.0.1-governance |
| **Phase 1** | 占卜模块 + 易经对话升级 | 中 | v0.1.0-fortune-and-dialogue |
| **Phase 2** | 9 部经典扩展 | 大 | v0.2.0-classics-9 |
| **Phase 3** | 童蒙 + 诗文 | 中 | v0.3.0-mengxue-shiwen |
| **Phase 4** | 中国历史百科 | 大（新范式） | v0.4.0-history |
| **v1.0** | 全 4 期完成、稳定上线 | - | v1.0.0 |

---

# Phase 0 — 备份与安全 ✅ 完成

- [x] 0.1 创建 PROJECT.md
- [x] 0.2 在 CLAUDE.md 加"先读 PROJECT.md"指引
- [x] 0.3 用户在 Forgejo 创建空 repo `ailearnandgrowth/guanyi`
- [x] 0.4 添加 Forgejo 为第二个 git remote（remote 名 `forgejo`）
- [x] 0.5 首次备份成功，commit `91a8e4e` 镜像可见

---

# Phase 0.5 — 治理系统建立（当前）

- [x] 0.5.1 SessionStart hook 注入当前时间
- [ ] 0.5.2 扩展 PROJECT.md 全 4 期（本文件）
- [ ] 0.5.3 创建 CHANGELOG.md / ERROR_LOG.md / PROGRESS.md / SOURCES.md
- [ ] 0.5.4 创建 docs/PRE_MERGE_CHECKLIST.md / MOBILE_TEST_SOP.md / decisions/
- [ ] 0.5.5 创建 4 个 slash command: /backup /checkpoint /log-error /premerge
- [ ] 0.5.6 commit + tag `v0.0.1-governance` + push forgejo

---

# Phase 1 — 占卜模块 + 易经对话升级 🎯

**完成标准：**
- 用户在新"占卜" tab 里 30 秒内完成"输入问题→出卦→看建议"
- 在易经任何原文页面，可以选中一句话→弹出按钮→与选定的"作者"对话该句

## 1A 占卜模块

- [ ] 1.1 路由 + 容器骨架
  - 改 `src/App.jsx`（mode 加 `'fortune'`）
  - 改 `src/components/Navigation.jsx`（加第 3 个 tab "占卜"）
  - 新 `src/components/Fortune.jsx`（容器 + 内嵌 sub-tab，模仿 Study.jsx）
- [ ] 1.2 梅花易数（数字/时间起卦，秒出）
  - 新 `src/utils/meiHua.js`：上卦=数1%8、下卦=数2%8、动爻=(数1+数2)%6；时间起卦用年支+月+日定上卦+时定下卦
  - 新 `src/components/fortune/MeiHua.jsx`
- [ ] 1.3 铜钱起卦（摇 6 次三枚铜钱动画）
  - 新 `src/utils/tongQian.js`：标准三钱概率（阳/阴/老阳变/老阴变）
  - 新 `src/components/fortune/TongQian.jsx`
- [ ] 1.4 观音灵签（一键抽签，5 签原型）
  - 新 `src/data/lingqian.js`：**Phase 1 仅 5 签原型；100 签数据待用户确认来源后补全**
  - 新 `src/components/fortune/LingQian.jsx`
- [ ] 1.5 占卜 prompt + 展示
  - 改 `src/utils/claudeApi.js`：新增 `interpretFortune({question, method, hexagram, changingPositions, lingQianText?})`
  - prompt 要求：≤120 字核心建议 + 1 句宜 + 1 句忌
  - 新 `src/components/fortune/QuickReading.jsx`：AI 建议在前，卦象细节折叠

## 1B 易经对话升级

- [ ] 1.6 studyChat 参数化
  - 改 `src/utils/studyChat.js`：`chat({book, persona, selectedText?, hexagramContext?, history, userMessage})`
  - 本期 `book` 固定 `'yijing'`
- [ ] 1.7 4 个 persona 的 prompt 调试
  - `confucius` 孔子：君子之道、述而不作
  - `wenwang` 文王/周公：演卦者口吻、从象数解
  - `shaoyong` 邵雍：数与象、心动即占
  - `zhuxi` 朱熹：理学视角、本义
- [ ] 1.8 StudyChat persona 切换 UI
  - 改 `src/components/StudyChat.jsx`：顶部加 4 个圆形按钮（宣纸墨韵）
  - 切换时清空当前对话
- [ ] 1.9 文本选择交互
  - 新 `src/hooks/useTextSelection.js`（监听 mouseup/touchend，window.getSelection() 取选区+rect）
  - 新 `src/components/SelectionPopover.jsx`（浮动按钮"问 [persona] 这一句"）
- [ ] 1.10 挂载到原文页面
  - 改 `src/components/HexagramDetail.jsx`（卦辞/彖传/象传/爻辞段落）
  - 改 `src/components/LessonReader.jsx`（课程正文段落）

- [ ] 1.11 `/checkpoint` → tag `v0.1.0-fortune-and-dialogue`

**预计：5-7 个 session（约 2-3 周）**

---

# Phase 2 — 9 部经典扩展

**目标：**Study tab 内增加"书架"，覆盖儒家四书 + 道家两部 + 佛家三部，共 9 部。复用 Phase 1 建立的"对话+追问"框架。

**完成标准：**用户从书架打开任意一部书，能阅读原文、看翻译注释、选段追问、与该书作者对话。

## 2.0 通用经典容器架构（关键架构动作）

- [ ] 2.0.1 设计统一 schema：`src/data/classics/{book}.js`
  ```
  {
    meta: {id, name, author, era, category, persona, totalSections, sourceText, sourceTranslation},
    sections: [{id, type, title, original, translation, notes, relatedTerms, relatedHexagrams?}]
  }
  ```
- [ ] 2.0.2 设计书架数据 `src/data/classics/index.js`（书目元信息）
- [ ] 2.0.3 评估 hexagrams.js 是否要 "经典化" 放入 classics/yijing.js（保持向后兼容）

## 2.1 通用 ClassicReader 组件

- [ ] 2.1.1 `src/components/classics/ClassicShelf.jsx`（书架，9 部书的卡片网格）
- [ ] 2.1.2 `src/components/classics/ClassicReader.jsx`（任意经典阅读器）
- [ ] 2.1.3 `src/components/classics/ChapterNavigator.jsx`（章节导航）
- [ ] 2.1.4 复用 Phase 1 的 SelectionPopover

## 2.2 Navigation 重构

- [ ] 2.2.1 在 Study tab 内增加"书架"作为 sub-tab（与 入门/通识/卦目 并列）
- [ ] 2.2.2 决策：是否抽到顶层（4 tab：问道/学易/占卜/书架）—— 写入 docs/decisions/

## 2.3 数据录入（最大工程量，分三批）

### 批 A — 儒家四书
- [ ] 2.3.1 论语 (20 篇 500 章)
- [ ] 2.3.2 孟子 (7 篇约 260 章)
- [ ] 2.3.3 大学 (1 章 11 节)
- [ ] 2.3.4 中庸 (33 章)

### 批 B — 道家两部
- [ ] 2.3.5 道德经 (81 章)
- [ ] 2.3.6 庄子内七篇 (7 篇)

### 批 C — 佛家三部
- [ ] 2.3.7 心经 (1 篇 260 字)
- [ ] 2.3.8 金刚经 (32 分)
- [ ] 2.3.9 坛经 (10 品)

每部书录入完成后单独 commit + push forgejo。每部都更新 SOURCES.md。

## 2.4 Author Personas

- [ ] 2.4.1 扩展 studyChat 的 persona 配置：
  - 论语：confucius (主), zixia, yan_hui (弟子视角)
  - 孟子：mengzi, zhuxi (《孟子集注》视角)
  - 大学/中庸：zengzi/zisi, zhuxi
  - 道德经：laozi
  - 庄子：zhuangzi
  - 心经/金刚经：佛 (释迦牟尼/观自在)
  - 坛经：六祖慧能
- [ ] 2.4.2 切书时切 persona 选项

## 2.5 按书过滤的对话

- [ ] 2.5.1 StudyChat 的 book 参数实际投入使用
- [ ] 2.5.2 对话历史按 (book, persona) 分组保存

- [ ] 2.6 `/checkpoint` → tag `v0.2.0-classics-9`

**预计：4-6 周（数据录入是瓶颈）**

---

# Phase 3 — 童蒙启蒙 + 诗文

**目标：**新增"启蒙"和"诗文"两个独立模块，覆盖中国传统启蒙书和经典诗文。

## 3A 童蒙启蒙

- [ ] 3.1 三字经 (~378 句)
- [ ] 3.2 百家姓 (568 字)
- [ ] 3.3 千字文 (1000 字)
- [ ] 3.4 幼学琼林 (4 卷)
- [ ] 3.5 新建 `src/components/mengxue/` 模块
  - 韵文展示（每句换行 + 韵脚高亮）
  - 朗读节奏标注（视觉停顿，不做 TTS）

## 3B 诗文

- [ ] 3.6 唐诗三百首 (313 首)
- [ ] 3.7 宋词三百首 (~300 首)
- [ ] 3.8 古文观止 (222 篇)
- [ ] 3.9 楚辞 (~17 篇)
- [ ] 3.10 新建 `src/components/shiwen/` 模块
  - 三维度浏览：朝代 / 作者 / 主题
  - 单首作品页：原文 + 注释 + 译文 + 用典 + AI 赏析
- [ ] 3.11 用典提示功能
  - 数据：标注每首诗中的典故，关联到对应经典/史书
  - 交互：点击标注词→弹出"出自《xx》..." + AI 详细解释

- [ ] 3.12 `/checkpoint` → tag `v0.3.0-mengxue-shiwen`

**预计：3-4 周**

---

# Phase 4 — 中国历史百科

**目标：**全新模块，时空+事件+人物+地图四维数据。**这不是"经典+对话"的延伸，需要独立设计。**

## 4.1 朝代时间轴

- [ ] 4.1.1 数据：`src/data/history/dynasties.js`（夏商周秦汉魏晋南北朝隋唐五代宋元明清）
- [ ] 4.1.2 可视化：横向滚动时间轴 + 朝代色块
- [ ] 4.1.3 组件：`src/components/history/Timeline.jsx`

## 4.2 历史事件库

- [ ] 4.2.1 数据：`src/data/history/events.js`（春秋五霸/战国七雄/楚汉/三国/安史之乱...）
- [ ] 4.2.2 每事件：起止年、地点、人物、影响、关联经典
- [ ] 4.2.3 组件：`src/components/history/EventCard.jsx`

## 4.3 历史地图

- [ ] 4.3.1 SVG 疆域演变（秦汉、唐宋、元明清）
- [ ] 4.3.2 关键战场地图（赤壁、淝水、安史之乱）
- [ ] 4.3.3 组件：`src/components/history/Map.jsx`
- [ ] 4.3.4 复杂度高，可能需要单独的可视化决策记录到 ADR

## 4.4 史书节选

- [ ] 4.4.1 史记精选（本纪 12 + 世家选 + 列传选，不全做）
- [ ] 4.4.2 资治通鉴精选段落
- [ ] 4.4.3 数据：`src/data/history/shiji.js`, `zizhitongjian.js`

## 4.5 历史人物百科

- [ ] 4.5.1 数据：重要人物（孔孟老庄、孙武商鞅、汉武唐宗、李白杜甫...）
- [ ] 4.5.2 关联：经典 + 事件 + 时代
- [ ] 4.5.3 如果是作者，链接到 Phase 2/3 的对话

- [ ] 4.6 `/checkpoint` → tag `v0.4.0-history`

**预计：6+ 周**

---

# 当前任务（动态更新区）

**阶段：** Phase 0.5 进行中
**正在做：** 创建 tracking files + slash commands
**下一步：** commit + tag `v0.0.1-governance` + push forgejo → 启动 Phase 1.1
**当前时间最后更新：** 2026-05-10 16:43 CDT

---

# 关键文件索引

| 文件 | 作用 |
|---|---|
| `CLAUDE.md` | 项目核心规则 |
| `PROJECT.md` | 本文件 - 当前进度与安全约束 |
| `CHANGELOG.md` | 版本化变更日志 |
| `PROGRESS.md` | 时间线工作日志 |
| `ERROR_LOG.md` | 失败教训库 |
| `SOURCES.md` | 数据来源声明 |
| `docs/PRE_MERGE_CHECKLIST.md` | merge to main 前必走清单 |
| `docs/MOBILE_TEST_SOP.md` | 手机端测试流程 |
| `docs/decisions/` | 架构决策记录 ADR |
| `.claude/commands/*.md` | slash 命令定义 |
| `.claude/settings.local.json` | hooks + permissions |
| `src/App.jsx` | 路由入口（mode 状态机） |
| `src/components/Navigation.jsx` | 顶部 tab 导航 |
| `src/components/Divination.jsx` + `Reading.jsx` | 蓍草问道（Phase 4 之前不动） |
| `src/components/Study.jsx` + 子组件 | 学易模式 |
| `src/components/StudyChat.jsx` | 与大师对话（Phase 1 升级） |
| `src/utils/divination.js` | 蓍草算法 |
| `src/utils/transformations.js` | 五层卦象计算 |
| `src/utils/claudeApi.js` | LLM 解读（Phase 1.5 加 interpretFortune） |
| `src/utils/studyChat.js` | 对话 LLM（Phase 1.6 参数化） |
| `src/data/hexagrams.js` | 64 卦数据（**改前必问**） |
| `src/data/lessons.js` | 9 课入门体系 |
| `src/data/glossary.js` | 词条库 |
| `src/data/hexagramIndex.js` | 卦序索引 |
| `src/styles/tokens.css` | 宣纸墨韵设计 token |
| `worker/src/index.js` | Cloudflare Worker（一期不改） |
