---
description: End-of-phase ritual — verify, commit, tag, backup. Args = phase number (e.g. 1.6 or v0.1.0)
---

执行 Phase 完成的检查点仪式。

`$ARGUMENTS` 是当前 Phase 编号（如 `1.6`）或目标 tag（如 `v0.1.0-fortune`）。

## 步骤

1. **验证 Phase 完成度**
   - 读 `PROJECT.md`，确认当前 Phase 所有子任务都已 ✅
   - 如果还有未完成项：停止，列出未完成项，不进入后续步骤

2. **代码质量**
   - 跑 `npm run lint`，**必须通过**
   - 跑 `npm run build`，**必须通过**
   - 任一失败：停止，报告问题，不要"修了再 commit"——先让用户知道

3. **更新文档**
   - `CHANGELOG.md`：加新版本条目（含日期、所有变更、文件清单）
   - `PROGRESS.md`：在顶部加 session 进度记录
   - `PROJECT.md` "当前任务"区块：标记完成 + 设置下一个 Phase

4. **Commit**
   - 用 conventional commit 格式：`chore(release): Phase X 完成 → vX.Y.Z`
   - 包含完整的变更摘要在 commit body

5. **Tag**
   - `git tag vX.Y.Z-<phase-slug>` (例：`v0.1.0-fortune-and-dialogue`)

6. **Push 到 forgejo**
   - `git push forgejo claude/naughty-booth-4d532f --tags`
   - **不动 GitHub**

7. **报告**
   - 版本号、tag、CHANGELOG 摘要
   - 下一 Phase 的第一个待办

## 安全约束

⚠️ 任何步骤失败都停止，不要带病 commit。
⚠️ tag 一旦推到 forgejo，不要重复使用同一 tag 名（语义版本）。
