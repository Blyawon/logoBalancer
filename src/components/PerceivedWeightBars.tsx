import { computeLogoSize } from '@/lib/balancer'
import type { BalancerParams } from '@/lib/balancer'
import type { LogoMeta } from '@/lib/logos'

interface PerceivedWeightBarsProps {
  params: BalancerParams
  logos: LogoMeta[]
}

export function PerceivedWeightBars({ params, logos }: PerceivedWeightBarsProps) {
  const cellSize = 100
  const data = logos.map((logo) => {
    const size = computeLogoSize(logo.ratio, cellSize, params)
    const pw = Math.pow(size.width, 0.25) * Math.pow(size.height, 0.75)
    return { name: logo.name, pw }
  })

  const maxPw = Math.max(...data.map((d) => d.pw))

  return (
    <div className="space-y-1.5">
      {data.map((d) => (
        <div key={d.name} className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 dark:text-zinc-400 w-12 text-right shrink-0 truncate">
            {d.name}
          </span>
          <div className="flex-1 h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-zinc-400 dark:bg-zinc-500 rounded-full transition-all duration-300"
              style={{ width: `${(d.pw / maxPw) * 100}%` }}
            />
          </div>
          <span className="text-[11px] font-mono tabular-nums text-zinc-400 dark:text-zinc-500 w-8 shrink-0">
            {d.pw.toFixed(1)}
          </span>
        </div>
      ))}
    </div>
  )
}
