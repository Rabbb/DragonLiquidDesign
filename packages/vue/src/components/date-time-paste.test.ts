import { describe, expect, it } from 'vitest'
import {
  parseDlPastedDate,
  parseDlPastedDateRange,
  parseDlPastedDateTimeLocal,
  parseDlPastedMonth,
  parseDlPastedMonthRange,
  parseDlPastedTime,
  parseDlPastedTimeRange,
  parseDlPastedYear,
  parseDlPastedYearRange,
} from './date-time-paste'

describe('date and time clipboard parsing', () => {
  it.each([
    ['2026-8-28', '2026-08-28'],
    ['2026/08/28', '2026-08-28'],
    ['2026年8月28日', '2026-08-28'],
    ['20260828', '2026-08-28'],
  ])('normalizes pasted date %s', (source, expected) => {
    expect(parseDlPastedDate(source)?.toString()).toBe(expected)
  })

  it('parses datetime, month, year and common time formats', () => {
    expect(parseDlPastedDate('2026-08-28 9:35', 'minute')?.toString()).toBe('2026-08-28T09:35:00')
    expect(parseDlPastedDateTimeLocal('2026/8/28 9:35')).toBe('2026-08-28T09:35')
    expect(parseDlPastedMonth('2026年8月')?.toString()).toBe('2026-08-01')
    expect(parseDlPastedYear('2026年')?.toString()).toBe('2026-01-01')
    expect(parseDlPastedTime('9点35分')?.toString()).toBe('09:35:00')
    expect(parseDlPastedTime('09:35 PM')?.toString()).toBe('21:35:00')
    expect(parseDlPastedMonthRange('2026-08 至 2026-11')?.end.toString()).toBe('2026-11-01')
    expect(parseDlPastedYearRange('2026年至2029年')?.end.toString()).toBe('2029-01-01')
  })

  it('parses ordered ranges and rejects invalid or reversed values', () => {
    expect(parseDlPastedDateRange('2026-08-01 至 2026-08-05')?.end.toString()).toBe('2026-08-05')
    expect(parseDlPastedTimeRange('09:30 ~ 18:00')?.end.toString()).toBe('18:00:00')
    expect(parseDlPastedDate('2026-02-30')).toBeNull()
    expect(parseDlPastedDateRange('2026-08-05 至 2026-08-01')).toBeNull()
  })
})
