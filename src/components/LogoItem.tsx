import type { LogoMeta } from '@/lib/logos'
import type { LogoSize } from '@/lib/balancer'

interface LogoItemProps {
  logo: LogoMeta
  size: LogoSize
  cellSize: number
  showBounds?: boolean
  showDimensions?: boolean
  onRemove?: () => void
}

export function LogoItem({ logo, size, cellSize, showBounds = true, showDimensions = false, onRemove }: LogoItemProps) {
  return (
    <div className="flex flex-col items-center gap-3 min-w-0">
      <div
        className={`relative flex items-center justify-center rounded-lg transition-colors duration-150 ${
          showBounds ? 'border border-dashed border-zinc-200 dark:border-zinc-700/40' : ''
        }`}
        style={{
          width: cellSize,
          height: cellSize,
          transition: 'width 300ms ease-out, height 300ms ease-out',
        }}
      >
        <img
          src={logo.src}
          alt={logo.name}
          draggable={false}
          className="block object-contain"
          style={{
            width: size.width,
            height: size.height,
            transition: 'width 300ms ease-out, height 300ms ease-out',
          }}
        />
        {onRemove && (
          <button
            onClick={onRemove}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-zinc-200/90 dark:bg-zinc-700/90 text-zinc-500 dark:text-zinc-400 text-xs leading-none flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors backdrop-blur-sm"
          >
            &times;
          </button>
        )}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-100 truncate max-w-full">{logo.name}</span>
        <span className="text-xs font-mono tabular-nums text-zinc-400 dark:text-zinc-500">
          {showDimensions
            ? `${Math.round(size.width)}\u00d7${Math.round(size.height)}`
            : `${logo.ratio.toFixed(2)}:1`}
        </span>
      </div>
    </div>
  )
}
