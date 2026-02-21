import type { DimensionConfig, GeneratedToken, CurveType, CubicBezier, RoundingStrategy } from './types'
import { getTokenName } from './naming'

// ── Cubic bezier evaluator (Newton-Raphson, same as CSS cubic-bezier) ──

function sampleCurveX(t: number, x1: number, x2: number): number {
  return ((1 - 3 * x2 + 3 * x1) * t + (3 * x2 - 6 * x1)) * t * t + 3 * x1 * t
}

function sampleCurveY(t: number, y1: number, y2: number): number {
  return ((1 - 3 * y2 + 3 * y1) * t + (3 * y2 - 6 * y1)) * t * t + 3 * y1 * t
}

function sampleCurveDerivativeX(t: number, x1: number, x2: number): number {
  return (3 * (1 - 3 * x2 + 3 * x1)) * t * t + (2 * (3 * x2 - 6 * x1)) * t + 3 * x1
}

function solveCurveX(x: number, x1: number, x2: number): number {
  let t = x
  for (let i = 0; i < 8; i++) {
    const currentX = sampleCurveX(t, x1, x2) - x
    if (Math.abs(currentX) < 1e-7) return t
    const d = sampleCurveDerivativeX(t, x1, x2)
    if (Math.abs(d) < 1e-7) break
    t -= currentX / d
  }
  // Fallback: bisection
  let a = 0, b = 1
  t = x
  while (a < b) {
    const mid = sampleCurveX(t, x1, x2)
    if (Math.abs(mid - x) < 1e-7) return t
    if (x > mid) a = t; else b = t
    t = (a + b) / 2
  }
  return t
}

function cubicBezier(t: number, x1: number, y1: number, x2: number, y2: number): number {
  if (t <= 0) return 0
  if (t >= 1) return 1
  return sampleCurveY(solveCurveX(t, x1, x2), y1, y2)
}

// ── Curve application ──

const CURVE_PRESETS: Record<Exclude<CurveType, 'custom'>, CubicBezier> = {
  'linear': [0, 0, 1, 1],
  'exponential': [0.5, 0, 1, 0.5],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
}

export function getCurvePoints(curveType: CurveType, customCurve: CubicBezier): CubicBezier {
  if (curveType === 'custom') return customCurve
  return CURVE_PRESETS[curveType]
}

function applyCurve(t: number, curveType: CurveType, customCurve: CubicBezier): number {
  const [x1, y1, x2, y2] = getCurvePoints(curveType, customCurve)
  return cubicBezier(t, x1, y1, x2, y2)
}

// ── Bias ──

function applyBias(t: number, bias: number): number {
  if (bias === 0) return t
  // Positive bias: more steps at large end (power < 1)
  // Negative bias: more steps at small end (power > 1)
  const power = Math.pow(2, -bias)
  return Math.pow(t, power)
}

// ── Optical compensation ──

function applyOpticalCompensation(value: number, compensation: number): number {
  if (compensation === 0) return value
  const threshold = 8
  if (value >= threshold) return value
  const boost = 1 + compensation * Math.pow((threshold - value) / threshold, 2) * 0.5
  return value * boost
}

// ── Rounding ──

function applyRounding(value: number, strategy: RoundingStrategy, precision: number): number {
  if (strategy === 'none') return value
  const factor = Math.pow(10, precision)
  switch (strategy) {
    case 'round': return Math.round(value * factor) / factor
    case 'floor': return Math.floor(value * factor) / factor
    case 'ceil': return Math.ceil(value * factor) / factor
    default: return value
  }
}

// ── Harmonic alignment ──

const HARMONIC_RATIOS = [1, 1.125, 1.2, 1.25, 1.333, 1.414, 1.5, 1.618, 1.75, 2]

function snapToHarmonic(value: number, base: number): number {
  let closest = value
  let minDist = Infinity
  for (const ratio of HARMONIC_RATIOS) {
    let candidate = base
    while (candidate < value * 2) {
      const dist = Math.abs(candidate - value)
      if (dist < minDist) {
        minDist = dist
        closest = candidate
      }
      candidate *= ratio
      if (candidate > value * 2) break
    }
  }
  return closest
}

// ── Fluid clamp ──

function generateFluidClamp(value: number, config: DimensionConfig): string {
  const minValue = value * config.fluidScaleFactor
  const vpRange = config.viewportMax - config.viewportMin
  if (vpRange <= 0) return `${value}px`
  const slope = (value - minValue) / vpRange
  const intercept = minValue - slope * config.viewportMin
  const slopeVw = +(slope * 100).toFixed(4)
  const interceptPx = +intercept.toFixed(2)

  if (config.outputUnit === 'rem') {
    const rb = Math.max(1, config.remBase)
    const minRem = +(minValue / rb).toFixed(4)
    const maxRem = +(value / rb).toFixed(4)
    return `clamp(${minRem}rem, ${interceptPx}px + ${slopeVw}vw, ${maxRem}rem)`
  }

  const minPx = +minValue.toFixed(2)
  const maxPx = +value.toFixed(2)
  return `clamp(${minPx}px, ${interceptPx}px + ${slopeVw}vw, ${maxPx}px)`
}

// ── Formula string ──

function buildFormula(index: number, config: DimensionConfig): string {
  const { base, scaleFactor, steps, curveType } = config
  if (steps === 1) return `${base}`
  const t = index / (steps - 1)
  if (curveType === 'linear' && config.progressionBias === 0) {
    return `${base} \u00d7 ${scaleFactor}^${index}`
  }
  return `${base} \u00d7 ${scaleFactor}^(curve(${t.toFixed(2)}) \u00d7 ${steps - 1})`
}

// ── Main generation ──

export function generateScale(config: DimensionConfig): GeneratedToken[] {
  const tokens: GeneratedToken[] = []

  for (let i = 0; i < config.steps; i++) {
    const t = config.steps === 1 ? 0 : i / (config.steps - 1)

    // Check locked first
    if (config.lockedTokens[i] !== undefined) {
      const lockedValue = config.lockedTokens[i]
      const name = getTokenName(i, config.steps, config.namingConvention, config.customNames)
      const displayValue = formatValue(lockedValue, config)
      tokens.push({
        index: i,
        name,
        rawValue: lockedValue,
        value: lockedValue,
        displayValue,
        remValue: lockedValue / Math.max(1, config.remBase),
        formula: `locked: ${lockedValue}`,
        fluidValue: config.fluid ? generateFluidClamp(lockedValue, config) : undefined,
        cssVar: `--${config.tokenPrefix}-${name}`,
        locked: true,
        negativeValue: config.negativeScale ? -lockedValue : undefined,
        negativeName: config.negativeScale ? `-${name}` : undefined,
      })
      continue
    }

    // Apply curve
    const curved = applyCurve(t, config.curveType, config.customCurve)
    const biased = applyBias(curved, config.progressionBias)

    // Calculate raw value
    const maxExponent = Math.max(config.steps - 1, 1)
    let rawValue = config.base * Math.pow(config.scaleFactor, biased * maxExponent)

    // Optical compensation
    rawValue = applyOpticalCompensation(rawValue, config.opticalCompensation)

    // Density
    rawValue *= config.densityMultiplier

    // Rounding
    let value = applyRounding(rawValue, config.roundingStrategy, config.roundingPrecision)

    // Snap to grid
    if (config.snapToGrid > 0) {
      value = Math.round(value / config.snapToGrid) * config.snapToGrid
      if (value === 0) value = config.snapToGrid // never snap to 0
    }

    // Clamp
    value = Math.max(config.minValue, Math.min(config.maxValue, value))

    // Harmonic alignment
    if (config.harmonicAlignment) {
      value = snapToHarmonic(value, config.base)
    }

    const name = getTokenName(i, config.steps, config.namingConvention, config.customNames)
    const displayValue = formatValue(value, config)

    tokens.push({
      index: i,
      name,
      rawValue,
      value,
      displayValue,
      remValue: value / Math.max(1, config.remBase),
      formula: buildFormula(i, config),
      fluidValue: config.fluid ? generateFluidClamp(value, config) : undefined,
      cssVar: `--${config.tokenPrefix}-${name}`,
      locked: false,
      negativeValue: config.negativeScale ? -value : undefined,
      negativeName: config.negativeScale ? `-${name}` : undefined,
    })
  }

  return tokens
}

function formatValue(value: number, config: DimensionConfig): string {
  const remBase = Math.max(1, config.remBase)
  if (config.outputUnit === 'rem') {
    return `${+(value / remBase).toFixed(4)}rem`
  }
  if (config.outputUnit === 'em') {
    return `${+(value / remBase).toFixed(4)}em`
  }
  // px
  if (Number.isInteger(value)) return `${value}px`
  return `${+value.toFixed(config.roundingPrecision || 2)}px`
}

// ── Evaluate curve at a given t (for the curve editor display) ──

export function evaluateCurveAt(t: number, config: DimensionConfig): number {
  const curved = applyCurve(t, config.curveType, config.customCurve)
  return applyBias(curved, config.progressionBias)
}
