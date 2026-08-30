export interface DlSearchFields {
  label: string
  value: string
  description: string
  keywords: string[]
}

export interface DlSearchMatchSegment { text: string; matched: boolean }
export interface DlSearchHiddenMatch { key: string; kind: '关键词' | '值'; segments: DlSearchMatchSegment[] }
export interface DlSearchMatchPresentation {
  label: DlSearchMatchSegment[]
  description: DlSearchMatchSegment[]
  hidden: DlSearchHiddenMatch[]
}

export const normalizeDlSearch = (value: string): string => value.normalize('NFKC').trim().toLocaleLowerCase()

export function matchDlSearchCharacterIndexes(source: string, keyword: string): number[] | null {
  if (!keyword) return null
  const sourceCharacters = [...source]
  const normalizedCharacters: string[] = []
  const sourceIndexes: number[] = []
  sourceCharacters.forEach((character, sourceIndex) => {
    for (const normalizedCharacter of normalizeDlSearch(character)) {
      normalizedCharacters.push(normalizedCharacter)
      sourceIndexes.push(sourceIndex)
    }
  })

  const keywordCharacters = [...normalizeDlSearch(keyword)]
  const exactLimit = normalizedCharacters.length - keywordCharacters.length
  for (let start = 0; start <= exactLimit; start += 1) {
    if (keywordCharacters.every((character, offset) => normalizedCharacters[start + offset] === character)) {
      return [...new Set(keywordCharacters.map((_, offset) => sourceIndexes[start + offset]))]
    }
  }

  const indexes: number[] = []
  let cursor = 0
  for (const character of keywordCharacters) {
    const matchedIndex = normalizedCharacters.indexOf(character, cursor)
    if (matchedIndex < 0) return null
    indexes.push(sourceIndexes[matchedIndex]!)
    cursor = matchedIndex + 1
  }
  return [...new Set(indexes)]
}

export const matchesDlSearchField = (source: string, keyword: string): boolean =>
  matchDlSearchCharacterIndexes(source, keyword) !== null

export function segmentDlSearchMatch(source: string, keyword: string): DlSearchMatchSegment[] {
  if (!source) return []
  const matchedIndexes = new Set(matchDlSearchCharacterIndexes(source, keyword) ?? [])
  const segments: DlSearchMatchSegment[] = []
  for (const [index, character] of [...source].entries()) {
    const matched = matchedIndexes.has(index)
    const previous = segments.at(-1)
    if (previous?.matched === matched) previous.text += character
    else segments.push({ text: character, matched })
  }
  return segments
}

export const matchesDlSearchFields = (fields: DlSearchFields, keyword: string): boolean =>
  [fields.label, fields.value, fields.description, ...fields.keywords].some(field => matchesDlSearchField(field, keyword))

export function buildDlSearchMatchPresentation(fields: DlSearchFields, keyword: string): DlSearchMatchPresentation {
  const hidden: DlSearchHiddenMatch[] = []
  const shown = new Set<string>()
  fields.keywords.forEach((candidate, index) => {
    if (!matchesDlSearchField(candidate, keyword)) return
    const normalized = normalizeDlSearch(candidate)
    if (shown.has(normalized)) return
    shown.add(normalized)
    hidden.push({ key: `keyword-${index}`, kind: '关键词', segments: segmentDlSearchMatch(candidate, keyword) })
  })
  const normalizedValue = normalizeDlSearch(fields.value)
  if (matchesDlSearchField(fields.value, keyword)
    && normalizedValue !== normalizeDlSearch(fields.label)
    && !shown.has(normalizedValue)) {
    hidden.push({ key: 'value', kind: '值', segments: segmentDlSearchMatch(fields.value, keyword) })
  }
  return {
    label: segmentDlSearchMatch(fields.label, keyword),
    description: segmentDlSearchMatch(fields.description, keyword),
    hidden,
  }
}
