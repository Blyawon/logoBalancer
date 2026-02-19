import { useState } from 'react'
import { CopyButton } from './CopyButton'

interface CodeBlockProps {
  id: string
  code: string
  /** Optional label shown in the header bar */
  label?: string
  /** Optional sublabel shown next to the label */
  sublabel?: string
  /** Optional variant icon: warn (×) or good (✓) */
  variant?: 'warn' | 'good'
  /** Optional description shown above the code */
  desc?: string
  /** Control whitespace wrapping. Default: 'pre' */
  wrap?: boolean
}

export function CodeBlock({ id, code, label, sublabel, variant, desc, wrap }: CodeBlockProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const showHeader = label || variant

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700/40 overflow-hidden">
      {showHeader && (
        <div className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-100 dark:border-zinc-700/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {variant === 'warn' && (
              <svg className="w-3 h-3 text-amber-400/80 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            )}
            {variant === 'good' && (
              <svg className="w-3 h-3 text-emerald-400/80 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8.5l3.5 3.5 6.5-8" />
              </svg>
            )}
            {label && <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>}
            {sublabel && <span className="text-[10px] text-zinc-400 dark:text-zinc-500">{sublabel}</span>}
          </div>
          <CopyButton copied={copiedId === id} onClick={handleCopy} />
        </div>
      )}
      <div className={showHeader ? 'p-3 sm:p-4' : 'p-4 sm:p-6'}>
        {desc && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">{desc}</p>
        )}
        <div className="overflow-x-auto">
          <pre className={`text-[12px] sm:text-[13px] leading-relaxed font-mono text-zinc-600 dark:text-zinc-400 ${wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'}`}>
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
