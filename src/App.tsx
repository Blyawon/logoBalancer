import { useState, useCallback, useEffect, Suspense } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { TOPICS } from '@/topics/registry'
import { Header } from '@/components/Header'
import { ThemeToggle } from '@/components/ThemeToggle'
import { TopicSwitcher } from '@/components/TopicSwitcher'

// ── Spring config ──────────────────────────────────
// Damped spring: stiffness 120, damping 16, mass 1
// ζ ≈ 0.73 (underdamped), peak overshoot ≈ 3.5 %, settle ≈ 900 ms
const spring = { type: 'spring' as const, stiffness: 120, damping: 16, mass: 1 }

// Exit: fast accelerating ease-in (150 ms)
const exitTransition = { duration: 0.15, ease: [0.4, 0, 1, 1] as const }

// Per-child enter transitions (spring for x/scale, quick ease for opacity)
function enterTransition(delay: number) {
  return {
    x: { ...spring, delay },
    scale: { ...spring, delay },
    opacity: { duration: 0.2, ease: 'easeOut' as const, delay },
  }
}

// ── Variants ───────────────────────────────────────
// Exit: whole wrapper slides out together
const wrapperVariants = {
  initial: {},
  animate: {},
  exit: (dir: number) => ({
    opacity: 0,
    x: dir * -24,
    scale: 0.97,
    transition: exitTransition,
  }),
}

function makeChildVariants(delay: number) {
  return {
    initial: (dir: number) => ({
      opacity: 0,
      x: dir * 20,
      scale: 0.99,
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: enterTransition(delay),
    },
    exit: {},
  }
}

const toggleVariants = makeChildVariants(0)
const headerVariants = makeChildVariants(0.05)
const bodyVariants = makeChildVariants(0.12)

// ── Component ──────────────────────────────────────
function App() {
  const [activeTopic, setActiveTopic] = useState('logo-balancing')
  const [direction, setDirection] = useState<1 | -1>(1)

  const activeDef = TOPICS.find((t) => t.id === activeTopic) ?? TOPICS[0]
  const TopicComponent = activeDef.component

  const handleTopicChange = useCallback(
    async (id: string) => {
      if (id === activeTopic) return

      // Ensure chunk is loaded before transitioning (safety net)
      const def = TOPICS.find((t) => t.id === id)
      if (def) await def.preload()

      const oldIdx = TOPICS.findIndex((t) => t.id === activeTopic)
      const newIdx = TOPICS.findIndex((t) => t.id === id)
      setDirection(newIdx > oldIdx ? 1 : -1)
      setActiveTopic(id)
    },
    [activeTopic],
  )

  // Arrow key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      e.preventDefault()
      const idx = TOPICS.findIndex((t) => t.id === activeTopic)
      const next = e.key === 'ArrowRight' ? idx + 1 : idx - 1
      if (next >= 0 && next < TOPICS.length) {
        handleTopicChange(TOPICS[next].id)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTopic, handleTopicChange])

  return (
    <MotionConfig reducedMotion="user">
    <>
      {/* Background panel */}
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex w-full flex-col overflow-x-clip">
        <main className="flex-auto">
          <div className="sm:px-8">
            <div className="mx-auto w-full max-w-7xl lg:px-8">
              <div className="relative px-4 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-2xl lg:max-w-5xl">
                  <AnimatePresence
                    mode="wait"
                    custom={direction}
                    onExitComplete={() =>
                      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
                    }
                  >
                    <motion.div
                      key={activeTopic}
                      custom={direction}
                      variants={wrapperVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <motion.div
                        className="flex justify-end pt-6 sm:pt-8"
                        custom={direction}
                        variants={toggleVariants}
                      >
                        <ThemeToggle />
                      </motion.div>

                      <motion.div custom={direction} variants={headerVariants}>
                        <Header title={activeDef.label} subtitle={activeDef.subtitle} />
                      </motion.div>

                      <motion.div custom={direction} variants={bodyVariants}>
                        <Suspense
                          key={activeTopic}
                          fallback={
                            <div className="flex items-center justify-center py-24">
                              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600 dark:border-zinc-600 dark:border-t-zinc-300" />
                            </div>
                          }
                        >
                          <TopicComponent />
                        </Suspense>

                        <footer className="mt-16 sm:mt-24 pb-24 sm:pb-28 flex items-center justify-center gap-2 text-xs text-zinc-300 dark:text-zinc-700">
                          <span>Design Guidelines</span>
                          <span>&middot;</span>
                          <a
                            href="https://github.com/Blyawon/logoBalancer"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-zinc-500 dark:hover:text-zinc-500 transition-colors"
                          >
                            GitHub
                          </a>
                        </footer>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating topic switcher */}
      <TopicSwitcher topics={TOPICS} activeId={activeTopic} onChange={handleTopicChange} />
    </>
    </MotionConfig>
  )
}

export default App
