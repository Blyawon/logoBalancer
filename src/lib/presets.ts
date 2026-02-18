import type { BalancerParams } from './balancer'

export interface Preset {
  id: string
  name: string
  description: string
  params: BalancerParams
}

export const PRESETS: Preset[] = [
  {
    id: 'equal-width',
    name: 'Equal Width',
    description: 'Same width for every logo — shows the problem (exponent = 0)',
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
    description: 'Equal bounding-box area (exponent = ½)',
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
    id: 'optical',
    name: 'Optical',
    description: 'Perceptually balanced — w^¼ × h^¾ = const (exponent = ¾)',
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

export const DEFAULT_PARAMS: BalancerParams = PRESETS[2].params
