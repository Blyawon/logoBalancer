import { motion } from 'motion/react'
import type { GeneratedToken } from './types'

const rulerSpring = { type: 'spring' as const, stiffness: 200, damping: 22 }

interface ScaleRulerProps {
  tokens: GeneratedToken[]
}

export function ScaleRuler({ tokens }: ScaleRulerProps) {
  if (tokens.length === 0) return null

  const maxValue = Math.max(...tokens.map(t => t.value))

  return (
    <div className="mt-4 space-y-1">
      {/* Ruler track */}
      <div className="relative h-8 bg-zinc-50 dark:bg-zinc-800/30 rounded-lg overflow-hidden">
        {/* Tick marks */}
        {tokens.map((token) => {
          const pct = (token.value / maxValue) * 100
          return (
            <motion.div
              key={token.index}
              className="absolute top-0 bottom-0 flex flex-col items-center"
              initial={false}
              animate={{ left: `${pct}%` }}
              transition={rulerSpring}
              style={{ transform: 'translateX(-50%)' }}
            >
              <div
                className={`w-px h-3 ${
                  token.locked
                    ? 'bg-amber-400 dark:bg-amber-500'
                    : 'bg-zinc-400 dark:bg-zinc-500'
                }`}
              />
              <span className="text-[8px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5 whitespace-nowrap">
                {token.name}
              </span>
            </motion.div>
          )
        })}

        {/* Baseline indicator */}
        <div className="absolute top-0 left-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700" />
        <div className="absolute top-0 right-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-700" />
      </div>

      {/* Value labels at ends */}
      <div className="flex justify-between px-1">
        <span className="text-[9px] font-mono text-zinc-300 dark:text-zinc-600">0</span>
        <span className="text-[9px] font-mono text-zinc-300 dark:text-zinc-600">
          {maxValue}px
        </span>
      </div>
    </div>
  )
}
