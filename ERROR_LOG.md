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

## E003 — 2026-05-10 22:02 CDT — Dev server 端口冲突导致用户看到旧代码

**现象**：A2 完成后让用户用 `http://localhost:5173/` 测试，用户报"没看到占卜"。core 是 worktree 代码已正确包含占卜 tab，build 也通过，但浏览器显示旧 UI。

**根因**：
- 用户的另一个 vite 进程（PID 30327, cwd=主仓库 `/Users/dz/Documents/Yijing App (Claude Code)`）已在 `localhost:5173` LISTEN，serving 主仓库 main 分支的旧代码（无占卜 tab）
- 我用 `npm run dev -- --host` 启动新 vite，绑 `*:5173`（所有接口）。**两个进程同时在 5173，但绑的 socket 不同**：
  - 旧 vite: `localhost:5173` (IPv6 loopback)
  - 新 vite: `*:5173` (catch-all)
- `http://localhost:5173/` 命中旧 vite → 用户看到主仓库代码
- `http://192.168.1.6:5173/` 命中新 vite → worktree 代码
- 我两个 URL 都给了用户，但用户点了 localhost → 看到旧版

**教训**：
1. 启 dev server 前必须检查目标端口是否被占用（`lsof -i :PORT -sTCP:LISTEN`）
2. 给用户的 URL 必须**无歧义**指向我启的服务，不能假设 localhost 等于我启的
3. worktree 工作流下，**永远用非默认端口**（5199 等），避免和用户在主仓库的并行 dev 冲突
4. 启动后立即 curl 验证 serving 的代码版本对（看 fileName 路径或注释）

**防范机制**：
- ✅ 已切到端口 5199，验证 fileName 路径来自 worktree
- 📋 在 docs/MOBILE_TEST_SOP.md 加一节"启动 dev server 前必做的检查"
- 📋 提议建一个 `/dev` slash command：自动选空闲端口 + 启动 + curl 验证 + 报告 URL（候选，待用户确认）
- 📋 ACTION_ITEMS.md 加 B2：更新 MOBILE_TEST_SOP

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
