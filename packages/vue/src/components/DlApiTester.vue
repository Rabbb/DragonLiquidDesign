<script setup lang="ts">
import { computed, inject, onBeforeUnmount, ref, watch } from 'vue'
import DlButton from './DlButton.vue'
import DlInputText from './DlInputText.vue'
import DlSelect from './DlSelect.vue'
import { createDlApiCurl, dlApiTesterPolicyKey, executeDlApiRequest, prepareDlApiRequest, type DlApiBodyMode, type DlApiResponse } from './api-tester'
const props = withDefaults(defineProps<{ title?: string; url?: string; method?: string; query?: string; headers?: string; bodyMode?: DlApiBodyMode; body?: string; timeout?: number; disabled?: boolean }>(),
  { title: 'API 调用测试', url: '', method: 'GET', query: '', headers: '', bodyMode: 'none', body: '', timeout: 30000, disabled: false })
const emit = defineEmits<{ response: [value: DlApiResponse]; error: [message: string] }>()
const policy = inject(dlApiTesterPolicyKey, { enabled: () => true })
const url = ref(props.url), method = ref(props.method), query = ref(props.query), headers = ref(props.headers), bodyMode = ref<DlApiBodyMode>(props.bodyMode), body = ref(props.body)
const token = ref(''), busy = ref(false), error = ref(''), notice = ref(''), result = ref<DlApiResponse>(), tab = ref('body'), fileField = ref('file'), files = ref<File[]>([]), includeSecrets = ref(false)
const blocked = computed(() => props.disabled || !policy.enabled())
const bodyPlaceholder = computed(() => bodyMode.value === 'json' ? JSON.stringify({ key: 'value' }) : '表单按每行 key=value 填写')
const hasBody = computed(() => !['GET', 'HEAD'].includes(method.value))
const methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'].map(value => ({ value, label: value }))
const modes = [{ value: 'none', label: '无正文' }, { value: 'json', label: 'JSON' }, { value: 'text', label: '纯文本' }, { value: 'urlencoded', label: '表单编码' }, { value: 'multipart', label: '文件与表单' }]
let controller: AbortController | undefined
const prepare = () => prepareDlApiRequest({ url: url.value, method: method.value, query: query.value, headers: headers.value, token: token.value,
  bodyMode: bodyMode.value, body: body.value, files: files.value.map(file => ({ name: fileField.value, file })) }, window.location.href)
function selectFiles(event: Event) { files.value = Array.from((event.target as HTMLInputElement).files || []) }
function cancel() { controller?.abort() }
watch(() => [props.url, props.method, props.query, props.headers, props.bodyMode, props.body], () => {
  cancel(); url.value = props.url; method.value = props.method; query.value = props.query
  headers.value = props.headers; bodyMode.value = props.bodyMode; body.value = props.body
  token.value = ''; files.value = []; result.value = undefined; error.value = ''; notice.value = ''
})
async function send() {
  if (busy.value || blocked.value) return
  error.value = ''; notice.value = ''; result.value = undefined
  let timer: ReturnType<typeof setTimeout> | undefined, timedOut = false
  try {
    const request = prepare(); controller = new AbortController(); busy.value = true
    timer = setTimeout(() => { timedOut = true; controller?.abort() }, Math.max(1000, Math.min(props.timeout, 120000)))
    result.value = await executeDlApiRequest(request, controller.signal); emit('response', result.value)
  } catch (failure) {
    error.value = controller?.signal.aborted ? timedOut ? '请求超时。' : '请求已取消。' : failure instanceof TypeError ? '请求未完成，请检查地址、网络与跨域设置；可复制 cURL 在终端调用。' : failure instanceof Error ? failure.message : '请求失败。'
    emit('error', error.value)
  } finally { clearTimeout(timer); controller = undefined; busy.value = false }
}
async function copyCurl() {
  try { await navigator.clipboard.writeText(createDlApiCurl(prepare(), includeSecrets.value)); notice.value = '已复制 cURL（Bash）。'; error.value = '' }
  catch (failure) { error.value = failure instanceof Error ? failure.message : '复制失败。' }
}
onBeforeUnmount(cancel)
</script>
<template>
  <section class="dl-api-tester" :aria-label="title">
    <header><strong>{{ title }}</strong><span>浏览器直连</span></header>
    <pre class="dl-api-tester__print">{{ method }} {{ url }}{{ query ? '\n' + query : '' }}{{ headers ? '\n' + headers : '' }}{{ hasBody && body ? '\n\n' + body : '' }}</pre>
    <div class="dl-api-tester__request"><DlSelect v-model="method" :options="methods" aria-label="请求方法" :disabled="busy || blocked" /><DlInputText v-model="url" placeholder="https://api.example.com/resource" aria-label="接口地址" :disabled="busy || blocked" /><DlButton v-if="!busy" size="sm" :disabled="blocked" @click="send">发送请求</DlButton><DlButton v-else size="sm" variant="secondary" @click="cancel">取消</DlButton></div>
    <p v-if="blocked" class="dl-api-tester__hint">当前页面不执行 API 请求。</p>
    <details class="dl-api-tester__parameters"><summary>参数、请求头与身份</summary><div class="dl-api-tester__grid"><label>查询参数（每行 key=value）<textarea v-model="query" rows="3" :disabled="busy || blocked" spellcheck="false" /></label><label>请求头（每行 Name: value）<textarea v-model="headers" rows="3" :disabled="busy || blocked" spellcheck="false" /></label><label class="dl-api-tester__wide">Bearer Token<input v-model="token" type="password" autocomplete="off" placeholder="只用于本次测试，不保存在文档中" :disabled="busy || blocked"></label></div></details>
    <div v-if="hasBody" class="dl-api-tester__body"><DlSelect v-model="bodyMode" :options="modes" aria-label="正文格式" :disabled="busy || blocked" /><textarea v-if="bodyMode !== 'none'" v-model="body" :disabled="busy || blocked" :rows="5" :placeholder="bodyPlaceholder" aria-label="请求正文" spellcheck="false" /><div v-if="bodyMode === 'multipart'" class="dl-api-tester__files"><label>文件字段名<input v-model="fileField" :disabled="busy || blocked"></label><input type="file" multiple :disabled="busy || blocked" aria-label="选择上传文件" @change="selectFiles"></div></div>
    <div class="dl-api-tester__actions"><DlButton size="sm" variant="ghost" @click="copyCurl">复制 cURL</DlButton><label><input v-model="includeSecrets" type="checkbox">包含认证请求头</label><small>受目标接口 CORS 限制</small></div>
    <p v-if="error" role="alert" class="dl-api-tester__error">{{ error }}</p><p v-if="notice" role="status" class="dl-api-tester__hint">{{ notice }}</p>
    <div v-if="result" class="dl-api-tester__result"><div class="dl-api-tester__result-bar"><strong :class="{ 'dl-api-tester__error': result.status >= 400 }">HTTP {{ result.status }} {{ result.statusText }}</strong><span>{{ result.elapsed }} ms</span><DlButton size="sm" :variant="tab === 'body' ? 'secondary' : 'ghost'" @click="tab = 'body'">正文</DlButton><DlButton size="sm" :variant="tab === 'headers' ? 'secondary' : 'ghost'" @click="tab = 'headers'">响应头</DlButton></div><pre tabindex="0">{{ tab === 'body' ? result.body || '（空响应）' : result.headers || '（无可读取的响应头）' }}</pre><p v-if="result.truncated" class="dl-api-tester__hint">正文超过 1 MiB，已截断显示。</p></div>
  </section>
</template>
<style scoped>
.dl-api-tester__print{display:none}.dl-api-tester{border:1px solid var(--dl-border);border-radius:12px;padding:14px;display:grid;gap:10px;min-width:0;background:var(--dl-surface);color:var(--dl-text);font-size:13px}.dl-api-tester header,.dl-api-tester__actions,.dl-api-tester__result-bar{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.dl-api-tester header>span,.dl-api-tester small,.dl-api-tester__hint{color:var(--dl-text-muted);font-size:12px}.dl-api-tester header>span{margin-left:auto}.dl-api-tester__request{display:grid;grid-template-columns:110px minmax(0,1fr) auto;gap:8px;align-items:center}.dl-api-tester__grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}.dl-api-tester label{display:grid;gap:5px;font-size:12px}.dl-api-tester__wide{grid-column:1/-1}.dl-api-tester textarea,.dl-api-tester input:not([type=checkbox]){box-sizing:border-box;width:100%;min-width:0;border:1px solid var(--dl-border);border-radius:6px;padding:8px;background:transparent;color:inherit;font:inherit}.dl-api-tester textarea{resize:vertical;font-family:ui-monospace,monospace;line-height:1.45}.dl-api-tester summary{cursor:pointer;font-weight:500}.dl-api-tester__body{display:grid;gap:8px}.dl-api-tester__body>:first-child{max-width:210px}.dl-api-tester__files{display:grid;grid-template-columns:150px 1fr;gap:10px}.dl-api-tester__actions label{display:flex;align-items:center;gap:5px}.dl-api-tester__error{color:var(--dl-danger,#c43f46)}.dl-api-tester p{margin:0}.dl-api-tester__result{min-width:0;border-top:1px solid var(--dl-border);padding-top:10px}.dl-api-tester pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:340px;overflow:auto;font-size:12px;line-height:1.5;padding:10px;margin:8px 0 0;background:var(--dl-surface-soft);border-radius:6px}.dl-api-tester__result-bar>span{margin-right:auto;color:var(--dl-text-muted)}@media(max-width:600px){.dl-api-tester__request{grid-template-columns:100px 1fr}.dl-api-tester__request>:nth-child(2){grid-row:2;grid-column:1/-1}.dl-api-tester__request>:last-child{justify-self:end}.dl-api-tester__grid,.dl-api-tester__files{grid-template-columns:1fr}}@media print{.dl-api-tester > :not(header):not(.dl-api-tester__print){display:none!important}.dl-api-tester .dl-api-tester__print{display:block;white-space:pre-wrap;overflow-wrap:anywhere;max-height:none;background:transparent}.dl-api-tester__actions,.dl-api-tester__request>button,.dl-api-tester__parameters{display:none}.dl-api-tester pre{max-height:none}}
</style>
