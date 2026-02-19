import { useState, useCallback, useRef, useEffect } from 'react'
import { ResizableContainer } from './ResizableContainer'
import { SampleCard } from './SampleCard'
import { StrategyToggle } from './StrategyToggle'

type Strategy = 'media' | 'container' | 'fluid'

const SIMULATED_VIEWPORT = 1440
const CARD_BREAKPOINT = 480

const OPTIONS: { value: Strategy; label: string; shortLabel?: string; color: 'amber' | 'emerald' }[] = [
  { value: 'media', label: 'Screen-based', shortLabel: 'Screen', color: 'amber' },
  { value: 'container', label: 'Space-based', shortLabel: 'Container', color: 'emerald' },
  { value: 'fluid', label: 'Space-based fluid', shortLabel: 'Fluid', color: 'emerald' },
]

export function ResizableCardDemo() {
  const [strategy, setStrategy] = useState<Strategy>('media')
  const [containerWidth, setContainerWidth] = useState<number | null>(null)
  const [maxWidth, setMaxWidth] = useState(800)
  const rulerRef = useRef<HTMLDivElement>(null)

  // Measure available width for the ruler
  useEffect(() => {
    const el = rulerRef.current
    if (!el) return
    const measure = () => setMaxWidth(el.getBoundingClientRect().width)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const handleWidthChange = useCallback((w: number) => {
    setContainerWidth(w)
  }, [])

  const measured = containerWidth !== null
  const width = containerWidth ?? 0

  const ruleLabel =
    strategy === 'media'
      ? `Screen ≥ ${CARD_BREAKPOINT}px? → window is ${SIMULATED_VIEWPORT}px → always horizontal`
      : strategy === 'fluid'
        ? `Scales fluidly with container — no breakpoint needed`
        : width >= CARD_BREAKPOINT
          ? `Space ≥ ${CARD_BREAKPOINT}px? → container is ${Math.round(width)}px → horizontal`
          : `Space ≥ ${CARD_BREAKPOINT}px? → container is ${Math.round(width)}px → stacked`

  const isBreaking = strategy === 'media' && width < CARD_BREAKPOINT

  return (
    <div className={`space-y-3 transition-opacity duration-200 ${measured ? 'opacity-100' : 'opacity-0'}`}>
      {/* Strategy controls (F8: short labels on mobile, F14: shared toggle) */}
      <div className="flex flex-wrap items-center gap-3">
        <StrategyToggle options={OPTIONS} value={strategy} onChange={setStrategy} />

        <span className="text-xs text-zinc-400 dark:text-zinc-500 hidden sm:inline">
          {strategy === 'media'
            ? 'Measures the window, ignores the container'
            : strategy === 'fluid'
              ? 'Scales smoothly — no breakpoints'
              : 'Measures the actual space available'
          }
        </span>
      </div>

      {/* Drag instruction above the card (F7) */}
      <p className="text-xs text-zinc-400 dark:text-zinc-500">
        Drag the right edge to resize &darr;
      </p>

      {/* Resizable card */}
      <ResizableContainer
        containerQuery={strategy !== 'media'}
        defaultWidth={420}
        minWidth={240}
        onWidthChange={handleWidthChange}
      >
        <div className="p-4">
          <SampleCard
            strategy={strategy}
            viewportWidth={SIMULATED_VIEWPORT}
            containerWidth={width}
          />
        </div>
      </ResizableContainer>

      {/* Width ruler with breakpoint marker */}
      <div ref={rulerRef} className="relative px-0.5">
        <WidthRuler
          currentWidth={width}
          maxWidth={maxWidth}
          breakpoint={CARD_BREAKPOINT}
          strategy={strategy}
        />
      </div>

      {/* CSS rule annotation (F10: more dramatic overflow) */}
      <div
        className={`rounded-lg px-4 py-3 text-xs font-mono transition-all duration-300 ${
          isBreaking
            ? 'bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30'
            : strategy === 'media'
              ? 'bg-zinc-50 dark:bg-zinc-800/30 text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-700/40'
              : 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30'
        }`}
        style={{ textWrap: 'balance' }}
      >
        <span className="opacity-50 mr-2">Rule →</span>
        {ruleLabel}
        {isBreaking && (
          <span className="ml-2 font-sans font-medium">
            — card overflows its space
          </span>
        )}
      </div>

      {/* Fluid annotation (F18) */}
      {strategy === 'fluid' && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed" style={{ textWrap: 'balance' }}>
          The fluid card scales proportionally with no layout shift.
          For layout changes (stacked → horizontal), combine{' '}
          <code className="text-[11px] bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono">@container</code>{' '}
          breakpoints with fluid sizing for the smoothest result.
        </p>
      )}
    </div>
  )
}

function WidthRuler({
  currentWidth,
  maxWidth,
  breakpoint,
  strategy,
}: {
  currentWidth: number
  maxWidth: number
  breakpoint: number
  strategy: Strategy
}) {
  const fillPct = Math.min((currentWidth / maxWidth) * 100, 100)
  const bpPct = (breakpoint / maxWidth) * 100
  const bpVisible = bpPct <= 100 // (F9) only show tick when it fits in the ruler
  const belowBreakpoint = currentWidth < breakpoint
  const isFluid = strategy === 'fluid'

  const fillColor =
    isFluid
      ? 'bg-emerald-400/40 dark:bg-emerald-500/30'
      : belowBreakpoint
        ? strategy === 'media'
          ? 'bg-amber-400/60 dark:bg-amber-500/40'
          : 'bg-emerald-400/60 dark:bg-emerald-500/40'
        : 'bg-zinc-300/60 dark:bg-zinc-600/40'

  const tickColor =
    isFluid
      ? 'bg-transparent'
      : belowBreakpoint
        ? strategy === 'media'
          ? 'bg-amber-400 dark:bg-amber-500'
          : 'bg-emerald-400 dark:bg-emerald-500'
        : 'bg-zinc-300 dark:bg-zinc-600'

  const labelColor =
    isFluid
      ? 'text-transparent'
      : belowBreakpoint
        ? strategy === 'media'
          ? 'text-amber-500 dark:text-amber-400'
          : 'text-emerald-500 dark:text-emerald-400'
        : 'text-zinc-400 dark:text-zinc-500'

  return (
    <div className="relative h-6">
      {/* Track background */}
      <div className="absolute top-2 left-0 right-0 h-[2px] rounded-full bg-zinc-100 dark:bg-zinc-800/60" />

      {/* Filled portion */}
      <div
        className={`absolute top-2 left-0 h-[2px] rounded-full transition-colors duration-200 ${fillColor}`}
        style={{ width: `${fillPct}%` }}
      />

      {/* Breakpoint tick (F9: hidden when beyond ruler range) */}
      {!isFluid && bpVisible && (
        <div
          className="absolute top-0 flex flex-col items-center"
          style={{ left: `${bpPct}%`, transform: 'translateX(-50%)' }}
        >
          <div className={`w-[2px] h-[10px] rounded-full transition-colors duration-200 ${tickColor}`} />
          <span className={`text-[10px] font-mono font-medium mt-0.5 transition-colors duration-200 whitespace-nowrap ${labelColor}`}>
            {breakpoint}px
          </span>
        </div>
      )}

      {/* Current width indicator */}
      <div
        className="absolute top-0"
        style={{ left: `${fillPct}%`, transform: 'translateX(-50%)' }}
      >
        <div className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
          isFluid
            ? 'bg-emerald-400 dark:bg-emerald-500'
            : belowBreakpoint
              ? strategy === 'media'
                ? 'bg-amber-400 dark:bg-amber-500'
                : 'bg-emerald-400 dark:bg-emerald-500'
              : 'bg-zinc-400 dark:bg-zinc-500'
        }`} style={{ marginTop: '4.5px' }} />
      </div>
    </div>
  )
}
