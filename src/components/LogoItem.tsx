import { motion } from 'motion/react'
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

const sizeSpring = { type: 'spring' as const, stiffness: 300, damping: 26 }

export function LogoItem({ logo, size, cellSize, showBounds = true, showDimensions = false, onRemove }: LogoItemProps) {
  return (
    <div className="flex flex-col items-center gap-3 min-w-0">
      <motion.div
        className={`relative flex items-center justify-center rounded-lg transition-colors duration-150 ${
          showBounds ? 'border border-dotted border-zinc-200 dark:border-zinc-700/40' : ''
        }`}
        initial={false}
        animate={{ width: cellSize, height: cellSize }}
        transition={sizeSpring}
      >
        <motion.img
          src={logo.src}
          alt={logo.name}
          draggable={false}
          className="block object-contain"
          initial={false}
          animate={{ width: size.width, height: size.height }}
          transition={sizeSpring}
        />
        {onRemove && (
          <button
            onClick={onRemove}
            title="Remove logo"
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-zinc-200/90 dark:bg-zinc-700/90 flex items-center justify-center hover:bg-zinc-300 dark:hover:bg-zinc-600 hover:scale-110 transition-all backdrop-blur-sm"
          >
            <svg className="w-2.5 h-2.5 text-zinc-500 dark:text-zinc-400" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 2l6 6M8 2l-6 6" />
            </svg>
          </button>
        )}
      </motion.div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-800 dark:text-zinc-100 truncate max-w-full">{logo.name}</span>
        <span className="text-xs font-mono tabular-nums text-zinc-400 dark:text-zinc-500">
          {showDimensions
            ? `${Math.round(size.width)}\u00d7${Math.round(size.height)}`
            : `${logo.ratio.toFixed(2)}:1`}
        </span>
      </div>
    </div>
  )
}
