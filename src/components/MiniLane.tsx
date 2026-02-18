import { computeLogoSize } from '@/lib/balancer'
import type { BalancerParams } from '@/lib/balancer'

interface MiniLaneProps {
  params: BalancerParams
  exponentOverride?: number
  cellSize?: number
}

const SAMPLE_RATIOS = [0.35, 1.0, 5.0]

export function MiniLane({ params, exponentOverride, cellSize = 36 }: MiniLaneProps) {
  const p = exponentOverride !== undefined
    ? { ...params, exponent: exponentOverride }
    : params

  return (
    <div className="inline-flex items-center gap-0.5">
      {SAMPLE_RATIOS.map((ratio) => {
        const size = computeLogoSize(ratio, cellSize, p)
        return (
          <div
            key={ratio}
            className="relative flex items-center justify-center"
            style={{ width: cellSize, height: cellSize }}
          >
            <div
              className="rounded-[2px] bg-zinc-400 dark:bg-zinc-500 transition-all duration-300"
              style={{ width: size.width, height: size.height }}
            />
          </div>
        )
      })}
    </div>
  )
}
