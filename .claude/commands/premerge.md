---
description: Run the full pre-merge-to-main checklist before deploying to production (Cloudflare Pages). The ONLY sanctioned way to push main.
---

执行 `docs/PRE_MERGE_CHECKLIST.md` 的全清单。这是 **唯一允许 merge 到 main / 推 main 的路径** ——
推 `main` 会触发 **Cloudflare Pages** 生产部署（生产地址 https://guanyi.pages.dev）。

> 注：`/backup`、`/checkpoint` 也会 push 到 GitHub origin，但推的是**功能分支**、不触发部署。
> 只有 `main` 是部署分支，只有 `/premerge` 能动它。

## 步骤

1. **读 checklist**：`docs/PRE_MERGE_CHECKLIST.md`，逐项检查
2. **自动跑：**
   - `npm run lint`
   - `npm run build`
   - `git ls-files | grep -E '\.env(\..*)?$'` —— 确认 .env 没被 track（`.env.example` 模板可以在）
   - `git ls-remote origin "$(git branch --show-current)"` —— 确认功能分支最新 commit 已备份到 origin
3. **提示用户手动项**：
   - 手机端测试（按 `docs/MOBILE_TEST_SOP.md` 走）
   - 用户验收（"我看过了，可以 merge"）
4. **如果有任何项 ❌**：列出具体问题，停止，不进入 merge
5. **如果全部 ✅，且用户明确说"可以 merge"**，才执行（在 main 仓库目录操作）：
   ```bash
   BRANCH="$(git branch --show-current)"
   git checkout main
   git merge --no-ff "$BRANCH" -m "Merge: <摘要>"
   git push origin main         # ⚠️ 触发 Cloudflare Pages 生产部署
   git push origin --tags       # 若本次有 phase tag
   ```
6. **验证生产**：提供生产地址 https://guanyi.pages.dev ，让用户开手机看；Cloudflare Pages 构建约 1–2 分钟
7. **生产出问题怎么办**：
   - **不要 hotfix 到 main**
   - 立即 `git revert -m 1 <merge-commit>` 回滚，再 `git push origin main`
   - 在 ERROR_LOG.md 记录原因
   - 回到 worktree 分支修复后重走 `/premerge`

## 安全约束

⚠️ **这是唯一允许 merge 到 main / 推 main 的命令**。日常备份用 `/backup`（只推功能分支）。
⚠️ 用户口头说"看起来没问题"不算批准——必须明确说"可以 merge"。
⚠️ Phase 1/2/3 的 checkpoint **不**用此命令；只在阶段性向公网发布时用。
