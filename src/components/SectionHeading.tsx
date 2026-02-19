interface SectionHeadingProps {
  title: string
  number?: string
  id?: string
}

export function SectionHeading({ title, number, id }: SectionHeadingProps) {
  return (
    <h3
      id={id}
      className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500 scroll-mt-8"
    >
      {number && <span className="text-zinc-300 dark:text-zinc-700 mr-2">{number}</span>}{title}
    </h3>
  )
}
