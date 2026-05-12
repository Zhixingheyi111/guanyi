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

## E006 — 2026-05-11 20:51 CDT — Worktree 缺 .env + 铜钱起卦 6 爻只显示 5 爻

用户 Phase 1 验收时报两个 bug，一并修：

### 6a. AI 解读全部报"密钥配置错误"

**现象**：占卜（梅花/铜钱/灵签）的 AI 解读卡显示 "AI 解读暂未取得：密钥配置错误"。

**根因**：worktree 根目录**没有 `.env` 文件**。`.env` 在主仓库 `/Users/dz/Documents/Yijing App (Claude Code)/.env` 存在并包含 `VITE_APP_SECRET`，但 worktree 是独立工作目录、`.env` 在 `.gitignore` 不进 git，所以 git worktree add 时未带过来。Vite 读不到 secret → claudeApi.js `if (!appSecret) throw new Error('密钥配置错误')`。

**教训**：worktree 工作流下，env 文件（gitignored）需要单独从主仓库复制。这跟在 fresh clone 一样。

**防范机制**：
- ✅ 已 `cp ../../../.env .env`（已复制）
- 📋 docs/MOBILE_TEST_SOP.md 加一节"worktree 初次启动前：cp ../../../.env ."
- 📋 dev server 启动前可做一个 sanity check：`[ -f .env ] || echo "⚠️ 缺 .env"`

### 6b. 铜钱起卦的 6 爻只显示 5 爻，上爻位置一直是 pending 虚线

**现象**：用户铜钱起完一卦（家人 → 既济，动·上爻），但 yao 列上爻位置显示为 pending 虚线，仿佛第 6 爻没被揭示。同时五爻位置显示"老阳·动"，但 changingPositions 的文字描述说"动·上爻"，两者矛盾。

**根因**（未完全确证，倾向于以下推测）：原代码用 `setRevealedYaos(prev => [...prev, full.yaos[i]])` append 模式 + 6 次 setInterval 调用。当第 6 次 setRevealedYaos 与紧随其后的 `setTimeout(setPhase('done'), 700)` 时序耦合时，可能因 React 19 strict mode 的 effect 双调用或某种状态更新被吞，导致只 append 了 5 次。同时五爻显示"老阳·动"是因为 result（castTongQian 一次性算出 6 爻）的 yaos[4] 真的是 老阳，但 changingPositions 数组里只有 [5]（上爻才是变爻），五爻只是 yang 阳爻。也就是说之前的 YaoRow 把 result.yaos[4] 的 sum=9（老阳）信息误以为是"动爻"——但读 castTongQian 代码 `isChanging = sum === 6 || sum === 9` 确实 sum=9 也是 isChanging=true！

**真正根因**：castTongQian 里 `isChanging = sum === 6 || sum === 9` —— **任何老阳/老阴爻都被标 isChanging=true**，但 YaoRow 显示它"·动"。这不是 bug。但**展示一致性问题**：YaoRow 自己判断"动"用 yao.isChanging，而 changingPositions 也是按 isChanging 过滤。这两者应该一致。

我重新看图：五爻"老阳·动"——result.yaos[4].isChanging=true 是对的。changingPositions=[4, 5]（如果上爻 sum=9 也是老阳）。但显示说"动·上爻"——单复数都对，"上爻" 是 POSITION_NAMES[5]，但应该也提五爻。

可能 changingPositions 只有 [4]，上爻没被推到 revealedYaos，所以上爻是 pending，文字说"动·上爻"是从 result.changingPositions=[5] 来的（result 是全 6 爻产出的，包括 yaos[5]），所以 result 知道上爻动，但 revealedYaos 不知道。

→ 结论：bug 是 **revealedYaos 最后一次 append 没成功**。重构成 `progress` 计数 + 直接渲染 `result.yaos[i]` 消除 append 漂移，即彻底防止此 race。

**教训**：
- 用 append 模式分批推 N 次状态更新时，最后一次容易被时序问题吞掉
- 单一 source of truth（pre-compute 全部 + 逐步显示）比"逐步累积状态"更稳健
- 测试动画化的状态机时，应该模拟完整时长后断言状态

**防范机制**：
- ✅ 已重构 TongQian.jsx 用 progress 计数模式（commit 待）
- 📋 类似的"分批揭示"场景未来都应用 progress 模式

---

## E005 — 2026-05-11 19:37 CDT — `lint | tail && commit` 让 lint error 漏过，dead code 进了 commit `9fe7cce`

**现象**：A4 完成时跑命令链 `npm run lint 2>&1 | tail -3 && npm run build && git commit ...`。lint 实际有 1 error（`Fortune.jsx` 里 `current` 变量 + `Placeholder` 函数因 sub-tab 全部接真组件后变成 dead code），但 commit 9fe7cce 还是成功了。

**根因**：`npm run lint | tail` 中 `tail` 的 exit code（0）覆盖了 `lint` 的 exit code（1）。`&&` 看到 0 就继续往下跑 build + commit。Bash 默认不开 `pipefail`，pipe 链的 exit code 取最后一个命令的，前面失败会被吞。

**教训**：
- `set -o pipefail` 不是默认行为；用 `cmd | tail && next` 写脚本时，`next` 永远会跑，无论 cmd 成败
- 验证步骤（lint/build/test）必须**先看 exit code**再决定是否继续；不能依赖 tail 截屏的"看起来还行"
- A4 commit 9fe7cce 现在包含 dead code（已通过 follow-up commit 修复，但 git 历史里残留一个 dirty commit）

**防范机制**：
- ✅ 已 fix Fortune.jsx 删除 `current`/`Placeholder` dead code，lint 现在 rc=0
- 📋 更新 `.claude/commands/checkpoint.md` 和 `.claude/skills/phase-checkpoint/SKILL.md`：**所有 lint/build 命令必须独立运行，不进 pipe，且必须显式检查 exit code**（写"`if ! npm run lint; then ...`"或不带 pipe）
- 📋 加 ACTION_ITEMS B3：更新 checkpoint command + skill 强制 pipefail 模式

---

## E004 — 2026-05-11 19:31 CDT — Forgejo push 失败（server-side unpacker error）

**现象**：B1 commit `0b3fe6c` 后 `git push forgejo` 第一次超时（"Failed to connect ... port 443"），第二次收到 `unpacker error` / `remote rejected`。Curl 同主机 HTTPS 返回 200，说明主机可达，是 git 服务端拒绝接收对象。

**根因**：服务端 unpacker error 通常意味着 Forgejo 服务器端无法 unpack push 来的 packfile。常见原因：磁盘满 / 用户配额 / repo 损坏 / 临时故障。客户端没法修。

**教训**：
- 远端 backup 不可保 100% 在线，**本地 commit 才是 source of truth**
- 服务端错误（"remote rejected" 不同于网络错误）不要无限重试，最多 2 次
- 一旦 forgejo 不可用，应**继续本地 commit**，定期重试 push；不要停下来等

**防范机制**：
- 本次：先继续 A3/A4/A5 等本地工作，每个 commit 后试 push 一次；最终汇报 forgejo 状态
- 长期：考虑加第二个备份 remote（GitLab/CodeBerg），单点风险大
- 短期：建议用户在 nexus.xinle.biz 后台看 disk usage / Forgejo 日志（用户可做的事）

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
