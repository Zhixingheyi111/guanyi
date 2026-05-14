# Changelog

观易 App 版本变更记录。每次完成 Phase 后添加新版本条目。遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

格式：`[版本号] - YYYY-MM-DD HH:MM TZ - 标题`，分 Added / Changed / Removed / Fixed / Security 五类。

**所有版本必须有 HH:MM TZ**（不能只写日期）。获取：`date "+%Y-%m-%d %H:%M %Z"`

---

## [Unreleased]

Phase 易经-A 进行中（占卜模块整治）。下个版本 tag：`v0.2.0-divination-deep`（A+B+C 全完后）。

### A2 — 2026-05-14 00:05 CDT — lessons.js 增 3 课占卜方法详解

#### Added
- 第 10 课 `divination-shicao` — 蓍草揲蓍法（大衍之数、18 变、四营、概率 3:5:5:3、再三渎伦理）
- 第 11 课 `divination-tongqian` — 金钱卦与《火珠林》（京房起源、三钱概率 1:3:3:1、铜钱不必古币）
- 第 12 课 `divination-meihua` — 梅花易数与体用（邵雍生平、心动即占、三种起卦法、体用五种生克关系、互卦）

#### Changed
- 第 9 课结尾：从"入门九课的最后一课"改为"入门部分的最后一课"+ 引导到 10-12 课

#### Rationale
第 8 课 `how-to-divine` 是 3 方法概览。第 10-12 课是各方法的独立深入：历史/数学/哲学。
形成"概览 → 深入"两层结构。配合 A1 的导读卡（占卜板块快速理解）+ A2 的课程（学易板块系统学习），
覆盖"快速了解"和"深度学习"两个场景。

为 Phase 易经-C4 的"学完 1 课 +2 次占卜额度"引流机制做内容铺垫。

#### 内容来源
全部公版自录：《系辞》《周易·蒙卦》《荀子》《观物内篇》（均 >1923 年公版）。
无现代版权译注引用。概率推演自录数学。

---

### A1 — 2026-05-14 00:00 CDT — 占卜顶部 3 种方法导读卡

#### Added
- `src/components/fortune/DivinationMethodCards.jsx` — 3 卡并列，可展开方法详情
- 内容：每方法含"方法 / 何时该用 / 概率（或体用）/ 来历" 4 区块（公版来源自录）
- 嵌入 `Fortune.jsx` sub-tabs 之上

#### Rationale
用户进入占卜板块就能看懂 3 种方式各是什么、何时用、怎么算、来历如何。
不需要先去"学易"系统学习就可以理解占卜行为本身。

---

### A0 — 2026-05-13 23:55 CDT — 删灵签 + 顶层 mode 重构

**用户决策（2026-05-13）**：以易经为主、占卜为辅，其他经典暂搁；Phase 2 经典扩展整体暂停。

#### Removed
- `src/data/lingqian.js` — 灵签 5 签原型数据
- `src/components/fortune/LingQian.jsx` — 灵签 UI 组件
- `src/utils/claudeApi.js` 中 `lingqian` 解读分支（约 25 行）
- Navigation 顶层 `问道` / `占卜` 按钮（合并为单 `占卜`）

#### Changed
- 顶层 mode 3 → 2：`占卜` / `学易`
- 原"问道"（蓍草起卦）合并入"占卜"模式的 `蓍草` sub-tab
- `Fortune.jsx` 重构为占卜模式容器：3 sub-tab（蓍草 / 梅花 / 铜钱）
- `App.jsx`：抽出 `buildShicaoSlot()`，将原"问道"渲染逻辑作为蓍草 sub-tab 内容传入 `Fortune`
- `src/data/classics/index.js`：临时注释 daxue import（Phase 2 暂停，schema 容器保留作未来扩展）
- `SOURCES.md` / `ACTION_ITEMS.md` / `PROJECT.md` 同步更新

#### Rationale
- 灵签是道+佛混合，与"以易经为主"产品定位偏离
- 3 mode 减为 2 mode：架构更清晰，蓍草作为最庄重占卜方式仍保留独立 sub-tab
- 灵签 100 签数据来源决策（原 ACTION_ITEM U1）取消

---

## [v0.1.0-fortune-and-dialogue] - 2026-05-11 20:06 CDT - Phase 1 完成：占卜模块 + 对话升级

### Added
**新占卜模块（3 种方法 + AI 解读）：**
- 占卜 tab（独立顶层 tab，与问道/学易并列）
- 灵签：观音灵签 5 签原型（数据明确标注 prototype，100 签待用户确认来源）
- 梅花易数：数字起卦 + 时间起卦
- 铜钱起卦：火珠林三钱法 + 摇钱动画（统计验证 6/7/8/9 概率分布）
- `interpretFortune()` 占卜专用 LLM prompt（≤120 字建议 + 宜 + 忌）
- `QuickReading.jsx` 三种方法共用的 AI 解读卡组件

**学易对话升级：**
- 4 位作者 persona：孔子 / 文王 / 邵雍 / 朱熹（系统 prompt 风格各异）
- StudyChat 顶部 persona 切换器（点击切换 → 清空历史）
- 选中文本浮动按钮：在卦辞/彖传/象传/文言传/六爻段落选中 → 弹"问 这一句"按钮 → 点击聚焦到 StudyChat
- `useTextSelection` hook（兼容桌面 + iOS Safari）
- `SelectionPopover` 浮动组件
- StudyChat 通过 forwardRef + useImperativeHandle 暴露 focusOn 给父组件

**治理：**
- ERROR_LOG E001-E005 全部记录（Forgejo MCP / React 19 lint / dev port collision / Forgejo push 失败 / pipe 吞 exit code）
- 4 个 slash commands + 3 个 skills + 时间 hook + 4 期 PROJECT.md

### Changed
- studyChat.js 完全重写，支持 persona / selectedText / book 参数（book 当前固定 'yijing'，二期扩）
- DivinationHistory.jsx + NoteEditor.jsx：修 React 19 react-hooks 严格模式错误
- Navigation.jsx：3 个 tab
- App.jsx：mode 加 'fortune' 分支
- docs/MOBILE_TEST_SOP.md：加 dev server 启动前检查
- docs/PRE_MERGE_CHECKLIST.md + checkpoint command + skills：禁用 lint pipe（保 exit code）

### Deferred to Phase 2
- LessonReader 选中追问集成（课程内容没有 chat 目标，等通用 ClassicReader 落地后再做）
- 灵签 100 签完整数据
- studyChat book 参数实际投入使用（论语/孟子等）

### Known Issue
- Forgejo backup remote 自 2026-05-11 19:31 起 server-side unpacker error（E004）。本期所有 commit 在本地，待 Forgejo 恢复时 push（4 个 commit 累积：0b3fe6c / 9afe3b1 / 196b87a / 167ac38 / f1413ac / 0d75fc5 / 5d8a308）。

### Commits in this release
```
5d8a308 feat(study): text-selection popover wired to StudyChat focus (Phase 1.9 + 1.10)
0d75fc5 feat(study): multi-persona dialogue (Phase 1.6 + 1.7 + 1.8)
f1413ac docs(governance): B2 + B3 — harden dev-server SOP + lint/build exit-code discipline
196b87a fix(fortune): remove dead Placeholder code from Fortune.jsx + log E005
9afe3b1 docs(governance): A2 done — update PROGRESS + ACTION_ITEMS
167ac38 feat(fortune): add interpretFortune AI + QuickReading shared component (Phase 1.5 / A5)
9fe7cce feat(fortune): add Guan Yin Ling Qian prototype with 5 signs (Phase 1.4 / A4)
9afe3b1 docs(governance): A2 done — update PROGRESS + ACTION_ITEMS
f5cef17 feat(fortune): implement Mei Hua Yi Shu (Phase 1.2)
0b3fe6c fix(react19): resolve react-hooks lint errors (B1)
86146a5 docs(governance): A1 done — log E002 (pre-existing lint) + update tracking
07674e2 feat(fortune): add tab routing + Fortune container skeleton (Phase 1.1)
```

---

## [v0.0.2-governance] - 2026-05-10 21:31 CDT - 治理系统加固
- Renamed `LESSONS.md` → `ERROR_LOG.md`（更直白）
- 新增 `ACTION_ITEMS.md`（当前 sprint 实际在做的事，与 PROJECT.md 远期分离）
- 新增 3 个真 skill（`.claude/skills/` 下，按上下文自动触发）：error-logger / safe-backup / phase-checkpoint
- Renamed slash command `/log-failure` → `/log-error`
- 所有 tracking 文件强制 `HH:MM TZ` 时间戳（不能只写日期）
- 补全 E001 / CHANGELOG 历史 entry 的时间字段

### Phase 1（占卜模块 + 易经对话升级，待启动）

---

## [v0.0.1-governance] - 2026-05-10 16:43 CDT - 治理系统建立 v1（被 v0.0.2 取代部分约定）

### Added
- `PROJECT.md` 跨 session 总控文件（含全 4 期路线图）
- `CHANGELOG.md` 版本化变更记录（本文件）
- `PROGRESS.md` 时间线工作日志
- `LESSONS.md` 失败教训库
- `SOURCES.md` 数据来源声明
- `docs/PRE_MERGE_CHECKLIST.md` 合并 main 前清单
- `docs/MOBILE_TEST_SOP.md` 手机端测试流程
- `docs/decisions/` 架构决策记录目录（ADR）
- `.claude/commands/backup.md` `/backup` 命令
- `.claude/commands/checkpoint.md` `/checkpoint` 命令
- `.claude/commands/log-failure.md` `/log-failure` 命令
- `.claude/commands/premerge.md` `/premerge` 命令
- `.claude/settings.local.json` 加 SessionStart hook 自动注入当前时间
- Forgejo 备份 remote `forgejo` (nexus.xinle.biz/git/ailearnandgrowth/guanyi)

### Changed
- `CLAUDE.md`：加"先读 PROJECT.md"指引；区分 GitHub vs Forgejo push 策略

---

## [v0.0.0-initial] - 2026-04 (具体时间未记录，回溯估算)

初始易经 App 状态：
- 蓍草问道模式（18 次取草模拟 + 五层卦象 + AI 解读）
- 学易模式（64 卦浏览 + 9 课入门 + 词条 + 与大师对话）
- 宣纸墨韵 UI（src/styles/tokens.css）
- LLM upstream：DeepSeek，前端 → Cloudflare Worker (api.guanyi.me) → DeepSeek
- 部署：GitHub Pages（origin/main 自动部署）
