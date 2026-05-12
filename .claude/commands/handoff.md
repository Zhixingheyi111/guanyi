---
description: Generate a self-contained handoff prompt to continue work in a fresh chat (when context fills up)
---

生成 session 接班 prompt 给用户复制粘贴到新 chat。

详细模板和字段说明：[docs/HANDOFF_PROMPT.md](../../docs/HANDOFF_PROMPT.md)

## 快速步骤

1. 取当前时间：`date "+%Y-%m-%d %H:%M %Z"`
2. 收集状态：
   - `cat PROJECT.md | sed -n '/^# 当前任务/,/^---$/p'` 或读"当前任务（动态更新区）"
   - `head -50 PROGRESS.md` 看顶部一条
   - `git log --oneline -5`
   - `git status --short`
   - `git ls-remote forgejo claude/naughty-booth-4d532f | head -1`（对比本地 HEAD）
   - 读 `ACTION_ITEMS.md` 的进行中 + 待做前 3 条
3. 按 `docs/HANDOFF_PROMPT.md` 模板填空
4. **输出时整段包在 ``` ``` 代码块里**，让用户一键复制
5. 末尾告诉用户："👆 复制方框里的内容到新 chat。"

## 安全约束

- 不要把 .env 内容、API key、密码塞进 handoff prompt
- 不要 push 到 GitHub
- 输出后不要继续做别的事，等用户决定是否切换 session
