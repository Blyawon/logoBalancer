import { useRef, useState, useCallback, useEffect } from 'react'

interface ResizableContainerProps {
  children: React.ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  label?: string
  containerQuery?: boolean
  className?: string
  onWidthChange?: (width: number) => void
}

export function ResizableContainer({
  children,
  defaultWidth,
  minWidth = 200,
  maxWidth,
  label,
  containerQuery = false,
  className = '',
  onWidthChange,
}: ResizableContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const startXRef = useRef(0)
  const startWidthRef = useRef(0)

  // Initialize width after mount, clamped to parent
  useEffect(() => {
    const parentWidth = parentRef.current?.getBoundingClientRect().width
    if (defaultWidth && parentWidth) {
      const clamped = Math.min(defaultWidth, parentWidth)
      setWidth(clamped)
      onWidthChange?.(clamped)
    } else if (parentWidth) {
      setWidth(parentWidth)
      onWidthChange?.(parentWidth)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultWidth])

  const getMaxWidth = useCallback(() => {
    if (maxWidth) return maxWidth
    if (parentRef.current) return parentRef.current.getBoundingClientRect().width
    return 800
  }, [maxWidth])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    setDragging(true)
    startXRef.current = e.clientX
    startWidthRef.current = width ?? getMaxWidth()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [width, getMaxWidth])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return
    const delta = e.clientX - startXRef.current
    const newWidth = Math.max(minWidth, Math.min(getMaxWidth(), startWidthRef.current + delta))
    setWidth(newWidth)
    onWidthChange?.(newWidth)
  }, [dragging, minWidth, getMaxWidth, onWidthChange])

  const handlePointerUp = useCallback(() => {
    setDragging(false)
  }, [])

  return (
    <div ref={parentRef} className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700/40 bg-white dark:bg-zinc-900"
        style={{
          width: width ?? '100%',
          containerType: containerQuery ? 'inline-size' : undefined,
        }}
      >
        {children}

        {/* Width label */}
        <div className="absolute top-2 left-3 px-2 py-0.5 rounded-md bg-zinc-100/90 dark:bg-zinc-800/90 text-[10px] font-mono text-zinc-400 dark:text-zinc-500 pointer-events-none">
          {Math.round(width ?? 0)}px
        </div>

        {/* Drag handle — wider hit target for touch (44px) */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className={`absolute top-0 right-0 bottom-0 w-6 sm:w-5 cursor-ew-resize flex items-center justify-center transition-colors touch-none ${
            dragging
              ? 'bg-zinc-200/60 dark:bg-zinc-700/60'
              : 'hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60'
          }`}
        >
          <div className="flex flex-col gap-1 animate-nudge">
            <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-600" />
          </div>
        </div>
      </div>

      {/* Label below */}
      {label && (
        <p className="mt-2 text-center text-xs font-medium text-zinc-400 dark:text-zinc-500">
          {label}
        </p>
      )}
    </div>
  )
}
