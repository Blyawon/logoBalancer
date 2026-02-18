import { useState, useCallback } from 'react'
import type { BalancerParams } from '@/lib/balancer'
import type { LogoMeta } from '@/lib/logos'
import { LOGOS } from '@/lib/logos'
import { DEFAULT_PARAMS, PRESETS } from '@/lib/presets'
import { Header } from '@/components/Header'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LogoLane } from '@/components/LogoLane'
import { ParameterControls } from '@/components/ParameterControls'
import { ExplanationSection } from '@/components/ExplanationSection'

function App() {
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
      {/* Spotlight fixed background panel */}
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>

      {/* Content */}
      <div className="relative flex w-full flex-col">
        <main className="flex-auto">
          <div className="sm:px-8">
            <div className="mx-auto w-full max-w-7xl lg:px-8">
              <div className="relative px-4 sm:px-8 lg:px-12">
                <div className="mx-auto max-w-2xl lg:max-w-5xl">
                  {/* Theme toggle — top right */}
                  <div className="flex justify-end pt-6 sm:pt-8">
                    <ThemeToggle />
                  </div>

                  <Header />

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

                  {/* Footer */}
                  <footer className="mt-16 sm:mt-24 pb-10 sm:pb-16 flex items-center justify-center gap-2 text-xs text-zinc-300 dark:text-zinc-700">
                    <span>Logo Balancer</span>
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
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default App
