import { useState, useMemo, useCallback } from 'react'
import type { BalancerParams } from '@/lib/balancer'
import type { LogoMeta } from '@/lib/logos'
import { FORMULA_CODE, LLM_PROMPT, EXPONENTS, CODE_TABS, generateExportCode } from '@/lib/content'
import { MiniLane } from './MiniLane'
import { ExponentSpectrum } from './ExponentSpectrum'
import { PerceivedWeightBars } from './PerceivedWeightBars'
import { FormulaWalkthrough } from './FormulaWalkthrough'
import { RatioExplorer } from './RatioExplorer'

interface ExplanationSectionProps {
  params: BalancerParams
  logos: LogoMeta[]
  onParamsChange: (params: BalancerParams) => void
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono text-zinc-700 dark:text-zinc-300">
      {children}
    </code>
  )
}

function ParamLink({ children }: { children: React.ReactNode }) {
  return (
    <button
      onClick={() =>
        document.getElementById('controls')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      title="Scroll to controls"
      className="text-zinc-900 dark:text-zinc-100 underline decoration-dotted underline-offset-2 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
    >
      {children}
    </button>
  )
}

export function ExplanationSection({ params, logos, onParamsChange }: ExplanationSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'formula' | 'export' | 'prompt'>('formula')

  const exportCode = useMemo(() => generateExportCode(params, logos), [params, logos])

  async function handleCopy(id: string, text: string) {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExponentChange = useCallback(
    (exp: number) => {
      onParamsChange({ ...params, exponent: exp })
    },
    [params, onParamsChange]
  )

  const tabContent = {
    formula: FORMULA_CODE,
    export: exportCode,
    prompt: LLM_PROMPT,
  }

  const activeTabMeta = CODE_TABS.find((t) => t.id === activeTab)!

  return (
    <div>
      <div className="border-t border-zinc-100 dark:border-zinc-700/40" />

      <h2 className="mt-8 text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:mt-12 sm:text-3xl">
        How It Works
      </h2>

      {/* ─── Zone 1: Understanding ─── */}
      <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-10">
        {/* The Problem */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
            <span className="text-zinc-300 dark:text-zinc-700 mr-2">01</span>The Problem
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
            When you line up logos in a row and give them all the same width,
            portrait logos tower over landscape wordmarks. Try the
            &ldquo;Equal Width&rdquo; preset above to see it. The row looks uneven because
            our eyes scan horizontally &mdash;{' '}
            <span className="text-zinc-900 dark:text-zinc-100">
              height is the dominant visual dimension
            </span>.
          </p>
          <div className="inline-flex flex-col sm:flex-row gap-4 sm:gap-8 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 p-4">
            <div className="space-y-2">
              <span className="block text-xs font-medium text-zinc-400 dark:text-zinc-500">
                Equal Width (e = 0)
              </span>
              <MiniLane params={params} exponentOverride={0} cellSize={40} />
            </div>
            <div className="space-y-2">
              <span className="block text-xs font-medium text-zinc-400 dark:text-zinc-500">
                Visual (e = 0.6)
              </span>
              <MiniLane params={params} exponentOverride={0.6} cellSize={40} />
            </div>
          </div>
        </section>

        {/* The Insight */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
            <span className="text-zinc-300 dark:text-zinc-700 mr-2">02</span>The Insight
          </h3>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl space-y-3">
            <p>
              Your first instinct might be to equalize{' '}
              <span className="text-zinc-900 dark:text-zinc-100">area</span> (<Code>exponent = 0.5</Code>),
              but it still looks wrong &mdash; portrait logos are still much taller.
              Pure <span className="text-zinc-900 dark:text-zinc-100">equal height</span> (<Code>exponent = 1.0</Code>)
              overcorrects the other way, making wide logos enormous.
            </p>
            <p>
              The sweet spot: in a horizontal strip our eye weighs{' '}
              <span className="text-zinc-900 dark:text-zinc-100">height more than width</span>.
              Perceptual research suggests roughly{' '}
              <span className="text-zinc-900 dark:text-zinc-100">
                perceived size = w<sup>&#188;</sup> &times; h<sup>&#190;</sup>
              </span>.
              The Visual preset uses <Code>exponent = 0.6</Code>, a tuned sweet spot
              between equal area and pure perceptual balance that looks best
              across a range of logo sets.
            </p>
          </div>
          <div className="rounded-xl bg-zinc-50 dark:bg-zinc-800/30 p-4 sm:p-5 max-w-sm">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">
              Sweep the exponent from 0 to 1:
            </p>
            <ExponentSpectrum params={params} onExponentChange={handleExponentChange} />
          </div>
        </section>
      </div>

      {/* ─── Zone divider ─── */}
      <div className="border-t border-zinc-100 dark:border-zinc-700/40 mt-12 sm:mt-16" />

      {/* ─── Zone 2: Technical ─── */}
      <div className="mt-10 sm:mt-14 space-y-8 sm:space-y-10">
        {/* The Math */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
            <span className="text-zinc-300 dark:text-zinc-700 mr-2">03</span>The Math
          </h3>
          <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl space-y-4">
            <p>
              Each logo sits in an equal square cell. We set its width as a
              power of its aspect ratio <Code>r = naturalWidth / naturalHeight</Code>:
            </p>
            <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/40 px-5 py-4 font-mono text-xs leading-loose space-y-1">
              <p className="text-zinc-700 dark:text-zinc-300">
                width &nbsp;= cell &times; <ParamLink>baseline</ParamLink> &times; r<sup><ParamLink>exponent</ParamLink></sup> &times; <ParamLink>scale</ParamLink>
              </p>
              <p className="text-zinc-700 dark:text-zinc-300">height = width / r</p>
            </div>
            <p>
              The <Code>exponent</Code> controls what gets equalized.
              Click any value to apply it:
            </p>
            <ul className="space-y-3 list-none">
              {EXPONENTS.map((e) => (
                <li key={e.value} className="flex items-center gap-3">
                  <button
                    onClick={() => handleExponentChange(e.value)}
                    className={`font-mono text-xs shrink-0 w-16 text-left transition-colors hover:text-sky-600 dark:hover:text-sky-400 ${
                      e.highlight
                        ? 'text-zinc-900 dark:text-zinc-100 font-semibold'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}
                  >
                    {e.label}
                  </button>
                  <span className={`text-sm ${e.highlight ? 'text-zinc-900 dark:text-zinc-100' : ''}`}>
                    {e.highlight ? <span className="font-semibold">{e.desc}</span> : e.desc}
                    {e.extra ?? ''}
                  </span>
                  <div className="hidden sm:block shrink-0">
                    <MiniLane params={params} exponentOverride={e.value} cellSize={28} />
                  </div>
                </li>
              ))}
            </ul>

            {/* Perceived Weight Bars */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Perceived weight (w<sup>&#188;</sup> &times; h<sup>&#190;</sup>) per logo at current settings:
              </p>
              <PerceivedWeightBars params={params} logos={logos} />
            </div>

            <p>
              The <Code>{'\u00be'}</Code> exponent comes from{' '}
              <span className="text-zinc-900 dark:text-zinc-100">
                perceived size = w<sup>0.25</sup> &times; h<sup>0.75</sup>
              </span>. In a horizontal
              strip, height accounts for roughly 75% and width for 25% of perceived size.
              Substituting <Code>h = w / r</Code> and solving for equal perceived weight
              gives exactly <Code>exponent = {'\u00be'}</Code>.
            </p>
            <p>
              The maximum safe exponent before wide logos overflow:
            </p>
            <div className="rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/40 px-5 py-4 font-mono text-xs leading-loose">
              <p className="text-zinc-700 dark:text-zinc-300">
                <span className="text-zinc-900 dark:text-zinc-100 font-semibold">e<sub>max</sub></span>
                {' '}= ln(<ParamLink>fitPercent</ParamLink> / (<ParamLink>baseline</ParamLink> &times; <ParamLink>scale</ParamLink>)) / ln(<ParamLink>ratioMax</ParamLink>)
              </p>
            </div>
          </div>
        </section>

        {/* Walkthrough + Explore — side by side on desktop */}
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-2">
          <section className="rounded-xl border border-zinc-100 dark:border-zinc-700/40 p-4 sm:p-5 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
              Walkthrough
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Pick a logo and trace the computation step by step:
            </p>
            <FormulaWalkthrough params={params} logos={logos} />
          </section>

          <section className="rounded-xl border border-zinc-100 dark:border-zinc-700/40 p-4 sm:p-5 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
              Explore
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Drag the aspect ratio and watch the algorithm size the rectangle:
            </p>
            <RatioExplorer params={params} />
          </section>
        </div>
      </div>

      {/* ─── Zone divider ─── */}
      <div className="border-t border-zinc-100 dark:border-zinc-700/40 mt-12 sm:mt-16" />

      {/* ─── Zone 3: Code ─── */}
      <div className="mt-10 sm:mt-14">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500 mb-4">
          Code
        </h3>

        {/* Tabbed card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700/40 overflow-hidden">
          {/* Tab bar */}
          <div className="flex items-center gap-1 px-2 py-2 border-b border-zinc-100 dark:border-zinc-700/40 bg-zinc-50 dark:bg-zinc-800/40">
            {CODE_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
                  activeTab === tab.id
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="flex-1" />
            <button
              onClick={() => handleCopy(activeTab, tabContent[activeTab])}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              {copiedId === activeTab ? (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 6.5l2.5 2.5 4.5-5" className="animate-check" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="4" width="7" height="7" rx="1" />
                    <path d="M8 4V2.5A1.5 1.5 0 006.5 1h-4A1.5 1.5 0 001 2.5v4A1.5 1.5 0 002.5 8H4" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          {/* Tab content */}
          <div className="p-4 sm:p-6">
            {activeTabMeta.desc && (
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">
                {activeTabMeta.desc}
              </p>
            )}
            <div className="overflow-x-auto">
              <pre className="text-[12px] sm:text-[13px] leading-relaxed font-mono text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap">
                <code>{tabContent[activeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
