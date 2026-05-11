# 手机端测试 SOP

**CLAUDE.md 规定：本应用主要在手机使用。** 每次大改后必须手机测试。

---

## 标准测试流程

### 1. 启动 dev server，开放局域网访问

```bash
npm run dev -- --host
```

`--host` 参数必须，否则手机访问不到。

启动后控制台会显示局域网 URL，类似：
```
  ➜  Network: http://192.168.1.x:5173/
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
