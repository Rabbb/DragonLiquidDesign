import type { App, InjectionKey } from 'vue'

export interface DlApiTesterPolicy { enabled: () => boolean }
export const dlApiTesterPolicyKey: InjectionKey<DlApiTesterPolicy> = Symbol('dragon-liquid-api-tester-policy')
export function createDlApiTesterPolicy(policy: DlApiTesterPolicy) {
  return { install(app: App) { app.provide(dlApiTesterPolicyKey, policy) } }
}
export type DlApiBodyMode = 'none' | 'json' | 'text' | 'urlencoded' | 'multipart'
export interface DlApiRequestInput {
  url: string; method: string; query?: string; headers?: string; token?: string
  bodyMode: DlApiBodyMode; body?: string; files?: { name: string; file: File }[]
}
export interface DlApiPreparedRequest { url: string; method: string; headers: Headers; body?: BodyInit; fields: [string, string][]; files: { name: string; file: File }[] }
export interface DlApiResponse { status: number; statusText: string; elapsed: number; headers: string; body: string; truncated: boolean }

export function parseDlApiPairs(value: string, separator = '='): [string, string][] {
  return value.split(/\r?\n/).filter(line => line.trim()).map(line => {
    const at = line.indexOf(separator)
    if (at <= 0) throw new Error(`请按 名称${separator}值 的格式填写。`)
    return [line.slice(0, at).trim(), line.slice(at + 1).trim()]
  })
}

/** 构建独立请求；Cookie 和文档站身份不参与请求。 */
export function prepareDlApiRequest(input: DlApiRequestInput, baseUrl: string): DlApiPreparedRequest {
  if (!input.url.trim()) throw new Error('请输入接口地址。')
  const url = new URL(input.url.trim(), baseUrl)
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) throw new Error('接口地址须为不含账号密码的 HTTP 或 HTTPS 地址。')
  for (const [key, value] of parseDlApiPairs(input.query || '')) url.searchParams.append(key, value)
  url.hash = ''
  const method = input.method.toUpperCase()
  if (!['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'].includes(method)) throw new Error('请求方法不受支持。')
  const headers = new Headers()
  for (const [key, value] of parseDlApiPairs(input.headers || '', ':')) {
    if (/^(?:cookie|host|origin|referer|content-length|connection|accept-encoding|sec-.+|proxy-.+)$/i.test(key)) throw new Error(`浏览器不允许手动设置 ${key}。`)
    headers.set(key, value)
  }
  if (input.token?.trim()) headers.set('Authorization', `Bearer ${input.token.trim()}`)
  let body: BodyInit | undefined
  let fields: [string, string][] = []
  const files = input.files || []
  if (!['GET', 'HEAD'].includes(method)) {
    if (input.bodyMode === 'json') { JSON.parse(input.body || ''); body = input.body; if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json') }
    if (input.bodyMode === 'text') { body = input.body || ''; if (!headers.has('Content-Type')) headers.set('Content-Type', 'text/plain;charset=UTF-8') }
    if (input.bodyMode === 'urlencoded' || input.bodyMode === 'multipart') {
      fields = parseDlApiPairs(input.body || '')
      if (input.bodyMode === 'urlencoded') { body = new URLSearchParams(fields); if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8') }
      else {
        const form = new FormData(); fields.forEach(([key, value]) => form.append(key, value)); files.forEach(({ name, file }) => form.append(name || 'file', file))
        body = form; headers.delete('Content-Type')
      }
    }
  }
  return { url: url.href, method, headers, body, fields, files }
}

/** 生成 Bash 格式的 cURL；默认隐藏常见认证请求头。 */
export function createDlApiCurl(request: DlApiPreparedRequest, includeSecrets = false): string {
  const quote = (value: string) => "'" + value.replaceAll("'", "'\\''") + "'"
  const parts = ['curl --request ' + request.method, quote(request.url)]
  request.headers.forEach((value, key) => parts.push('--header ' + quote(key + ': ' + (!includeSecrets && /authorization|token|api[-_]?key|secret/i.test(key) ? '<REDACTED>' : value))))
  if (request.body instanceof FormData) {
    request.fields.forEach(([key, value]) => parts.push('--form-string ' + quote(key + '=' + value)))
    request.files.forEach(({ name, file }) => parts.push('--form ' + quote((name || 'file') + '=@' + file.name)))
  } else if (request.body !== undefined) parts.push('--data-raw ' + quote(String(request.body)))
  return parts.join(' \\\n  ')
}

/** 发起可取消的浏览器请求，最多显示 1 MiB 响应正文。 */
export async function executeDlApiRequest(request: DlApiPreparedRequest, signal: AbortSignal): Promise<DlApiResponse> {
  const started = performance.now()
  const response = await fetch(request.url, { method: request.method, headers: request.headers, body: request.body, signal, credentials: 'omit', redirect: 'error', cache: 'no-store' })
  const limit = 1024 * 1024, reader = response.body?.getReader(), decoder = new TextDecoder()
  let body = '', size = 0, truncated = false
  if (reader) {
    try {
      while (true) {
        const chunk = await reader.read(); if (chunk.done) break
        const remaining = limit - size; body += decoder.decode(chunk.value.subarray(0, remaining), { stream: true }); size += chunk.value.length
        if (size > limit) { truncated = true; await reader.cancel(); break }
      }
      body += decoder.decode()
    } finally { reader.releaseLock() }
  }
  if (!truncated && response.headers.get('content-type')?.includes('json')) { try { body = JSON.stringify(JSON.parse(body), null, 2) } catch { /* 非 JSON 响应按原文显示。 */ } }
  return { status: response.status, statusText: response.statusText, elapsed: Math.round(performance.now() - started),
    headers: [...response.headers].map(([key, value]) => key + ': ' + value).join('\n'), body, truncated }
}
