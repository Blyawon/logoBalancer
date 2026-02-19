import { useState } from 'react'
import { Code } from '@/components/Code'
import { SectionHeading } from '@/components/SectionHeading'
import { Pill } from '@/components/Pill'
import { Callout } from '@/components/Callout'
import { CodeBlock } from '@/components/CodeBlock'
import { ButtonHero } from './ButtonHero'
import { ResizableCardDemo } from './ResizableCardDemo'
import { TokenDemo } from './TokenDemo'
import {
  MEDIA_QUERY_CODE,
  CONTAINER_QUERY_CODE,
  FLUID_CODE,
} from './content'

export default function BreakpointsPage() {
  return (
    <>
      {/* ─── Hero: The Proof ─── */}
      <div className="mt-2 sm:mt-4">
        <ButtonHero />
      </div>

      {/* ─── Explanation (mirrors ExplanationSection pattern) ─── */}
      <div className="mt-10 sm:mt-20">
        <div className="border-t border-zinc-100 dark:border-zinc-700/40" />

        <h2 className="mt-8 text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:mt-12 sm:text-3xl">
          Why It Matters
        </h2>

        {/* Bridge: hero → section 01 */}
        <p className="mt-6 text-sm text-zinc-400 dark:text-zinc-500" style={{ textWrap: 'balance' }}>
          That was a button. Now imagine a more complex component &mdash; a card with an image,
          title, and description &mdash; placed in containers of varying widths.
        </p>

        {/* ─── Zone 1: Understanding ─── */}
        <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-10">
          {/* 01: The Container Responds */}
          <section className="space-y-4">
            <SectionHeading number="01" title="The Container Responds" id="the-container-responds" />
            <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl space-y-3">
              <p>
                The same principle scales to complex components. Resize the card below
                to see how layout adapts to the available space &mdash; not the viewport.
              </p>
              <p>
                Screen-based breakpoints measure the <em>browser window</em>, not the component.
                A card at 400px in a sidebar and at 400px fullscreen would look different &mdash;
                even though they have the exact same amount of space.
                The screen size is lying to your components.
              </p>
              <p className="text-zinc-400 dark:text-zinc-500 text-xs">
                The demos use JS-driven layout (not real CSS queries) so the illustration works
                at any viewport. The fluid variant uses real <Code>cqi</Code> units.
                In production, you&rsquo;d write actual <Code>@container</Code> rules in CSS.
              </p>
            </div>

            <div className="mt-6">
              <ResizableCardDemo />
            </div>
          </section>

          {/* 02: The Fix */}
          <section className="space-y-4">
            <SectionHeading number="02" title="The Fix: Container Queries" id="the-fix" />
            <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl space-y-3">
              <p>
                In CSS, screen-based sizing is written with <Code>@media</Code> &mdash;
                it measures the browser window.{' '}
                <span className="text-zinc-900 dark:text-zinc-100">
                  <Code>@container</Code> queries are the alternative
                </span>:
                they let a component respond to its own container&rsquo;s size, not the viewport.
                Write the rule once, and it works everywhere &mdash; sidebar, modal, grid cell, full width.
              </p>
              <p>
                Container queries are supported in{' '}
                <span className="text-zinc-900 dark:text-zinc-100">all modern browsers</span>
                {' '}&mdash; Chrome&nbsp;105+, Firefox&nbsp;110+, Safari&nbsp;16+, Edge&nbsp;105+.
                The platform already moved on. Most design systems haven&rsquo;t.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3 mt-6">
              <CodeBlock id="media-code" label="@media" sublabel="Viewport-dependent" code={MEDIA_QUERY_CODE} variant="warn" />
              <CodeBlock id="container-code" label="@container" sublabel="Space-aware" code={CONTAINER_QUERY_CODE} variant="good" />
              <CodeBlock id="fluid-code" label="fluid" sublabel="No breakpoints" code={FLUID_CODE} variant="good" />
            </div>
          </section>
        </div>

        {/* ─── Zone divider ─── */}
        <div className="border-t border-zinc-100 dark:border-zinc-700/40 mt-12 sm:mt-16" />

        {/* ─── Zone 2: Architecture ─── */}
        <div className="mt-10 sm:mt-14 space-y-8 sm:space-y-10">
          {/* 03: Layout Owns the Breakpoints */}
          <section className="space-y-4">
            <SectionHeading number="03" title="Layout Owns the Breakpoints" id="layout-owns-breakpoints" />
            <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl space-y-3">
              <p>
                Now you have the tools. But where do they go?
                The answer:{' '}
                <span className="text-zinc-900 dark:text-zinc-100">only the layout checks the screen</span>.
                Page shells, grid wrappers, sidebar containers &mdash; these use <Code>@media</Code> to decide the overall structure:
                sidebar vs. full width, 3&nbsp;columns vs.&nbsp;1.
              </p>
              <p>
                <span className="text-zinc-900 dark:text-zinc-100">Components never check the screen.</span>{' '}
                A button, a card, a nav item &mdash; they respond to their container
                using <Code>@container</Code> or <Code>clamp()</Code>.
                They don&rsquo;t know and don&rsquo;t care if they&rsquo;re on a phone or a desktop.
              </p>
              <p>
                This creates a clean contract. The layout says &ldquo;here&rsquo;s 200px.&rdquo;
                The component renders for 200px. If the layout changes &mdash; sidebar collapses,
                modal opens, grid reflows &mdash; the components just adapt.
              </p>
            </div>

            <div className="mt-6">
              <ResponsibilityDiagram />
            </div>
          </section>

          {/* 04: Tokens */}
          <section className="space-y-4">
            <SectionHeading number="04" title="Tokens: Density, Not Devices" id="tokens" />
            <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl space-y-3">
              <p>
                Once your components respond to their container, you&rsquo;ll need tokens that
                describe density rather than devices.
                If your tokens are called <Code>spacing.mobile</Code> and <Code>spacing.desktop</Code>,
                they carry an implicit assumption: the screen decides the density.
                Rename them to <Code>compact</Code> and <Code>comfortable</Code> &mdash;
                now the <em>layout</em> decides, and the same component
                can render at either density in any context.
              </p>
              <p>
                Different components need different breakpoints. A button might switch
                at <Code>400px</Code>, while a card switches at <Code>480px</Code> &mdash;
                that&rsquo;s expected. The breakpoint belongs to the component&rsquo;s content, not a global scale.
              </p>
            </div>

            <div className="mt-6">
              <TokenDemo />
            </div>
          </section>

          {/* 05: Context, Not Devices */}
          <section className="space-y-4">
            <SectionHeading number="05" title="Context, Not Devices" id="context-not-devices" />

            {/* Pull-quote objection (Concept 1) */}
            <div className="rounded-xl border-l-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800/30 px-4 py-3 max-w-2xl">
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                &ldquo;Pixel density varies across devices. Phones are held closer to our eyes.
                Mobile content is consumed on the go. Sizes on mobile should be <em>bigger</em>.&rdquo;
              </p>
            </div>

            <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl space-y-3">
              <p>
                These constraints are real. But they&rsquo;re not <em>device</em> constraints &mdash;
                they&rsquo;re{' '}
                <span className="text-zinc-900 dark:text-zinc-100">context constraints</span>.
                &ldquo;Mobile&rdquo; collapses several independent axes into one word.
              </p>
            </div>

            {/* Context Stack diagram (Concept 5) */}
            <div className="mt-6">
              <ContextStack />
            </div>

            {/* Device Breaker demo (Concepts 2 + 3) */}
            <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mt-6">
              <p>
                Every real-world scenario is a unique combination of these layers.
                &ldquo;Mobile&rdquo; guesses at them. Context tokens describe them.
              </p>
            </div>

            <div className="mt-4">
              <DeviceBreakerDemo />
            </div>

            {/* Token naming conclusion (Concept 4) */}
            <div className="mt-6 max-w-2xl space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Callout variant="warn" label="Device tokens" className="flex-1 rounded-lg px-3 py-2.5">
                  <div className="space-y-0.5 text-xs font-mono text-amber-600 dark:text-amber-400">
                    <div>spacing.mobile</div>
                    <div>spacing.desktop</div>
                  </div>
                </Callout>
                <Callout variant="good" label="Context tokens" className="flex-1 rounded-lg px-3 py-2.5">
                  <div className="space-y-0.5 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    <div>target.touch / target.pointer</div>
                    <div>density.near / density.far</div>
                  </div>
                </Callout>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Express the actual constraint, and the system works on every device &mdash;
                including ones that don&rsquo;t exist yet.
              </p>
            </div>
          </section>
        </div>

        {/* ─── Zone divider ─── */}
        <div className="border-t border-zinc-100 dark:border-zinc-700/40 mt-12 sm:mt-16" />

        {/* ─── Zone 3: Summary ─── */}
        <div className="mt-10 sm:mt-14">
          <SectionHeading title="The Rules" />

          <div className="max-w-2xl mt-4">
            <ol className="space-y-4 list-none">
              {RULES.map((rule, i) => (
                <li key={i} className="flex gap-3">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-400 dark:text-zinc-500">
                    {i + 1}
                  </span>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pt-0.5">
                    {rule}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-8 rounded-xl bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-700/40 px-5 py-4 max-w-2xl">
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Do your tokens reference device classes? Open a sidebar and a phone screen side by side.
              If the same component looks different in the same amount of space,{' '}
              <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                your system has a viewport problem
              </span>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

const RULES = [
  <>Never use screen-based breakpoints (<Code>@media</Code>) inside a reusable component. Components don&rsquo;t know what screen they&rsquo;re on.</>,
  <>Use container queries (<Code>@container</Code>) for layout shifts within components. Let them respond to their own space.</>,
  <>Use <Code>clamp()</Code> for fluid sizing &mdash; font, padding, gap. No breakpoints needed.</>,
  <>Reserve <Code>@media</Code> for page-level layout shells only &mdash; the grid that decides sidebar vs. full width.</>,
  <>Name tokens by density (<Code>compact</Code>, <Code>comfortable</Code>), not by device (<Code>mobile</Code>, <Code>desktop</Code>).</>,
  <>Layout owns breakpoints. Components receive context. Never the other way around.</>,
]

function ResponsibilityDiagram() {
  return (
    <div className="space-y-4">
      {/* Correct model */}
      <Callout variant="good" label="Layout owns the breakpoints" className="rounded-xl p-4 sm:p-5">
        <div className="flex gap-3">
          <DiagramRegion label="Sidebar" width="200px" color="emerald" flex="none" className="w-[35%] sm:w-[30%]">
            <DiagramLine name="Button" result="small" />
            <DiagramLine name="Card" result="stacked" />
            <div className="text-[9px] font-mono text-emerald-500 dark:text-emerald-400 mt-2">@container</div>
          </DiagramRegion>
          <DiagramRegion label="Main" width="900px" color="emerald" flex="1">
            <DiagramLine name="Button" result="large" />
            <DiagramLine name="Card" result="horizontal" />
            <div className="text-[9px] font-mono text-emerald-500 dark:text-emerald-400 mt-2">@container</div>
          </DiagramRegion>
        </div>
      </Callout>

      {/* Broken model */}
      <Callout variant="warn" label="Every component checks the screen" className="rounded-xl p-4 sm:p-5">
        <div className="flex gap-3">
          <DiagramRegion label="Sidebar" width="200px" color="amber" flex="none" className="w-[35%] sm:w-[30%]">
            <DiagramLine name="Button" result="large!" warn />
            <DiagramLine name="Card" result="horizontal!" warn />
            <div className="text-[9px] font-mono text-amber-500 dark:text-amber-400 mt-2">@media → 1440px</div>
          </DiagramRegion>
          <DiagramRegion label="Main" width="900px" color="amber" flex="1">
            <DiagramLine name="Button" result="large" />
            <DiagramLine name="Card" result="horizontal" />
            <div className="text-[9px] font-mono text-amber-500 dark:text-amber-400 mt-2">@media → 1440px</div>
          </DiagramRegion>
        </div>
      </Callout>
    </div>
  )
}

function DiagramRegion({
  label,
  width,
  color,
  flex,
  className = '',
  children,
}: {
  label: string
  width: string
  color: 'emerald' | 'amber'
  flex: string
  className?: string
  children: React.ReactNode
}) {
  const borderColor = color === 'emerald'
    ? 'border-emerald-200 dark:border-emerald-800/40'
    : 'border-amber-200 dark:border-amber-800/40'
  const bgColor = color === 'emerald'
    ? 'bg-white dark:bg-emerald-900/10'
    : 'bg-white dark:bg-amber-900/10'

  return (
    <div
      className={`rounded-lg border ${borderColor} ${bgColor} p-2 sm:p-3 ${className}`}
      style={{ flex }}
    >
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">{label}</span>
        <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500">{width}</span>
      </div>
      {children}
    </div>
  )
}

function DiagramLine({ name, result, warn }: { name: string; result: string; warn?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] leading-relaxed">
      <span className="text-zinc-400 dark:text-zinc-500">{name}</span>
      <span className="text-zinc-300 dark:text-zinc-600">→</span>
      <span className={warn ? 'text-amber-500 dark:text-amber-400 font-medium' : 'text-zinc-500 dark:text-zinc-400'}>
        {result}
      </span>
    </div>
  )
}

/* ─── Section 05: Context Stack (Concept 5) ─── */

const CONTEXT_LAYERS = [
  { label: 'Container size', token: '@container queries', question: 'How much space?' },
  { label: 'Input method', token: 'touch / pointer', question: 'How do they interact?' },
  { label: 'Viewing distance', token: 'near / far', question: 'How close are they?' },
  { label: 'Attention mode', token: 'focused / glancing', question: 'How engaged are they?' },
]

function ContextStack() {
  return (
    <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
      {/* Old model: collapsed */}
      <Callout variant="warn" label="One word for everything" className="rounded-xl p-4">
        <div className="rounded-lg border border-amber-200 dark:border-amber-800/40 bg-white dark:bg-amber-900/10 p-4 flex items-center justify-center min-h-[160px]">
          <div className="text-center">
            <div className="text-lg font-semibold text-amber-600 dark:text-amber-400">&ldquo;mobile&rdquo;</div>
            <div className="text-[10px] text-amber-500/60 dark:text-amber-400/50 mt-1 space-y-0.5">
              <div>size? input? distance?</div>
              <div>attention? density?</div>
            </div>
          </div>
        </div>
      </Callout>

      {/* New model: decomposed */}
      <Callout variant="good" label="Independent layers" className="rounded-xl p-4">
        <div className="space-y-1.5">
          {CONTEXT_LAYERS.map((layer) => (
            <div
              key={layer.label}
              className="rounded-lg border border-emerald-200 dark:border-emerald-800/40 bg-white dark:bg-emerald-900/10 px-3 py-2 flex items-baseline justify-between gap-2"
            >
              <div className="min-w-0">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{layer.label}</span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 ml-1.5 hidden sm:inline">{layer.question}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-500 dark:text-emerald-400 whitespace-nowrap shrink-0">
                {layer.token}
              </span>
            </div>
          ))}
        </div>
      </Callout>
    </div>
  )
}

/* ─── Section 05: Device Breaker Demo (Concepts 2 + 3) ─── */

const DEVICE_SCENARIOS = [
  {
    id: 'phone-hand',
    label: 'Phone in hand',
    shortLabel: 'Phone',
    device: 'mobile',
    context: 'touch + near',
    deviceResult: 'large targets',
    contextResult: 'large targets',
    deviceCorrect: true,
  },
  {
    id: 'phone-dashboard',
    label: 'Phone on dashboard',
    shortLabel: 'Dashboard',
    device: 'mobile',
    context: 'pointer + far',
    deviceResult: 'large targets',
    contextResult: 'readable at distance',
    deviceCorrect: false,
  },
  {
    id: 'tablet-keyboard',
    label: 'Tablet with keyboard',
    shortLabel: 'Tablet+KB',
    device: 'mobile',
    context: 'pointer + near',
    deviceResult: 'large targets',
    contextResult: 'compact targets',
    deviceCorrect: false,
  },
  {
    id: 'desktop-touch',
    label: 'Desktop with touchscreen',
    shortLabel: 'Desktop+Touch',
    device: 'desktop',
    context: 'touch + far',
    deviceResult: 'compact targets',
    contextResult: 'large targets',
    deviceCorrect: false,
  },
]

function DeviceBreakerDemo() {
  const [active, setActive] = useState(0)
  const scenario = DEVICE_SCENARIOS[active]
  const deviceScore = DEVICE_SCENARIOS.filter((s) => s.deviceCorrect).length

  return (
    <div className="max-w-2xl space-y-3">
      {/* Scenario selector */}
      <div className="flex flex-wrap gap-1.5">
        {DEVICE_SCENARIOS.map((s, i) => (
          <Pill
            key={s.id}
            active={active === i}
            onClick={() => setActive(i)}
            className={`px-2.5 py-1.5 rounded-full text-xs ${
              active !== i
                ? 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                : ''
            }`}
          >
            <span className="sm:hidden">{s.shortLabel}</span>
            <span className="hidden sm:inline">{s.label}</span>
          </Pill>
        ))}
      </div>

      {/* Result comparison */}
      <div className="grid grid-cols-2 gap-3">
        {/* Device tokens result */}
        <div className={`rounded-lg border px-3 py-2.5 transition-colors duration-200 ${
          scenario.deviceCorrect
            ? 'border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-900/5'
            : 'border-amber-200 dark:border-amber-800/30 bg-amber-50/30 dark:bg-amber-900/5'
        }`}>
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
            Device says
          </div>
          <div className={`text-xs font-medium ${
            scenario.deviceCorrect
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}>
            {scenario.device} → {scenario.deviceResult}
          </div>
          <div className="mt-1.5">
            {scenario.deviceCorrect ? (
              <svg className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8.5l3.5 3.5 6.5-8" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            )}
          </div>
        </div>

        {/* Context tokens result */}
        <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/30 dark:bg-emerald-900/5 px-3 py-2.5">
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
            Context says
          </div>
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {scenario.context} → {scenario.contextResult}
          </div>
          <div className="mt-1.5">
            <svg className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8.5l3.5 3.5 6.5-8" />
            </svg>
          </div>
        </div>
      </div>

      {/* Score line */}
      <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
        Device tokens:{' '}
        <span className="text-amber-500">{deviceScore}/{DEVICE_SCENARIOS.length} correct</span>
        {' '}&mdash;{' '}
        Context tokens:{' '}
        <span className="text-emerald-500">{DEVICE_SCENARIOS.length}/{DEVICE_SCENARIOS.length} correct</span>
      </p>
    </div>
  )
}
