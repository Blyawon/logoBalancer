/**
 * SampleCard demonstrates a card component under 3 CSS strategies.
 *
 * Instead of real @media queries (which would respond to the page viewport
 * and defeat the illustration), layout is driven by props:
 *
 * - media:     `viewportWidth` decides layout — simulates @media behavior
 * - container: `containerWidth` decides layout — simulates @container behavior
 * - fluid:     actual CSS `cqi` units — needs parent to have `container-type: inline-size`
 */

interface SampleCardProps {
  strategy: 'media' | 'container' | 'fluid'
  /** Simulated viewport width (only used by "media" strategy) */
  viewportWidth?: number
  /** Actual container width (only used by "container" strategy) */
  containerWidth?: number
}

const CARD_BREAKPOINT = 480

export function SampleCard({ strategy, viewportWidth = 1440, containerWidth = 600 }: SampleCardProps) {
  // Decide layout direction based on strategy
  const isHorizontal =
    strategy === 'media'
      ? viewportWidth >= CARD_BREAKPOINT  // @media checks viewport → always "desktop" on wide screens
      : strategy === 'container'
        ? containerWidth >= CARD_BREAKPOINT // @container checks actual space
        : false // fluid doesn't use a breakpoint

  if (strategy === 'fluid') {
    return <FluidCard />
  }

  return (
    <div
      className={`flex overflow-hidden transition-all duration-300 ease-out ${
        isHorizontal ? 'flex-row' : 'flex-col'
      }`}
    >
      <div
        className={`bg-gradient-to-br from-zinc-300 to-zinc-200 dark:from-zinc-700 dark:to-zinc-600 shrink-0 transition-all duration-300 ${
          isHorizontal ? 'w-2/5' : 'h-[120px]'
        }`}
      />
      <div className="p-4 flex flex-col gap-2 min-w-0">
        <h4 className="text-[15px] font-semibold text-zinc-800 dark:text-zinc-100 leading-tight truncate">
          Dashboard Widget
        </h4>
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
          Track key metrics and performance indicators in real time.
        </p>
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            Analytics
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
            Real-time
          </span>
        </div>
        <button className="mt-1 self-start px-3 py-1.5 text-[13px] font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  )
}

/**
 * Fluid variant uses CSS `cqi` units — needs parent with `container-type: inline-size`.
 * Always stacked: fluid sizing scales proportionally within one layout mode.
 * Combine with @container breakpoints for layout shifts (stacked → horizontal).
 */
function FluidCard() {
  return (
    <div className="flex flex-col overflow-hidden">
      <div
        className="bg-gradient-to-br from-zinc-300 to-zinc-200 dark:from-zinc-700 dark:to-zinc-600 shrink-0"
        style={{ height: 'clamp(80px, 20cqi, 160px)' }}
      />
      <div
        className="flex flex-col min-w-0"
        style={{ padding: 'clamp(12px, 3cqi, 20px)', gap: 'clamp(6px, 1.5cqi, 12px)' }}
      >
        <h4
          className="font-semibold text-zinc-800 dark:text-zinc-100 leading-tight truncate"
          style={{ fontSize: 'clamp(13px, 3cqi, 17px)' }}
        >
          Dashboard Widget
        </h4>
        <p
          className="text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2"
          style={{ fontSize: 'clamp(11px, 2.5cqi, 14px)' }}
        >
          Track key metrics and performance indicators in real time.
        </p>
        <div className="flex gap-1.5 flex-wrap">
          <span
            className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
            style={{ fontSize: 'clamp(9px, 2cqi, 11px)' }}
          >
            Analytics
          </span>
          <span
            className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
            style={{ fontSize: 'clamp(9px, 2cqi, 11px)' }}
          >
            Real-time
          </span>
        </div>
        <button
          className="mt-1 self-start font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
          style={{
            padding: 'clamp(6px, 1.5cqi, 10px) clamp(10px, 2.5cqi, 18px)',
            fontSize: 'clamp(11px, 2.5cqi, 14px)',
          }}
        >
          View Details
        </button>
      </div>
    </div>
  )
}
