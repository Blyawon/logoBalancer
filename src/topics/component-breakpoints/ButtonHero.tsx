import { useState } from 'react'
import { ProseCallout } from '@/components/Callout'
import { Pill } from '@/components/Pill'
import { SampleButton } from './SampleButton'

type Strategy = 'media' | 'container'

export function ButtonHero() {
  const [strategy, setStrategy] = useState<Strategy>('media')

  const isMedia = strategy === 'media'

  return (
    <div className="space-y-4">
      {/* Framing text (F2) */}
      <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center" style={{ textWrap: 'balance' }}>
        Toggle between strategies and watch the sidebar button.
        Same space, same component &mdash; different result?
      </p>

      <div className="flex items-center justify-center gap-1.5">
        <Pill active={strategy === 'media'} onClick={() => setStrategy('media')}>
          <span className="sm:hidden">Screen</span>
          <span className="hidden sm:inline">Sized by screen</span>
        </Pill>
        <Pill active={strategy === 'container'} onClick={() => setStrategy('container')}>
          <span className="sm:hidden">Space</span>
          <span className="hidden sm:inline">Sized by space</span>
        </Pill>
      </div>

      {/* ── Desktop: full-width app with sidebar ── */}
      <div className={`rounded-xl overflow-hidden border transition-colors duration-300 ${
        isMedia
          ? 'border-amber-200 dark:border-amber-800/30'
          : 'border-zinc-200 dark:border-zinc-700/40'
      }`}>
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800/60 border-b border-zinc-200 dark:border-zinc-700/40">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
          <div className="flex-1 h-4 rounded bg-zinc-200/60 dark:bg-zinc-700/40 flex items-center px-2">
            <span className="text-[8px] font-mono text-zinc-400 dark:text-zinc-500">app.example.com</span>
          </div>
        </div>

        {/* App layout: sidebar + main — main always visible (F3) */}
        <div className="flex bg-white dark:bg-zinc-900">
          {/* Sidebar */}
          <div className={`w-[55%] sm:w-[396px] shrink-0 border-r p-3 flex flex-col transition-colors duration-300 ${
            !isMedia
              ? 'border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/20 dark:bg-emerald-900/5'
              : 'border-zinc-100 dark:border-zinc-700/40 bg-zinc-50/30 dark:bg-zinc-800/10'
          }`}>
            <SidebarUI />
            <div className="my-2.5">
              <SampleButton
                strategy={strategy}
                viewportWidth={1440}
                containerWidth={372}
              />
            </div>
            <SidebarUIBottom />
          </div>

          {/* Main content — visible on all sizes for full comparison (F3) */}
          <div className="flex-1 p-3 sm:p-4">
            <div className="space-y-2 sm:space-y-2.5">
              <div className="h-2.5 sm:h-3 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800/30" />
              <div className="h-2 w-full rounded bg-zinc-50 dark:bg-zinc-800/20" />
              <div className="h-2 w-4/5 rounded bg-zinc-50 dark:bg-zinc-800/20" />
              <div className="hidden sm:block h-2 w-5/6 rounded bg-zinc-50 dark:bg-zinc-800/20" />
              <div className="mt-2 sm:mt-3 flex gap-2">
                <div className="h-10 sm:h-16 flex-1 rounded-lg bg-zinc-50 dark:bg-zinc-800/20" />
                <div className="h-10 sm:h-16 flex-1 rounded-lg bg-zinc-50 dark:bg-zinc-800/20" />
                <div className="hidden sm:block h-10 sm:h-16 flex-1 rounded-lg bg-zinc-50 dark:bg-zinc-800/20" />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop annotation bar */}
        <div className="px-3 py-1.5 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-700/40 flex items-center justify-between">
          <span className={`text-[10px] font-mono transition-colors duration-200 ${
            isMedia ? 'text-amber-500' : 'text-zinc-400 dark:text-zinc-500'
          }`}>
            viewport: <strong>1440px</strong>
          </span>
          <span className={`text-[9px] font-mono transition-colors duration-200 ${
            isMedia ? 'text-amber-500' : 'text-emerald-500'
          }`}>
            sidebar button {isMedia ? '→ desktop styling' : '→ compact'}
          </span>
        </div>
      </div>

      {/* ── Phone: fixed realistic width (F4) ── */}
      <div className={`w-[55%] sm:w-[396px] rounded-xl overflow-hidden border transition-colors duration-300 ${
        !isMedia
          ? 'border-emerald-200 dark:border-emerald-800/30'
          : 'border-zinc-200 dark:border-zinc-700/40'
      }`}>
        {/* Phone header */}
        <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-100 dark:border-zinc-700/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-2 rounded-[2px] border border-zinc-300 dark:border-zinc-600" />
            <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">Phone</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
            viewport: <strong className="text-zinc-500 dark:text-zinc-400">396px</strong>
          </span>
        </div>

        {/* Same sidebar UI at same width */}
        <div className="bg-white dark:bg-zinc-900 p-3">
          <SidebarUI />
          <div className="my-2.5">
            <SampleButton
              strategy={strategy}
              viewportWidth={396}
              containerWidth={372}
            />
          </div>
          <SidebarUIBottom />
        </div>

        {/* Phone annotation */}
        <div className="px-3 py-1.5 bg-zinc-50/50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-700/40 flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
            container: <strong className="text-zinc-500 dark:text-zinc-400">372px</strong>
          </span>
          <span className={`text-[9px] font-mono transition-colors duration-200 ${
            isMedia ? 'text-zinc-400 dark:text-zinc-500' : 'text-emerald-500'
          }`}>
            {isMedia ? '→ mobile styling' : '→ compact'}
          </span>
        </div>
      </div>

      {/* Callout */}
      <ProseCallout variant={isMedia ? 'warn' : 'good'}>
        {isMedia ? (
          <>
            The sidebar and the phone have <strong>the same available space</strong>.
            But the sidebar button gets &ldquo;desktop&rdquo; styling because
            screen-based sizing checks the <strong>full browser window</strong> (1440px),
            not the space the button actually has. Same space, different result.
          </>
        ) : (
          <>
            The sidebar and the phone have <strong>the same available space</strong>.
            Both buttons are the same size. Space-based sizing checks
            the <strong>actual container</strong> &mdash; same width, same result.
          </>
        )}
      </ProseCallout>
    </div>
  )
}

/** Abstract wireframe nav items above the button */
function SidebarUI() {
  return (
    <div className="space-y-1.5">
      <WireframeNavItem active />
      <WireframeNavItem />
      <WireframeNavItem />
    </div>
  )
}

/** Abstract wireframe nav items below the button */
function SidebarUIBottom() {
  return (
    <div className="space-y-1.5">
      <WireframeNavItem />
      <WireframeNavItem />
    </div>
  )
}

function WireframeNavItem({ active }: { active?: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded-md ${
      active ? 'bg-zinc-100 dark:bg-zinc-800/50' : ''
    }`}>
      <div className={`w-2 h-2 rounded-sm shrink-0 ${
        active
          ? 'bg-zinc-300 dark:bg-zinc-600'
          : 'bg-zinc-200/70 dark:bg-zinc-700/40'
      }`} />
      <div className={`h-1.5 rounded ${
        active
          ? 'w-16 bg-zinc-300 dark:bg-zinc-600'
          : 'w-12 bg-zinc-200/50 dark:bg-zinc-700/30'
      }`} />
    </div>
  )
}
