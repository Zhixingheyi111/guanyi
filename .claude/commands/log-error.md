---
description: Log an error/failure to ERROR_LOG.md with timestamp, root cause, lesson, prevention. Same mistake never happens twice.
---

把刚才发生的错误记录到 `ERROR_LOG.md`。`$ARGUMENTS` 通常是用户给的失败简述。

## 步骤

1. **取当前时间戳**（必须 HH:MM 精度，不能只写日期）：
   ```bash
   date "+%Y-%m-%d %H:%M %Z"
   ```

2. 读 `ERROR_LOG.md`，看下一个 ID 编号（`E001`, `E002`, ...）。

3. 在 `---` 分隔线之后、最新条目之前，插入新 entry。**6 字段全填**：
   - **ID**：`Exxx`
   - **时间**：步骤 1 的输出，格式 `YYYY-MM-DD HH:MM TZ`
   - **现象**：一句话描述发生了什么（基于 `$ARGUMENTS` + 对话上下文）
   - **根因**：为什么会这样（可能需要回看代码 / 想几秒）
   - **教训**：从中学到什么 generalizable 的东西，不要太具体
   - **防范机制**：hook / skill / 文档更新 / 流程改动，怎么确保下次不再犯

4. 如果防范机制是"加 hook"或"加 skill"，**只提议、不立即建** —— 告诉用户先确认。

5. 如果这条 lesson 应跨 session 持久（比如"DeepSeek 不支持 X 参数"），**也存为 memory**：
   - 写到 `~/.claude/projects/-Users-dz-Documents-Yijing-App--Claude-Code-/memory/error_<slug>.md`
   - 加到那目录的 `MEMORY.md` 索引

6. Commit：`docs(errors): E00N - <现象简述>`

7. `/backup`（push 到 forgejo）

## 报告

- error ID 和标题
- 是否提议建 hook/skill / 加 memory
- 已 push 到 forgejo（commit hash + 验证）

## 严格规则

- **时间字段必填**，必须 HH:MM TZ（不能只写日期）
- **不能跳过任何字段**，宁可写"待补"也不能省略
- 不 push 到 GitHub origin（forgejo only）

## 例子

```
## E007 — 2026-08-15 14:23 CDT — DeepSeek tool_choice 不接受 "auto" 字符串

**现象**：调用 chat completion 时传 tool_choice: "auto" 报 400
**根因**：DeepSeek API 只支持 "none" 或具体工具对象
**教训**：所有"OpenAI 兼容"upstream 都要按实际 spec 测，不能假定 100% 兼容
**防范机制**：在 src/utils/claudeApi.js 加注释说明此约束；存为 memory
```
