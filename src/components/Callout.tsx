type CalloutVariant = 'warn' | 'good'

const STYLES: Record<CalloutVariant, { border: string; bg: string; icon: string; label: string; text: string }> = {
  warn: {
    border: 'border-amber-200 dark:border-amber-800/30',
    bg: 'bg-amber-50/30 dark:bg-amber-900/5',
    icon: 'text-amber-400/80',
    label: 'text-amber-500 dark:text-amber-400',
    text: 'text-amber-700 dark:text-amber-400',
  },
  good: {
    border: 'border-emerald-200 dark:border-emerald-800/30',
    bg: 'bg-emerald-50/30 dark:bg-emerald-900/5',
    icon: 'text-emerald-400/80',
    label: 'text-emerald-500 dark:text-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
}

const ICON_PATHS: Record<CalloutVariant, string> = {
  warn: 'M4 4l8 8M12 4l-8 8',
  good: 'M3 8.5l3.5 3.5 6.5-8',
}

interface CalloutProps {
  variant: CalloutVariant
  children: React.ReactNode
  /** Optional label shown with icon in the header */
  label?: string
  /** When provided, replaces the default size/shape (rounded-lg px-3 py-2.5).
   *  Color and border classes are always applied from the variant. */
  className?: string
}

export function Callout({ variant, children, label, className }: CalloutProps) {
  const s = STYLES[variant]

  return (
    <div className={`border ${s.border} ${s.bg} transition-colors duration-200 ${className ?? 'rounded-lg px-3 py-2.5'}`}>
      {label && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <svg className={`w-3 h-3 ${s.icon} shrink-0`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={ICON_PATHS[variant]} />
          </svg>
          <span className={`text-[10px] font-mono ${s.label} uppercase tracking-wider`}>
            {label}
          </span>
        </div>
      )}
      {children}
    </div>
  )
}

/** Prose callout — simpler variant for longer text that toggles between warn/good */
export function ProseCallout({ variant, children, className }: Omit<CalloutProps, 'label'>) {
  const s = STYLES[variant]

  return (
    <div
      className={`rounded-lg px-4 py-3 text-sm border transition-all duration-300 ${s.border} ${s.text} ${
        variant === 'warn'
          ? 'bg-amber-50 dark:bg-amber-900/10'
          : 'bg-emerald-50 dark:bg-emerald-900/10'
      } ${className ?? ''}`}
      style={{ textWrap: 'balance' }}
    >
      {children}
    </div>
  )
}
