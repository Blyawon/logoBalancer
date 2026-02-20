import { useRef, useState, useEffect, useCallback } from 'react'
import type { LogoMeta } from '@/lib/logos'
import { computeLogoSize } from '@/lib/balancer'
import type { BalancerParams } from '@/lib/balancer'
import { LogoItem } from './LogoItem'
import { Pill } from './Pill'

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

async function processFiles(files: FileList | File[]): Promise<LogoMeta[]> {
  const newLogos: LogoMeta[] = []
  for (const file of Array.from(files)) {
    if (!file.type.startsWith('image/')) continue
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
  return newLogos
}

export function LogoLane({ params, logos, onUpload, onRemoveLogo, onRemoveAll, hasCustomLogos }: LogoLaneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [cellSize, setCellSize] = useState(120)
  const [gridCols, setGridCols] = useState(4)
  const [showBounds, setShowBounds] = useState(true)
  const [showDimensions, setShowDimensions] = useState(false)
  const [gridMode, setGridMode] = useState(false)
  const [autoGrid, setAutoGrid] = useState(false)
  const [dragging, setDragging] = useState(false)

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

      // Auto-enable grid on narrow containers
      setAutoGrid(innerWidth < 400)

      const effectiveGrid = gridMode || innerWidth < 400

      let cols: number
      if (effectiveGrid) {
        if (innerWidth >= 640) cols = Math.min(logos.length, 4)
        else if (innerWidth >= 400) cols = Math.min(logos.length, 3)
        else cols = Math.min(logos.length, 2)
        setGridCols(cols)
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
    const newLogos = await processFiles(files)
    if (newLogos.length > 0) onUpload(newLogos)
    e.target.value = ''
  }, [onUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return
    setDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const files = e.dataTransfer.files
    if (!files || files.length === 0) return
    const newLogos = await processFiles(files)
    if (newLogos.length > 0) onUpload(newLogos)
  }, [onUpload])

  return (
    <div
      id="logo-lane"
      ref={containerRef}
      className={`relative rounded-2xl border p-3 sm:p-6 transition-colors ${
        dragging
          ? 'border-zinc-400 bg-zinc-50 dark:border-zinc-500 dark:bg-zinc-800/50'
          : 'border-zinc-100 dark:border-zinc-700/40'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop zone overlay */}
      {dragging && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-sm z-10">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Drop images here</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5">
          <Pill active={gridMode} onClick={() => setGridMode(!gridMode)} title="Wrap logos into a grid" mode="multi">Grid</Pill>
          <Pill active={showBounds} onClick={() => setShowBounds(!showBounds)} title="Show cell boundaries" mode="multi">Bounds</Pill>
          <Pill active={showDimensions} onClick={() => setShowDimensions(!showDimensions)} title="Show pixel dimensions" mode="multi">Sizes</Pill>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-150 bg-zinc-100 text-zinc-500 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
          >
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 2v8M2 6h8" />
            </svg>
            Upload
          </button>
          {hasCustomLogos && (
            <button
              onClick={onRemoveAll}
              className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-150 bg-zinc-100 text-zinc-500 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300"
            >
              Remove All
            </button>
          )}
        </div>
      </div>

      {/* Logo display */}
      <div
        ref={scrollRef}
        className={`gap-3 sm:gap-4 px-2 py-1 ${
          (gridMode || autoGrid)
            ? 'grid justify-items-center'
            : 'flex items-center justify-center overflow-x-auto'
        }`}
        style={(gridMode || autoGrid) ? { gridTemplateColumns: `repeat(${gridCols}, 1fr)` } : undefined}
      >
        {logos.map((logo, i) => {
          const size = computeLogoSize(logo.ratio, cellSize, params)
          return (
            <div
              key={logo.id}
              className="animate-in"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <LogoItem
                logo={logo}
                size={size}
                cellSize={cellSize}
                showBounds={showBounds}
                showDimensions={showDimensions}
                onRemove={hasCustomLogos ? () => onRemoveLogo(logo.id) : undefined}
              />
            </div>
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
