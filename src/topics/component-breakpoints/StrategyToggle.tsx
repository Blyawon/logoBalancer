interface ToggleOption<T extends string> {
  value: T
  label: string
  shortLabel?: string
  color: 'amber' | 'emerald'
}

interface StrategyToggleProps<T extends string> {
  options: ToggleOption<T>[]
  value: T
  onChange: (value: T) => void
}

export function StrategyToggle<T extends string>({
  options,
  value,
  onChange,
}: StrategyToggleProps<T>) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800/60 p-1">
      {options.map((opt) => {
        const active = value === opt.value
        const dotColor =
          opt.color === 'amber'
            ? active ? 'bg-amber-400' : 'bg-amber-400/40'
            : active ? 'bg-emerald-400' : 'bg-emerald-400/40'

        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-150 ${
              active
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
            {opt.shortLabel ? (
              <>
                <span className="sm:hidden">{opt.shortLabel}</span>
                <span className="hidden sm:inline">{opt.label}</span>
              </>
            ) : (
              opt.label
            )}
          </button>
        )
      })}
    </div>
  )
}
