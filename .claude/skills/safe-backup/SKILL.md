---
name: safe-backup
description: Use when the user asks to "back up", "save progress", "备份", "保存进度", or after completing a meaningful chunk of work and wanting to checkpoint it. Commits any pending changes with a Conventional Commit message and pushes the current feature branch to GitHub origin (never main — pushing main triggers production deploy). Updates PROGRESS.md with timestamp.
---

# Safe Backup Skill

Backup current work by pushing the current **feature branch** to GitHub origin.

> 备份去向 2026-05-18 更改：forgejo 远端已弃用。备份改推 GitHub origin 的功能分支。
> 只有 `main` 分支会触发 Cloudflare Pages 生产部署，推功能分支不会上线。

## Steps

1. **Get current timestamp**:
   ```bash
   date "+%Y-%m-%d %H:%M %Z"
   ```

2. **Confirm branch is NOT main**:
   ```bash
   git branch --show-current
   ```
   If it returns `main`: STOP. This skill never pushes main.

3. **Check git status**:
   ```bash
   git status --short
   ```

4. **If no changes**: report "nothing to back up, last commit already on origin", verify with `git ls-remote origin "$(git branch --show-current)"` and exit.

5. **If changes exist**:
   - Group changes logically (don't lump unrelated changes into one commit)
   - For each group, stage specific files (no `git add -A`)
   - Commit with Conventional Commits format: `<type>(<scope>): <subject>`
     - Types: feat / fix / docs / chore / refactor / style
     - Example: `feat(fortune): add Mei Hua Yi Shu input UI`

6. **Push the feature branch to origin**:
   ```bash
   git push origin "$(git branch --show-current)"
   ```

7. **Verify backup is visible**:
   ```bash
   git ls-remote origin "$(git branch --show-current)"
   ```
   Confirm the latest commit hash matches local `git log -1 --format=%H`.

8. **Update `PROGRESS.md`**: prepend a new dated entry at the top, format:
   ```
   ## YYYY-MM-DD HH:MM TZ — <一句话标题>

   - <做了什么>
   - <commit hash + 简述>
   - 备份状态：✅ origin/<branch> 已同步
   ```

9. **Report**: commit hash(es), origin verification result, PROGRESS.md update summary.

## Strict Rules

- **Never push `main`** — pushing main triggers the Cloudflare Pages production deploy. That is `/premerge` only. This skill pushes the feature branch only.
- **Never** run on `main` branch.
- **Never** use `git add -A` or `git add .` — always specify files.
- If push fails: do NOT retry blindly. Diagnose (auth issue? network? wrong branch?), report, possibly invoke error-logger skill.
- All timestamps must include HH:MM TZ.
- **Never pipe verification commands** (`npm run lint`, `npm run build`, tests) through `tail`/`head` before checking exit code. Pipes mask failures. See ERROR_LOG E005.
