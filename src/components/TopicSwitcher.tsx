import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { TopicDef } from '@/topics/registry'

interface TopicSwitcherProps {
  topics: TopicDef[]
  activeId: string
  onChange: (id: string) => void
}

// ── Springs & transitions ────────────────────────────
const indicatorSpring = { type: 'spring' as const, stiffness: 200, damping: 22 }
const fabSpring = { type: 'spring' as const, stiffness: 200, damping: 20 }
const scrimTransition = { duration: 0.2, ease: 'easeOut' as const }

// ── Hook: track sm breakpoint ────────────────────────
function useIsSmScreen() {
  const [isSm, setIsSm] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 640px)').matches : true
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const handler = (e: MediaQueryListEvent) => setIsSm(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isSm
}

// ── Desktop pill bar ─────────────────────────────────
function DesktopPillBar({ topics, activeId, onChange }: TopicSwitcherProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pillRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const [ready, setReady] = useState(false)

  const measureIndicator = useCallback(() => {
    const container = containerRef.current
    const activeBtn = pillRefs.current.get(activeId)
    if (!container || !activeBtn) return

    const containerRect = container.getBoundingClientRect()
    const btnRect = activeBtn.getBoundingClientRect()
    setIndicator({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    })
    setReady(true)
  }, [activeId])

  useEffect(() => {
    // Measure immediately, then again after a frame (layout may not be settled)
    measureIndicator()
    const raf = requestAnimationFrame(measureIndicator)
    // Re-measure when fonts finish loading (button widths change)
    document.fonts.ready.then(measureIndicator)
    return () => cancelAnimationFrame(raf)
  }, [measureIndicator])

  useEffect(() => {
    const observer = new ResizeObserver(measureIndicator)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [measureIndicator])

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
      style={{ bottom: `calc(1.25rem + env(safe-area-inset-bottom, 0px))` }}
    >
      <div
        ref={containerRef}
        className="relative inline-flex items-center gap-1 rounded-full p-1 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-xl shadow-lg shadow-zinc-900/10 dark:shadow-black/40 border border-zinc-200/60 dark:border-zinc-700/50 ring-1 ring-black/[0.04] dark:ring-white/[0.06]"
      >
        {/* Sliding indicator — only mounts after first measurement */}
        {ready && (
          <motion.div
            className="absolute top-1 bottom-1 rounded-full bg-white dark:bg-zinc-700 shadow-sm"
            initial={{ left: indicator.left, width: indicator.width }}
            animate={{ left: indicator.left, width: indicator.width }}
            transition={indicatorSpring}
          />
        )}

        {/* Pills */}
        {topics.map((topic) => (
          <button
            key={topic.id}
            ref={(el) => {
              if (el) pillRefs.current.set(topic.id, el)
            }}
            onClick={() => onChange(topic.id)}
            className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap focus-visible:outline-none ${
              activeId === topic.id
                ? 'text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {topic.label}
          </button>
        ))}

        {/* Coming soon separator + label */}
        <div className="w-px h-4 bg-zinc-200/60 dark:bg-zinc-700/60 mx-0.5 shrink-0" />
        <span className="relative z-10 px-3 py-2 text-xs text-zinc-300 dark:text-zinc-600 whitespace-nowrap italic">
          More soon
        </span>
      </div>
    </div>
  )
}

// ── Mobile FAB ───────────────────────────────────────
function MobileFab({ topics, activeId, onChange }: TopicSwitcherProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (id: string) => {
    onChange(id)
    setOpen(false)
  }

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <>
      {/* Scrim */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={scrimTransition}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* FAB + menu container */}
      <div
        className="fixed z-50"
        style={{ right: 'calc(1rem + 4px)', bottom: `calc(1.25rem + 4px + env(safe-area-inset-bottom, 0px))` }}
      >
        {/* Menu items — appear above the FAB */}
        <AnimatePresence>
          {open && (
            <div className="absolute bottom-16 right-0 flex flex-col items-end gap-2 mb-2">
              {topics.map((topic, i) => (
                <motion.button
                  key={topic.id}
                  onClick={() => handleSelect(topic.id)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-lg shadow-zinc-900/10 dark:shadow-black/40 backdrop-blur-xl border transition-colors ${
                    activeId === topic.id
                      ? 'bg-zinc-900 text-white border-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-zinc-200'
                      : 'bg-white/90 text-zinc-700 border-zinc-200/60 hover:bg-white dark:bg-zinc-800/90 dark:text-zinc-200 dark:border-zinc-700/50 dark:hover:bg-zinc-800'
                  }`}
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      ...fabSpring,
                      delay: (topics.length - 1 - i) * 0.05,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 8,
                    scale: 0.95,
                    transition: { duration: 0.12, ease: 'easeIn', delay: i * 0.03 },
                  }}
                >
                  {topic.label}
                </motion.button>
              ))}

              {/* "More soon" label */}
              <motion.span
                className="px-3 py-1.5 text-xs text-zinc-400 dark:text-zinc-500 italic whitespace-nowrap"
                initial={{ opacity: 0, y: 12 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { ...fabSpring, delay: topics.length * 0.05 },
                }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
              >
                More soon
              </motion.span>
            </div>
          )}
        </AnimatePresence>

        {/* FAB button */}
        <motion.button
          onClick={() => setOpen(!open)}
          className="w-14 h-14 rounded-full bg-zinc-100/90 dark:bg-zinc-800/90 backdrop-blur-xl shadow-lg shadow-zinc-900/10 dark:shadow-black/40 border border-zinc-200/60 dark:border-zinc-700/50 ring-1 ring-black/[0.04] dark:ring-white/[0.06] flex items-center justify-center focus-visible:outline-none"
          whileTap={{ scale: 0.92 }}
          aria-label={open ? 'Close menu' : 'Open topic menu'}
        >
          <BentoIcon open={open} />
        </motion.button>
      </div>
    </>
  )
}

// ── Bento → × icon ──────────────────────────────────
// Four rounded squares in a 2×2 grid that morph into two crossed lines
const iconSpring = { type: 'spring' as const, stiffness: 260, damping: 20 }

function BentoIcon({ open }: { open: boolean }) {
  // Grid positions (2×2 bento) — each square is 5×5 in an 18×18 viewBox
  // × positions — each square stretches into a line segment
  return (
    <motion.svg
      className="w-5 h-5 text-zinc-600 dark:text-zinc-300"
      viewBox="0 0 18 18"
      initial={false}
      animate={{ rotate: open ? 180 : 0 }}
      transition={iconSpring}
    >
      {/* Top-left → top-left of × */}
      <motion.rect
        fill="currentColor"
        rx={open ? 1 : 1.5}
        initial={false}
        animate={
          open
            ? { x: 2.5, y: 8, width: 5.5, height: 2, rotate: 45, originX: '50%', originY: '50%' }
            : { x: 2, y: 2, width: 5.5, height: 5.5, rotate: 0 }
        }
        transition={iconSpring}
      />
      {/* Top-right → top-right of × */}
      <motion.rect
        fill="currentColor"
        rx={open ? 1 : 1.5}
        initial={false}
        animate={
          open
            ? { x: 10.5, y: 8, width: 5.5, height: 2, rotate: -45, originX: '50%', originY: '50%' }
            : { x: 10.5, y: 2, width: 5.5, height: 5.5, rotate: 0 }
        }
        transition={iconSpring}
      />
      {/* Bottom-left → bottom-left of × */}
      <motion.rect
        fill="currentColor"
        rx={open ? 1 : 1.5}
        initial={false}
        animate={
          open
            ? { x: 2.5, y: 8, width: 5.5, height: 2, rotate: -45, originX: '50%', originY: '50%' }
            : { x: 2, y: 10.5, width: 5.5, height: 5.5, rotate: 0 }
        }
        transition={iconSpring}
      />
      {/* Bottom-right → bottom-right of × */}
      <motion.rect
        fill="currentColor"
        rx={open ? 1 : 1.5}
        initial={false}
        animate={
          open
            ? { x: 10.5, y: 8, width: 5.5, height: 2, rotate: 45, originX: '50%', originY: '50%' }
            : { x: 10.5, y: 10.5, width: 5.5, height: 5.5, rotate: 0 }
        }
        transition={iconSpring}
      />
    </motion.svg>
  )
}

// ── Exported component ───────────────────────────────
export function TopicSwitcher(props: TopicSwitcherProps) {
  const isSm = useIsSmScreen()
  return isSm ? <DesktopPillBar {...props} /> : <MobileFab {...props} />
}
