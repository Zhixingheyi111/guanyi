# Action Items（当前可执行）

只放**当前 sprint 实际在做或马上要做**的事。远期 4 期计划在 `PROJECT.md`。

每条 action 必须有：
- 时间戳（添加时间 / 完成时间）
- 状态：📋 待做 / 🔄 进行中 / ✅ 完成 / ⏸️ 阻塞 / ❌ 取消
- 责任人（默认 Claude，"用户" 表示需要你手动做）

---

## 当前活跃项

### 🔄 进行中

无（v0.0.2-governance 已 commit + push 后会清空）

### 📋 待做（按顺序）

#### A1 — Phase 1.1：占卜 tab 路由 + Fortune.jsx 骨架
- **添加时间：** 2026-05-10 21:28 CDT
- **责任人：** Claude
- **预计：** 单 session 完成
- **细节：**
  - 改 `src/App.jsx` mode 加 `'fortune'`
  - 改 `src/components/Navigation.jsx` 加第 3 个 tab "占卜"
  - 新 `src/components/Fortune.jsx` 容器骨架（含 sub-tab 但不实现 3 种方法）
- **完成后：** `/backup`，更新本文件状态

#### A2 — Phase 1.2：梅花易数实现
- **添加时间：** 2026-05-10 21:28 CDT
- **责任人：** Claude
- **依赖：** A1 完成

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
| 2026-05-10 16:43 CDT | DONE-Phase 0.5 | 治理系统 v0.0.1 完成 + push forgejo |
| 2026-05-10 16:43 CDT | DONE-Phase 0.6 | Forgejo 备份验证可见 |
| 2026-05-10 16:30 CDT | DONE-Phase 0.5 | Forgejo remote 添加 + 首次 push |
| 2026-05-10 16:20 CDT | DONE-Phase 0.4 | PROJECT.md + CLAUDE.md 创建 |
| 2026-05-10 16:00 CDT | DONE-Phase 0.3 | 用户在 Forgejo 创建空 repo |

完整历史见 `PROGRESS.md` 和 `CHANGELOG.md`。

---

## 维护规则

- 完成一项 → 立即移到"已完成"，留时间戳
- 每开始一项 → 标 🔄 + 加开始时间
- 至多保留 1 个 🔄（一次只做一件事）
- 阻塞 → 移到 ⏸️ + 写明等什么
