---
description: Log a failure to LESSONS.md so the same mistake doesn't happen twice
---

把刚才发生的失败记录到 `LESSONS.md`，用户用此命令时通常会带 `$ARGUMENTS` 简述失败现象。

## 步骤

1. 读 `LESSONS.md`，看下一个 ID 编号（L001, L002, ...）
2. 在文件中"---"分隔之后、最新条目之前插入新 lesson
3. 必须包含 5 个字段（缺一不可）：
   - **日期**：用 `date "+%Y-%m-%d"`
   - **现象**：一句话描述发生了什么（基于 `$ARGUMENTS` + 对话上下文）
   - **根因**：为什么会这样（可能需要回看代码 / 想几秒）
   - **教训**：从中学到什么 generalizable 的东西，不要太具体
   - **防范机制**：hook / skill / 文档更新 / 流程改动，怎么确保下次不再犯
4. 如果防范机制是"加 hook"或"加 skill"，**只提议、不立即建** —— 告诉用户先确认
5. 如果这条 lesson 适合跨 session 持久（比如"DeepSeek 不支持 X 参数"），**也存为 memory**：
   - 写到 `~/.claude/projects/-Users-dz-Documents-Yijing-App--Claude-Code-/memory/lesson_<slug>.md`
   - 加到 `MEMORY.md` 索引
6. Commit：`docs(lessons): L00N - <现象简述>`
7. `/backup`（push 到 forgejo）

## 报告

- lesson ID 和标题
- 是否提议建 hook/skill / 加 memory
- 已 push 到 forgejo

## 例子

```
L007 — 2026-08-XX — DeepSeek tool_choice 不接受 "auto" 字符串
现象：调用 chat completion 时传 tool_choice: "auto" 报 400
根因：DeepSeek API 只支持 "none" 或具体工具对象
教训：所有"OpenAI 兼容"upstream 都要按实际 spec 测，不能假定 100% 兼容
防范机制：在 src/utils/claudeApi.js 加注释说明此约束；存为 memory
```
