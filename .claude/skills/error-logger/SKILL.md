---
name: error-logger
description: Use when a failure, error, bug, mistake, or unexpected behavior occurs during work on the 观易 App project. Triggers on user mentions like "出错了", "失败了", "this broke", "error", "bug", "the build failed", or after Claude observes a tool call failure / lint failure / build failure. Captures the failure into ERROR_LOG.md with required fields (ID, timestamp, phenomenon, root cause, lesson, prevention) and proposes hook/skill/memory upgrades to prevent recurrence.
---

# Error Logger Skill

When invoked, log the most recent failure to `ERROR_LOG.md` so the same mistake doesn't happen twice.

## Steps

1. **Get current timestamp**:
   ```bash
   date "+%Y-%m-%d %H:%M %Z"
   ```

2. **Read `ERROR_LOG.md`** to find the next ID (E001, E002, ...).

3. **Construct the new entry** with all 6 required fields:
   - **ID**: next sequential `Exxx`
   - **时间**: from step 1, format `YYYY-MM-DD HH:MM TZ`
   - **现象**: one-sentence description of what happened (use conversation context)
   - **根因**: why did this happen (may need to think for a few seconds or look at code)
   - **教训**: generalizable lesson (not too specific to this one bug)
   - **防范机制**: concrete mechanism — hook, skill, doc update, process change

4. **Insert at top** of the entries list (after the `---` separator line, before previous newest entry).

5. **If 防范机制 includes "add hook" or "add skill"**:
   - Propose it to the user, do NOT install it without confirmation.

6. **If the lesson should persist across sessions** (e.g., "DeepSeek doesn't support X param"):
   - Also save as memory in `~/.claude/projects/-Users-dz-Documents-Yijing-App--Claude-Code-/memory/lesson_<slug>.md`
   - Add to that directory's `MEMORY.md` index.

7. **Commit + push to Forgejo**:
   - Commit message: `docs(errors): E0NN — <现象简述>`
   - Push: `git push forgejo claude/naughty-booth-4d532f`

8. **Report**:
   - The error ID and one-line summary
   - Whether you proposed a hook/skill/memory addition
   - Confirmation that it's pushed to Forgejo

## Strict Rules

- **Time field is mandatory and must include HH:MM TZ** (not just date).
- **Never** mark an error as "minor — won't log it" — every failure gets logged. The whole point is to never repeat them.
- Don't push to GitHub origin (forgejo only).

## Example output entry

```
## E007 — 2026-08-15 14:23 CDT — DeepSeek tool_choice 不接受 "auto" 字符串

**现象**：调用 chat completion 时传 tool_choice: "auto" 报 400

**根因**：DeepSeek API 只支持 "none" 或具体工具对象

**教训**：所有"OpenAI 兼容" upstream 都要按实际 spec 测，不能假定 100% 兼容

**防范机制**：在 src/utils/claudeApi.js 加注释说明此约束；存为 memory
```
