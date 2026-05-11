# Pre-Merge Checklist

每次准备从 worktree 分支 merge 到 main（即触发 GitHub Pages 部署）之前，**逐项核对**。

`/premerge` 命令会自动运行能自动的部分，无法自动的项必须用户确认。

---

## 代码质量
- [ ] `npm run lint` 通过（0 error，可有可控的 warning）
- [ ] `npm run build` 通过（无新警告 / 无新错误）
- [ ] 没有 `console.log` / `debugger` / `// TODO` 残留
- [ ] 没有"装了又没用"的依赖（`package.json` diff 看一遍）

## 功能验证（golden path）
- [ ] 当前 Phase 所有 golden path 走通（参见 PROJECT.md 当前 Phase 的"完成标准"）
- [ ] 既有功能回归测试通过：
  - [ ] 蓍草问道：起卦 → 五层卦象 → AI 解读 → 笔记
  - [ ] 学易：64 卦浏览 → 单卦详情 → 与大师对话
  - [ ] 9 课入门：每课能正常打开 + 词条跳转
- [ ] 没有破坏 `src/data/*` 的数据结构（hexagrams.js 的 schema 不变）

## 文档同步
- [ ] `CHANGELOG.md` 已添加新版本条目
- [ ] `PROGRESS.md` 已记录本次工作
- [ ] `PROJECT.md` "当前任务"区块已更新
- [ ] 新增的数据已在 `SOURCES.md` 标注来源

## 手机端（CLAUDE.md：本应用主要在手机使用）
- [ ] iOS Safari 实机或模拟器走完整 golden path
- [ ] 长按选中文本能弹出 popover（如本期含此功能）
- [ ] 抽屉/折叠面板流畅展开
- [ ] 动画 fps 不卡（铜钱摇/签筒摇）
- [ ] 字号在手机上可读（详见 `docs/MOBILE_TEST_SOP.md`）

## API & 安全
- [ ] `.env` 没被 git track（`git ls-files | grep .env` 应为空）
- [ ] LLM 调用没有把 API key 暴露给前端
- [ ] Worker 端没有不必要的改动
- [ ] 仓库里没有 secret（grep 一遍 `sk-`、`api_key=` 等模式）

## 备份就位
- [ ] worktree 分支已 push 到 forgejo（最新 commit hash 可见）
- [ ] ERROR_LOG.md 是否需新增条目（本期是否有失败值得记录）

## 用户验收（最后一步）
- [ ] **用户明确说"可以 merge"**

---

## 全部 ✅ 后才能：

```bash
git checkout main
git merge --no-ff claude/naughty-booth-4d532f -m "Merge Phase X: ..."
git push origin main           # ⚠️ 触发 GitHub Pages 部署
git push origin --tags         # 把 phase tag 也推上去
```

部署完成后：
- [ ] 打开 GitHub Pages URL，手机扫码访问
- [ ] golden path 在生产环境再走一遍
- [ ] 如有问题：**不要 hotfix 到 main**，回到 worktree 分支修复后重走 /premerge

---

## 回滚方案

如果生产环境出问题：
1. 立即 `git revert -m 1 <merge-commit>` （revert merge commit，保留代码历史）
2. `git push origin main`（再次部署，回到上一个稳定版）
3. 在 ERROR_LOG.md 记录这次回滚和原因
