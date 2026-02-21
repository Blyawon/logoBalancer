import type { GeneratedToken, DimensionConfig } from './types'

export function exportCSS(tokens: GeneratedToken[], _config: DimensionConfig): string {
  const lines = tokens.map(t => {
    const value = t.fluidValue ?? t.displayValue
    return `  ${t.cssVar}: ${value};`
  })
  return `:root {\n${lines.join('\n')}\n}`
}

export function exportTailwind(tokens: GeneratedToken[], _config: DimensionConfig): string {
  const entries = tokens.map(t => `      '${t.name}': '${t.displayValue}',`)
  return `module.exports = {\n  theme: {\n    spacing: {\n${entries.join('\n')}\n    }\n  }\n}`
}

export function exportJSON(tokens: GeneratedToken[], config: DimensionConfig): string {
  const obj: Record<string, { $type: string; $value: string }> = {}
  for (const t of tokens) {
    obj[t.name] = {
      $type: 'dimension',
      $value: t.fluidValue ?? t.displayValue,
    }
  }
  return JSON.stringify({ [config.tokenPrefix]: obj }, null, 2)
}

export function exportFigma(tokens: GeneratedToken[], config: DimensionConfig): string {
  const variables = tokens.map(t => ({
    name: `${config.tokenPrefix}/${t.name}`,
    value: t.value,
    type: 'FLOAT',
  }))
  return JSON.stringify({ variables }, null, 2)
}

export function exportAIPrompt(tokens: GeneratedToken[], config: DimensionConfig): string {
  const tokenList = tokens.map(t => `- ${t.name}: ${t.displayValue}`).join('\n')
  return `You are implementing a spacing scale for a design system.

Base unit: ${config.base}px
Scale factor: ${config.scaleFactor}
Steps: ${config.steps}
Curve: ${config.curveType}
Output unit: ${config.outputUnit}
${config.fluid ? `Fluid: yes (${config.viewportMin}px – ${config.viewportMax}px)` : 'Fluid: no'}

Generated tokens:
${tokenList}

Use these tokens as CSS custom properties (${tokens.map(t => t.cssVar).join(', ')}) for all spacing, padding, gap, and margin values in the component. Never use raw pixel values — always reference a token.`
}

export const EXPORT_TABS = [
  { id: 'css', label: 'CSS' },
  { id: 'tailwind', label: 'Tailwind' },
  { id: 'json', label: 'JSON' },
  { id: 'figma', label: 'Figma' },
  { id: 'prompt', label: 'AI Prompt' },
] as const

export type ExportTabId = (typeof EXPORT_TABS)[number]['id']

export function getExportContent(tabId: ExportTabId, tokens: GeneratedToken[], config: DimensionConfig): string {
  switch (tabId) {
    case 'css': return exportCSS(tokens, config)
    case 'tailwind': return exportTailwind(tokens, config)
    case 'json': return exportJSON(tokens, config)
    case 'figma': return exportFigma(tokens, config)
    case 'prompt': return exportAIPrompt(tokens, config)
  }
}
