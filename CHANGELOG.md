# Changelog

观易 App 版本变更记录。每次完成 Phase 后添加新版本条目。遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

格式：`[版本号] - YYYY-MM-DD HH:MM TZ - 标题`，分 Added / Changed / Removed / Fixed / Security 五类。

**所有版本必须有 HH:MM TZ**（不能只写日期）。获取：`date "+%Y-%m-%d %H:%M %Z"`

---

## [Unreleased]

### v0.0.2-governance（待 commit，2026-05-10 21:28 CDT 起）
- Renamed `LESSONS.md` → `ERROR_LOG.md`（更直白）
- 新增 `ACTION_ITEMS.md`（当前 sprint 实际在做的事，与 PROJECT.md 远期分离）
- 新增 3 个真 skill（`.claude/skills/` 下，按上下文自动触发）：error-logger / safe-backup / phase-checkpoint
- Renamed slash command `/log-failure` → `/log-error`
- 所有 tracking 文件强制 `HH:MM TZ` 时间戳（不能只写日期）
- 补全 E001 / CHANGELOG 历史 entry 的时间字段

### Phase 1（占卜模块 + 易经对话升级，待启动）

---

## [v0.0.1-governance] - 2026-05-10 16:43 CDT - 治理系统建立 v1

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
