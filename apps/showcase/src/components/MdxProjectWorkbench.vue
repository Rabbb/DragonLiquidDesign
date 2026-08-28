<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  createDlMdxEngine,
  createDlMdxLocalStorageAdapter,
  parseDlMdxProject,
  serializeDlMdxProject,
  DlMdx,
  type DlMdxActionMap,
  type DlMdxProjectEntry,
  type DlMdxProjectFileLanguage,
  type DlMdxProjectTreeNode,
} from '@dragon-liquid/vue'

type TreeRow = { entry: DlMdxProjectEntry; depth: number }

const projectId = 'dragon-liquid-online-project-demo'
const engine = createDlMdxEngine({
  project: {
    manifest: {
      id: projectId,
      name: 'Aurora Knowledge Base',
      version: '0.1.0',
      entry: '/pages/index.mdx',
      sharedScripts: ['/shared/actions.ts'],
      sharedStyles: ['/shared/theme.css'],
    },
    entries: [
      { kind: 'directory', path: '/' },
      { kind: 'directory', path: '/pages' },
      { kind: 'directory', path: '/pages/guide' },
      { kind: 'directory', path: '/shared' },
      { kind: 'directory', path: '/assets' },
      { kind: 'file', path: '/pages/index.mdx', language: 'mdx', encoding: 'utf8', content: '# Aurora Knowledge Base\n\n这是一个由 MarkdownX 引擎管理的线上项目。\n\n+++component:Button\nvariant = "primary"\n@click = saveProject\n+++end\n' },
      { kind: 'file', path: '/pages/index.ts', language: 'typescript', encoding: 'utf8', content: '/** Save the current online project. */\nexport function saveProject(context: ActionContext) {\n  return context.component.id\n}\n' },
      { kind: 'file', path: '/pages/index.css', language: 'css', encoding: 'utf8', content: '.home-page {\n  color: var(--dl-text);\n}\n' },
      { kind: 'file', path: '/pages/guide/index.mdx', language: 'mdx', encoding: 'utf8', content: '# Guide\n\n- [x] Create a project\n- [ ] Publish a route\n' },
      { kind: 'file', path: '/shared/actions.ts', language: 'typescript', encoding: 'utf8', content: '/** Navigate to a project route. */\nexport function openRoute(context: ActionContext) {\n  return context\n}\n' },
      { kind: 'file', path: '/shared/theme.css', language: 'css', encoding: 'utf8', content: ':root {\n  --project-accent: #e8b84e;\n}\n' },
      { kind: 'file', path: '/assets/readme.txt', language: 'text', encoding: 'utf8', content: 'Assets can be stored as UTF-8 or Base64 project files.\n' },
    ],
  },
})
const storage = createDlMdxLocalStorageAdapter({ prefix: 'dragon-liquid:showcase-project:' })
const snapshot = ref(engine.snapshot())
const selectedPath = ref('/pages/index.mdx')
const collapsed = ref(new Set<string>())
const newPath = ref('/pages/new-page.mdx')
const moveTarget = ref('/pages/index.mdx')
const message = ref('READY')
const build = ref(engine.build())
const importInput = ref<HTMLInputElement>()
let saveTimer: ReturnType<typeof setTimeout> | undefined

const actions: DlMdxActionMap = {
  saveProject: () => { void saveNow('PROJECT SAVED') },
  openRoute: ({ payload }) => { message.value = `ROUTE ACTION · ${String(payload[0] ?? '/')}` },
}

const treeRows = computed<TreeRow[]>(() => {
  void snapshot.value.revision
  const rows: TreeRow[] = []
  const visit = (node: DlMdxProjectTreeNode, depth: number) => {
    if (node.entry.path !== '/') rows.push({ entry: node.entry, depth })
    if (node.entry.kind === 'directory' && collapsed.value.has(node.entry.path)) return
    node.children.forEach(child => visit(child, node.entry.path === '/' ? 0 : depth + 1))
  }
  visit(engine.tree(), 0)
  return rows
})
const selectedEntry = computed(() => {
  void snapshot.value.revision
  return engine.read(selectedPath.value)
})
const selectedMdx = computed(() => selectedEntry.value?.kind === 'file' && selectedEntry.value.language === 'mdx')
const selectedDirectory = computed(() => selectedEntry.value?.kind === 'directory')
const pageBase = computed(() => selectedPath.value.replace(/\.(?:md|mdx)$/i, ''))
const scriptPath = computed(() => {
  void snapshot.value.revision
  return engine.exists(`${pageBase.value}.ts`) ? `${pageBase.value}.ts` : engine.exists(`${pageBase.value}.js`) ? `${pageBase.value}.js` : `${pageBase.value}.ts`
})
const stylePath = computed(() => `${pageBase.value}.css`)
const projectName = computed({
  get: () => snapshot.value.manifest.name,
  set: value => engine.updateManifest({ name: value }),
})
const mdxSource = computed({
  get: () => {
    void snapshot.value.revision
    return engine.readFile(selectedPath.value)?.content ?? ''
  },
  set: value => engine.writeFile(selectedPath.value, value, { language: 'mdx' }),
})
const scriptSource = computed({
  get: () => {
    void snapshot.value.revision
    return engine.readFile(scriptPath.value)?.content ?? ''
  },
  set: value => engine.writeFile(scriptPath.value, value, { language: scriptPath.value.endsWith('.js') ? 'javascript' : 'typescript' }),
})
const styleSource = computed({
  get: () => {
    void snapshot.value.revision
    return engine.readFile(stylePath.value)?.content ?? ''
  },
  set: value => engine.writeFile(stylePath.value, value, { language: 'css' }),
})
const genericContent = computed({
  get: () => selectedEntry.value?.kind === 'file' ? selectedEntry.value.content : '',
  set: value => {
    const entry = selectedEntry.value
    if (entry?.kind === 'file') engine.writeFile(entry.path, value, { language: entry.language, encoding: entry.encoding, mediaType: entry.mediaType })
  },
})
const routeForSelected = computed(() => build.value.routes.find(route => route.file === selectedPath.value)?.route)

const unsubscribe = engine.subscribe((event) => {
  snapshot.value = event.snapshot
  build.value = engine.build()
  message.value = `REVISION ${event.revision} · ${event.changes.length} CHANGE${event.changes.length === 1 ? '' : 'S'}`
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => { void saveNow('AUTO SAVED') }, 220)
})

onMounted(async () => {
  try {
    const restored = await engine.restore(storage, projectId)
    if (restored) message.value = 'LOCAL PROJECT RESTORED'
    else await engine.save(storage)
    if (!engine.exists(selectedPath.value)) selectedPath.value = engine.manifest().entry
    moveTarget.value = selectedPath.value
    snapshot.value = engine.snapshot()
    build.value = engine.build()
  } catch (cause) {
    message.value = cause instanceof Error ? cause.message : String(cause)
  }
})

onBeforeUnmount(() => {
  unsubscribe()
  if (saveTimer) clearTimeout(saveTimer)
})

function fileName(path: string) { return path === '/' ? '/' : path.slice(path.lastIndexOf('/') + 1) }
function toggleDirectory(path: string) {
  const next = new Set(collapsed.value)
  if (next.has(path)) next.delete(path)
  else next.add(path)
  collapsed.value = next
}
function selectEntry(entry: DlMdxProjectEntry) {
  selectedPath.value = entry.path
  moveTarget.value = entry.path
  if (entry.kind === 'directory') toggleDirectory(entry.path)
}
function createFile() {
  try {
    const path = newPath.value.trim()
    if (!path) return
    engine.writeFile(path, path.endsWith('.mdx') ? '# New page\n' : '', { language: languageFor(path) })
    selectedPath.value = engine.read(path)?.path ?? selectedPath.value
    moveTarget.value = selectedPath.value
  } catch (cause) { message.value = cause instanceof Error ? cause.message : String(cause) }
}
function createDirectory() {
  try {
    engine.createDirectory(newPath.value)
    selectedPath.value = engine.read(newPath.value)?.path ?? selectedPath.value
    moveTarget.value = selectedPath.value
  } catch (cause) { message.value = cause instanceof Error ? cause.message : String(cause) }
}
function moveSelected() {
  try {
    const previous = selectedPath.value
    engine.move(previous, moveTarget.value)
    selectedPath.value = engine.read(moveTarget.value)?.path ?? previous
  } catch (cause) { message.value = cause instanceof Error ? cause.message : String(cause) }
}
function removeSelected() {
  try {
    if (selectedPath.value === '/') return
    engine.remove(selectedPath.value, true)
    selectedPath.value = engine.exists(snapshot.value.manifest.entry) ? snapshot.value.manifest.entry : '/'
    moveTarget.value = selectedPath.value
  } catch (cause) { message.value = cause instanceof Error ? cause.message : String(cause) }
}
function languageFor(path: string): DlMdxProjectFileLanguage {
  if (/\.mdx?$/i.test(path)) return 'mdx'
  if (/\.tsx?$/i.test(path)) return 'typescript'
  if (/\.(?:m?js|jsx)$/i.test(path)) return 'javascript'
  if (/\.css$/i.test(path)) return 'css'
  if (/\.json$/i.test(path)) return 'json'
  return 'text'
}
function rebuild() {
  build.value = engine.build()
  message.value = build.value.ok ? `BUILD READY · ${build.value.routes.length} ROUTES` : `BUILD FAILED · ${build.value.diagnostics.length} DIAGNOSTICS`
}
async function saveNow(label: string) {
  try { await engine.save(storage); message.value = label }
  catch (cause) { message.value = cause instanceof Error ? cause.message : String(cause) }
}
function exportProject() {
  const blob = new Blob([serializeDlMdxProject(engine.snapshot())], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${engine.manifest().id}.dl-mdx.json`
  anchor.click()
  URL.revokeObjectURL(url)
  message.value = 'PROJECT EXPORTED'
}
async function importProject(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  try {
    const imported = parseDlMdxProject(await file.text())
    engine.replace({ ...imported, manifest: { ...imported.manifest, id: projectId } })
    selectedPath.value = engine.manifest().entry
    moveTarget.value = selectedPath.value
    message.value = 'PROJECT IMPORTED'
  } catch (cause) { message.value = cause instanceof Error ? cause.message : String(cause) }
  if (importInput.value) importInput.value.value = ''
}
function openRoute(file: string) {
  selectedPath.value = file
  moveTarget.value = file
}
</script>

<template>
  <section class="mdx-project-workbench">
    <header class="mdx-project-bar">
      <label><span>PROJECT</span><input v-model="projectName" aria-label="项目名称"></label>
      <div class="mdx-project-actions">
        <button type="button" @click="rebuild">Build</button>
        <button type="button" @click="exportProject">Export</button>
        <button type="button" @click="importInput?.click()">Import</button>
        <input ref="importInput" class="visually-hidden" type="file" accept=".json,.dl-mdx.json,application/json" @change="importProject">
      </div>
      <output :class="{ error: !build.ok }">{{ message }}</output>
    </header>

    <div class="mdx-project-layout">
      <aside class="mdx-project-explorer">
        <header><b>EXPLORER</b><small>{{ snapshot.entries.length - 1 }} entries</small></header>
        <div class="mdx-project-tree" role="tree" aria-label="项目目录">
          <button
            v-for="row in treeRows"
            :key="row.entry.path"
            type="button"
            role="treeitem"
            :aria-selected="selectedPath === row.entry.path"
            :aria-expanded="row.entry.kind === 'directory' ? !collapsed.has(row.entry.path) : undefined"
            :class="{ active: selectedPath === row.entry.path, directory: row.entry.kind === 'directory' }"
            :style="{ '--tree-depth': row.depth }"
            @click="selectEntry(row.entry)"
          >
            <i>{{ row.entry.kind === 'directory' ? (collapsed.has(row.entry.path) ? '▸' : '▾') : '·' }}</i>
            <span>{{ fileName(row.entry.path) }}</span>
            <em v-if="row.entry.kind === 'file'">{{ row.entry.language }}</em>
          </button>
        </div>
        <div class="mdx-project-create">
          <input v-model="newPath" aria-label="新路径" placeholder="/pages/new-page.mdx" @keydown.enter="createFile">
          <button type="button" @click="createFile">+ File</button><button type="button" @click="createDirectory">+ Folder</button>
        </div>
        <div v-if="selectedPath !== '/'" class="mdx-project-move">
          <input v-model="moveTarget" aria-label="移动目标" @keydown.enter="moveSelected">
          <button type="button" :disabled="moveTarget === selectedPath" @click="moveSelected">Move</button>
          <button class="danger" type="button" @click="removeSelected">Delete</button>
        </div>
      </aside>

      <main class="mdx-project-editor">
        <nav v-if="build.routes.length" class="mdx-project-routes" aria-label="构建路由">
          <button v-for="route in build.routes" :key="route.route" type="button" :class="{ active: route.file === selectedPath }" @click="openRoute(route.file)">{{ route.route }}</button>
        </nav>
        <div class="mdx-project-file-head">
          <span>{{ selectedPath }}</span>
          <code v-if="routeForSelected">ROUTE {{ routeForSelected }}</code>
          <code v-else-if="selectedEntry?.kind === 'file'">{{ selectedEntry.language.toUpperCase() }}</code>
          <code v-else>DIRECTORY</code>
        </div>
        <DlMdx
          v-if="selectedMdx"
          v-model="mdxSource"
          v-model:script-value="scriptSource"
          v-model:style-value="styleSource"
          :actions="actions"
          show-companion-documents
          mode="split"
          min-height="34rem"
          aria-label="MarkdownX 项目文件"
        />
        <textarea v-else-if="selectedEntry?.kind === 'file'" v-model="genericContent" class="mdx-project-code" :aria-label="`${selectedPath} 源码`" spellcheck="false" />
        <div v-else class="mdx-project-directory-empty">
          <b>{{ selectedDirectory ? 'DIRECTORY SELECTED' : 'SELECT A FILE' }}</b>
          <span>选择一个 MDX 页面进入可视化工作区，或选择脚本、样式和数据文件直接编辑。</span>
        </div>
      </main>
    </div>

    <footer class="mdx-project-status">
      <span>REV {{ snapshot.revision }}</span><span>{{ build.routes.length }} ROUTES</span>
      <span>{{ build.diagnostics.length }} DIAGNOSTICS</span><span class="spacer" />
      <span>LOCAL AUTO-SAVE</span><span>NO SCRIPT EVAL</span>
    </footer>
  </section>
</template>

<style scoped>
.mdx-project-workbench{overflow:hidden;border:1px solid var(--dl-border);border-radius:20px;background:var(--dl-surface);box-shadow:var(--dl-shadow-md)}.mdx-project-bar{display:grid;grid-template-columns:minmax(240px,1fr) auto minmax(180px,auto);gap:12px;align-items:center;padding:11px 13px;border-bottom:1px solid var(--dl-border);background:var(--dl-night-soft)}.mdx-project-bar label{display:flex;align-items:center;gap:10px;min-width:0}.mdx-project-bar label span,.mdx-project-explorer header,.mdx-project-status{color:var(--dl-text-faint);font:800 .62rem/1 ui-monospace,monospace;letter-spacing:.09em}.mdx-project-bar input,.mdx-project-create input,.mdx-project-move input{min-width:0;width:100%;padding:8px 10px;border:1px solid var(--dl-border);border-radius:9px;color:var(--dl-text);background:var(--dl-surface)}.mdx-project-actions{display:flex;gap:5px}.mdx-project-actions button,.mdx-project-create button,.mdx-project-move button,.mdx-project-routes button{padding:8px 10px;border:1px solid var(--dl-border);border-radius:9px;color:var(--dl-text-muted);background:var(--dl-surface);font-size:.7rem;font-weight:750;cursor:pointer}.mdx-project-actions button:hover,.mdx-project-create button:hover,.mdx-project-move button:hover,.mdx-project-routes button:hover,.mdx-project-routes button.active{border-color:var(--dl-accent-border);color:var(--dl-accent-text);background:var(--dl-accent-surface)}.mdx-project-bar output{justify-self:end;color:var(--dl-accent-text);font:700 .63rem/1 ui-monospace,monospace}.mdx-project-bar output.error{color:var(--dl-danger,#dc2626)}.mdx-project-layout{display:grid;grid-template-columns:270px minmax(0,1fr);min-height:38rem}.mdx-project-explorer{display:grid;grid-template-rows:auto minmax(0,1fr) auto auto;min-width:0;border-right:1px solid var(--dl-border);background:var(--dl-night-soft)}.mdx-project-explorer>header{display:flex;justify-content:space-between;padding:13px}.mdx-project-explorer>header small{font:inherit}.mdx-project-tree{overflow:auto;padding:3px 7px 12px}.mdx-project-tree button{appearance:none;display:grid;grid-template-columns:16px minmax(0,1fr) auto;width:100%;align-items:center;gap:5px;padding:7px 7px 7px calc(7px + var(--tree-depth)*14px);border:0;border-radius:8px;color:var(--dl-text-muted);background:transparent;text-align:left;cursor:pointer}.mdx-project-tree button:hover{background:var(--dl-accent-surface)}.mdx-project-tree button.active{color:var(--dl-accent-text);background:var(--dl-accent-surface)}.mdx-project-tree i{color:var(--dl-text-faint);font-style:normal}.mdx-project-tree span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mdx-project-tree em{color:var(--dl-text-faint);font:600 .48rem/1 ui-monospace,monospace;text-transform:uppercase}.mdx-project-tree .directory span{font-weight:700}.mdx-project-create,.mdx-project-move{display:grid;grid-template-columns:1fr 1fr;gap:5px;padding:8px;border-top:1px solid var(--dl-border)}.mdx-project-create input,.mdx-project-move input{grid-column:1/-1}.mdx-project-move .danger{color:var(--dl-danger,#dc2626)}.mdx-project-editor{display:grid;grid-template-rows:auto auto minmax(0,1fr);min-width:0}.mdx-project-routes{display:flex;gap:4px;overflow-x:auto;padding:8px 10px;border-bottom:1px solid var(--dl-border);background:var(--dl-night-soft)}.mdx-project-file-head{display:flex;align-items:center;gap:12px;padding:9px 13px;border-bottom:1px solid var(--dl-border);color:var(--dl-text-muted);font:700 .68rem/1 ui-monospace,monospace}.mdx-project-file-head code{margin-left:auto;color:var(--dl-accent-text)}.mdx-project-code{resize:none;width:100%;min-height:34rem;padding:20px;border:0;outline:0;color:var(--dl-text);background:linear-gradient(180deg,var(--dl-surface),var(--dl-night-soft));font:500 .83rem/1.75 "Cascadia Code",Consolas,monospace;tab-size:2}.mdx-project-directory-empty{display:grid;place-content:center;gap:10px;padding:40px;color:var(--dl-text-faint);text-align:center}.mdx-project-directory-empty b{color:var(--dl-accent-text);font:800 .7rem/1 ui-monospace,monospace;letter-spacing:.1em}.mdx-project-status{display:flex;gap:14px;padding:9px 13px;border-top:1px solid var(--dl-border);background:var(--dl-night-soft)}.mdx-project-status .spacer{flex:1}.visually-hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
@media(max-width:900px){.mdx-project-bar{grid-template-columns:1fr}.mdx-project-bar output{justify-self:start}.mdx-project-layout{grid-template-columns:1fr}.mdx-project-explorer{max-height:26rem;border-right:0;border-bottom:1px solid var(--dl-border)}.mdx-project-status{flex-wrap:wrap}.mdx-project-status .spacer{display:none}}
</style>
