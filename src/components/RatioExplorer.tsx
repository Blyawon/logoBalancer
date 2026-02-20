import { useState } from 'react'
import { motion } from 'motion/react'
import { computeLogoSize } from '@/lib/balancer'
import type { BalancerParams } from '@/lib/balancer'
import { Slider } from '@/components/ui/slider'

const sizeSpring = { type: 'spring' as const, stiffness: 300, damping: 26 }

interface RatioExplorerProps {
  params: BalancerParams
}

const CELL = 100

export function RatioExplorer({ params }: RatioExplorerProps) {
  const [ratio, setRatio] = useState(1.0)
  const size = computeLogoSize(ratio, CELL, params)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">0.2</span>
        <div className="flex-1">
          <Slider
            value={[ratio]}
            min={0.2}
            max={6.0}
            step={0.01}
            onValueChange={([v]) => setRatio(v)}
          />
        </div>
        <span className="text-xs text-zinc-400 dark:text-zinc-500 shrink-0">6.0</span>
      </div>
      <div className="flex items-center gap-3 sm:gap-6">
        <div
          className="flex items-center justify-center border border-dotted border-zinc-300 dark:border-zinc-600 rounded-lg shrink-0"
          style={{ width: CELL, height: CELL }}
        >
          <motion.div
            className="rounded-sm bg-zinc-400 dark:bg-zinc-500"
            initial={false}
            animate={{ width: size.width, height: size.height }}
            transition={sizeSpring}
          />
        </div>
        <div className="text-xs font-mono space-y-1 text-zinc-500 dark:text-zinc-400">
          <p>
            ratio ={' '}
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
              {ratio.toFixed(2)}
            </span>
          </p>
          <p>
            width ={' '}
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
              {Math.round(size.width)}
            </span>
          </p>
          <p>
            height ={' '}
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
              {Math.round(size.height)}
            </span>
          </p>
          <p>
            area ={' '}
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
              {Math.round(size.width * size.height)}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
