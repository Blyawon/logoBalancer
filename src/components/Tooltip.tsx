import type { ReactNode } from 'react'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <span className="relative inline-flex group/tip">
      {children}
      <span
        role="tooltip"
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 px-3 py-2 rounded-lg text-xs leading-relaxed text-center bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-800 shadow-lg shadow-zinc-900/15 dark:shadow-zinc-200/10 w-max max-w-[200px] sm:max-w-[240px] opacity-0 translate-y-1 scale-[0.98] pointer-events-none transition-[opacity,transform] duration-200 ease-out delay-0 group-hover/tip:delay-300 group-hover/tip:opacity-100 group-hover/tip:translate-y-0 group-hover/tip:scale-100"
      >
        {content}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-zinc-800 dark:border-t-zinc-200" />
      </span>
    </span>
  )
}
