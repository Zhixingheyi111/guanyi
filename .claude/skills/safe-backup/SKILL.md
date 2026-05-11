---
name: safe-backup
description: Use when the user asks to "back up", "save progress", "备份", "保存进度", or after completing a meaningful chunk of work and wanting to checkpoint it. Commits any pending changes with a Conventional Commit message and pushes the current worktree branch to the Forgejo backup remote (NEVER to GitHub). Updates PROGRESS.md with timestamp.
---

# Safe Backup Skill

Backup current work to Forgejo. **Never touches GitHub.**

## Steps

1. **Get current timestamp**:
   ```bash
   date "+%Y-%m-%d %H:%M %Z"
   ```

2. **Check git status**:
   ```bash
   git status --short
   ```

3. **If no changes**: report "nothing to back up, last commit already on Forgejo", verify with `git ls-remote forgejo` and exit.

4. **If changes exist**:
   - Group changes logically (don't lump unrelated changes into one commit)
   - For each group, stage specific files (no `git add -A`)
   - Commit with Conventional Commits format: `<type>(<scope>): <subject>`
     - Types: feat / fix / docs / chore / refactor / style
     - Example: `feat(fortune): add Mei Hua Yi Shu input UI`

5. **Push to Forgejo**:
   ```bash
   git push forgejo claude/naughty-booth-4d532f
   ```

6. **Verify backup is visible**:
   ```bash
   git ls-remote forgejo claude/naughty-booth-4d532f
   ```
   Confirm the latest commit hash matches local `git log -1 --format=%H`.

7. **Update `PROGRESS.md`**: prepend a new dated entry at the top, format:
   ```
   ## YYYY-MM-DD HH:MM TZ — <一句话标题>

   - <做了什么>
   - <commit hash + 简述>
   - 备份状态：✅ Forgejo 已同步
   ```

8. **Report**: commit hash(es), Forgejo verification result, PROGRESS.md update summary.

## Strict Rules

- **Never push to `origin` (GitHub)** — that triggers GitHub Pages deploy. Forgejo only.
- **Never** run on `main` branch.
- **Never** use `git add -A` or `git add .` — always specify files.
- If push fails: do NOT retry blindly. Diagnose (auth issue? network? wrong branch?), report, possibly invoke error-logger skill.
- All timestamps must include HH:MM TZ.
