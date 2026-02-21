import { useState } from 'react'
import { motion } from 'motion/react'
import { Slider } from '@/components/ui/slider'
import type { GeneratedToken, DimensionConfig } from './types'

const barSpring = { type: 'spring' as const, stiffness: 200, damping: 22 }

interface FluidPreviewProps {
  tokens: GeneratedToken[]
  config: DimensionConfig
}

function interpolateFluid(token: GeneratedToken, viewport: number, config: DimensionConfig): number {
  const maxVal = token.value
  const minVal = maxVal * config.fluidScaleFactor
  const t = Math.max(0, Math.min(1, (viewport - config.viewportMin) / (config.viewportMax - config.viewportMin)))
  return minVal + (maxVal - minVal) * t
}

export function FluidPreview({ tokens, config }: FluidPreviewProps) {
  const [viewport, setViewport] = useState(config.viewportMax)

  if (!config.fluid) return null

  const maxValue = Math.max(...tokens.map(t => t.value), 1)

  return (
    <div className="space-y-4">
      {/* Viewport slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Simulated viewport</span>
          <span className="text-sm font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
            {viewport}px
          </span>
        </div>
        <Slider
          value={[viewport]}
          min={config.viewportMin}
          max={config.viewportMax}
          step={10}
          onValueChange={([v]) => setViewport(v)}
        />
        <div className="flex justify-between text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
          <span>{config.viewportMin}px</span>
          <span>{config.viewportMax}px</span>
        </div>
      </div>

      {/* Fluid token bars */}
      <div className="space-y-1">
        {tokens.map((token) => {
          const fluidValue = interpolateFluid(token, viewport, config)
          const pct = (fluidValue / maxValue) * 100

          return (
            <div key={token.index} className="flex items-center gap-2">
              <span className="w-12 text-[10px] font-mono text-zinc-500 dark:text-zinc-400 text-right shrink-0">
                {token.name}
              </span>
              <div className="flex-1 h-3 relative">
                <motion.div
                  className="h-full rounded-sm bg-zinc-900 dark:bg-zinc-100"
                  initial={false}
                  animate={{ width: `${Math.max(pct, 1)}%` }}
                  transition={barSpring}
                />
              </div>
              <span className="w-12 text-[10px] font-mono tabular-nums text-zinc-400 dark:text-zinc-500 shrink-0">
                {Math.round(fluidValue)}px
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
