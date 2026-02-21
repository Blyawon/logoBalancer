import { lazy } from 'react'
import type { ComponentType } from 'react'

export interface TopicDef {
  id: string
  label: string
  subtitle: string
  component: React.LazyExoticComponent<ComponentType>
  preload: () => Promise<unknown>
}

const importLogoBalancer = () => import('./logo-balancer')
const importComponentBreakpoints = () => import('./component-breakpoints')
const importDimension = () => import('./dimension')

export const TOPICS: TopicDef[] = [
  {
    id: 'logo-balancing',
    label: 'Logo Balancing',
    subtitle: 'A power-law formula for optically balancing logos of any aspect ratio.',
    component: lazy(importLogoBalancer),
    preload: importLogoBalancer,
  },
  {
    id: 'component-breakpoints',
    label: 'Component Breakpoints',
    subtitle: 'Why breakpoints should never be tied to components — design for space, not screens.',
    component: lazy(importComponentBreakpoints),
    preload: importComponentBreakpoints,
  },
  {
    id: 'dimension',
    label: 'Dimension',
    subtitle: 'Build spacing and sizing scales with interactive curve control, fluid tokens, and live preview.',
    component: lazy(importDimension),
    preload: importDimension,
  },
]

// Eagerly preload all topic chunks at module parse time
// so they're ready before the user ever clicks
TOPICS.forEach(t => t.preload())
