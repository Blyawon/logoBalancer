import { computeLogoSize } from '@/lib/balancer'
import type { BalancerParams } from '@/lib/balancer'

interface MiniLaneProps {
  params: BalancerParams
  exponentOverride?: number
  cellSize?: number
}

const SAMPLE_RATIOS = [
  { ratio: 0.35, color: 'bg-zinc-500 dark:bg-zinc-400' },
  { ratio: 1.0, color: 'bg-zinc-400 dark:bg-zinc-500' },
  { ratio: 5.0, color: 'bg-zinc-300 dark:bg-zinc-600' },
]

export function MiniLane({ params, exponentOverride, cellSize = 36 }: MiniLaneProps) {
  const p = exponentOverride !== undefined
    ? { ...params, exponent: exponentOverride }
    : params

  return (
    <div className="inline-flex items-center gap-0.5">
      {SAMPLE_RATIOS.map(({ ratio, color }) => {
        const size = computeLogoSize(ratio, cellSize, p)
        return (
          <div
            key={ratio}
            className="relative flex items-center justify-center"
            style={{ width: cellSize, height: cellSize }}
          >
            <div
              className={`rounded-[2px] ${color} transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
              style={{ width: size.width, height: size.height }}
            />
          </div>
        )
      })}
    </div>
  )
}
