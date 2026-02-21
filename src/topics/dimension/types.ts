export type CurveType = 'linear' | 'exponential' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'custom'
export type CubicBezier = [number, number, number, number]
export type RoundingStrategy = 'none' | 'round' | 'floor' | 'ceil'
export type DensityMode = 'compact' | 'comfortable' | 'spacious'
export type OutputUnit = 'px' | 'rem' | 'em'

export type NamingConventionId =
  | 'tshirt'
  | 'numeric'
  | 'ordinal'
  | 'semantic'
  | 'tailwind'
  | 'fibonacci'
  | 'custom'

export interface DimensionConfig {
  // Core
  base: number
  steps: number
  namingConvention: NamingConventionId
  scaleFactor: number

  // Curve
  curveType: CurveType
  customCurve: CubicBezier

  // Fluid
  fluid: boolean
  viewportMin: number
  viewportMax: number
  fluidScaleFactor: number

  // Rounding & Grid
  roundingStrategy: RoundingStrategy
  roundingPrecision: number
  snapToGrid: number

  // Bounds
  minValue: number
  maxValue: number

  // Density
  densityMode: DensityMode
  densityMultiplier: number

  // Units
  outputUnit: OutputUnit
  remBase: number

  // Additional influence factors
  harmonicAlignment: boolean
  opticalCompensation: number
  progressionBias: number
  tokenPrefix: string
  negativeScale: boolean

  // Per-token overrides
  lockedTokens: Record<number, number>

  // Custom names (when namingConvention === 'custom')
  customNames: string[]
}

export interface GeneratedToken {
  index: number
  name: string
  rawValue: number
  value: number
  displayValue: string
  remValue: number
  formula: string
  fluidValue?: string
  cssVar: string
  locked: boolean
  negativeValue?: number
  negativeName?: string
}
