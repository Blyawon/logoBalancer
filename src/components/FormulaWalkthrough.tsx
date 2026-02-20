import { useState, useMemo } from 'react'
import type { BalancerParams } from '@/lib/balancer'
import type { LogoMeta } from '@/lib/logos'
import { Pill } from './Pill'

interface FormulaWalkthroughProps {
  params: BalancerParams
  logos: LogoMeta[]
}

export function FormulaWalkthrough({ params, logos }: FormulaWalkthroughProps) {
  const [selectedId, setSelectedId] = useState(logos[0]?.id ?? '')

  const logo = logos.find((l) => l.id === selectedId) || logos[0]

  const steps = useMemo(() => {
    if (!logo) return []
    const ratio = logo.ratio
    const cellSize = 100
    const r = Math.max(params.ratioMin, Math.min(params.ratioMax, ratio))
    const rPow = Math.pow(r, params.exponent)
    const wFrac = params.baseline * rPow
    const safeBox = cellSize * params.fitPercent
    const widthRaw = cellSize * wFrac * params.scale
    const heightRaw = widthRaw / ratio
    const fit = Math.min(1, safeBox / widthRaw, safeBox / heightRaw)
    const width = widthRaw * fit
    const height = heightRaw * fit

    return [
      { label: 'ratio', formula: 'naturalWidth / naturalHeight', value: ratio.toFixed(3) },
      {
        label: 'r',
        formula: `clamp(${ratio.toFixed(2)}, ${params.ratioMin}, ${params.ratioMax})`,
        value: r.toFixed(3),
      },
      { label: 'r^e', formula: `${r.toFixed(2)}^${params.exponent}`, value: rPow.toFixed(3) },
      {
        label: 'wFrac',
        formula: `${params.baseline} \u00d7 ${rPow.toFixed(3)}`,
        value: wFrac.toFixed(3),
      },
      {
        label: 'width\u2080',
        formula: `100 \u00d7 ${wFrac.toFixed(3)} \u00d7 ${params.scale}`,
        value: widthRaw.toFixed(1),
      },
      {
        label: 'height\u2080',
        formula: `${widthRaw.toFixed(1)} / ${ratio.toFixed(2)}`,
        value: heightRaw.toFixed(1),
      },
      {
        label: 'safeBox',
        formula: `100 \u00d7 ${params.fitPercent}`,
        value: safeBox.toFixed(1),
      },
      {
        label: 'fit',
        formula: `min(1, ${safeBox.toFixed(1)}/${widthRaw.toFixed(1)}, ${safeBox.toFixed(1)}/${heightRaw.toFixed(1)})`,
        value: fit.toFixed(3),
      },
      {
        label: 'width',
        formula: `${widthRaw.toFixed(1)} \u00d7 ${fit.toFixed(3)}`,
        value: width.toFixed(1),
      },
      {
        label: 'height',
        formula: `${heightRaw.toFixed(1)} \u00d7 ${fit.toFixed(3)}`,
        value: height.toFixed(1),
      },
    ]
  }, [logo, params])

  if (!logo || logos.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5 flex-wrap">
        {logos.map((l) => (
          <Pill
            key={l.id}
            active={selectedId === l.id}
            onClick={() => setSelectedId(l.id)}
            className={`px-2.5 py-1 rounded-md text-xs ${
              selectedId !== l.id
                ? 'bg-zinc-100 text-zinc-500 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300'
                : ''
            }`}
          >
            {l.name}
          </Pill>
        ))}
      </div>
      <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/40 px-2 sm:px-4 py-3 font-mono text-[11px] sm:text-xs space-y-0.5 overflow-x-auto">
        {steps.map((step, i) => (
          <div key={i} className="flex items-baseline gap-1 sm:gap-2 min-w-0">
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold shrink-0 w-12 sm:w-20 text-right">
              {step.label}
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">=</span>
            <span className="text-zinc-500 dark:text-zinc-400 truncate">{step.formula}</span>
            <span className="text-zinc-400 dark:text-zinc-600">=</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold shrink-0">
              {step.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
