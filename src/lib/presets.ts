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
    description: 'Tuned visual balance \u2014 a practical sweet spot between equal area and perceptual weight (exponent = 0.6)',
    params: {
      baseline: 0.5,
      exponent: 0.6,
      ratioMin: 0.35,
      ratioMax: 6.0,
      scale: 0.55,
      fitPercent: 0.7,
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
