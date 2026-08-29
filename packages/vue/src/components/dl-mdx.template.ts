import type { DlMdxRegistry } from './dl-mdx.registry'

export type DlMdxTemplateDiagnosticSeverity = 'error' | 'warning'

export interface DlMdxTemplateDiagnostic {
  code: string
  severity: DlMdxTemplateDiagnosticSeverity
  message: string
  line: number
  column: number
  from: number
  to: number
}

export type DlMdxTemplateExpression =
  | { type: 'literal'; value: unknown }
  | { type: 'identifier'; name: string }
  | { type: 'member'; object: DlMdxTemplateExpression; property: DlMdxTemplateExpression; computed: boolean }
  | { type: 'unary'; operator: '!' | '-' | '+'; argument: DlMdxTemplateExpression }
  | { type: 'binary'; operator: string; left: DlMdxTemplateExpression; right: DlMdxTemplateExpression }
  | { type: 'conditional'; test: DlMdxTemplateExpression; consequent: DlMdxTemplateExpression; alternate: DlMdxTemplateExpression }
  | { type: 'array'; elements: DlMdxTemplateExpression[] }
  | { type: 'object'; properties: Array<{ key: string; value: DlMdxTemplateExpression }> }

export type DlMdxTemplateAttributeValue =
  | { type: 'literal'; value: unknown }
  | { type: 'expression'; expression: DlMdxTemplateExpression }

export interface DlMdxTemplateAttribute {
  name: string
  value: DlMdxTemplateAttributeValue
}

export type DlMdxTemplateNode =
  | { type: 'text'; value: string; from: number }
  | { type: 'expression'; expression: DlMdxTemplateExpression; from: number }
  | { type: 'element'; name: string; attributes: DlMdxTemplateAttribute[]; children: DlMdxTemplateNode[]; from: number }

export interface DlMdxTemplateBinding {
  name: string
  expression: DlMdxTemplateExpression
}

export interface DlMdxTemplateFunction {
  name: string
  parameters: string[]
  bindings: DlMdxTemplateBinding[]
  root: DlMdxTemplateNode
  from: number
}

export interface DlMdxTemplateProgram {
  entry: string
  functions: Record<string, DlMdxTemplateFunction>
  diagnostics: DlMdxTemplateDiagnostic[]
}

export type DlMdxTemplateScope = Record<string, unknown>

type Token = { type: 'identifier' | 'number' | 'string' | 'operator' | 'punctuation' | 'eof'; value: string; from: number; to: number }

const forbiddenMembers = new Set(['__proto__', 'prototype', 'constructor'])
const nativeElements = new Set([
  'a', 'article', 'aside', 'b', 'br', 'button', 'code', 'div', 'em', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'header', 'hr', 'i', 'img', 'label', 'li', 'main', 'nav', 'ol', 'p', 'pre', 'section', 'small', 'span', 'strong',
  'sub', 'sup', 'time', 'ul',
])
const runtimeElements = new Set(['Fragment', 'If', 'Else', 'For', 'Slot', 'Fill'])

class TemplateSyntaxError extends Error {
  constructor(message: string, readonly position: number) { super(message) }
}

function positionOf(source: string, offset: number) {
  const prefix = source.slice(0, Math.max(0, offset))
  const lines = prefix.split('\n')
  return { line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 }
}

function diagnostic(source: string, code: string, message: string, from: number, to = from + 1): DlMdxTemplateDiagnostic {
  const position = positionOf(source, from)
  return { code, severity: 'error', message, ...position, from, to: Math.max(to, from + 1) }
}

class ExpressionLexer {
  private index = 0
  constructor(private readonly source: string, private readonly offset: number) {}

  next(): Token {
    while (/\s/.test(this.source[this.index] ?? '')) this.index += 1
    const from = this.index
    if (from >= this.source.length) return { type: 'eof', value: '', from: this.offset + from, to: this.offset + from }
    const character = this.source[from]
    if (/[A-Za-z_$]/.test(character)) {
      this.index += 1
      while (/[\w$]/.test(this.source[this.index] ?? '')) this.index += 1
      return { type: 'identifier', value: this.source.slice(from, this.index), from: this.offset + from, to: this.offset + this.index }
    }
    if (/\d/.test(character) || (character === '.' && /\d/.test(this.source[from + 1] ?? ''))) {
      const match = this.source.slice(from).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/)
      this.index += match?.[0].length ?? 1
      return { type: 'number', value: match?.[0] ?? character, from: this.offset + from, to: this.offset + this.index }
    }
    if (character === '"' || character === "'") {
      const quote = character
      this.index += 1
      let value = ''
      while (this.index < this.source.length) {
        const current = this.source[this.index++]
        if (current === quote) return { type: 'string', value, from: this.offset + from, to: this.offset + this.index }
        if (current !== '\\') { value += current; continue }
        const escaped = this.source[this.index++]
        value += ({ n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', '\\': '\\', '"': '"', "'": "'" } as Record<string, string>)[escaped] ?? escaped
      }
      throw new TemplateSyntaxError('字符串缺少结束引号。', this.offset + from)
    }
    const operator = ['===', '!==', '==', '!=', '>=', '<=', '&&', '||', '??', '>', '<', '+', '-', '*', '/', '%', '!'].find(value => this.source.startsWith(value, from))
    if (operator) {
      this.index += operator.length
      return { type: 'operator', value: operator, from: this.offset + from, to: this.offset + this.index }
    }
    if ('()[]{}.,?:'.includes(character)) {
      this.index += 1
      return { type: 'punctuation', value: character, from: this.offset + from, to: this.offset + this.index }
    }
    throw new TemplateSyntaxError(`表达式包含不支持的字符“${character}”。`, this.offset + from)
  }
}

class ExpressionParser {
  private current: Token
  constructor(source: string, offset = 0) {
    this.lexer = new ExpressionLexer(source, offset)
    this.current = this.lexer.next()
  }
  private readonly lexer: ExpressionLexer

  parse(): DlMdxTemplateExpression {
    const expression = this.parseConditional()
    if (this.current.type !== 'eof') throw new TemplateSyntaxError(`表达式在“${this.current.value}”前未结束。`, this.current.from)
    return expression
  }

  private advance() { const previous = this.current; this.current = this.lexer.next(); return previous }
  private accept(value: string) { if (this.current.value !== value) return false; this.advance(); return true }
  private expect(value: string) { if (!this.accept(value)) throw new TemplateSyntaxError(`表达式需要“${value}”。`, this.current.from) }

  private parseConditional(): DlMdxTemplateExpression {
    const test = this.parseBinary(0)
    if (!this.accept('?')) return test
    const consequent = this.parseConditional()
    this.expect(':')
    return { type: 'conditional', test, consequent, alternate: this.parseConditional() }
  }

  private parseBinary(minimum: number): DlMdxTemplateExpression {
    let left = this.parseUnary()
    const precedence: Record<string, number> = { '??': 1, '||': 2, '&&': 3, '==': 4, '!=': 4, '===': 4, '!==': 4, '>': 5, '>=': 5, '<': 5, '<=': 5, '+': 6, '-': 6, '*': 7, '/': 7, '%': 7 }
    while (this.current.type === 'operator' && (precedence[this.current.value] ?? -1) >= minimum) {
      const operator = this.advance().value
      const level = precedence[operator]
      const right = this.parseBinary(level + 1)
      left = { type: 'binary', operator, left, right }
    }
    return left
  }

  private parseUnary(): DlMdxTemplateExpression {
    if (this.current.type === 'operator' && ['!', '-', '+'].includes(this.current.value)) {
      const operator = this.advance().value as '!' | '-' | '+'
      return { type: 'unary', operator, argument: this.parseUnary() }
    }
    return this.parseMember()
  }

  private parseMember(): DlMdxTemplateExpression {
    let object = this.parsePrimary()
    while (true) {
      if (this.accept('.')) {
        if (this.current.type !== 'identifier') throw new TemplateSyntaxError('点号后需要属性名。', this.current.from)
        const property: DlMdxTemplateExpression = { type: 'literal', value: this.advance().value }
        object = { type: 'member', object, property, computed: false }
        continue
      }
      if (this.accept('[')) {
        const property = this.parseConditional()
        this.expect(']')
        object = { type: 'member', object, property, computed: true }
        continue
      }
      return object
    }
  }

  private parsePrimary(): DlMdxTemplateExpression {
    const token = this.current
    if (token.type === 'string') { this.advance(); return { type: 'literal', value: token.value } }
    if (token.type === 'number') { this.advance(); return { type: 'literal', value: Number(token.value) } }
    if (token.type === 'identifier') {
      this.advance()
      if (token.value === 'true') return { type: 'literal', value: true }
      if (token.value === 'false') return { type: 'literal', value: false }
      if (token.value === 'null') return { type: 'literal', value: null }
      if (token.value === 'undefined') return { type: 'literal', value: undefined }
      return { type: 'identifier', name: token.value }
    }
    if (this.accept('(')) {
      const value = this.parseConditional()
      this.expect(')')
      return value
    }
    if (this.accept('[')) {
      const elements: DlMdxTemplateExpression[] = []
      while (!this.accept(']')) {
        elements.push(this.parseConditional())
        if (!this.accept(',')) { this.expect(']'); break }
      }
      return { type: 'array', elements }
    }
    if (this.accept('{')) {
      const properties: Array<{ key: string; value: DlMdxTemplateExpression }> = []
      while (!this.accept('}')) {
        const keyToken = this.current
        if (!['identifier', 'string'].includes(keyToken.type)) throw new TemplateSyntaxError('对象属性需要名称。', keyToken.from)
        this.advance()
        this.expect(':')
        properties.push({ key: keyToken.value, value: this.parseConditional() })
        if (!this.accept(',')) { this.expect('}'); break }
      }
      return { type: 'object', properties }
    }
    throw new TemplateSyntaxError('表达式不完整。', token.from)
  }
}

export function parseDlMdxTemplateExpression(source: string, offset = 0): DlMdxTemplateExpression {
  return new ExpressionParser(source, offset).parse()
}

function binary(operator: string, left: unknown, right: unknown): unknown {
  if (operator === '??') return left ?? right
  if (operator === '||') return left || right
  if (operator === '&&') return left && right
  if (operator === '==') return left == right // eslint-disable-line eqeqeq
  if (operator === '!=') return left != right // eslint-disable-line eqeqeq
  if (operator === '===') return left === right
  if (operator === '!==') return left !== right
  if (operator === '+') return typeof left === 'string' || typeof right === 'string' ? String(left ?? '') + String(right ?? '') : Number(left) + Number(right)
  if (operator === '-') return Number(left) - Number(right)
  if (operator === '*') return Number(left) * Number(right)
  if (operator === '/') return Number(left) / Number(right)
  if (operator === '%') return Number(left) % Number(right)
  if (operator === '>') return Number(left) > Number(right)
  if (operator === '>=') return Number(left) >= Number(right)
  if (operator === '<') return Number(left) < Number(right)
  if (operator === '<=') return Number(left) <= Number(right)
  return undefined
}

export function evaluateDlMdxTemplateExpression(expression: DlMdxTemplateExpression, scope: DlMdxTemplateScope): unknown {
  if (expression.type === 'literal') return expression.value
  if (expression.type === 'identifier') return scope[expression.name]
  if (expression.type === 'array') return expression.elements.map(item => evaluateDlMdxTemplateExpression(item, scope))
  if (expression.type === 'object') return Object.fromEntries(expression.properties.map(item => [item.key, evaluateDlMdxTemplateExpression(item.value, scope)]))
  if (expression.type === 'unary') {
    const value = evaluateDlMdxTemplateExpression(expression.argument, scope)
    if (expression.operator === '!') return !value
    if (expression.operator === '-') return -Number(value)
    return Number(value)
  }
  if (expression.type === 'binary') {
    const left = evaluateDlMdxTemplateExpression(expression.left, scope)
    if (expression.operator === '&&' && !left) return left
    if (expression.operator === '||' && left) return left
    if (expression.operator === '??' && left !== null && left !== undefined) return left
    return binary(expression.operator, left, evaluateDlMdxTemplateExpression(expression.right, scope))
  }
  if (expression.type === 'conditional') {
    return evaluateDlMdxTemplateExpression(expression.test, scope)
      ? evaluateDlMdxTemplateExpression(expression.consequent, scope)
      : evaluateDlMdxTemplateExpression(expression.alternate, scope)
  }
  const object = evaluateDlMdxTemplateExpression(expression.object, scope)
  const property = String(evaluateDlMdxTemplateExpression(expression.property, scope) ?? '')
  if (!object || forbiddenMembers.has(property)) return undefined
  if (Array.isArray(object) && property === 'length') return object.length
  if (typeof object === 'string' && property === 'length') return object.length
  if (typeof object !== 'object' && typeof object !== 'function') return undefined
  return Object.prototype.hasOwnProperty.call(object, property) ? (object as Record<string, unknown>)[property] : undefined
}

function matching(source: string, start: number, open: string, close: string): number {
  let depth = 0
  let quote = ''
  let escaped = false
  for (let index = start; index < source.length; index += 1) {
    const character = source[index]
    if (quote) {
      if (escaped) escaped = false
      else if (character === '\\') escaped = true
      else if (character === quote) quote = ''
      continue
    }
    if (character === '"' || character === "'" || character === '`') { quote = character; continue }
    if (character === open) depth += 1
    if (character === close) {
      depth -= 1
      if (depth === 0) return index
    }
  }
  throw new TemplateSyntaxError(`缺少“${close}”。`, start)
}

class JsxParser {
  private index = 0
  constructor(private readonly source: string, private readonly offset: number) {}

  parseRoot(): DlMdxTemplateNode {
    this.skipWhitespace()
    const node = this.parseNode()
    this.skipWhitespace()
    if (this.index !== this.source.length) throw new TemplateSyntaxError('返回值只能包含一个根节点；请使用 <Fragment> 包裹并列节点。', this.offset + this.index)
    return node
  }

  private skipWhitespace() { while (/\s/.test(this.source[this.index] ?? '')) this.index += 1 }
  private parseNode(): DlMdxTemplateNode {
    if (this.source[this.index] === '<') return this.parseElement()
    if (this.source[this.index] === '{') return this.parseExpressionNode()
    return this.parseText()
  }

  private parseExpressionNode(): DlMdxTemplateNode {
    const from = this.index
    const end = matching(this.source, this.index, '{', '}')
    const expressionSource = this.source.slice(this.index + 1, end)
    this.index = end + 1
    return { type: 'expression', expression: parseDlMdxTemplateExpression(expressionSource, this.offset + from + 1), from: this.offset + from }
  }

  private parseText(): DlMdxTemplateNode {
    const from = this.index
    while (this.index < this.source.length && !'<{'.includes(this.source[this.index])) this.index += 1
    return { type: 'text', value: this.source.slice(from, this.index).replace(/\s+/g, ' '), from: this.offset + from }
  }

  private parseName(): string {
    const match = this.source.slice(this.index).match(/^[A-Za-z][A-Za-z0-9._:-]*/)
    if (!match) throw new TemplateSyntaxError('JSX 标签或属性名称无效。', this.offset + this.index)
    this.index += match[0].length
    return match[0]
  }

  private parseElement(): DlMdxTemplateNode {
    const from = this.index
    this.index += 1
    const name = this.parseName()
    const attributes: DlMdxTemplateAttribute[] = []
    while (this.index < this.source.length) {
      this.skipWhitespace()
      if (this.source.startsWith('/>', this.index)) {
        this.index += 2
        return { type: 'element', name, attributes, children: [], from: this.offset + from }
      }
      if (this.source[this.index] === '>') { this.index += 1; break }
      const attributeName = this.parseName()
      this.skipWhitespace()
      if (this.source[this.index] !== '=') {
        attributes.push({ name: attributeName, value: { type: 'literal', value: true } })
        continue
      }
      this.index += 1
      this.skipWhitespace()
      const character = this.source[this.index]
      if (character === '"' || character === "'") {
        const quote = character
        const valueFrom = ++this.index
        while (this.index < this.source.length && this.source[this.index] !== quote) this.index += this.source[this.index] === '\\' ? 2 : 1
        if (this.index >= this.source.length) throw new TemplateSyntaxError('JSX 属性缺少结束引号。', this.offset + valueFrom - 1)
        attributes.push({ name: attributeName, value: { type: 'literal', value: this.source.slice(valueFrom, this.index) } })
        this.index += 1
        continue
      }
      if (character === '{') {
        const end = matching(this.source, this.index, '{', '}')
        attributes.push({ name: attributeName, value: { type: 'expression', expression: parseDlMdxTemplateExpression(this.source.slice(this.index + 1, end), this.offset + this.index + 1) } })
        this.index = end + 1
        continue
      }
      throw new TemplateSyntaxError('JSX 属性值需要使用引号或 {表达式}。', this.offset + this.index)
    }
    const children: DlMdxTemplateNode[] = []
    while (this.index < this.source.length) {
      if (this.source.startsWith('</', this.index)) {
        this.index += 2
        const closing = this.parseName()
        this.skipWhitespace()
        if (this.source[this.index] !== '>') throw new TemplateSyntaxError('结束标签缺少“>”。', this.offset + this.index)
        this.index += 1
        if (closing !== name) throw new TemplateSyntaxError(`标签 <${name}> 不能由 </${closing}> 结束。`, this.offset + this.index)
        return { type: 'element', name, attributes, children, from: this.offset + from }
      }
      children.push(this.parseNode())
    }
    throw new TemplateSyntaxError(`标签 <${name}> 缺少结束标签。`, this.offset + from)
  }
}

function stripFrontMatter(source: string): { source: string; offset: number } {
  if (!source.startsWith('---\n') && !source.startsWith('---\r\n')) return { source, offset: 0 }
  const match = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)
  return match ? { source: source.slice(match[0].length), offset: match[0].length } : { source, offset: 0 }
}

function functionParameters(source: string): string[] {
  const body = source.trim().replace(/^\{/, '').replace(/\}$/, '')
  if (!body) return []
  return body.split(',').map(item => item.trim().split('=')[0].trim()).filter(name => /^[A-Za-z_$][\w$]*$/.test(name))
}

function parseFunctionBody(body: string, bodyOffset: number): { bindings: DlMdxTemplateBinding[]; root: DlMdxTemplateNode } {
  const returnMatch = /\breturn\b/.exec(body)
  if (!returnMatch) throw new TemplateSyntaxError('函数组件需要 return 一个 JSX 根节点。', bodyOffset)
  const prelude = body.slice(0, returnMatch.index)
  const bindings: DlMdxTemplateBinding[] = []
  const bindingPattern = /\bconst\s+([A-Za-z_$][\w$]*)\s*=\s*([^;\n]+)\s*;?/g
  for (const match of prelude.matchAll(bindingPattern)) {
    if (match[1] === '$dlx') throw new TemplateSyntaxError('$dlx 是只读运行时保留字，不能被局部变量覆盖。', bodyOffset + (match.index ?? 0))
    const expression = match[2].trim()
    const expressionAt = bodyOffset + (match.index ?? 0) + match[0].indexOf(match[2])
    bindings.push({ name: match[1], expression: parseDlMdxTemplateExpression(expression, expressionAt) })
  }
  let returned = body.slice(returnMatch.index + returnMatch[0].length).trim()
  let returnOffset = bodyOffset + returnMatch.index + returnMatch[0].length + body.slice(returnMatch.index + returnMatch[0].length).indexOf(returned)
  if (returned.endsWith(';')) returned = returned.slice(0, -1).trimEnd()
  if (returned.startsWith('(')) {
    const end = matching(returned, 0, '(', ')')
    if (returned.slice(end + 1).trim().replace(/;$/, '').trim()) throw new TemplateSyntaxError('return 后包含多余内容。', returnOffset + end + 1)
    returned = returned.slice(1, end)
    returnOffset += 1
  }
  return { bindings, root: new JsxParser(returned, returnOffset).parseRoot() }
}

function validateElements(program: DlMdxTemplateProgram, source: string, registry?: DlMdxRegistry) {
  const functions = new Set(Object.keys(program.functions))
  const visit = (node: DlMdxTemplateNode) => {
    if (node.type !== 'element') return
    if (registry && !runtimeElements.has(node.name) && !nativeElements.has(node.name) && !functions.has(node.name) && !registry.resolve(node.name)) {
      program.diagnostics.push(diagnostic(source, 'template.component.unknown', `未注册的模板组件：${node.name}。`, node.from, node.from + node.name.length + 1))
    }
    if (node.name === 'For' && !node.attributes.some(attribute => attribute.name === 'each')) {
      program.diagnostics.push(diagnostic(source, 'template.for.each', '<For> 必须提供 each 属性。', node.from))
    }
    node.children.forEach(visit)
  }
  Object.values(program.functions).forEach(component => visit(component.root))
}

export function parseDlMdxTemplate(input: string, registry?: DlMdxRegistry): DlMdxTemplateProgram {
  const stripped = stripFrontMatter(input)
  const source = stripped.source
  const sourceOffset = stripped.offset
  const functions: Record<string, DlMdxTemplateFunction> = {}
  const diagnostics: DlMdxTemplateDiagnostic[] = []
  let entry = ''
  const pattern = /\b(export\s+)?(default\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s*\{/g
  try {
    for (const match of source.matchAll(pattern)) {
      const from = match.index ?? 0
      const open = from + match[0].lastIndexOf('{')
      const close = matching(source, open, '{', '}')
      const name = match[3]
      if (!/^[A-Z][A-Za-z0-9_$]*$/.test(name)) throw new TemplateSyntaxError('函数组件名称必须以大写字母开头。', sourceOffset + from)
      if (/(?:^|[^\w$])\$dlx(?:$|[^\w$])/.test(match[4])) throw new TemplateSyntaxError('$dlx 由运行时自动提供，无需也不能声明为函数参数。', sourceOffset + from)
      const parsed = parseFunctionBody(source.slice(open + 1, close), sourceOffset + open + 1)
      functions[name] = { name, parameters: functionParameters(match[4]), ...parsed, from: sourceOffset + from }
      if (match[2]) entry = name
    }
    if (!Object.keys(functions).length) {
      const trimmed = source.trim()
      const at = sourceOffset + source.indexOf(trimmed)
      if (!trimmed) throw new TemplateSyntaxError('模板不能为空。', sourceOffset)
      functions.App = { name: 'App', parameters: [], bindings: [], root: new JsxParser(trimmed, at).parseRoot(), from: at }
      entry = 'App'
    }
    if (!entry) entry = functions.App ? 'App' : Object.keys(functions)[0]
  } catch (cause) {
    const error = cause instanceof TemplateSyntaxError ? cause : new TemplateSyntaxError(cause instanceof Error ? cause.message : String(cause), sourceOffset)
    diagnostics.push(diagnostic(input, 'template.syntax', error.message, error.position))
  }
  const program = { entry, functions, diagnostics }
  validateElements(program, input, registry)
  return program
}

export function analyzeDlMdxTemplate(source: string, registry?: DlMdxRegistry): DlMdxTemplateDiagnostic[] {
  return parseDlMdxTemplate(source, registry).diagnostics
}

export function isDlMdxTemplateNativeElement(name: string) { return nativeElements.has(name) }
