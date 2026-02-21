import { useState } from 'react'
import { motion } from 'motion/react'
import { Pill } from '@/components/Pill'
import type { GeneratedToken } from './types'

const barSpring = { type: 'spring' as const, stiffness: 200, damping: 22 }

interface ReferenceScale {
  id: string
  name: string
  values: number[]
}

const REFERENCE_SCALES: ReferenceScale[] = [
  {
    id: 'tailwind',
    name: 'Tailwind',
    values: [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96],
  },
  {
    id: 'material',
    name: 'Material',
    values: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64],
  },
  {
    id: 'bootstrap',
    name: 'Bootstrap',
    values: [0, 4, 8, 16, 24, 48],
  },
]

interface ScaleComparisonProps {
  tokens: GeneratedToken[]
}

export function ScaleComparison({ tokens }: ScaleComparisonProps) {
  const [activeRefs, setActiveRefs] = useState<Set<string>>(new Set(['tailwind']))

  const allValues = [
    ...tokens.map(t => t.value),
    ...REFERENCE_SCALES.filter(r => activeRefs.has(r.id)).flatMap(r => r.values),
  ]
  const maxValue = Math.max(...allValues, 1)

  const toggleRef = (id: string) => {
    setActiveRefs(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-4">
      {/* Reference toggles */}
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-zinc-400 dark:text-zinc-500 mr-1">Compare with:</span>
        {REFERENCE_SCALES.map((ref) => (
          <Pill
            key={ref.id}
            active={activeRefs.has(ref.id)}
            onClick={() => toggleRef(ref.id)}
            mode="multi"
            size="sm"
          >
            {ref.name}
          </Pill>
        ))}
      </div>

      {/* Scale bars */}
      <div className="space-y-3">
        {/* User scale */}
        <div className="space-y-1">
          <span className="text-[10px] font-medium text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Your scale
          </span>
          <div className="flex items-end gap-px h-6">
            {tokens.map((token) => (
              <motion.div
                key={token.index}
                className="bg-zinc-900 dark:bg-zinc-100 rounded-t-sm"
                initial={false}
                animate={{
                  width: Math.max(4, (token.value / maxValue) * 200),
                  height: 24,
                }}
                transition={barSpring}
                title={`${token.name}: ${token.displayValue}`}
                style={{ minWidth: 4 }}
              />
            ))}
          </div>
        </div>

        {/* Reference scales */}
        {REFERENCE_SCALES.filter(r => activeRefs.has(r.id)).map((ref) => (
          <div key={ref.id} className="space-y-1">
            <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {ref.name}
            </span>
            <div className="flex items-end gap-px h-4">
              {ref.values.filter(v => v > 0).map((value, i) => (
                <motion.div
                  key={i}
                  className="bg-zinc-300 dark:bg-zinc-600 rounded-t-sm"
                  initial={false}
                  animate={{
                    width: Math.max(3, (value / maxValue) * 200),
                    height: 16,
                  }}
                  transition={barSpring}
                  title={`${value}px`}
                  style={{ minWidth: 3 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
