# Lessons Learned

记录失败和教训，**确保同样的错误不发生第二次**。

每条 Lesson 必须包含 5 个字段：
- **日期**
- **现象**：发生了什么
- **根因**：为什么会发生
- **教训**：从中学到什么 generalizable 的东西
- **防范机制**：hook / skill / 文档 / 流程，怎么确保下次不再犯

新 lesson 加在最上方（倒序），ID 递增（L001, L002, ...）。

---

## L001 — 2026-05-10 — Forgejo MCP 没有创建 repo 的工具

**现象**：在策划自动化备份流程时，假定 Forgejo MCP 能创建空 repo，结果工具列表里只有 list/search 类的 read 工具和 issue/PR/wiki/release 的写工具，**没有** `create_repository`。

**根因**：Forgejo MCP 的实现侧重于读和协作流程（issue/PR），不暴露管理员级别的 repo 创建。

**教训**：MCP 工具不是万能的。任何"我自动建 X"的承诺，必须先确认对应工具存在；否则要明确告知用户需要手动操作。

**防范机制**：
- PROJECT.md 的 Phase 0 步骤里明确标注 "用户操作"（如 `0.3 用户在 Forgejo 创建空 repo`）
- 未来对 MCP 能力的假设要先用 ToolSearch 确认
