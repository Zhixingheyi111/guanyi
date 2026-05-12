# Action Items（当前可执行）

只放**当前 sprint 实际在做或马上要做**的事。远期 4 期计划在 `PROJECT.md`。

每条 action 必须有：
- 时间戳（添加时间 / 完成时间）
- 状态：📋 待做 / 🔄 进行中 / ✅ 完成 / ⏸️ 阻塞 / ❌ 取消
- 责任人（默认 Claude，"用户" 表示需要你手动做）

---

## 当前活跃项

### 🔄 进行中

无

### ⚠️ 阻塞项（Phase 1.11 /checkpoint 之前必修）

#### B1 — 修 React 19 Hooks lint 错误
- **添加时间：** 2026-05-10 21:38 CDT
- **来源：** ERROR_LOG E002
- **责任人：** Claude（修代码）；用户（确认行为是否变化）
- **影响范围：**
  - `src/components/DivinationHistory.jsx:144`（`react-hooks/set-state-in-effect`）
  - `src/components/NoteEditor.jsx:53`（`react-hooks/refs`）
- **为什么阻塞：** lint 不通过，`/checkpoint` 拒绝打 v0.1.0 tag
- **何时修：** 建议在 A5 完成后、Phase 1.11 之前；或者发现行为问题随时修

#### ✅ B3 (DONE 2026-05-11 19:42 CDT) — checkpoint command/skill 强制独立运行 lint+build
- **添加时间：** 2026-05-11 19:37 CDT
- **来源：** ERROR_LOG E005
- **责任人：** Claude
- **要做的事：**
  1. 更新 `.claude/commands/checkpoint.md` 步骤 2：明确"`npm run lint` 必须独立运行，看 rc 才能进下一步；禁止用 `lint | tail`"
  2. 同步更新 `.claude/skills/phase-checkpoint/SKILL.md`
  3. 同步更新 `.claude/skills/safe-backup/SKILL.md`
- **何时做：** 与 B2 一起处理

#### ✅ B2 (DONE 2026-05-11 19:42 CDT) — 更新 MOBILE_TEST_SOP 加 dev server 启动前检查
- **添加时间：** 2026-05-10 22:02 CDT
- **来源：** ERROR_LOG E003
- **责任人：** Claude
- **要做的事：**
  1. `docs/MOBILE_TEST_SOP.md` 加一节"启动前检查"：lsof 看端口 / 默认用 5199 等非默认端口 / curl 验证 fileName 路径是 worktree
  2. 提议给用户：是否要建 `/dev` slash command 自动化整个流程
- **何时做：** 不阻塞 Phase 1，可在 A3 之后处理

### 📋 待做（按顺序）

#### A3 — Phase 1.3：铜钱起卦 + 摇动画
- **添加时间：** 2026-05-10 21:28 CDT
- **责任人：** Claude
- **依赖：** A1 完成

#### A4 — Phase 1.4：观音灵签（5 签原型）
- **添加时间：** 2026-05-10 21:28 CDT
- **责任人：** Claude（5 签原型）+ 用户（确认 100 签数据来源）
- **依赖：** A1 完成

#### A5 — Phase 1.5：占卜 prompt + QuickReading 组件
- **添加时间：** 2026-05-10 21:28 CDT
- **责任人：** Claude
- **依赖：** A2/A3/A4 任一完成

### ⏸️ 阻塞中

无

---

## 用户待做

#### U1 — 确认观音灵签 100 签数据来源
- **添加时间：** 2026-05-10 21:28 CDT
- **要做的事：** 决定用公版民间通行版本，还是你提供数据
- **影响：** Phase 1.4 灵签从 5 签原型扩到 100 签的时机

---

## 已完成（最近 5 条）

| 时间 | ID | 内容 |
|---|---|---|
| 2026-05-10 21:53 CDT | A2 | Phase 1.2 梅花易数（数字+时间起卦，commit f5cef17，build ✅，lint 0 new） |
| 2026-05-10 21:38 CDT | A1 | Phase 1.1 占卜 tab 路由 + Fortune.jsx 骨架（commit 07674e2，build ✅，lint 有 pre-existing E002） |
| 2026-05-10 21:31 CDT | DONE-0.5b | 治理系统 v0.0.2（ERROR_LOG/ACTION_ITEMS/3 skills/时间戳）+ push forgejo |
| 2026-05-10 16:43 CDT | DONE-Phase 0.5 | 治理系统 v0.0.1 完成 + push forgejo |
| 2026-05-10 16:43 CDT | DONE-Phase 0.6 | Forgejo 备份验证可见 |
| 2026-05-10 16:30 CDT | DONE-Phase 0.5 | Forgejo remote 添加 + 首次 push |

完整历史见 `PROGRESS.md` 和 `CHANGELOG.md`。

---

## 维护规则

- 完成一项 → 立即移到"已完成"，留时间戳
- 每开始一项 → 标 🔄 + 加开始时间
- 至多保留 1 个 🔄（一次只做一件事）
- 阻塞 → 移到 ⏸️ + 写明等什么
