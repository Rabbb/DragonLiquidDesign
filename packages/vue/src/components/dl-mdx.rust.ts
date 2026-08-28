import type { DlMdxDocument, DlMdxHighlightedCode } from './dl-mdx.types'
import {
  dlMdxRustWasmBase64,
  dlMdxRustWasmByteLength,
  dlMdxRustWasmSha256,
} from './dl-mdx-core.wasm.generated'

type DlMdxRustExports = {
  memory: WebAssembly.Memory
  dl_mdx_abi_version: () => number
  dl_mdx_alloc: (length: number) => number
  dl_mdx_dealloc: (pointer: number, capacity: number) => void
  dl_mdx_parse: (pointer: number, length: number) => number
  dl_mdx_highlight: (sourcePointer: number, sourceLength: number, languagePointer: number, languageLength: number) => number
  dl_mdx_output_len: () => number
  dl_mdx_release_output: () => void
  dl_mdx_fnv1a: (pointer: number, length: number) => number
  dl_mdx_inspect_url: (pointer: number, length: number) => number
}

export type DlMdxUrlInspection = 'invalid' | 'relative' | 'protocol-relative' | 'http' | 'https' | 'mailto' | 'tel' | 'data' | 'blob' | 'other'

export interface DlMdxRustCoreStatus {
  engine: 'rust-wasm'
  available: boolean
  abiVersion: number
  binarySize: number
  binaryFingerprint: string
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()
let rustExports: DlMdxRustExports | undefined

function decodeBase64(value: string): Uint8Array<ArrayBuffer> {
  if (typeof globalThis.atob !== 'function') throw new Error('当前环境缺少 Base64 解码能力，无法启动 Rust MarkdownX 核心。')
  const binary = globalThis.atob(value)
  const bytes = new Uint8Array(new ArrayBuffer(binary.length))
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

function core(): DlMdxRustExports {
  if (rustExports) return rustExports
  if (typeof WebAssembly === 'undefined') throw new Error('当前环境不支持 WebAssembly，无法启动 Rust MarkdownX 核心。')
  const module = new WebAssembly.Module(decodeBase64(dlMdxRustWasmBase64))
  rustExports = new WebAssembly.Instance(module).exports as unknown as DlMdxRustExports
  if (rustExports.dl_mdx_abi_version() !== 2) throw new Error(`不兼容的 Rust MarkdownX ABI：${rustExports.dl_mdx_abi_version()}`)
  return rustExports
}

function withUtf8Input<T>(value: string, callback: (exports: DlMdxRustExports, pointer: number, length: number) => T): T {
  const exports = core()
  const bytes = encoder.encode(value)
  const pointer = exports.dl_mdx_alloc(bytes.byteLength)
  try {
    if (bytes.byteLength) new Uint8Array(exports.memory.buffer, pointer, bytes.byteLength).set(bytes)
    return callback(exports, pointer, bytes.byteLength)
  } finally {
    exports.dl_mdx_dealloc(pointer, bytes.byteLength)
  }
}

function withTwoUtf8Inputs<T>(first: string, second: string, callback: (exports: DlMdxRustExports, firstPointer: number, firstLength: number, secondPointer: number, secondLength: number) => T): T {
  const exports = core()
  const firstBytes = encoder.encode(first)
  const secondBytes = encoder.encode(second)
  const firstPointer = exports.dl_mdx_alloc(firstBytes.byteLength)
  let secondPointer = 0
  try {
    if (firstBytes.byteLength) new Uint8Array(exports.memory.buffer, firstPointer, firstBytes.byteLength).set(firstBytes)
    secondPointer = exports.dl_mdx_alloc(secondBytes.byteLength)
    if (secondBytes.byteLength) new Uint8Array(exports.memory.buffer, secondPointer, secondBytes.byteLength).set(secondBytes)
    return callback(exports, firstPointer, firstBytes.byteLength, secondPointer, secondBytes.byteLength)
  } finally {
    if (secondPointer) exports.dl_mdx_dealloc(secondPointer, secondBytes.byteLength)
    exports.dl_mdx_dealloc(firstPointer, firstBytes.byteLength)
  }
}

function readJsonOutput<T>(exports: DlMdxRustExports, outputPointer: number): T {
  const outputLength = exports.dl_mdx_output_len()
  try {
    const json = decoder.decode(new Uint8Array(exports.memory.buffer, outputPointer, outputLength))
    return JSON.parse(json) as T
  } finally {
    exports.dl_mdx_release_output()
  }
}

export function parseDlMdxWithRust(source: string): DlMdxDocument {
  return withUtf8Input(source, (exports, pointer, length) => {
    const outputPointer = exports.dl_mdx_parse(pointer, length)
    return readJsonOutput<DlMdxDocument>(exports, outputPointer)
  })
}

export function highlightDlMdxCodeWithRust(source: string, language: string): DlMdxHighlightedCode {
  return withTwoUtf8Inputs(source, language, (exports, sourcePointer, sourceLength, languagePointer, languageLength) => {
    const outputPointer = exports.dl_mdx_highlight(sourcePointer, sourceLength, languagePointer, languageLength)
    return readJsonOutput<DlMdxHighlightedCode>(exports, outputPointer)
  })
}

export function hashDlMdxWithRust(value: string): number {
  return withUtf8Input(value, (exports, pointer, length) => exports.dl_mdx_fnv1a(pointer, length) >>> 0)
}

export function inspectDlMdxUrlWithRust(value: string): DlMdxUrlInspection {
  const result = withUtf8Input(value, (exports, pointer, length) => exports.dl_mdx_inspect_url(pointer, length))
  return (['invalid', 'relative', 'protocol-relative', 'http', 'https', 'mailto', 'tel', 'data', 'blob', 'other'] as const)[result] ?? 'invalid'
}

export function getDlMdxRustCoreStatus(): DlMdxRustCoreStatus {
  try {
    return Object.freeze({
      engine: 'rust-wasm',
      available: true,
      abiVersion: core().dl_mdx_abi_version(),
      binarySize: dlMdxRustWasmByteLength,
      binaryFingerprint: dlMdxRustWasmSha256,
    })
  } catch {
    return Object.freeze({
      engine: 'rust-wasm',
      available: false,
      abiVersion: 0,
      binarySize: dlMdxRustWasmByteLength,
      binaryFingerprint: dlMdxRustWasmSha256,
    })
  }
}
