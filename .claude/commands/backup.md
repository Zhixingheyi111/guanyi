---
description: Commit pending changes (if any) and push current branch to Forgejo backup. Does NOT touch GitHub.
---

执行进度备份到 Forgejo。

## 步骤

1. `git status --short` — 检查有无未 commit 的改动
2. 如果有未 commit 改动：
   - 用 Conventional Commits 格式 commit（feat / fix / docs / chore / refactor）
   - 例：`feat(fortune): add Mei Hua Yi Shu input UI`
   - **绝不**使用 `git add -A`，按文件名添加
3. `git push forgejo claude/naughty-booth-4d532f`
4. `git ls-remote forgejo claude/naughty-booth-4d532f` — 验证最新 commit hash 在远端可见
5. 在 `PROGRESS.md` 顶部加一条时间戳记录。**时间格式必须 HH:MM TZ**：`date "+%Y-%m-%d %H:%M %Z"`
6. 报告：commit hash、Forgejo 验证结果、PROGRESS.md 更新摘要

## 安全约束

⚠️ **绝不 push 到 origin (GitHub)**，那会触发 GitHub Pages 部署。本命令只动 forgejo remote。
⚠️ 不在 main 分支执行此命令。
⚠️ 失败时：先 `/log-failure` 记录原因，再修复。
