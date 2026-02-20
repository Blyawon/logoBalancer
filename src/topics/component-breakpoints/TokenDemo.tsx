import { useState } from 'react'
import { ProseCallout } from '@/components/Callout'
import { StrategyToggle } from './StrategyToggle'

type TokenStrategy = 'device' | 'density'

const OPTIONS: { value: TokenStrategy; label: string; shortLabel: string; color: 'amber' | 'emerald' }[] = [
  { value: 'device', label: 'Device Tokens', shortLabel: 'Device', color: 'amber' },
  { value: 'density', label: 'Density Tokens', shortLabel: 'Density', color: 'emerald' },
]

export function TokenDemo() {
  const [strategy, setStrategy] = useState<TokenStrategy>('device')

  const isDevice = strategy === 'device'

  return (
    <div className="space-y-4">
      {/* Toggle (F14: shared component) */}
      <StrategyToggle options={OPTIONS} value={strategy} onChange={setStrategy} />

      {/* Single app layout panel */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700/40 overflow-hidden">
        <div className="flex bg-white dark:bg-zinc-900">
          {/* Sidebar */}
          <div className="w-[120px] sm:w-[160px] shrink-0 border-r border-zinc-100 dark:border-zinc-700/40 bg-zinc-50/50 dark:bg-zinc-800/20 p-3 overflow-hidden">
            <div className="text-[8px] font-mono uppercase tracking-widest text-zinc-300 dark:text-zinc-600 mb-3">
              Sidebar
            </div>
            <div className="space-y-2">
              <button
                className="w-full font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-all duration-200 truncate"
                style={{
                  padding: isDevice ? '12px 16px' : '6px 10px',
                  fontSize: isDevice ? '14px' : '12px',
                }}
              >
                Add Item
              </button>
              <p className={`text-[9px] font-mono transition-colors duration-200 ${
                isDevice ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {isDevice ? '→ desktop' : '→ compact'}
              </p>
            </div>
          </div>

          {/* Main area */}
          <div className="flex-1 p-3">
            <div className="text-[8px] font-mono uppercase tracking-widest text-zinc-300 dark:text-zinc-600 mb-3">
              Main
            </div>
            <div className="space-y-2">
              <button
                className="w-full font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 transition-all duration-200 truncate"
                style={{
                  padding: isDevice ? '12px 16px' : '10px 14px',
                  fontSize: isDevice ? '14px' : '13px',
                }}
              >
                Add Item
              </button>
              <p className={`text-[9px] font-mono transition-colors duration-200 ${
                isDevice ? 'text-amber-500' : 'text-emerald-500'
              }`}>
                {isDevice ? '→ desktop' : '→ comfortable'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Callout */}
      <ProseCallout variant={isDevice ? 'warn' : 'good'}>
        {isDevice ? (
          <>
            Both buttons use <strong>desktop</strong> tokens &mdash; same generous size everywhere,
            even though the sidebar has a fraction of the space.
          </>
        ) : (
          <>
            The layout passes <strong>compact</strong> to the sidebar and <strong>comfortable</strong> to the main area.
            Same component, sized for its context.
          </>
        )}
      </ProseCallout>
    </div>
  )
}
