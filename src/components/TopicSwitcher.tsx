import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'motion/react'
import type { TopicDef } from '@/topics/registry'

interface TopicSwitcherProps {
  topics: TopicDef[]
  activeId: string
  onChange: (id: string) => void
}

const indicatorSpring = { type: 'spring' as const, stiffness: 200, damping: 22 }

export function TopicSwitcher({ topics, activeId, onChange }: TopicSwitcherProps) {
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
    measureIndicator()
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
        {/* Sliding indicator */}
        <motion.div
          className="absolute top-1 bottom-1 rounded-full bg-white dark:bg-zinc-700 shadow-sm"
          initial={false}
          animate={ready ? { left: indicator.left, width: indicator.width } : undefined}
          transition={indicatorSpring}
        />

        {/* Pills */}
        {topics.map((topic) => (
          <button
            key={topic.id}
            ref={(el) => {
              if (el) pillRefs.current.set(topic.id, el)
            }}
            onClick={() => onChange(topic.id)}
            className={`relative z-10 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 whitespace-nowrap focus-visible:outline-none ${
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
        <span className="relative z-10 px-2.5 sm:px-3 py-2 text-[11px] sm:text-xs text-zinc-300 dark:text-zinc-600 whitespace-nowrap italic">
          More soon
        </span>
      </div>
    </div>
  )
}
