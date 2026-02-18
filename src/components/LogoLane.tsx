import { useRef, useState, useEffect, useCallback } from 'react'
import type { LogoMeta } from '@/lib/logos'
import { computeLogoSize } from '@/lib/balancer'
import type { BalancerParams } from '@/lib/balancer'
import { LogoItem } from './LogoItem'

interface LogoLaneProps {
  params: BalancerParams
  logos: LogoMeta[]
  onUpload: (logos: LogoMeta[]) => void
  onRemoveLogo: (id: string) => void
  onRemoveAll: () => void
  hasCustomLogos: boolean
}

const MIN_CELL = 80
const MAX_CELL = 160

export function LogoLane({ params, logos, onUpload, onRemoveLogo, onRemoveAll, hasCustomLogos }: LogoLaneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cellSize, setCellSize] = useState(120)
  const [showBounds, setShowBounds] = useState(true)
  const [showDimensions, setShowDimensions] = useState(false)
  const [gridMode, setGridMode] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    const scrollEl = scrollRef.current
    if (!el || !scrollEl) return

    const update = () => {
      const style = getComputedStyle(scrollEl)
      const gap = parseFloat(style.columnGap) || 16

      const w = el.getBoundingClientRect().width
      const cs = getComputedStyle(el)
      const padLeft = parseFloat(cs.paddingLeft) || 0
      const padRight = parseFloat(cs.paddingRight) || 0
      const innerWidth = w - padLeft - padRight

      let cols: number
      if (gridMode) {
        if (innerWidth >= 640) cols = Math.min(logos.length, 4)
        else if (innerWidth >= 400) cols = Math.min(logos.length, 3)
        else cols = Math.min(logos.length, 2)
      } else {
        cols = logos.length
      }

      const perCell = (innerWidth - (cols - 1) * gap) / cols
      setCellSize(Math.max(MIN_CELL, Math.min(MAX_CELL, Math.floor(perCell))))
    }

    const observer = new ResizeObserver(update)
    observer.observe(el)
    update()
    return () => observer.disconnect()
  }, [gridMode, logos.length])

  const handleFiles = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newLogos: LogoMeta[] = []
    for (const file of Array.from(files)) {
      try {
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        const { width, height } = await new Promise<{ width: number; height: number }>((resolve, reject) => {
          const img = new Image()
          img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
          img.onerror = reject
          img.src = dataUrl
        })

        if (width > 0 && height > 0) {
          newLogos.push({
            id: `upload-${Date.now()}-${newLogos.length}`,
            name: file.name.replace(/\.[^.]+$/, ''),
            ratio: width / height,
            src: dataUrl,
          })
        }
      } catch {
        // Skip invalid files
      }
    }

    if (newLogos.length > 0) onUpload(newLogos)
    e.target.value = ''
  }, [onUpload])

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-zinc-100 p-3 sm:p-6 dark:border-zinc-700/40"
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5">
          <ToggleBtn active={gridMode} onClick={() => setGridMode(!gridMode)}>Grid</ToggleBtn>
          <ToggleBtn active={showBounds} onClick={() => setShowBounds(!showBounds)}>Bounds</ToggleBtn>
          <ToggleBtn active={showDimensions} onClick={() => setShowDimensions(!showDimensions)}>Sizes</ToggleBtn>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 bg-zinc-100 text-zinc-500 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            Upload
          </button>
          {hasCustomLogos && (
            <button
              onClick={onRemoveAll}
              className="px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 bg-zinc-100 text-zinc-500 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              Remove All
            </button>
          )}
        </div>
      </div>

      {/* Logo display */}
      <div
        ref={scrollRef}
        className={`flex items-center justify-center gap-3 sm:gap-4 py-1 ${
          gridMode ? 'flex-wrap' : 'overflow-x-auto'
        }`}
      >
        {logos.map((logo) => {
          const size = computeLogoSize(logo.ratio, cellSize, params)
          return (
            <LogoItem
              key={logo.id}
              logo={logo}
              size={size}
              cellSize={cellSize}
              showBounds={showBounds}
              showDimensions={showDimensions}
              onRemove={hasCustomLogos ? () => onRemoveLogo(logo.id) : undefined}
            />
          )
        })}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />
    </div>
  )
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors duration-150 ${
        active
          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
          : 'bg-zinc-100 text-zinc-500 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300'
      }`}
    >
      {children}
    </button>
  )
}
