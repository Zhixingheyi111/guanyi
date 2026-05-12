# Changelog

观易 App 版本变更记录。每次完成 Phase 后添加新版本条目。遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

格式：`[版本号] - YYYY-MM-DD HH:MM TZ - 标题`，分 Added / Changed / Removed / Fixed / Security 五类。

**所有版本必须有 HH:MM TZ**（不能只写日期）。获取：`date "+%Y-%m-%d %H:%M %Z"`

---

## [Unreleased]

（Phase 1 已完成；下个版本 v0.2.0-classics-9 在 Phase 2 启动后开始累积）

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
