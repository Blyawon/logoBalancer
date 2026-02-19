interface PillProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  title?: string
  /** When provided, replaces ALL default sizing and inactive styling.
   *  The consumer must include size, shape, and inactive color classes.
   *  The Pill only adds active colors on top. */
  className?: string
}

export function Pill({ active, onClick, children, title, className }: PillProps) {
  if (className) {
    return (
      <button
        onClick={onClick}
        title={title}
        className={`font-medium transition-colors duration-150 ${
          active ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900' : ''
        } ${className}`}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      title={title}
      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-150 ${
        active
          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
          : 'bg-zinc-100 text-zinc-500 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300'
      }`}
    >
      {children}
    </button>
  )
}
