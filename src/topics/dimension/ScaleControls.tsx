import { Pill } from '@/components/Pill'
import { Slider } from '@/components/ui/slider'
import { NAMING_OPTIONS } from './naming'
import { DIMENSION_PRESETS } from './presets'
import type { DimensionConfig, CurveType, RoundingStrategy, DensityMode, OutputUnit } from './types'

interface ScaleControlsProps {
  config: DimensionConfig
  activePreset: string | null
  onChange: (partial: Partial<DimensionConfig>) => void
  onPresetChange: (presetId: string) => void
}

function ControlLabel({ children, description }: { children: React.ReactNode; description?: string }) {
  return (
    <div className="mb-2">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{children}</span>
      {description && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{description}</p>
      )}
    </div>
  )
}

function SliderRow({
  label,
  description,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  description?: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</span>
        <span className="text-sm font-mono tabular-nums text-zinc-900 dark:text-zinc-100">
          {value.toFixed(step < 1 ? Math.max(1, -Math.floor(Math.log10(step))) : 0)}
        </span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={([v]) => onChange(v)} />
      {description && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500">{description}</p>
      )}
    </div>
  )
}

const BASE_OPTIONS = [4, 8, 10, 16] as const
const CURVE_OPTIONS: { id: CurveType; label: string }[] = [
  { id: 'linear', label: 'Linear' },
  { id: 'exponential', label: 'Expo' },
  { id: 'ease-in', label: 'Ease In' },
  { id: 'ease-out', label: 'Ease Out' },
  { id: 'ease-in-out', label: 'Ease I/O' },
  { id: 'custom', label: 'Custom' },
]
const ROUNDING_OPTIONS: { id: RoundingStrategy; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'round', label: 'Round' },
  { id: 'floor', label: 'Floor' },
  { id: 'ceil', label: 'Ceil' },
]
const SNAP_OPTIONS = [0, 2, 4, 8] as const
const DENSITY_OPTIONS: { id: DensityMode; mult: number; label: string }[] = [
  { id: 'compact', mult: 0.75, label: 'Compact' },
  { id: 'comfortable', mult: 1, label: 'Comfortable' },
  { id: 'spacious', mult: 1.25, label: 'Spacious' },
]
const UNIT_OPTIONS: OutputUnit[] = ['px', 'rem', 'em']

export function ScaleControls({ config, activePreset, onChange, onPresetChange }: ScaleControlsProps) {
  return (
    <div className="rounded-2xl border border-zinc-100 p-3 sm:p-6 space-y-5 sm:space-y-6 dark:border-zinc-700/40">
      {/* ── Presets ── */}
      <div className="space-y-2">
        <ControlLabel>Presets</ControlLabel>
        <div className="flex items-center gap-1.5 flex-wrap">
          {DIMENSION_PRESETS.map((preset) => (
            <Pill
              key={preset.id}
              active={activePreset === preset.id}
              onClick={() => onPresetChange(preset.id)}
              title={preset.description}
            >
              {preset.name}
            </Pill>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-700/40" />

      {/* ── Core Controls ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Base Dimension */}
        <div>
          <ControlLabel description="Base unit for the scale">Base</ControlLabel>
          <div className="flex items-center gap-1.5 flex-wrap">
            {BASE_OPTIONS.map((b) => (
              <Pill key={b} active={config.base === b} onClick={() => onChange({ base: b })}>
                {b}
              </Pill>
            ))}
            <Pill
              active={!BASE_OPTIONS.includes(config.base as typeof BASE_OPTIONS[number])}
              onClick={() => {
                const v = prompt('Custom base value:', String(config.base))
                if (v) {
                  const parsed = parseFloat(v)
                  if (!isNaN(parsed) && parsed > 0) onChange({ base: parsed })
                }
              }}
            >
              Custom
            </Pill>
          </div>
        </div>

        {/* Steps */}
        <SliderRow
          label="Steps"
          description="Number of tokens in the scale"
          value={config.steps}
          min={3}
          max={20}
          step={1}
          onChange={(v) => onChange({ steps: v })}
        />

        {/* Scale Factor */}
        <SliderRow
          label="Scale Factor"
          description="Ratio between consecutive steps"
          value={config.scaleFactor}
          min={1}
          max={3}
          step={0.01}
          onChange={(v) => onChange({ scaleFactor: v })}
        />
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-700/40" />

      {/* ── Naming ── */}
      <div>
        <ControlLabel description="Token naming scheme">Naming</ControlLabel>
        <div className="flex items-center gap-1.5 flex-wrap">
          {NAMING_OPTIONS.map((opt) => (
            <Pill
              key={opt.id}
              active={config.namingConvention === opt.id}
              onClick={() => onChange({ namingConvention: opt.id })}
              size="sm"
              title={opt.example}
            >
              {opt.label}
            </Pill>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-700/40" />

      {/* ── Curve ── */}
      <div>
        <ControlLabel description="How values progress across the scale">Curve</ControlLabel>
        <div className="flex items-center gap-1.5 flex-wrap">
          {CURVE_OPTIONS.map((opt) => (
            <Pill
              key={opt.id}
              active={config.curveType === opt.id}
              onClick={() => onChange({ curveType: opt.id })}
              size="sm"
            >
              {opt.label}
            </Pill>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-700/40" />

      {/* ── Rounding & Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Rounding Strategy */}
        <div>
          <ControlLabel description="How fractional values resolve">Rounding</ControlLabel>
          <div className="flex items-center gap-1.5 flex-wrap">
            {ROUNDING_OPTIONS.map((opt) => (
              <Pill
                key={opt.id}
                active={config.roundingStrategy === opt.id}
                onClick={() => onChange({ roundingStrategy: opt.id })}
                size="sm"
              >
                {opt.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Rounding Precision */}
        {config.roundingStrategy !== 'none' && (
          <SliderRow
            label="Precision"
            description="Decimal places"
            value={config.roundingPrecision}
            min={0}
            max={4}
            step={1}
            onChange={(v) => onChange({ roundingPrecision: v })}
          />
        )}

        {/* Snap to Grid */}
        <div>
          <ControlLabel description="Align all values to a pixel grid">Snap</ControlLabel>
          <div className="flex items-center gap-1.5 flex-wrap">
            {SNAP_OPTIONS.map((s) => (
              <Pill
                key={s}
                active={config.snapToGrid === s}
                onClick={() => onChange({ snapToGrid: s })}
                size="sm"
              >
                {s === 0 ? 'Off' : `${s}px`}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-700/40" />

      {/* ── Bounds & Density ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Min */}
        <SliderRow
          label="Min"
          description="Absolute floor"
          value={config.minValue}
          min={0}
          max={16}
          step={1}
          onChange={(v) => onChange({ minValue: v })}
        />

        {/* Max */}
        <SliderRow
          label="Max"
          description="Absolute ceiling"
          value={config.maxValue}
          min={64}
          max={1024}
          step={8}
          onChange={(v) => onChange({ maxValue: v })}
        />

        {/* Density */}
        <div>
          <ControlLabel description="Overall density multiplier">Density</ControlLabel>
          <div className="flex items-center gap-1.5 flex-wrap">
            {DENSITY_OPTIONS.map((opt) => (
              <Pill
                key={opt.id}
                active={config.densityMode === opt.id}
                onClick={() => onChange({ densityMode: opt.id, densityMultiplier: opt.mult })}
                size="sm"
              >
                {opt.label}
              </Pill>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-700/40" />

      {/* ── Units & Output ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Output Unit */}
        <div>
          <ControlLabel description="Unit for output values">Unit</ControlLabel>
          <div className="flex items-center gap-1.5">
            {UNIT_OPTIONS.map((u) => (
              <Pill
                key={u}
                active={config.outputUnit === u}
                onClick={() => onChange({ outputUnit: u })}
                size="sm"
              >
                {u}
              </Pill>
            ))}
          </div>
          {config.outputUnit !== 'px' && (
            <div className="mt-2">
              <SliderRow
                label="Base (px)"
                value={config.remBase}
                min={8}
                max={24}
                step={1}
                onChange={(v) => onChange({ remBase: v })}
              />
            </div>
          )}
        </div>

        {/* Token Prefix */}
        <div>
          <ControlLabel description="CSS custom property prefix">Prefix</ControlLabel>
          <input
            type="text"
            value={config.tokenPrefix}
            onChange={(e) => onChange({ tokenPrefix: e.target.value || 'space' })}
            className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400 dark:focus:border-zinc-500"
            placeholder="space"
          />
        </div>
      </div>

      <div className="border-t border-zinc-100 dark:border-zinc-700/40" />

      {/* ── Advanced ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Optical Compensation */}
        <SliderRow
          label="Optical Compensation"
          description="Boost small values for sub-pixel safety"
          value={config.opticalCompensation}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => onChange({ opticalCompensation: v })}
        />

        {/* Progression Bias */}
        <SliderRow
          label="Progression Bias"
          description="Concentrate steps toward small (-) or large (+) end"
          value={config.progressionBias}
          min={-1}
          max={1}
          step={0.01}
          onChange={(v) => onChange({ progressionBias: v })}
        />
      </div>

      {/* ── Toggles ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <Pill
          active={config.harmonicAlignment}
          onClick={() => onChange({ harmonicAlignment: !config.harmonicAlignment })}
          mode="multi"
          size="sm"
        >
          Harmonic
        </Pill>
        <Pill
          active={config.negativeScale}
          onClick={() => onChange({ negativeScale: !config.negativeScale })}
          mode="multi"
          size="sm"
        >
          Negative
        </Pill>
        <Pill
          active={config.fluid}
          onClick={() => onChange({ fluid: !config.fluid })}
          mode="multi"
          size="sm"
        >
          Fluid
        </Pill>
      </div>

      {/* ── Fluid Options (revealed when fluid is on) ── */}
      {config.fluid && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
          <SliderRow
            label="Viewport Min"
            description="Minimum viewport width"
            value={config.viewportMin}
            min={240}
            max={640}
            step={10}
            onChange={(v) => onChange({ viewportMin: v })}
          />
          <SliderRow
            label="Viewport Max"
            description="Maximum viewport width"
            value={config.viewportMax}
            min={768}
            max={2560}
            step={10}
            onChange={(v) => onChange({ viewportMax: v })}
          />
          <SliderRow
            label="Fluid Scale"
            description="Reduction factor at min viewport"
            value={config.fluidScaleFactor}
            min={0.5}
            max={1}
            step={0.01}
            onChange={(v) => onChange({ fluidScaleFactor: v })}
          />
        </div>
      )}
    </div>
  )
}
