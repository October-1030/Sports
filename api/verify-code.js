// Vercel Serverless Function: /api/verify-code
// POST { code: "FS-XXXX-XXXX" }
// Returns: { success: true } | { success: false, message: "..." }

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// 简单内存限流（进程级别）
const ipAttempts = new Map()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 60 * 1000 // 1分钟

function checkRateLimit(ip) {
  const now = Date.now()
  const record = ipAttempts.get(ip)
  if (!record || now > record.resetAt) {
    ipAttempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }
  if (record.count >= RATE_LIMIT_MAX) return false
  record.count++
  return true
}

async function supabaseFetch(path, options = {}) {
  const resp = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
      ...(options.headers || {}),
    },
  })
  return resp
}

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: '方法不允许' })

  // 检查环境变量
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing env vars:', { SUPABASE_URL: !!SUPABASE_URL, KEY: !!SUPABASE_SERVICE_ROLE_KEY })
    return res.status(500).json({ success: false, message: '服务器配置错误：缺少环境变量' })
  }

  // IP 限流
  const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'
  if (!checkRateLimit(clientIP)) {
    return res.status(429).json({ success: false, message: '请求过于频繁，请稍后再试' })
  }

  // 解析请求
  const { code } = req.body || {}
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, message: '请输入兑换码' })
  }

  const normalizedCode = code.trim().toUpperCase()

  // 永久测试码：直接通过，不标记已用
  const TEST_CODES = ['FS-0000-0000']
  if (TEST_CODES.includes(normalizedCode)) {
    return res.status(200).json({ success: true })
  }

  try {
    // 原子操作：PATCH 只更新 is_used=false 的行
    // PostgreSQL 行锁保证并发安全
    const patchResp = await supabaseFetch(
      `/redemption_codes?code=eq.${encodeURIComponent(normalizedCode)}&is_used=eq.false`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          is_used: true,
          used_at: new Date().toISOString(),
          used_ip: clientIP,
        }),
      }
    )

    const patchData = await patchResp.json()

    // 如果更新到了行 → 成功
    if (Array.isArray(patchData) && patchData.length > 0) {
      return res.status(200).json({ success: true })
    }

    // 没有更新到 → 码不存在 或 已使用，查一下区分
    const getResp = await supabaseFetch(
      `/redemption_codes?code=eq.${encodeURIComponent(normalizedCode)}&select=is_used`
    )
    const getData = await getResp.json()

    if (!Array.isArray(getData) || getData.length === 0) {
      return res.status(200).json({ success: false, message: '无效兑换码' })
    }

    return res.status(200).json({ success: false, message: '兑换码已被使用' })

  } catch (err) {
    console.error('verify-code error:', err)
    return res.status(500).json({ success: false, message: '服务器错误，请稍后再试' })
  }
}
