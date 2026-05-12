---
description: End-of-phase ritual — verify, commit, tag, backup. Args = phase number (e.g. 1.6 or v0.1.0)
---

执行 Phase 完成的检查点仪式。

`$ARGUMENTS` 是当前 Phase 编号（如 `1.6`）或目标 tag（如 `v0.1.0-fortune`）。

## 步骤

1. **验证 Phase 完成度**
   - 读 `PROJECT.md`，确认当前 Phase 所有子任务都已 ✅
   - 如果还有未完成项：停止，列出未完成项，不进入后续步骤

2. **代码质量（严禁用 pipe 截输出，参见 E005）**
   - 跑 `npm run lint`（**独立运行，不要用 `| tail` 或 `| head`，否则 exit code 会被吞**）
   - 看 `echo "rc=$?"` 必须为 0
   - 跑 `npm run build`（同样独立）
   - 看 `echo "rc=$?"` 必须为 0
   - 任一非 0：停止，报告问题。不要把 lint/build 命令塞进 `&&` 链里，那会让失败混进 commit

3. **更新文档**（**所有时间戳必须 HH:MM TZ**：`date "+%Y-%m-%d %H:%M %Z"`）
   - `CHANGELOG.md`：加新版本条目，header 含 `vX.Y.Z - YYYY-MM-DD HH:MM TZ - 标题`
   - `PROGRESS.md`：在顶部加 session 进度记录，header 同样含 HH:MM TZ
   - `PROJECT.md` "当前任务"区块：标记完成 + 设置下一个 Phase + 更新"当前时间最后更新"
   - `ACTION_ITEMS.md`：把当前 Phase 的 actions 移到"已完成" + 加完成时间

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
