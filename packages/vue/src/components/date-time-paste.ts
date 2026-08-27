import { CalendarDate, CalendarDateTime, Time } from '@internationalized/date'

export type DlDateGranularity = 'day' | 'hour' | 'minute' | 'second'
export type DlTimeGranularity = 'hour' | 'minute' | 'second'

const normalize = (value: string) => value.normalize('NFKC').trim()

function validDate(year: number, month: number, day: number) {
  try {
    const value = new CalendarDate(year, month, day)
    return value.year === year && value.month === month && value.day === day ? value : null
  }
  catch {
    return null
  }
}

function dateParts(value: string) {
  const source = normalize(value)
  const separated = /(?:^|\D)(\d{4})\s*(?:[-/.年])\s*(\d{1,2})\s*(?:[-/.月])\s*(\d{1,2})(?:\s*日)?(?:\D|$)/.exec(source)
  const compact = /(?:^|\D)(\d{4})(\d{2})(\d{2})(?:\D|$)/.exec(source)
  const match = separated ?? compact
  if (!match) return null
  const [year, month, day] = match.slice(1, 4).map(Number)
  return validDate(year, month, day)
}

function timeParts(value: string) {
  const source = normalize(value)
    .replace(/[时點点]/g, ':')
    .replace(/[分]/g, '')
    .replace(/：/g, ':')
  const meridiemMatch = /\b(pm|am)\b|上午|下午|晚上|凌晨/i.exec(source)?.[0]?.toLowerCase()
  const meridiem = meridiemMatch === 'pm' || meridiemMatch === '下午' || meridiemMatch === '晚上'
    ? 'pm'
    : meridiemMatch ? 'am' : undefined
  const separated = /(?:^|[^\d])(\d{1,2})\s*:\s*(\d{1,2})(?:\s*:\s*(\d{1,2}))?(?:[^\d]|$)/.exec(source)
  const compact = /^\s*(\d{2})(\d{2})(\d{2})?\s*$/.exec(source)
  const match = separated ?? compact
  if (!match) return null
  let hour = Number(match[1])
  const minute = Number(match[2])
  const second = Number(match[3] ?? 0)
  if (meridiem) {
    if (hour < 1 || hour > 12) return null
    if (meridiem === 'pm' && hour < 12) hour += 12
    if (meridiem === 'am' && hour === 12) hour = 0
  }
  if (hour > 23 || minute > 59 || second > 59) return null
  return { hour, minute, second }
}

export function parseDlPastedDate(value: string, granularity: DlDateGranularity = 'day') {
  const date = dateParts(value)
  if (!date) return null
  if (granularity === 'day') return date
  const time = timeParts(value) ?? { hour: 0, minute: 0, second: 0 }
  return new CalendarDateTime(
    date.year,
    date.month,
    date.day,
    time.hour,
    granularity === 'hour' ? 0 : time.minute,
    granularity === 'second' ? time.second : 0,
  )
}

export function parseDlPastedTime(value: string, granularity: DlTimeGranularity = 'minute') {
  const time = timeParts(value)
  if (!time) return null
  return new Time(
    time.hour,
    granularity === 'hour' ? 0 : time.minute,
    granularity === 'second' ? time.second : 0,
  )
}

export function parseDlPastedDateRange(value: string, granularity: DlDateGranularity = 'day') {
  const matches = [...normalize(value).matchAll(/\d{4}\s*(?:[-/.年])\s*\d{1,2}\s*(?:[-/.月])\s*\d{1,2}(?:\s*日)?(?:[ T]\d{1,2}(?::|：|时|点)\d{1,2}(?:(?::|：)\d{1,2})?)?|\d{8}/g)]
    .map(match => parseDlPastedDate(match[0], granularity))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
  if (matches.length < 2 || matches[0].compare(matches[1]) > 0) return null
  return { start: matches[0], end: matches[1] }
}

export function parseDlPastedTimeRange(value: string, granularity: DlTimeGranularity = 'minute') {
  const matches = [...normalize(value).matchAll(/\d{1,2}\s*(?::|：|时|点)\s*\d{1,2}(?:(?::|：)\d{1,2})?\s*(?:am|pm)?/gi)]
    .map(match => parseDlPastedTime(match[0], granularity))
    .filter((item): item is Time => Boolean(item))
  if (matches.length < 2 || compareDlTimes(matches[0], matches[1]) > 0) return null
  return { start: matches[0], end: matches[1] }
}

export function parseDlPastedMonth(value: string) {
  const source = normalize(value)
  const match = /(?:^|\D)(\d{4})\s*(?:[-/.年])\s*(\d{1,2})(?:\s*月)?(?:\D|$)/.exec(source)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  return month >= 1 && month <= 12 ? new CalendarDate(year, month, 1) : null
}

export function parseDlPastedYear(value: string) {
  const match = /^\s*(\d{4})(?:\s*年)?\s*$/.exec(normalize(value))
  return match ? new CalendarDate(Number(match[1]), 1, 1) : null
}

export function parseDlPastedMonthRange(value: string) {
  const matches = [...normalize(value).matchAll(/\d{4}\s*(?:[-/.年])\s*\d{1,2}(?:\s*月)?/g)]
    .map(match => parseDlPastedMonth(match[0]))
    .filter((item): item is CalendarDate => Boolean(item))
  if (matches.length < 2 || matches[0].compare(matches[1]) > 0) return null
  return { start: matches[0], end: matches[1] }
}

export function parseDlPastedYearRange(value: string) {
  const matches = [...normalize(value).matchAll(/(?:^|\D)(\d{4})(?:\s*年)?(?=\D|$)/g)]
    .map(match => new CalendarDate(Number(match[1]), 1, 1))
  if (matches.length < 2 || matches[0].compare(matches[1]) > 0) return null
  return { start: matches[0], end: matches[1] }
}

export function parseDlPastedDateTimeLocal(value: string) {
  const parsed = parseDlPastedDate(value, 'minute')
  return parsed instanceof CalendarDateTime
    ? `${String(parsed.year).padStart(4, '0')}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}T${String(parsed.hour).padStart(2, '0')}:${String(parsed.minute).padStart(2, '0')}`
    : null
}

export function compareDlTimes(left: { hour: number; minute: number; second?: number }, right: { hour: number; minute: number; second?: number }) {
  return left.hour * 3600 + left.minute * 60 + (left.second ?? 0)
    - (right.hour * 3600 + right.minute * 60 + (right.second ?? 0))
}

export function dlClipboardText(event: ClipboardEvent) {
  return event.clipboardData?.getData('text/plain')?.trim() ?? ''
}
