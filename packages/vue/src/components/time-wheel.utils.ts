export interface DlTimeWheelValue {
  hour: number
  minute: number
}

export function parseDlTimeWheelValue(value?: string | null): DlTimeWheelValue | null {
  const matched = /^(\d{2}):(\d{2})$/.exec(value?.trim() ?? '')
  if (!matched) return null
  const hour = Number(matched[1])
  const minute = Number(matched[2])
  if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) return null
  return { hour, minute }
}

export const formatDlTimeWheelValue = (hour: number, minute: number) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`

export function buildDlTimeWheelMinutes(step = 5): number[] {
  const safeStep = Math.max(1, Math.min(30, Math.round(step) || 5))
  const values: number[] = []
  for (let minute = 0; minute < 60; minute += safeStep) values.push(minute)
  if (60 % safeStep !== 0 && values.at(-1) !== 59) values.push(59)
  return values
}

export function clampDlTimeWheelMinute(minute: number, step = 5): number {
  return buildDlTimeWheelMinutes(step).reduce((nearest, candidate) =>
    Math.abs(candidate - minute) < Math.abs(nearest - minute) ? candidate : nearest, 0)
}
