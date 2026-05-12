# 手机端测试 SOP

**CLAUDE.md 规定：本应用主要在手机使用。** 每次大改后必须手机测试。

---

## Worktree 初次启动前必做（避免 E006 类问题）

```bash
# .env 是 gitignored，git worktree add 不会带；从主仓库复制
[ -f .env ] || cp "/Users/dz/Documents/Yijing App (Claude Code)/.env" .env

# 验证关键 vars 已定义（不打印 value）
grep -c "^VITE_APP_SECRET=." .env  # 应为 1
grep -c "^VITE_API_BASE_URL=." .env # 应为 1
```

如果 `.env` 还没复制就启动 dev server，所有 LLM 调用会报"密钥配置错误"。

---

## 启动 dev server 前必做（避免 E003 类问题）

worktree 工作流下，主仓库上可能已有 vite 在跑。两者同时跑 5173 会让用户连 localhost 看到错版本。

### 0a. 检查目标端口

```bash
lsof -i :5173 -sTCP:LISTEN 2>&1 | head -3
```

如有 LISTEN 行：**换非默认端口**（如 5199）。如无：可用 5173。

### 0b. 启动用非默认端口（推荐）

```bash
npm run dev -- --host --port 5199
```

### 0c. 启动后**验证 serving 的是 worktree 代码**

```bash
curl -s http://localhost:5199/src/components/Navigation.jsx | head -3
```

输出里的 `fileName` 路径应包含 `naughty-booth-4d532f`（worktree），不是 `Yijing App (Claude Code)/src` 顶层。如不对：检查是否启错了 npm（cwd 应在 worktree 根）。

### 0d. 报告用户的 URL **必须无歧义**

只给用户**经过验证的、非默认端口的** URL，并显式说明端口号。不要让用户去猜 localhost:5173 vs Network IP。

---

## 标准测试流程

### 1. 启动 dev server，开放局域网访问

参见上面 0a-0c。手机扫码用的 URL：

```
http://<你的 LAN IP>:5199/
```

### 2. 手机连同一 Wi-Fi

iPhone：扫描终端 QR 码（建议安装 `qrencode`：`brew install qrencode`，然后 `qrencode -t ANSI "http://192.168.1.x:5173"`）
或手动在 Safari 输入上面的 URL。

### 3. Golden path 检查

按 PROJECT.md 当前 Phase 的"完成标准"逐项过：

**通用回归（每次都要）：**
- [ ] 首页加载顺滑
- [ ] 顶部 tab 切换无 flash
- [ ] 蓍草问道：能起卦 → 看到五层卦象 → AI 解读
- [ ] 学易→64 卦：网格滚动流畅
- [ ] 学易→单卦详情：经典原文可读
- [ ] 学易→与大师对话：能发消息收回复

### 4. 触摸交互检查

iOS HIG 标准：
- [ ] 按钮点击区 ≥ 44×44 pt
- [ ] 长按选中文本能弹出 popover（Phase 1.9 之后）
- [ ] 抽屉/折叠面板流畅展开
- [ ] 滚动惯性自然（无奇怪的 -webkit overflow 问题）

### 5. 动画性能

- [ ] 铜钱摇动画（Phase 1.3 之后）：6 次摇动每次都流畅
- [ ] 签筒摇动画（Phase 1.4 之后）：流畅
- [ ] 抽屉滑入：不掉帧

### 6. 字号检查

- [ ] 经典原文字号 ≥ 18pt（眼睛友好）
- [ ] 注释字号 ≥ 14pt
- [ ] 不出现横向滚动条
- [ ] 在 iPhone SE（小屏）上也可读

### 7. 安卓兼容（可选，如有设备）

简单走一遍 golden path 即可。重点：
- 中文字体回退是否正常（Songti 在安卓可能没有）
- 长按选中行为差异

---

## 常见手机端问题排查

| 现象 | 可能原因 | 排查 |
|---|---|---|
| 局域网访问不到 | `--host` 没加 / 防火墙 | 检查 dev server 启动参数 |
| 选中弹 popover 不出现 | iOS Safari 的 selection 事件名差异 | useTextSelection 要监听 `selectionchange` 而非 `mouseup` |
| 字体回退乱 | tokens.css 字体优先级 | 检查 `font-family` 顺序 |
| 100dvh 滚动异常 | 老 iOS 不支持 dvh | fallback 到 vh + JS 计算 |
| 动画卡 | 用 JS 动画而非 CSS transform | 优先 `transform: translate/rotate/scale` |
