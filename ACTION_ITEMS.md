# Action Items（当前可执行）

只放**当前 sprint 实际在做或马上要做**的事。远期 4 期计划在 `PROJECT.md`。

每条 action 必须有：
- 时间戳（添加时间 / 完成时间）
- 状态：📋 待做 / 🔄 进行中 / ✅ 完成 / ⏸️ 阻塞 / ❌ 取消
- 责任人（默认 Claude，"用户" 表示需要你手动做）

---

## 当前活跃项

### 🔄 进行中

#### Phase 易经-A · 占卜模块整治
- **添加时间：** 2026-05-13 23:55 CDT
- **来源：** plan `/Users/dz/.claude/plans/app-cwd-users-dz-documents-yijing-warm-owl.md`
- **进度：**
  - ✅ A0：删灵签 + 2 mode 重构（commit 8de3454）
  - ✅ A1：占卜顶部 3 种方法导读卡（commit deaf478）
  - ✅ A2：lessons.js 增 3 课占卜方法（commit 3468f4f）
  - ✅ A3：梅花体用分析模块（commit pending）
  - 📋 A4：复盘机制（占完→事后追问）（**护城河**）
- **责任人：** Claude

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

#### U2 — 用户验收 Phase 1
- **添加时间：** 2026-05-11 20:06 CDT
- **要做的事：** 用 dev server (http://localhost:5199/) 试占卜 3 法 + 学易选段对话；OK → 说"通过"开 Phase 2，否则告诉我问题
- **责任人：** 用户

#### U3 — Forgejo 服务恢复后通知我，一次 push 所有积累 commits
- **添加时间：** 2026-05-11 20:06 CDT
- **要做的事：** 在 nexus.xinle.biz 后台看 disk usage / 日志，或等服务自愈
- **责任人：** 用户

#### Phase 2 经典扩展 — **整体暂停**（用户 2026-05-13 决策）
- 用户决策："以易经为主，占卜为辅，其他书暂搁"
- schema 容器（`src/data/classics/_schema.md` + `index.js`）保留作未来扩展骨架
- 大学数据录入（2.0d）已暂停，daxue import 在 index.js 中临时注释
- 灵签 100 签数据来源 → **❌ 取消**（灵签整体删除）

#### A3 — Phase 1.3：铜钱起卦 + 摇动画（DEPRECATED，已完成）
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

#### ~~U1~~ — ❌ 取消（2026-05-13）— 灵签整体删除，无需 100 签数据

---

## 已完成（最近 5 条）

| 时间 | ID | 内容 |
|---|---|---|
| 2026-05-14 00:09 CDT | **A3** | 梅花体用分析模块（8 卦五行 + 5 种生克 + UI 卡片 + AI prompt 注入）|
| 2026-05-14 00:05 CDT | **A2** | lessons.js 增 3 课占卜方法详解（蓍草大衍数+四营、金钱卦火珠林、梅花体用）|
| 2026-05-14 00:00 CDT | **A1** | 占卜顶部 3 种方法导读卡（蓍草/梅花/铜钱），可展开方法+何时用+概率+来历 |
| 2026-05-13 23:55 CDT | **A0** | 删灵签 + 顶层 mode 3→2（占卜/学易）+ 蓍草并入占卜 sub-tab；修 build（注释 daxue import） |
| 2026-05-11 20:06 CDT | **Phase 1** | v0.1.0-fortune-and-dialogue tag（10 commits 累积，Forgejo 等服务恢复） |
| 2026-05-11 20:00 CDT | Phase 1.9-1.10 | useTextSelection + SelectionPopover + HexagramDetail (commit 5d8a308) |
| 2026-05-11 19:55 CDT | Phase 1.6-1.8 | studyChat persona 化 + 4 位作者 + UI (commit 0d75fc5) |
| 2026-05-11 19:42 CDT | B2+B3 | MOBILE_TEST_SOP + checkpoint/skills 强制独立 lint (commit f1413ac) |
| 2026-05-11 19:35 CDT | A5 | interpretFortune + QuickReading (commit 167ac38) |
| 2026-05-11 19:32 CDT | A4 | 观音灵签 5 签原型 (commit 9fe7cce → 196b87a 清 dead code) |
| 2026-05-11 19:25 CDT | A3 | 铜钱起卦 + 摇钱动画 (commit f5cef17) |
| 2026-05-11 19:20 CDT | B1 | React 19 hooks lint 错修复 (commit 0b3fe6c) |
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
