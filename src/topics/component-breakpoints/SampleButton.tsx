/**
 * SampleButton demonstrates a button under 3 CSS strategies.
 *
 * Layout is JS-driven (not real @media) so the demo works on any viewport:
 * - media:     `viewportWidth` decides size (simulates @media)
 * - container: `containerWidth` decides size (simulates @container)
 * - fluid:     CSS `cqi` units (needs parent with container-type: inline-size)
 */

interface SampleButtonProps {
  strategy: 'media' | 'container' | 'fluid'
  /** Simulated viewport width (media strategy) */
  viewportWidth?: number
  /** Actual container width (container strategy) */
  containerWidth?: number
}

const BTN_BREAKPOINT = 400
const MEDIA_BREAKPOINT = 768

export function SampleButton({ strategy, viewportWidth = 1440, containerWidth = 600 }: SampleButtonProps) {
  const isComfortable =
    strategy === 'media'
      ? viewportWidth >= MEDIA_BREAKPOINT  // @media checks viewport
      : strategy === 'container'
        ? containerWidth >= BTN_BREAKPOINT  // @container checks actual space
        : false // fluid handled separately

  if (strategy === 'fluid') {
    return <FluidButton />
  }

  return (
    <button
      className={`inline-flex items-center font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all duration-200 ${
        isComfortable
          ? 'px-6 py-3 text-[15px] gap-2'
          : 'px-3.5 py-2 text-[13px] gap-1.5'
      }`}
    >
      <svg
        className={`shrink-0 transition-all duration-200 ${isComfortable ? 'w-4 h-4' : 'w-3.5 h-3.5'}`}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 3v10M3 8h10" />
      </svg>
      Add Item
    </button>
  )
}

function FluidButton() {
  return (
    <button
      className="inline-flex items-center font-medium rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all duration-200"
      style={{
        padding: 'clamp(8px, 2cqi, 14px) clamp(14px, 4cqi, 28px)',
        fontSize: 'clamp(13px, 2.5cqi, 16px)',
        gap: 'clamp(6px, 1.5cqi, 10px)',
      }}
    >
      <svg
        className="shrink-0"
        style={{ width: 'clamp(14px, 2.5cqi, 18px)', height: 'clamp(14px, 2.5cqi, 18px)' }}
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 3v10M3 8h10" />
      </svg>
      Add Item
    </button>
  )
}
