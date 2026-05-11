---
description: Run the full pre-merge-to-main checklist before deploying to GitHub Pages. ONLY way to push to GitHub.
---

执行 `docs/PRE_MERGE_CHECKLIST.md` 的全清单。这是 **Phase 4** 的第一步，也是 **唯一允许 push to GitHub 的路径**。

## 步骤

1. **读 checklist**：`docs/PRE_MERGE_CHECKLIST.md`，逐项检查
2. **自动跑：**
   - `npm run lint`
   - `npm run build`
   - `git ls-files | grep -E '\.env(\..*)?$'` —— 确认 .env 没被 track
   - `git ls-remote forgejo claude/naughty-booth-4d532f` —— 确认最新 commit 已备份
3. **提示用户手动项**：
   - 手机端测试（按 `docs/MOBILE_TEST_SOP.md` 走）
   - 用户验收（"我看过了，可以 merge"）
4. **如果有任何项 ❌**：列出具体问题，停止，不进入 merge
5. **如果全部 ✅，且用户明确说"可以 merge"**，才执行：
   ```bash
   git checkout main
   git merge --no-ff claude/naughty-booth-4d532f -m "Merge Phase X: <摘要>"
   git push origin main         # ⚠️ 触发 GitHub Pages 部署
   git push origin --tags
   ```
6. **验证生产**：提供 GitHub Pages URL，让用户开手机扫码看
7. **生产出问题怎么办**：
   - **不要 hotfix 到 main**
   - 立即 `git revert -m 1 <merge-commit>` 回滚
   - 在 ERROR_LOG.md 记录原因
   - 回到 worktree 分支修复后重走 `/premerge`

## 安全约束

⚠️ **这是唯一允许 push to GitHub 的命令**。其他时候用 `/backup`。
⚠️ 用户口头说"看起来没问题"不算批准——必须明确说"可以 merge"。
⚠️ Phase 1/2/3 的 checkpoint **不**用此命令；只在阶段性向公网发布时用。
