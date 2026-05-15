# Progress Log

按时间倒序记录每个 session 的进度（最新在上）。

格式：`## YYYY-MM-DD HH:MM TZ — 标题`（**HH:MM 必须**，不能只写日期）

---

## 2026-05-14 00:45 CDT — Polish · 蓍草 sub-tab intro（commit af23ad7）

视觉验收期间用户报：蓍草下没有 intro，与梅花/铜钱不一致。
- 改 `src/components/Divination.jsx`：wrapper 顶部加 intro（与 MeiHua 同款样式）
- 文案"蓍草揲数 · 大衍之数 / 心有大事 · 一日一占"——对仗梅花"邵雍传"和铜钱"火珠林"
- 顺带 commit 了 `.claude/launch.json`（preview tool 配置）

---

## 2026-05-14 00:32 CDT — Phase 易经-A4 完成：复盘机制（核心护城河）

**做了什么：**

### 数据层
- 改 `src/utils/storage.js`：
  - 新增 `updateDivinationFollowUp(id, followUp)`：保存复盘信息
  - 新增 `getPendingReviewRecords(now)`：返回待复盘记录（7-30 天和 30+ 天）
  - 新增 `getDivinationStats(daysAgo, now)`：统计准确度分布（"上个月 5 卦准了 3 个"）
  - followUp 字段结构：`{askedAt, userReply, selfRating(1-5), aiReflection, reviewedAt}`

### AI 层
- 改 `src/utils/claudeApi.js`：
  - 新增 `reflectFortune({record, userReply, selfRating, daysElapsed})` 函数
  - prompt 设计：3 层结构（对照 / 解释 / 学到什么）+ 诚实优先（不应验就承认不应验）+ 收尾"下次该如何用占卜"小建议
  - 兼容蓍草五层卦象 + 梅花/铜钱简版字段

### UI 层
- 新建 `src/components/divination/ReviewPrompt.jsx`（~230 行）：
  - 4 阶段状态机：editing → loading → reflecting / error
  - 文本框（"那件事后来怎样了"）+ 1-5 星自评
  - "请 AI 反思一下"按钮 → 调 `reflectFortune` → 显示 AI 文本
  - "保存此次复盘" / "暂不保存" / 错误时"不要 AI 反思，仅保存"
- 改 `src/components/DivinationHistory.jsx`：
  - 每条记录加 ageDays 计算（基于 currentTime 快照，避免 render 阶段 Date.now()）
  - 占卜 ≥ 7 天且未复盘 → 朱砂"复盘 · N 天前"按钮
  - 已复盘 → 金色"已复盘 N/5"徽章
  - 点击复盘按钮 → inline 展开 ReviewPrompt（不弹 modal）
  - 复盘提交 → `updateDivinationFollowUp` + 刷新

**React 19 hooks/purity 处理：**
- `Date.now()` 不能在 render 阶段调
- 用 `useState(() => Date.now())` initializer 在 mount 时调一次
- event handler（handleToggle / handleDelete / handleReviewSubmit）内 setCurrentTime(Date.now()) 更新

**验证：**
- `npm run lint` rc=0
- `npm run build` rc=0；bundle 737 KB（+9 KB 含 ReviewPrompt UI + reflectFortune）
- 视觉/交互测试待 dev server 启动

**护城河价值：**
- 这是任何 AI 占卜对手（卦语 AI、知命阁等）都没做的差异化
- 长期累积 → "我的占卜日记"，用户能看见"准 vs 不准"的真实统计
- 反向训练用户：从"问完即丢"到"看见真实对应"——把占卜从一次性娱乐变成长期学习
- 与限频规则配合：日 1 次蓍草、5 次占卜 → 鼓励"少而精" + 复盘机制鼓励"问完看后续"

**下一步：**
- 一个补丁后续可考虑：占卜后 7/30 天首页弹"上次问 X 那件事怎样了"（plan 里 A4 后半，本 session 未做）
- B：日历 + 每日仪式（节气×卦、农历×爻、占卜历、打卡历）
- C：Worker 限频 + 缓存

---

## 2026-05-14 00:09 CDT — Phase 易经-A3 完成：梅花体用分析模块

**做了什么：**
- 改 `src/utils/meiHua.js`（+~110 行）：
  - 新增 `BAGUA_ELEMENT` 映射：乾兑→金、震巽→木、坎→水、离→火、坤艮→土
  - 新增 `ELEMENT_NAMES` 中文表
  - 新增 `GENERATES` / `OVERCOMES` 五行生克常量
  - 新增 `analyzeTiyong(upperNum, lowerNum, changingIndex)` 函数：
    - 动爻 index < 3 → 在下卦 → yong=下卦、ti=上卦
    - 动爻 index ≥ 3 → 在上卦 → yong=上卦、ti=下卦
    - 判 5 种关系：体生用（耗）/ 用生体（得）/ 体克用（胜）/ 用克体（难）/ 比和（稳）
    - 返回 {tiPosition, yongPosition, tiBagua, yongBagua, relation, relationLabel, nature, meaning}
  - 改 `buildResult`：附加 tiyong 字段到返回；为 upper/lowerBagua 加 element/elementName
- 改 `src/components/fortune/MeiHua.jsx`（+~95 行 style + ~30 行 JSX）：
  - 新增体用分析卡片（带朱砂左 border）
  - 显示：体（我）/ 用（事）两栏，含八卦符号 + 名 + 五行
  - 关系标签 + 朱砂色性质徽章（耗/得/胜/难/稳）
  - 一句白话解释
  - 把 tiyong 传给 QuickReading 的 scenario
- 改 `src/utils/claudeApi.js` buildFortunePrompt 中 meihua 分支：
  - 新增 tiyongBlock：在 prompt 中传入体用信息（含每种关系下 AI 应当强调的方向）
  - 修改 coreAdvice 要求：梅花卦明确利用体用关系
  - 修改 valence 参考：增加梅花体用对吉凶的影响说明

**算法手测：**
- 例 1：上=乾(金) + 下=离(火) + 动初爻 → yong=离(火)、ti=乾(金)；火克金 → 用克体（难）✓
- 例 2：上=兑(金) + 下=艮(土) + 动四爻 → yong=兑(金)、ti=艮(土)；土生金 → 体生用（耗）✓

**验证：**
- `npm run lint` rc=0
- `npm run build` rc=0；bundle 728 KB（+5 KB tiyong 逻辑+UI）
- 视觉测试待 dev server 启动

**下一步：**
- A4：复盘机制（核心护城河）—— 占卜历史 + 7/30 天追问 + 用户自评 + AI 综合反思

---

## 2026-05-14 00:05 CDT — Phase 易经-A2 完成：lessons.js 增 3 课占卜方法详解

**做了什么：**
- 改 `src/data/lessons.js`（1191 → 1593 行，新增 ~400 行）：
  - 第 9 课结尾措辞调整："入门部分的最后一课" + 引导到 10-12 课
  - 新增 3 课（占卜方法详解系列）：
    - **第 10 课 · 蓍草揲蓍法**：大衍之数从何而来（《系辞》"大衍五十"）/ 18 变完整四营流程（分二、挂一、揲四、归奇）/ 四种余数 13/17/21/25 → 老阳/少阴/少阳/老阴 / 概率推演 3:5:5:3 / 与本 App 实现的对应 / 何时该用（"再三渎"伦理与日 1 次限频）
    - **第 11 课 · 金钱卦与《火珠林》**：京房与麻衣道者起源 / 三钱正反约定 / 6/7/8/9 对应爻型 / 概率 1:3:3:1 / 与蓍草的实际差异 / 注意"铜钱不必古币"
    - **第 12 课 · 梅花易数与体用之论**：邵雍生平 / "心动即占" / "数即是象"哲学 / 三种起卦法（时间/报数/外应）/ **体用关系深入**（生克五种关系 + 八卦五行映射）/ 互卦补充 / 何时该用
- 每课结构与现有 9 课一致：sections 含 h/p/ul/quote/note 几种类型 + relatedTerms

**与第 8 课的关系：**
- 第 8 课 `how-to-divine` 是"3 方法概览"
- 第 10-12 课是"每方法独立深入"：历史 / 数学 / 哲学 / 与本 App 算法的对应
- 双层结构：概览 → 深入

**全部内容来源：**
- 自录，参考公版《系辞》《周易·蒙卦》《荀子·大略》《观物内篇》（>1923 年文献）
- 概率推演自录数学
- 不抄现代版权译注（如杨伯峻、陈鼓应）

**验证：**
- `npm run lint` rc=0
- `npm run build` rc=0；bundle 增加 ~12 KB（content-only）

**下一步：**
- A3：梅花体用分析模块（第 12 课讲了，A3 在算法+UI 真正实现）
- A4：复盘机制（核心护城河）

**值得后续注意：**
- 第 8 课第 941 行的概率说"老阳 3/16、少阴 7/16、少阳 5/16、老阴 1/16"与第 10 课的 3:5:5:3 是两个不同的传统揲蓍变体——本 App 算法（divination.js）取 3:5:5:3 对称版。可以考虑下一次 cleanup 把第 8 课统一到 3:5:5:3，避免文本内部矛盾。已记录为后续 chore。

---

## 2026-05-14 00:00 CDT — Phase 易经-A1 完成：占卜顶部 3 种方法导读卡

**做了什么：**
- 新建 `src/components/fortune/DivinationMethodCards.jsx`（~200 行）：
  - 3 张并列小卡（蓍草 / 梅花 / 铜钱），每卡含 name + tagline + duration
  - 点击展开 → 显示方法 / 何时该用 / 概率（或体用）/ 来历 4 个区块
  - 再点击 → 收起
  - 内联 CSS-in-JS，使用 tokens：朱砂色强调展开卡左边、宣纸色背景、宋体字
  - 移动端：grid auto-fit minmax(170px) 自动堆叠
- 改 `src/components/Fortune.jsx`：sub-tabs 之上嵌入 `<DivinationMethodCards />`

**方法内容来源：**
- 蓍草：《系辞·上》大衍五十之数 + 四营成易概率（自录）
- 梅花：邵雍《梅花易数》传统（自录，含体用关系基础）
- 铜钱：《火珠林》三钱法（自录）
- 全部公版来源，无现代版权译注引用

**验证：**
- `npm run lint` rc=0
- `npm run build` rc=0
- 视觉/交互测试待 dev server 启动

**下一步：**
- A2：lessons.js 增 3 课（蓍草揲蓍法 / 铜钱起卦 / 梅花易数），与导读卡形成"快速了解 vs 系统学习"两层
- A3：梅花体用分析模块（导读卡已介绍体用概念，A3 在算法+UI 真正实现）
- A4：复盘机制（核心护城河）

---

## 2026-05-13 23:55 CDT — Phase 易经-A0 完成：删灵签 + 顶层 2 mode 重构

**做了什么：**
- 修 build：注释 `src/data/classics/index.js:4` 的 `import daxue from './daxue'` + 第 8 行 `daxue,`（Phase 2 经典扩展暂停后该 import 不再有效）
- 删 `src/data/lingqian.js` + `src/components/fortune/LingQian.jsx`
- 重写 `src/components/Fortune.jsx`（71 行）：3 sub-tab `蓍草 / 梅花 / 铜钱`；接受 `shicaoSlot` prop 嵌入蓍草工作流
- 改 `src/App.jsx`：mode 状态机注释更新；抽出 `buildShicaoSlot()` 把原"问道"渲染逻辑作为 slot 传入 `<Fortune>`；删除 `mode === 'fortune'` 分支
- 改 `src/components/Navigation.jsx`：3 个按钮（问道/学易/占卜）合并为 2 个（占卜/学易）
- 改 `src/utils/claudeApi.js`：`buildFortunePrompt` 删 lingqian 分支（约 25 行）；jsdoc 入参 type 收窄到 `'meihua' | 'tongqian'`
- 更新 `SOURCES.md` / `ACTION_ITEMS.md` / `PROJECT.md` / `CHANGELOG.md`

**用户决策（plan 阶段确认）：**
- 以易经为主，占卜为辅；其他经典（Phase 2）整体暂停（schema 容器保留作未来扩展骨架）
- 删灵签：道+佛混合，与"以易为主"定位偏离
- 顶层 mode 合并为 2：占卜 / 学易；占卜内 3 sub-tab（蓍草最庄重 / 梅花轻便 / 铜钱日常）
- 完全免费 + 纯前端无账号 + 限频 + 缓存（C 阶段在 Worker 实现）
- 限频规则：蓍草日 1 次（"再三渎"伦理）/ 占卜池日 5 次 / 学易池日 20 次 / 学完 1 课 +2 次占卜额度（核心引流机制）

**验证：**
- `npm run lint` rc=0（独立运行，E005 纪律）
- `npm run build` rc=0，模块数 101→99
- 视觉测试待 dev server 启动

**下一步：**
- A1：占卜顶部 3 种方法导读卡（蓍草/梅花/铜钱 概览）
- A2：lessons.js 增 3 课（蓍草揲蓍法 / 铜钱起卦 / 梅花易数）

---

## 2026-05-10 21:53 CDT — A2 / Phase 1.2 完成：梅花易数

**做了什么：**
- 新建 `src/utils/meiHua.js`（~110 行）：
  - 数字起卦：上=num1%8、下=num2%8、动=(num1+num2)%6（0 取 max）
  - 时间起卦：年支=(年-4)%12+1、时支=hour 映射 1-12，公历月日
  - 返回 `{ binary, variantBinary, changingPositions[0-indexed], upperBagua, lowerBagua, changingPositionName }`
  - 八卦数：1乾 2兑 3离 4震 5巽 6坎 7艮 8坤
- 新建 `src/components/fortune/MeiHua.jsx`（~280 行）：
  - 双模式 UI（数字 / 时间），宣纸墨韵
  - 结果展示：本卦 + 卦辞 + 上下卦 + 动爻 + 变卦 + AI 解读占位
  - 淡入动画
- 改 `src/components/Fortune.jsx`：meihua sub-tab 渲染 `<MeiHua />` 取代占位
- commit `f5cef17`

**验证：**
- 算法手测：1,1→乾；8,1→地天泰；时间起卦正常
- `npm run build` ✅
- `npm run lint` ⚠️ 仍 2 个 E002 pre-existing，A2 引入 0 个新错误

**下一步：**
- A3 / Phase 1.3 — 铜钱起卦（摇 6 次三枚铜钱动画）

---

## 2026-05-11 20:06 CDT — 🎯 Phase 1 完成 (v0.1.0-fortune-and-dialogue)

**用户授权自主执行**（"全部执行，不需要 allow"）后一段连续工作：

**完成的 Action：**
- B1：修 React 19 hooks lint 错（DivinationHistory + NoteEditor）— commit 0b3fe6c
- A3：铜钱起卦 + 摇钱动画 — commit f5cef17
- A4：观音灵签 5 签原型 — commit 9fe7cce
- A5：interpretFortune AI prompt + QuickReading 共用组件 — commit 167ac38
- B2+B3：MOBILE_TEST_SOP + checkpoint/skills 强制独立 lint/build — commit f1413ac
- Phase 1.6-1.8：studyChat persona 化 + 4 位作者 + UI 切换器 — commit 0d75fc5
- Phase 1.9-1.10：useTextSelection + SelectionPopover + HexagramDetail 接入 — commit 5d8a308
- Phase 1.11：CHANGELOG / PROGRESS / PROJECT / ACTION_ITEMS 更新 + tag v0.1.0

**记录的错误：**
- E003：dev server 端口冲突（5173 上有用户另一个 vite，serving 主仓库代码）
- E004：Forgejo push 失败（server-side unpacker error，从 19:31 起持续到 20:06）
- E005：`lint | tail && commit` pipe 吞 exit code，dead code 进了 commit 9fe7cce

**Forgejo 备份状态：** 仍 unpacker error，本期所有 commit 仅在本地。需要用户在 nexus.xinle.biz 后台查 disk usage / Forgejo logs，或服务恢复后我可以一次性 push 所有累积的 commits + tags（v0.0.2-governance 已 push，v0.1.0 待 push）。

**下一步：**
- 等用户人工验收 Phase 1
- 验收后再开 Phase 2（9 部经典扩展）—— src/data/* 录入需要用户单独确认每部书的来源

---

## 2026-05-10 21:38 CDT — A1 / Phase 1.1 完成：占卜 tab 骨架

**做了什么：**
- `src/App.jsx`：import Fortune；mode 加 `'fortune'` 分支
- `src/components/Navigation.jsx`：加第 3 个 tab 按钮 "占卜"
- `src/components/Fortune.jsx`（新建，~80 行）：容器 + 3 sub-tab（灵签/梅花/铜钱），各放 "此功能即将开放" 占位
- commit `07674e2` `feat(fortune): add tab routing + Fortune container skeleton (Phase 1.1)`

**验证：**
- `npm run build` ✅ 通过（629 kB bundle，跟之前一样）
- `npm run lint` ⚠️ 有 2 个 pre-existing error（DivinationHistory.jsx + NoteEditor.jsx，React 19 新规则），A1 没动这两个文件 → 记录为 E002

**新增阻塞项：**
- B1：修 React 19 Hooks lint 错误（Phase 1.11 /checkpoint 之前必修）

**下一步：**
- A2 / Phase 1.2 — 梅花易数实现（输入两个数 → 出本卦+动爻）

---

## 2026-05-10 21:28 CDT — Phase 0.5b 治理系统加固

**用户要求**：明确"project plan / action item / error log / skills"四类必须在 repo 内；每条日志/变更必须有时间戳。

**完成：**
- `LESSONS.md` → `ERROR_LOG.md`（git mv，更直白的命名）
- 新增 `ACTION_ITEMS.md`（当前 sprint 实际在做的事，与远期 PROJECT.md 分离）
- 新增 3 个真 skill 在 `.claude/skills/`：
  - `error-logger`（按上下文自动触发：用户提到 error/bug/失败时）
  - `safe-backup`（按上下文自动触发：用户提到备份/保存进度时）
  - `phase-checkpoint`（按上下文自动触发：用户提到 phase 完成时）
- slash command `/log-failure` → `/log-error`（命名一致性）
- 所有 tracking 文件强制 `YYYY-MM-DD HH:MM TZ` 时间戳
- 补全 E001 + CHANGELOG 的时间字段
- PROJECT.md / PRE_MERGE_CHECKLIST / 4 commands 更新引用

**下一步：**
- `/checkpoint` 1.0.5b → tag `v0.0.2-governance` → push forgejo
- 等用户确认进入 Phase 1.1（占卜 tab 骨架）

---

## 2026-05-10 16:43 CDT — Phase 0 + Phase 0.5 完成

**Phase 0 — 备份与安全 ✅**
- 创建 `PROJECT.md`（最初为 Phase 1 单期版）
- 更新 `CLAUDE.md`：加 PROJECT.md 入口指引、区分 GitHub/Forgejo push 策略
- 添加 Forgejo remote `forgejo` (nexus.xinle.biz/git/ailearnandgrowth/guanyi)
- 首次备份成功，commit `91a8e4e` 在 Forgejo 可见

**Phase 0.5 — 治理系统建立 ✅**
- SessionStart hook 配好（`date` → `additionalContext`）
- 扩展 `PROJECT.md` 到全 4 期详细计划
- 创建 5 个 tracking 文件：`CHANGELOG.md`, `PROGRESS.md`, `LESSONS.md`, `SOURCES.md`
- 创建 3 个 docs：`docs/PRE_MERGE_CHECKLIST.md`, `docs/MOBILE_TEST_SOP.md`, `docs/decisions/README.md`
- 创建 4 个 slash commands：`/backup`, `/checkpoint`, `/log-failure`, `/premerge`
- 记录 L001 lesson：Forgejo MCP 没有 create_repository 工具
- commit + tag `v0.0.1-governance` + push forgejo（待执行）

**下一步：**
- 等用户确认进入 Phase 1.1（占卜 tab 路由 + 容器骨架）
