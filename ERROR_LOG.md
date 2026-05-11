# Error Log

记录错误和教训，**确保同样的错误不发生第二次**。

## 必填字段（缺一不可）

每条记录必须包含：

| 字段 | 说明 |
|---|---|
| **ID** | 递增编号 `E001`, `E002`, ... |
| **时间** | `YYYY-MM-DD HH:MM TZ`（**精确到分钟，不能只写日期**） |
| **现象** | 一句话：发生了什么 |
| **根因** | 为什么会发生 |
| **教训** | 从中学到什么 generalizable 的东西 |
| **防范机制** | hook / skill / 文档 / 流程，怎么确保下次不再犯 |

新条目加在最上方（倒序排列）。

获取标准时间戳：`date "+%Y-%m-%d %H:%M %Z"`

---

## E002 — 2026-05-10 21:38 CDT — npm run lint 有 2 个 pre-existing React Hooks 错误

**现象**：A1 完成后跑 `npm run lint`，报 2 个 error：
- `src/components/DivinationHistory.jsx:144` — `react-hooks/set-state-in-effect`（在 effect 里直接 setState）
- `src/components/NoteEditor.jsx:53` — `react-hooks/refs`（render 期间 mutate ref）

**根因**：项目已升级到 React 19.2，`eslint-plugin-react-hooks` 新版加入了这两条规则。代码本身没变，是规则变严格了。这两个文件 A1 没动过。

**教训**：升级框架/lint 配置后，一定先跑一遍 lint 把 baseline 摸清，否则后续任何 PR 都会被 pre-existing 错误污染、责任难分。

**防范机制**：
- ACTION_ITEMS.md 加阻塞项 **B1：修 React Hooks lint 错误**，必须在 Phase 1.11 `/checkpoint` 之前完成（否则 lint 卡住，Phase 1 无法 tag）
- 未来所有 framework 升级 commit 必须含一个 lint baseline 步骤
- 不在本 commit 里偷修这两个 bug —— 保持 A1 scope 干净

---



**现象**：在策划自动化备份流程时，假定 Forgejo MCP 能创建空 repo，结果工具列表里只有 list/search 类的 read 工具和 issue/PR/wiki/release 的写工具，**没有** `create_repository`。

**根因**：Forgejo MCP 的实现侧重于读和协作流程（issue/PR），不暴露管理员级别的 repo 创建。

**教训**：MCP 工具不是万能的。任何"我自动建 X"的承诺，必须先确认对应工具存在；否则要明确告知用户需要手动操作。

**防范机制**：
- PROJECT.md 的 Phase 0 步骤里明确标注 "用户操作"（如 `0.3 用户在 Forgejo 创建空 repo`）
- 未来对 MCP 能力的假设要先用 ToolSearch 确认
