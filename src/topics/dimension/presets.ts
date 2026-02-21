import type { DimensionConfig } from './types'

export const DEFAULT_CONFIG: DimensionConfig = {
  base: 8,
  steps: 10,
  namingConvention: 'tshirt',
  scaleFactor: 1.5,
  curveType: 'linear',
  customCurve: [0.25, 0.1, 0.75, 0.9],
  fluid: false,
  viewportMin: 320,
  viewportMax: 1440,
  fluidScaleFactor: 0.75,
  roundingStrategy: 'round',
  roundingPrecision: 0,
  snapToGrid: 0,
  minValue: 1,
  maxValue: 256,
  densityMode: 'comfortable',
  densityMultiplier: 1,
  harmonicAlignment: false,
  opticalCompensation: 0,
  progressionBias: 0,
  tokenPrefix: 'space',
  negativeScale: false,
  outputUnit: 'px',
  remBase: 16,
  lockedTokens: {},
  customNames: [],
}

export interface DimensionPreset {
  id: string
  name: string
  description: string
  config: Partial<DimensionConfig>
}

export const DIMENSION_PRESETS: DimensionPreset[] = [
  {
    id: 'tailwind',
    name: 'Tailwind',
    description: 'Tailwind CSS default spacing scale — base 4, mostly linear',
    config: {
      base: 4,
      steps: 12,
      scaleFactor: 1.5,
      curveType: 'linear',
      namingConvention: 'tailwind',
      snapToGrid: 0,
      roundingStrategy: 'round',
      roundingPrecision: 0,
    },
  },
  {
    id: 'material',
    name: 'Material',
    description: 'Material Design 8px grid with 4px half-steps',
    config: {
      base: 4,
      steps: 10,
      scaleFactor: 2,
      curveType: 'linear',
      namingConvention: 'numeric',
      snapToGrid: 4,
      roundingStrategy: 'round',
      roundingPrecision: 0,
    },
  },
  {
    id: 'golden',
    name: 'Golden Ratio',
    description: 'Scale based on the golden ratio (1.618)',
    config: {
      base: 8,
      steps: 8,
      scaleFactor: 1.618,
      curveType: 'linear',
      namingConvention: 'tshirt',
      harmonicAlignment: true,
      snapToGrid: 0,
    },
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    description: 'Bootstrap 5 spacing utilities — rem-based',
    config: {
      base: 4,
      steps: 6,
      scaleFactor: 2,
      curveType: 'linear',
      namingConvention: 'ordinal',
      outputUnit: 'rem',
      remBase: 16,
      roundingStrategy: 'round',
      roundingPrecision: 0,
    },
  },
  {
    id: 'linear-8',
    name: 'Linear 8pt',
    description: 'Simple 8-point grid: 8, 16, 24, 32…',
    config: {
      base: 8,
      steps: 10,
      scaleFactor: 1,
      curveType: 'linear',
      namingConvention: 'ordinal',
      snapToGrid: 8,
      roundingStrategy: 'round',
      roundingPrecision: 0,
    },
  },
]
