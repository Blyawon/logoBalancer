import type { ReactNode } from 'react'

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-zinc-700 dark:text-zinc-300">
      {children}
    </code>
  )
}
