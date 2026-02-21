import { useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import type { DimensionConfig, GeneratedToken } from './types'
import { getCurvePoints, evaluateCurveAt } from './scale-engine'

const handleSpring = { type: 'spring' as const, stiffness: 200, damping: 22 }

// SVG coordinate system: 320 x 240, with 20px padding on each side
const W = 320
const H = 240
const PAD = 24
const PLOT_W = W - PAD * 2
const PLOT_H = H - PAD * 2

// Convert normalized [0,1] to SVG coordinates
function toSvg(nx: number, ny: number): [number, number] {
  return [PAD + nx * PLOT_W, PAD + (1 - ny) * PLOT_H]
}

// Convert SVG coordinates to normalized [0,1]
function fromSvg(sx: number, sy: number): [number, number] {
  return [
    Math.max(0, Math.min(1, (sx - PAD) / PLOT_W)),
    Math.max(-0.5, Math.min(1.5, 1 - (sy - PAD) / PLOT_H)),
  ]
}

interface CurveEditorProps {
  config: DimensionConfig
  tokens: GeneratedToken[]
  onChange: (partial: Partial<DimensionConfig>) => void
}

export function CurveEditor({ config, tokens, onChange }: CurveEditorProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{ handle: 0 | 1; pointerId: number } | null>(null)

  const [x1, y1, x2, y2] = getCurvePoints(config.curveType, config.customCurve)
  const isCustom = config.curveType === 'custom'

  // Build the bezier curve path
  const [sx0, sy0] = toSvg(0, 0)
  const [cx1, cy1] = toSvg(x1, y1)
  const [cx2, cy2] = toSvg(x2, y2)
  const [sx1, sy1] = toSvg(1, 1)
  const curvePath = `M ${sx0} ${sy0} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${sx1} ${sy1}`

  // Step markers on the curve
  const stepMarkers = tokens.map((token, i) => {
    const t = config.steps === 1 ? 0 : i / (config.steps - 1)
    const curveY = evaluateCurveAt(t, config)
    const [mx, my] = toSvg(t, curveY)
    return { x: mx, y: my, token, t }
  })

  const getSvgPoint = useCallback((e: React.PointerEvent): [number, number] => {
    const svg = svgRef.current
    if (!svg) return [0, 0]
    const rect = svg.getBoundingClientRect()
    const sx = ((e.clientX - rect.left) / rect.width) * W
    const sy = ((e.clientY - rect.top) / rect.height) * H
    return fromSvg(sx, sy)
  }, [])

  const handlePointerDown = useCallback((handle: 0 | 1) => (e: React.PointerEvent) => {
    if (!isCustom) return
    e.preventDefault()
    e.stopPropagation()
    ;(e.target as SVGElement).setPointerCapture(e.pointerId)
    dragRef.current = { handle, pointerId: e.pointerId }
  }, [isCustom])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return
    const [nx, ny] = getSvgPoint(e)
    const { handle } = dragRef.current
    const newCurve = [...config.customCurve] as [number, number, number, number]
    if (handle === 0) {
      newCurve[0] = nx
      newCurve[1] = ny
    } else {
      newCurve[2] = nx
      newCurve[3] = ny
    }
    onChange({ customCurve: newCurve, curveType: 'custom' })
  }, [config.customCurve, getSvgPoint, onChange])

  const handlePointerUp = useCallback(() => {
    dragRef.current = null
  }, [])

  return (
    <div className="rounded-xl border border-zinc-100 dark:border-zinc-700/40 bg-zinc-50/50 dark:bg-zinc-800/20 p-3 sm:p-4">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-sm mx-auto"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((v) => {
          const [gx, gy] = toSvg(v, 0)
          const [, gy2] = toSvg(v, 1)
          const [gx3, gy3] = toSvg(0, v)
          const [gx4] = toSvg(1, v)
          return (
            <g key={v}>
              <line x1={gx} y1={gy} x2={gx} y2={gy2} className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="0.5" />
              <line x1={gx3} y1={gy3} x2={gx4} y2={gy3} className="stroke-zinc-200 dark:stroke-zinc-700" strokeWidth="0.5" />
            </g>
          )
        })}

        {/* Axis border */}
        <rect
          x={PAD} y={PAD} width={PLOT_W} height={PLOT_H}
          fill="none"
          className="stroke-zinc-200 dark:stroke-zinc-700"
          strokeWidth="1"
        />

        {/* Diagonal reference (linear) */}
        <line
          x1={sx0} y1={sy0} x2={sx1} y2={sy1}
          className="stroke-zinc-200 dark:stroke-zinc-700"
          strokeWidth="0.5"
          strokeDasharray="4 4"
        />

        {/* Control point lines */}
        <motion.line
          x1={sx0} y1={sy0}
          initial={false}
          animate={{ x2: cx1, y2: cy1 }}
          transition={handleSpring}
          className="stroke-zinc-300 dark:stroke-zinc-600"
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <motion.line
          x1={sx1} y1={sy1}
          initial={false}
          animate={{ x2: cx2, y2: cy2 }}
          transition={handleSpring}
          className="stroke-zinc-300 dark:stroke-zinc-600"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Curve */}
        <motion.path
          d={curvePath}
          fill="none"
          className="stroke-zinc-900 dark:stroke-zinc-100"
          strokeWidth="2"
          strokeLinecap="round"
          initial={false}
        />

        {/* Step markers */}
        {stepMarkers.map(({ x, y, token }) => (
          <motion.circle
            key={token.index}
            initial={false}
            animate={{ cx: x, cy: y }}
            transition={handleSpring}
            r="3"
            className={token.locked
              ? 'fill-amber-400 dark:fill-amber-500'
              : 'fill-zinc-400 dark:fill-zinc-500'
            }
          />
        ))}

        {/* Value readout lines */}
        {stepMarkers.map(({ x, y, token }) => {
          const [rightX] = toSvg(1, 0)
          return (
            <g key={`readout-${token.index}`}>
              <motion.line
                initial={false}
                animate={{ x1: x, y1: y, x2: rightX + 4, y2: y }}
                transition={handleSpring}
                className="stroke-zinc-200 dark:stroke-zinc-700"
                strokeWidth="0.5"
                strokeDasharray="2 2"
              />
              <motion.text
                initial={false}
                animate={{ x: rightX + 8, y: y }}
                transition={handleSpring}
                dominantBaseline="central"
                className="fill-zinc-400 dark:fill-zinc-500 text-[8px] font-mono"
              >
                {Math.round(token.value)}
              </motion.text>
            </g>
          )
        })}

        {/* Control point handles */}
        <motion.circle
          initial={false}
          animate={{ cx: cx1, cy: cy1 }}
          transition={handleSpring}
          r={isCustom ? 6 : 4}
          className={isCustom
            ? 'fill-zinc-900 dark:fill-zinc-100 cursor-grab'
            : 'fill-zinc-400 dark:fill-zinc-500'
          }
          onPointerDown={handlePointerDown(0)}
          style={{ touchAction: 'none' }}
        />
        {/* Invisible larger touch target */}
        {isCustom && (
          <motion.circle
            initial={false}
            animate={{ cx: cx1, cy: cy1 }}
            transition={handleSpring}
            r={14}
            fill="transparent"
            className="cursor-grab"
            onPointerDown={handlePointerDown(0)}
            style={{ touchAction: 'none' }}
          />
        )}

        <motion.circle
          initial={false}
          animate={{ cx: cx2, cy: cy2 }}
          transition={handleSpring}
          r={isCustom ? 6 : 4}
          className={isCustom
            ? 'fill-zinc-900 dark:fill-zinc-100 cursor-grab'
            : 'fill-zinc-400 dark:fill-zinc-500'
          }
          onPointerDown={handlePointerDown(1)}
          style={{ touchAction: 'none' }}
        />
        {isCustom && (
          <motion.circle
            initial={false}
            animate={{ cx: cx2, cy: cy2 }}
            transition={handleSpring}
            r={14}
            fill="transparent"
            className="cursor-grab"
            onPointerDown={handlePointerDown(1)}
            style={{ touchAction: 'none' }}
          />
        )}

        {/* Axis labels */}
        <text x={PAD} y={H - 4} className="fill-zinc-300 dark:fill-zinc-600 text-[8px] font-mono">0</text>
        <text x={W - PAD} y={H - 4} className="fill-zinc-300 dark:fill-zinc-600 text-[8px] font-mono" textAnchor="end">1</text>
        <text x={4} y={PAD + PLOT_H} className="fill-zinc-300 dark:fill-zinc-600 text-[8px] font-mono" dominantBaseline="auto">0</text>
        <text x={4} y={PAD} className="fill-zinc-300 dark:fill-zinc-600 text-[8px] font-mono" dominantBaseline="hanging">1</text>
      </svg>
    </div>
  )
}
