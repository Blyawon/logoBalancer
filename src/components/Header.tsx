interface HeaderProps {
  title: string
  subtitle: string
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="flex flex-col items-center text-center py-4 sm:py-10">
      <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-100 sm:text-5xl" style={{ letterSpacing: '-0.04em' }}>
        {title}
      </h1>
      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 sm:mt-4 sm:text-base max-w-md text-balance">
        {subtitle}
      </p>
    </div>
  )
}
