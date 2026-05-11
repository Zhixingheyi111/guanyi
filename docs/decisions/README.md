# Architecture Decision Records (ADR)

记录关键技术选择，避免反复争论或事后忘记理由。

## 文件命名

`NNNN-slug.md`，4 位编号 + 短横连接的 slug。例如：
- `0001-no-react-router.md`
- `0002-forgejo-as-backup-remote.md`
- `0003-multi-persona-chat.md`

## 模板

```markdown
# NNNN: 决策标题

- **状态**：proposed / accepted / superseded by NNNN / deprecated
- **日期**：YYYY-MM-DD
- **决策者**：

## 背景
为什么要做这个决策？什么情境下提出？

## 决策
具体决定是什么？

## 理由
为什么选这个方案？拒绝了哪些备选？

## 后果
正面 / 负面 / 中性后果各是什么？将来如果要改，成本是多少？
```

## 何时写 ADR

- 引入新技术栈或库
- 选择 A 不选 B 的分叉点
- 项目结构的非显然约定
- 任何"将来一定有人会问'为什么不'的决定"

不是每个 commit 都要 ADR，但每个 Phase 至少 1-2 个关键决策应被记录。

## 已记录的决策

（待 Phase 1 开始后陆续添加）

- 0001-no-react-router.md - 自定义 mode 状态机替代 react-router（待写）
- 0002-forgejo-as-backup-remote.md - Forgejo 作为进度备份 remote（待写）
- 0003-multi-persona-chat.md - studyChat 支持多 persona 切换（Phase 1.7 时写）
