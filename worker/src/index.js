// guanyi-proxy：Cloudflare Worker 薄代理
// 职责：把前端请求透传给 DeepSeek API，隐藏 API key，加 CORS 白名单 + 共享 secret 防护

const DEEPSEEK_URL = 'https://api.deepseek.com/v1/chat/completions';

const ALLOWED_ORIGINS = [
  'https://guanyi.pages.dev',
  'https://guanyi.me',
  'https://www.guanyi.me',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
];

// 开发期允许局域网 IP（手机访问 Vite dev server 用）
const LAN_ORIGIN_RE = /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d{1,5}$/;

function isAllowedOrigin(origin) {
  return ALLOWED_ORIGINS.includes(origin) || LAN_ORIGIN_RE.test(origin);
}

function corsHeaders(origin) {
  const allowed = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, x-app-secret',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function jsonError(status, message, cors) {
  return new Response(
    JSON.stringify({ error: { message } }),
    { status, headers: { ...cors, 'content-type': 'application/json' } },
  );
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const cors = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (!isAllowedOrigin(origin)) {
      return jsonError(403, '来源不被允许', cors);
    }

    const url = new URL(request.url);
    if (url.pathname !== '/v1/chat/completions' || request.method !== 'POST') {
      return jsonError(404, 'Not found', cors);
    }

    const secret = request.headers.get('x-app-secret');
    if (!env.APP_SECRET || secret !== env.APP_SECRET) {
      return jsonError(401, '未授权', cors);
    }

    const body = await request.text();

    let upstream;
    try {
      upstream = await fetch(DEEPSEEK_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
          'content-type': 'application/json',
        },
        body,
      });
    } catch {
      return jsonError(502, '上游请求失败', cors);
    }

    const respBody = await upstream.text();
    return new Response(respBody, {
      status: upstream.status,
      headers: {
        ...cors,
        'content-type': upstream.headers.get('content-type') || 'application/json',
      },
    });
  },
};
