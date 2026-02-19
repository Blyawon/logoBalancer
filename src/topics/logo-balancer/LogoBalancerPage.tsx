import { useState, useCallback } from 'react'
import type { BalancerParams } from '@/lib/balancer'
import type { LogoMeta } from '@/lib/logos'
import { LOGOS } from '@/lib/logos'
import { DEFAULT_PARAMS, PRESETS } from '@/lib/presets'
import { LogoLane } from '@/components/LogoLane'
import { ParameterControls } from '@/components/ParameterControls'
import { ExplanationSection } from '@/components/ExplanationSection'

export default function LogoBalancerPage() {
  const [params, setParams] = useState<BalancerParams>(DEFAULT_PARAMS)
  const [activePreset, setActivePreset] = useState<string | null>('visual')
  const [customLogos, setCustomLogos] = useState<LogoMeta[]>([])

  const handleParamsChange = useCallback((newParams: BalancerParams) => {
    setParams(newParams)
    setActivePreset(null)
  }, [])

  const handlePresetChange = useCallback((presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId)
    if (preset) {
      setParams(preset.params)
      setActivePreset(presetId)
    }
  }, [])

  const handleUpload = useCallback((newLogos: LogoMeta[]) => {
    setCustomLogos(prev => [...prev, ...newLogos])
  }, [])

  const handleRemoveLogo = useCallback((id: string) => {
    setCustomLogos(prev => prev.filter(l => l.id !== id))
  }, [])

  const handleRemoveAll = useCallback(() => {
    setCustomLogos([])
  }, [])

  const displayLogos = customLogos.length > 0 ? customLogos : LOGOS

  return (
    <>
      <div className="mt-2 sm:mt-4">
        <LogoLane
          params={params}
          logos={displayLogos}
          onUpload={handleUpload}
          onRemoveLogo={handleRemoveLogo}
          onRemoveAll={handleRemoveAll}
          hasCustomLogos={customLogos.length > 0}
        />
      </div>

      <div className="mt-3 sm:mt-4">
        <ParameterControls
          params={params}
          activePreset={activePreset}
          onParamsChange={handleParamsChange}
          onPresetChange={handlePresetChange}
        />
      </div>

      <div className="mt-10 sm:mt-20">
        <ExplanationSection params={params} logos={displayLogos} onParamsChange={handleParamsChange} />
      </div>
    </>
  )
}
