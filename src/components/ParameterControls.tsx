import { useState, useRef, useEffect } from 'react'
import type { BalancerParams } from '@/lib/balancer'
import { PRESETS, DEFAULT_PARAMS } from '@/lib/presets'
import { Slider } from '@/components/ui/slider'
import { Pill } from '@/components/Pill'

interface ParameterControlsProps {
  params: BalancerParams
  activePreset: string | null
  onParamsChange: (params: BalancerParams) => void
  onPresetChange: (presetId: string) => void
}

interface SliderConfig {
  key: keyof BalancerParams
  label: string
  min: number
  max: number
  step: number
  description: string
}

const SLIDER_CONFIGS: SliderConfig[] = [
  {
    key: 'baseline',
    label: 'Baseline',
    min: 0.1,
    max: 1.0,
    step: 0.01,
    description: 'Width fraction for a square logo (ratio = 1)',
  },
  {
    key: 'exponent',
    label: 'Exponent',
    min: 0,
    max: 1.0,
    step: 0.01,
    description: '0 = equal width, 0.5 = equal area, 0.6 = visual',
  },
  {
    key: 'ratioMin',
    label: 'Ratio Min',
    min: 0.1,
    max: 0.9,
    step: 0.05,
    description: 'Clamp for extreme portrait aspect ratios',
  },
  {
    key: 'ratioMax',
    label: 'Ratio Max',
    min: 1.5,
    max: 6.0,
    step: 0.1,
    description: 'Clamp for extreme landscape aspect ratios',
  },
  {
    key: 'scale',
    label: 'Scale',
    min: 0.5,
    max: 2.0,
    step: 0.01,
    description: 'Global scale multiplier applied to all logos',
  },
  {
    key: 'fitPercent',
    label: 'Fit %',
    min: 0.5,
    max: 1.0,
    step: 0.01,
    description: 'Safety inset to prevent logo overflow',
  },
]

function EditableValue({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setDraft(value.toFixed(2))
    setEditing(true)
  }

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  function commit() {
    const parsed = parseFloat(draft)
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed))
      const rounded = Math.round(clamped / step) * step
      onChange(rounded)
    }
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className="text-sm font-mono tabular-nums text-zinc-900 dark:text-zinc-100 bg-transparent border-b border-zinc-300 dark:border-zinc-600 w-14 text-right outline-none focus:border-zinc-900 dark:focus:border-zinc-100"
      />
    )
  }

  return (
    <button
      onClick={startEdit}
      className="text-sm font-mono tabular-nums text-zinc-900 dark:text-zinc-100 hover:text-sky-600 dark:hover:text-sky-400 hover:underline hover:decoration-dotted hover:underline-offset-2 cursor-text transition-colors"
      title="Click to edit"
    >
      {value.toFixed(2)}
    </button>
  )
}

export function ParameterControls({
  params,
  activePreset,
  onParamsChange,
  onPresetChange,
}: ParameterControlsProps) {
  function handleSliderChange(key: keyof BalancerParams, value: number) {
    onParamsChange({ ...params, [key]: value })
  }

  function handleDoubleClickLabel(key: keyof BalancerParams) {
    onParamsChange({ ...params, [key]: DEFAULT_PARAMS[key] })
  }

  // Keyboard shortcuts: 1-4 for presets
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const idx = parseInt(e.key) - 1
      if (idx >= 0 && idx < PRESETS.length) {
        onPresetChange(PRESETS[idx].id)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onPresetChange])

  const activeDescription = activePreset
    ? PRESETS.find((p) => p.id === activePreset)?.description
    : null

  return (
    <div id="controls" className="rounded-2xl border border-zinc-100 p-3 sm:p-6 space-y-5 sm:space-y-6 dark:border-zinc-700/40">
      {/* Preset Pills */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {PRESETS.map((preset, i) => (
            <Pill
              key={preset.id}
              active={activePreset === preset.id}
              onClick={() => {
                onPresetChange(preset.id)
                document.getElementById('logo-lane')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }}
              title={`Press ${i + 1} to activate`}
            >
              {preset.name}
            </Pill>
          ))}
          {!activePreset && (
            <button
              onClick={() => onPresetChange('visual')}
              title="Reset to Visual preset"
              className="px-3 py-1.5 rounded-full text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
        {activeDescription && (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            {activeDescription}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-100 dark:border-zinc-700/40" />

      {/* Slider Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {SLIDER_CONFIGS.map((config) => (
          <div key={config.key} className="space-y-3">
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-medium text-zinc-700 dark:text-zinc-200 cursor-default select-none"
                onDoubleClick={() => handleDoubleClickLabel(config.key)}
                title="Double-click to reset"
              >
                {config.label}
              </span>
              <EditableValue
                value={params[config.key]}
                min={config.min}
                max={config.max}
                step={config.step}
                onChange={(v) => handleSliderChange(config.key, v)}
              />
            </div>
            <Slider
              value={[params[config.key]]}
              min={config.min}
              max={config.max}
              step={config.step}
              onValueChange={([v]) => handleSliderChange(config.key, v)}
            />
            <p className="text-xs text-zinc-300 dark:text-zinc-600 leading-snug">
              {config.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
