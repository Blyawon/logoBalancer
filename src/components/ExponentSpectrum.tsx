import { useState, useRef, useCallback, useEffect } from 'react'
import { Slider } from '@/components/ui/slider'
import type { BalancerParams } from '@/lib/balancer'
import { MiniLane } from './MiniLane'

interface ExponentSpectrumProps {
  params: BalancerParams
  onExponentChange?: (exponent: number) => void
}

const DURATION = 4000

export function ExponentSpectrum({ params, onExponentChange }: ExponentSpectrumProps) {
  const [exponent, setExponent] = useState(params.exponent)
  const [playing, setPlaying] = useState(false)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  useEffect(() => {
    if (!playing) setExponent(params.exponent)
  }, [params.exponent, playing])

  const animate = useCallback((ts: number) => {
    if (!startRef.current) startRef.current = ts
    const t = Math.min((ts - startRef.current) / DURATION, 1)
    const val = Math.round(t * 100) / 100
    setExponent(val)
    if (t < 1) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      setPlaying(false)
      startRef.current = 0
      onExponentChange?.(val)
    }
  }, [onExponentChange])

  const togglePlay = useCallback(() => {
    if (playing) {
      cancelAnimationFrame(rafRef.current)
      setPlaying(false)
      onExponentChange?.(exponent)
    } else {
      setPlaying(true)
      startRef.current = 0
      setExponent(0)
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [playing, exponent, animate, onExponentChange])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const handleSlider = useCallback((v: number) => {
    if (playing) {
      cancelAnimationFrame(rafRef.current)
      setPlaying(false)
    }
    setExponent(v)
    onExponentChange?.(v)
  }, [playing, onExponentChange])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors ${!playing ? 'animate-pulse-ring' : ''}`}
          aria-label={playing ? 'Pause' : 'Play'}
          title="Sweep exponent from 0 to 1"
        >
          {playing ? (
            <svg className="w-3 h-3 text-zinc-600 dark:text-zinc-300" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg className="w-3 h-3 text-zinc-600 dark:text-zinc-300 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>
        <div className="flex-1">
          <Slider
            value={[exponent]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([v]) => handleSlider(v)}
          />
        </div>
        <span className="text-sm font-mono tabular-nums text-zinc-900 dark:text-zinc-100 w-10 text-right shrink-0">
          {exponent.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-center">
        <MiniLane params={params} exponentOverride={exponent} cellSize={40} />
      </div>
    </div>
  )
}
