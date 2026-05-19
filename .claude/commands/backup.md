---
description: Commit pending changes (if any) and push the current feature branch to GitHub origin. Never pushes main.
---

执行进度备份：把当前功能分支推到 GitHub origin。

> 备份去向 2026-05-18 更改：forgejo 远端已弃用，备份改推 GitHub origin 的**功能分支**。
> 只有 `main` 分支会触发 Cloudflare Pages 部署，推功能分支不会上线。

## 步骤

1. `git branch --show-current` — 确认当前分支**不是 main**
2. `git status --short` — 检查有无未 commit 的改动
3. 如果有未 commit 改动：
   - 用 Conventional Commits 格式 commit（feat / fix / docs / chore / refactor）
   - 例：`feat(fortune): add Mei Hua Yi Shu input UI`
   - **绝不**使用 `git add -A`，按文件名添加
4. `git push origin "$(git branch --show-current)"`
5. `git ls-remote origin "$(git branch --show-current)"` — 验证最新 commit hash 在远端可见
6. 在 `PROGRESS.md` 顶部加一条时间戳记录。**时间格式必须 HH:MM TZ**：`date "+%Y-%m-%d %H:%M %Z"`
7. 报告：commit hash、origin 验证结果、PROGRESS.md 更新摘要

## 安全约束

⚠️ **绝不在此命令里 push `main`**。推 main = 触发 Cloudflare Pages 生产部署，那是 `/premerge` 的事。
⚠️ 不在 main 分支执行此命令——本命令只推功能分支。
⚠️ 失败时：先 `/log-error` 记录原因，再修复。
