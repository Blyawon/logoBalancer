import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import { CopyButton } from '@/components/CopyButton'
import type { GeneratedToken, DimensionConfig } from './types'

const barSpring = { type: 'spring' as const, stiffness: 200, damping: 22 }

interface TokenRowProps {
  token: GeneratedToken
  maxValue: number
  config: DimensionConfig
  onLock: (index: number, value: number) => void
  onUnlock: (index: number) => void
}

function EditableValue({
  value,
  onCommit,
}: {
  value: number
  onCommit: (v: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setDraft(String(value))
    setEditing(true)
  }

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  function commit() {
    const parsed = parseFloat(draft)
    if (!isNaN(parsed) && parsed > 0) {
      onCommit(parsed)
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') setEditing(false)
        }}
        className="w-16 text-xs font-mono tabular-nums text-zinc-900 dark:text-zinc-100 bg-transparent border-b border-zinc-300 dark:border-zinc-600 text-right outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
      />
    )
  }

  return (
    <button
      onClick={startEdit}
      className="text-xs font-mono tabular-nums text-zinc-900 dark:text-zinc-100 hover:text-sky-600 dark:hover:text-sky-400 hover:underline hover:decoration-dotted hover:underline-offset-2 cursor-text transition-colors"
    >
      {value}
    </button>
  )
}

function useCopy(text: string) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [text])
  return { copied, handleCopy }
}

export function TokenRow({ token, maxValue, config, onLock, onUnlock }: TokenRowProps) {
  const barPercent = maxValue > 0 ? (token.value / maxValue) * 100 : 0
  const showWarning = token.value < 24
  const copyText = `${token.cssVar}: ${token.fluidValue ?? token.displayValue};`
  const { copied, handleCopy } = useCopy(copyText)

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
        token.locked
          ? 'bg-amber-50/50 dark:bg-amber-900/10'
          : 'bg-zinc-50/50 dark:bg-zinc-800/20'
      }`}
    >
      {/* Visual bar */}
      <div className="w-24 sm:w-32 shrink-0">
        <motion.div
          className="h-3 rounded-sm bg-zinc-900 dark:bg-zinc-100"
          initial={false}
          animate={{ width: `${Math.max(barPercent, 2)}%` }}
          transition={barSpring}
        />
      </div>

      {/* Name */}
      <span className="w-16 sm:w-20 shrink-0 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 truncate">
        {token.name}
      </span>

      {/* Value */}
      <span className="w-16 shrink-0 text-right">
        {token.locked ? (
          <EditableValue value={token.value} onCommit={(v) => onLock(token.index, v)} />
        ) : (
          <span className="text-xs font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
            {token.displayValue}
          </span>
        )}
      </span>

      {/* Rem value */}
      {config.outputUnit === 'px' && (
        <span className="w-14 shrink-0 text-right text-[10px] font-mono tabular-nums text-zinc-400 dark:text-zinc-500 hidden sm:block">
          {token.remValue.toFixed(token.remValue < 1 ? 3 : 2)}rem
        </span>
      )}

      {/* Formula or fluid */}
      <span className="flex-1 min-w-0 text-[10px] font-mono text-zinc-300 dark:text-zinc-600 truncate hidden lg:block">
        {token.fluidValue ?? token.formula}
      </span>

      {/* Accessibility warning */}
      {showWarning && (
        <span title="Below 24px touch target minimum" className="text-amber-500 text-[10px] shrink-0 hidden sm:block">
          !
        </span>
      )}

      {/* Lock toggle */}
      <button
        onClick={() => token.locked ? onUnlock(token.index) : onLock(token.index, token.value)}
        className={`shrink-0 w-6 h-6 flex items-center justify-center rounded transition-colors ${
          token.locked
            ? 'text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300'
            : 'text-zinc-300 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400'
        }`}
        title={token.locked ? 'Unlock token' : 'Lock token'}
      >
        {token.locked ? (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 7V5a4 4 0 118 0v2h1a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1h1zm2 0h4V5a2 2 0 10-4 0v2z" />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M10 7H5V5a3 3 0 016 0h2a5 5 0 00-10 0v2H2a1 1 0 00-1 1v6a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1z" />
          </svg>
        )}
      </button>

      {/* Copy */}
      <div className="shrink-0">
        <CopyButton copied={copied} onClick={handleCopy} />
      </div>
    </div>
  )
}
