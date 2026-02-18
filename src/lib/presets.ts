import type { BalancerParams } from './balancer'

export interface Preset {
  id: string
  name: string
  description: string
  params: BalancerParams
}

export const PRESETS: Preset[] = [
  {
    id: 'visual',
    name: 'Visual',
    description: 'Perceptually balanced \u2014 gives every logo the same visual weight (exponent = \u00be)',
    params: {
      baseline: 0.46,
      exponent: 0.75,
      ratioMin: 0.35,
      ratioMax: 6.0,
      scale: 0.57,
      fitPercent: 0.73,
    },
  },
  {
    id: 'equal-width',
    name: 'Equal Width',
    description: 'Same width for every logo \u2014 shows the problem (exponent = 0)',
    params: {
      baseline: 1.0,
      exponent: 0,
      ratioMin: 0.25,
      ratioMax: 6.0,
      scale: 1.0,
      fitPercent: 0.92,
    },
  },
  {
    id: 'equal-area',
    name: 'Equal Area',
    description: 'Equal bounding-box area (exponent = \u00bd)',
    params: {
      baseline: 0.48,
      exponent: 0.5,
      ratioMin: 0.25,
      ratioMax: 6.0,
      scale: 1.0,
      fitPercent: 0.96,
    },
  },
  {
    id: 'equal-height',
    name: 'Equal Height',
    description: 'All logos share the same height (exponent = 1)',
    params: {
      baseline: 0.48,
      exponent: 1.0,
      ratioMin: 0.25,
      ratioMax: 6.0,
      scale: 1.0,
      fitPercent: 0.96,
    },
  },
]

export const DEFAULT_PARAMS: BalancerParams = PRESETS[0].params
