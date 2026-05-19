# Session Handoff Prompt 模板

当本 session 上下文快满，用以下模板生成一段**自包含的接班 prompt**。用户粘到新 chat 即可无缝继续。

## 触发时机

1. **被动**：用户运行 `/handoff` 主动要交接 prompt
2. **主动**：Claude 感觉上下文压缩频繁、context 接近极限时，自己生成

## 生成步骤

1. 取当前时间：`date "+%Y-%m-%d %H:%M %Z"`
2. 读 `PROJECT.md` 的"当前任务（动态更新区）"
3. 读 `PROGRESS.md` 最新条目（一段）
4. 读 `ACTION_ITEMS.md` 的"🔄 进行中"和"📋 待做"前 3 条
5. 看 `git log --oneline -5` 最近 commits
6. 看 `git status --short` 是否有未 commit 改动
7. 看 `git ls-remote origin "$(git branch --show-current)"` vs 本地 HEAD（功能分支是否已备份到 origin）
8. 输出下面的模板，**给用户直接复制粘贴**

## 模板（占位 `{...}` 由生成时填充）

```
接班观易 App 的开发。

# 工作目录
{cwd}（在 worktree 分支 `{branch}`）

# 必读
1. `CLAUDE.md` — 核心规则 + 自治模式说明
2. `PROJECT.md` — 全 4 期路线 + 当前 Phase
3. `ACTION_ITEMS.md` — 当前 sprint 在做的事
4. `ERROR_LOG.md` — 最近的错误 + 教训（防止重蹈覆辙）
5. `PROGRESS.md` 顶部一条 — 上次工作进度

# 当前状态（{timestamp}）
- 阶段：{phase}
- 当前任务：{current_task}
- origin 备份状态：{origin_status}
- 本地 HEAD：{local_commit_short} {local_commit_subject}

# 最近 commits
{git_log_oneline_5}

# 进行中 / 待做
{action_items_top_3}

# 上次 session 关键事件
{recent_progress_summary}

# 自治模式
用户已授权 bypassPermissions。`.claude/settings.local.json` 列了 deny。
只有 src/data 改动、push GitHub、merge main、安装依赖、不可逆操作才停问。

# 下一步建议
{next_step_suggestion}

# 工作流命令
- `/backup`：commit + push 功能分支到 GitHub origin（不部署）
- `/checkpoint`：phase 完成仪式
- `/log-error`：错误记录
- `/handoff`：再次生成接班 prompt
- `/premerge`：唯一允许 merge 到 main / 推 main 的命令（= 触发 Cloudflare Pages 部署）
```

## 字段填法示例

`{branch}` — `claude/clever-torvalds-6f9f19`
`{phase}` — `Phase 1 完成 v0.1.0-fortune-and-dialogue，等用户验收`
`{current_task}` — `验收中；E006 已修；等用户验收通过开 Phase 2`
`{origin_status}` — `✅ 功能分支已同步到 origin` 或 `⚠️ 本地领先 N commits 未推`
`{recent_progress_summary}` — 50-100 字，概括上 session 关键动作

## 输出格式

用 Markdown 代码块包起整段 prompt，方便用户一键复制：

````
```
接班观易 App 的开发。
...（填好的模板）
```
````

然后告诉用户："👆 复制方框里的内容到新 chat 即可继续。"
