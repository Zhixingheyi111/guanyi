# guanyi-proxy

Cloudflare Worker 薄代理：把前端请求转发到 Anthropic API，隐藏 API key。

## 部署步骤

所有命令在**项目根目录**运行（不是 `worker/` 目录）。

### 1. 登录 Cloudflare

```bash
npx wrangler login
```

浏览器会弹出授权页，授权后回到终端。

### 2. 生成一个随机的 APP_SECRET

```bash
openssl rand -hex 32
```

复制输出（64 位十六进制字符串）。下一步和前端 `.env` 都要用到**同一个值**。

### 3. 设置 Worker 的两个 secret

```bash
cd worker
npx wrangler secret put ANTHROPIC_API_KEY
# 粘贴你的 Anthropic API key，回车

npx wrangler secret put APP_SECRET
# 粘贴上一步生成的 64 位字符串，回车
```

### 4. 部署

```bash
npx wrangler deploy
```

部署成功后会打印 Worker URL，形如：

```
https://guanyi-proxy.<你的子域>.workers.dev
```

### 5. 配置前端 `.env`

在项目根目录的 `.env` 里填：

```
VITE_API_BASE_URL=https://guanyi-proxy.<你的子域>.workers.dev
VITE_APP_SECRET=<第2步生成的同一个64位字符串>
```

删除旧的 `VITE_ANTHROPIC_API_KEY`。

## 日常维护

- **查看日志**：`cd worker && npx wrangler tail`
- **更新 secret**：重复 `wrangler secret put`，旧值会被覆盖
- **修改代码后重新部署**：`cd worker && npx wrangler deploy`
