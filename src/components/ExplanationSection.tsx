import { useState, useMemo, useCallback } from 'react'
import type { BalancerParams } from '@/lib/balancer'
import type { LogoMeta } from '@/lib/logos'
import { computeLogoSize } from '@/lib/balancer'
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

const FORMULA_CODE = `function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Power-law width mapping for visual balance.
 *
 * width  = cell × baseline × r^exponent × scale
 * height = width / r
 *
 * Key exponents:
 *   0.0  → equal width  (no correction)
 *   0.5  → equal area   (w × h = const)
 *   0.75 → optical balance (w^¼ × h^¾ = const)
 *   1.0  → equal height (h = const)
 *
 * Max safe exponent (avoids overflow):
 *   e_max = ln(fitPercent / (baseline × scale)) / ln(ratioMax)
 */
function widthFraction(ratio, { baseline, exponent, ratioMin, ratioMax }) {
  const r = clamp(ratio, ratioMin, ratioMax);
  return baseline * Math.pow(r, exponent);
}

// Compute final logo dimensions within a square cell
function computeLogoSize(ratio, cellSize, params) {
  const wFrac = widthFraction(ratio, params);
  const safeBox = cellSize * params.fitPercent;

  let width = cellSize * wFrac * params.scale;
  let height = width / ratio;

  // Fit-clamp: prevent overflow on either axis
  const fit = Math.min(1, safeBox / width, safeBox / height);
  width *= fit;
  height *= fit;

  return { width, height };
}`

const LLM_PROMPT = `Visually balance logos of different aspect ratios in a row.

Problem:
  Logos given equal width look uneven — portrait logos dominate
  because the eye weighs height more than width.

Solution — power-law width mapping:

  ratio = naturalWidth / naturalHeight
  ratio = clamp(ratio, ratioMin, ratioMax)
  widthFraction = baseline * ratio ^ exponent
  width = cellSize * widthFraction * scale
  height = width / ratio

  Fit-clamp to prevent overflow:
    safeBox = cellSize * fitPercent
    fit = min(1, safeBox / width, safeBox / height)
    width *= fit
    height *= fit

Parameters:
  baseline   = 0.46  width fraction for a square logo (ratio = 1)
  exponent   = 0.75  balance strategy
  ratioMin   = 0.35  clamp for extreme portrait ratios
  ratioMax   = 6.0   clamp for extreme landscape ratios
  scale      = 0.57  global size multiplier
  fitPercent = 0.73  max fraction of cell on either axis

Key exponents:
  0    equal width  (no correction)
  0.5  equal area   (w * h = const)
  0.75 optical      (w^0.25 * h^0.75 = const)
  1.0  equal height (h = const)

Why 0.75?
  Perceived size ~ w^0.25 * h^0.75.
  Setting exponent = 0.75 equalizes this metric,
  giving every logo the same visual weight.`

const EXPONENTS = [
  { value: 0, label: 'e = 0', desc: 'Equal width \u2014 no correction', highlight: false },
  { value: 0.5, label: 'e = 0.5', desc: 'Equal area \u2014 mathematically tidy', highlight: false },
  {
    value: 0.75,
    label: 'e = 0.75',
    desc: 'Optical balance',
    extra: ' \u2014 w\u00b9\u2044\u2074 \u00d7 h\u00b3\u2044\u2074 = const',
    highlight: true,
  },
  { value: 1.0, label: 'e = 1.0', desc: 'Equal height \u2014 overcorrects for wide logos', highlight: false },
]

const CODE_TABS = [
  { id: 'formula' as const, label: 'Formula', desc: null },
  { id: 'export' as const, label: 'Export', desc: 'Self-contained function with your current parameters. Updates live as you move the sliders.' },
  { id: 'prompt' as const, label: 'AI Prompt', desc: 'Paste this into any LLM to implement the balancing logic in your project.' },
]

function generateExportCode(params: BalancerParams, logos: LogoMeta[]): string {
  const sizes = logos
    .map((logo) => {
      const size = computeLogoSize(logo.ratio, 100, params)
      return `//   ${logo.name} (r=${logo.ratio.toFixed(2)}): ${Math.round(size.width)}\u00d7${Math.round(size.height)}`
    })
    .join('\n')

  return `// Logo Balancer — drop into your project
const config = {
  baseline: ${params.baseline},
  exponent: ${params.exponent},
  ratioMin: ${params.ratioMin},
  ratioMax: ${params.ratioMax},
  scale: ${params.scale},
  fitPercent: ${params.fitPercent},
};

function getLogoSize(ratio, cellSize) {
  const r = Math.max(config.ratioMin, Math.min(config.ratioMax, ratio));
  const wFrac = config.baseline * Math.pow(r, config.exponent);
  const safeBox = cellSize * config.fitPercent;
  let w = cellSize * wFrac * config.scale;
  let h = w / ratio;
  const fit = Math.min(1, safeBox / w, safeBox / h);
  return { width: w * fit, height: h * fit };
}

// Sizes at cellSize = 100:
${sizes}`
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
            The Problem
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
                Optical (e = 0.75)
              </span>
              <MiniLane params={params} exponentOverride={0.75} cellSize={40} />
            </div>
          </div>
        </section>

        {/* The Insight */}
        <section className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
            The Insight
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
              Setting <Code>exponent = 0.75</Code> equalizes that metric &mdash; giving every
              logo the same visual weight.
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
            The Math
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
          <section className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-500">
              Walkthrough
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Pick a logo and trace the computation step by step:
            </p>
            <FormulaWalkthrough params={params} logos={logos} />
          </section>

          <section className="space-y-3">
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
          <div className="flex items-center gap-1 px-2 py-2 border-b border-zinc-100 dark:border-zinc-700/40 bg-zinc-50/50 dark:bg-zinc-800/30">
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
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              {copiedId === activeTab ? 'Copied!' : 'Copy'}
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
