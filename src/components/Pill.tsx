import { useState, useEffect } from 'react'
import { motion } from 'motion/react'

// ── Springs ──────────────────────────────────────────
const bgSpring = { type: 'spring' as const, stiffness: 180, damping: 20 }
const tapSpring = { type: 'spring' as const, stiffness: 300, damping: 18 }

// ── Size tokens ──────────────────────────────────────
const SIZE = {
  sm: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-xs',
} as const

// ── Colors (raw hex so framer-motion can interpolate) ─
const COLORS = {
  light: {
    // single-select: solid dark fill
    activeBg: '#18181b',     // zinc-900
    activeText: '#ffffff',
    // multi-select: ring + inset
    toggleBg: '#e4e4e7',     // zinc-200
    toggleText: '#3f3f46',   // zinc-700
    toggleShadow: 'inset 0 0 0 1px #d4d4d8', // zinc-300 ring
    // shared inactive
    inactiveBg: '#f4f4f5',   // zinc-100
    inactiveText: '#71717a', // zinc-500
    inactiveShadow: 'inset 0 0 0 0px transparent',
  },
  dark: {
    activeBg: '#f4f4f5',     // zinc-100
    activeText: '#18181b',   // zinc-900
    toggleBg: '#3f3f46',     // zinc-700
    toggleText: '#e4e4e7',   // zinc-200
    toggleShadow: 'inset 0 0 0 1px #52525b', // zinc-600 ring
    inactiveBg: 'rgba(39,39,42,0.5)', // zinc-800/50
    inactiveText: '#71717a', // zinc-500
    inactiveShadow: 'inset 0 0 0 0px transparent',
  },
} as const

// ── Dark mode hook (class-based: .dark on <html>) ───
function useDarkMode() {
  const [dark, setDark] = useState(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
  )
  useEffect(() => {
    const el = document.documentElement
    const observer = new MutationObserver(() => {
      setDark(el.classList.contains('dark'))
    })
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])
  return dark
}

// ── Pill ─────────────────────────────────────────────
interface PillProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  title?: string
  size?: 'sm' | 'lg'
  /** 'single' = radio-like (solid dark fill). 'multi' = toggle-like (ring + inset). */
  mode?: 'single' | 'multi'
}

export function Pill({ active, onClick, children, title, size = 'lg', mode = 'single' }: PillProps) {
  const dark = useDarkMode()
  const c = dark ? COLORS.dark : COLORS.light

  const isMulti = mode === 'multi'

  return (
    <motion.button
      onClick={onClick}
      title={title}
      className={`rounded-full font-medium whitespace-nowrap ${SIZE[size]}`}
      initial={false}
      animate={{
        backgroundColor: active
          ? (isMulti ? c.toggleBg : c.activeBg)
          : c.inactiveBg,
        color: active
          ? (isMulti ? c.toggleText : c.activeText)
          : c.inactiveText,
        boxShadow: isMulti
          ? (active ? c.toggleShadow : c.inactiveShadow)
          : 'none',
      }}
      transition={bgSpring}
      whileTap={{ scale: 0.96, transition: tapSpring }}
    >
      {children}
    </motion.button>
  )
}
