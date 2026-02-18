export interface BalancerParams {
  baseline: number    // Width fraction for a square logo (ratio = 1)
  exponent: number    // Power exponent — 0 = equal width, 0.5 = equal area, 0.75 = visual, 1 = equal height
  ratioMin: number    // Clamp floor for extreme portrait ratios
  ratioMax: number    // Clamp ceiling for extreme landscape ratios
  scale: number       // Global scale multiplier
  fitPercent: number  // Safety inset fraction (1.0 = no inset)
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
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
 *   0.75 → visual balance (w^¼ × h^¾ = const)
 *   1.0  → equal height (h = const)
 *
 * Max safe exponent (avoids overflow):
 *   e_max = ln(fitPercent / (baseline × scale)) / ln(ratioMax)
 */
export function widthPctFromRatio(
  ratio: number,
  params: BalancerParams
): number {
  const r = clamp(ratio, params.ratioMin, params.ratioMax)
  return params.baseline * Math.pow(r, params.exponent)
}

export interface LogoSize {
  width: number
  height: number
}

/**
 * Compute logo render size within a square cell.
 */
export function computeLogoSize(
  ratio: number,
  cellSize: number,
  params: BalancerParams
): LogoSize {
  const widthPct = widthPctFromRatio(ratio, params)
  const safeBox = cellSize * params.fitPercent

  let width = cellSize * widthPct * params.scale
  let height = ratio > 0 ? width / ratio : width

  // Fit-clamp: ensure logo stays within safeBox on both axes
  const fit = Math.min(
    1,
    safeBox / Math.max(width, 1e-6),
    safeBox / Math.max(height, 1e-6)
  )
  width *= fit
  height *= fit

  return { width, height }
}
