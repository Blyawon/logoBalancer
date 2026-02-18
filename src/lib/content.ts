import type { BalancerParams } from './balancer'
import type { LogoMeta } from './logos'
import { computeLogoSize } from './balancer'

export const FORMULA_CODE = `function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Power-law width mapping for visual balance.
 *
 * width  = cell × baseline × r^exponent × scale
 * height = width / r
 *
 * Key exponents:
 *   0.0  → equal width  (no correction)
 *   0.5  → equal area   (w × h = const)
 *   0.6  → visual default (tuned sweet spot)
 *   0.75 → perceptual weight (w^¼ × h^¾ = const)
 *   1.0  → equal height (h = const)
 *
 * Max safe exponent (avoids overflow):
 *   e_max = ln(fitPercent / (baseline × scale)) / ln(ratioMax)
 */
function widthFraction(ratio, { baseline, exponent, ratioMin, ratioMax }) {
  const r = clamp(ratio, ratioMin, ratioMax);
  return baseline * Math.pow(r, exponent);
}

// Compute final logo dimensions within a square cell
function computeLogoSize(ratio, cellSize, params) {
  const wFrac = widthFraction(ratio, params);
  const safeBox = cellSize * params.fitPercent;

  let width = cellSize * wFrac * params.scale;
  let height = width / ratio;

  // Fit-clamp: prevent overflow on either axis
  const fit = Math.min(1, safeBox / width, safeBox / height);
  width *= fit;
  height *= fit;

  return { width, height };
}`

export const LLM_PROMPT = `Visually balance logos of different aspect ratios in a row.

Problem:
  Logos given equal width look uneven — portrait logos dominate
  because the eye weighs height more than width.

Solution — power-law width mapping:

  ratio = naturalWidth / naturalHeight
  ratio = clamp(ratio, ratioMin, ratioMax)
  widthFraction = baseline * ratio ^ exponent
  width = cellSize * widthFraction * scale
  height = width / ratio

  Fit-clamp to prevent overflow:
    safeBox = cellSize * fitPercent
    fit = min(1, safeBox / width, safeBox / height)
    width *= fit
    height *= fit

Parameters:
  baseline   = 0.5   width fraction for a square logo (ratio = 1)
  exponent   = 0.6   balance strategy
  ratioMin   = 0.35  clamp for extreme portrait ratios
  ratioMax   = 6.0   clamp for extreme landscape ratios
  scale      = 0.55  global size multiplier
  fitPercent = 0.7   max fraction of cell on either axis

Key exponents:
  0    equal width  (no correction)
  0.5  equal area   (w * h = const)
  0.6  visual       (tuned default)
  0.75 perceptual   (w^0.25 * h^0.75 = const)
  1.0  equal height (h = const)

Why 0.6?
  Perceived size ~ w^0.25 * h^0.75, which gives a
  theoretical optimum at 0.75. In practice, 0.6 is a
  tuned sweet spot between equal area and perceptual
  weight that looks best across a range of logo sets.`

export interface ExponentEntry {
  value: number
  label: string
  desc: string
  extra?: string
  highlight: boolean
}

export const EXPONENTS: ExponentEntry[] = [
  { value: 0, label: 'e = 0', desc: 'Equal width \u2014 no correction', highlight: false },
  { value: 0.5, label: 'e = 0.5', desc: 'Equal area \u2014 mathematically tidy', highlight: false },
  {
    value: 0.6,
    label: 'e = 0.6',
    desc: 'Visual',
    extra: ' \u2014 tuned default',
    highlight: true,
  },
  {
    value: 0.75,
    label: 'e = 0.75',
    desc: 'Perceptual weight',
    extra: ' \u2014 w\u00b9\u2044\u2074 \u00d7 h\u00b3\u2044\u2074 = const',
    highlight: false,
  },
  { value: 1.0, label: 'e = 1.0', desc: 'Equal height \u2014 overcorrects for wide logos', highlight: false },
]

export interface CodeTab {
  id: 'formula' | 'export' | 'prompt'
  label: string
  desc: string | null
}

export const CODE_TABS: CodeTab[] = [
  { id: 'formula', label: 'Formula', desc: null },
  { id: 'export', label: 'Export', desc: 'Self-contained function with your current parameters. Updates live as you move the sliders.' },
  { id: 'prompt', label: 'AI Prompt', desc: 'Paste this into any LLM to implement the balancing logic in your project.' },
]

export function generateExportCode(params: BalancerParams, logos: LogoMeta[]): string {
  const sizes = logos
    .map((logo) => {
      const size = computeLogoSize(logo.ratio, 100, params)
      return `//   ${logo.name} (r=${logo.ratio.toFixed(2)}): ${Math.round(size.width)}\u00d7${Math.round(size.height)}`
    })
    .join('\n')

  return `// Logo Balancer — drop into your project
const config = {
  baseline: ${params.baseline},
  exponent: ${params.exponent},
  ratioMin: ${params.ratioMin},
  ratioMax: ${params.ratioMax},
  scale: ${params.scale},
  fitPercent: ${params.fitPercent},
};

function getLogoSize(ratio, cellSize) {
  const r = Math.max(config.ratioMin, Math.min(config.ratioMax, ratio));
  const wFrac = config.baseline * Math.pow(r, config.exponent);
  const safeBox = cellSize * config.fitPercent;
  let w = cellSize * wFrac * config.scale;
  let h = w / ratio;
  const fit = Math.min(1, safeBox / w, safeBox / h);
  return { width: w * fit, height: h * fit };
}

// Sizes at cellSize = 100:
${sizes}`
}
