import { useState, useCallback } from 'react'
import { CopyButton } from '@/components/CopyButton'
import { TokenRow } from './TokenRow'
import { exportCSS } from './export'
import type { GeneratedToken, DimensionConfig } from './types'

interface TokenTableProps {
  tokens: GeneratedToken[]
  config: DimensionConfig
  onLock: (index: number, value: number) => void
  onUnlock: (index: number) => void
}

export function TokenTable({ tokens, config, onLock, onUnlock }: TokenTableProps) {
  const maxValue = Math.max(...tokens.map(t => t.value), 1)
  const [copied, setCopied] = useState(false)

  const handleCopyAll = useCallback(() => {
    navigator.clipboard.writeText(exportCSS(tokens, config))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [tokens, config])

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Generated Scale
          <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500 font-normal">
            {tokens.length} tokens
          </span>
        </h3>
        <CopyButton copied={copied} onClick={handleCopyAll} />
      </div>

      {/* Token rows */}
      <div className="space-y-1">
        {tokens.map((token) => (
          <TokenRow
            key={token.index}
            token={token}
            maxValue={maxValue}
            config={config}
            onLock={onLock}
            onUnlock={onUnlock}
          />
        ))}
      </div>

      {/* Negative scale */}
      {config.negativeScale && (
        <div className="mt-4 space-y-1">
          <h4 className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
            Negative tokens
          </h4>
          {tokens.map((token) => (
            <div
              key={`neg-${token.index}`}
              className="flex items-center gap-3 rounded-lg px-3 py-1.5 bg-zinc-50/30 dark:bg-zinc-800/10"
            >
              <span className="w-16 sm:w-20 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                {token.negativeName}
              </span>
              <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
                -{token.displayValue}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
