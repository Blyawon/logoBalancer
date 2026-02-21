import type { GeneratedToken } from './types'

interface SampleDesignProps {
  tokens: GeneratedToken[]
}

function tokenVal(tokens: GeneratedToken[], index: number): number {
  // Map requested index to available tokens proportionally
  if (tokens.length === 0) return 8
  if (index >= tokens.length) return tokens[tokens.length - 1].value
  if (index < 0) return tokens[0].value
  return tokens[index].value
}

export function SampleDesign({ tokens }: SampleDesignProps) {
  // Map 10 semantic slots across however many tokens exist
  const steps = tokens.length
  const t = (frac: number) => tokenVal(tokens, Math.round(frac * (steps - 1)))

  // Semantic slots
  const border = t(0)          // smallest — borders, dividers
  const tightGap = t(1 / 9)   // icon-to-text gap
  const tagPadX = t(2 / 9)    // tag horizontal padding
  const btnPadY = t(3 / 9)    // button padding y
  const inputPad = t(4 / 9)   // input padding
  const sectionGap = t(5 / 9) // section gaps
  const cardPad = t(6 / 9)    // card internal padding
  const avatar = t(7 / 9)     // avatar size
  const largeEl = t(8 / 9)    // large element height
  const pagePad = t(1)        // page margins

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Live Preview
        <span className="ml-2 text-xs text-zinc-400 dark:text-zinc-500 font-normal">
          Every dimension driven by your scale
        </span>
      </h3>

      <div className="group/sample rounded-2xl border border-zinc-200 dark:border-zinc-700/40 bg-white dark:bg-zinc-900 overflow-hidden transition-all">
        {/* The settings panel mockup */}
        <div style={{ padding: pagePad }}>

          {/* ── Profile header ── */}
          <div className="flex items-center" style={{ gap: sectionGap }}>
            {/* Avatar */}
            <div
              className="rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0 flex items-center justify-center text-zinc-400 dark:text-zinc-500 text-xs font-medium"
              style={{ width: avatar, height: avatar }}
            >
              <svg width={avatar * 0.45} height={avatar * 0.45} viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm0 2c-3.3 0-6 1.3-6 3v1h12v-1c0-1.7-2.7-3-6-3z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1" style={{ display: 'flex', flexDirection: 'column', gap: tightGap }}>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">Jane Doe</div>
              <div className="text-xs text-zinc-400 dark:text-zinc-500 truncate">@janedoe</div>
            </div>
            <button
              className="text-xs font-medium text-zinc-500 dark:text-zinc-400 rounded-full border border-zinc-200 dark:border-zinc-700 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800"
              style={{ paddingLeft: inputPad, paddingRight: inputPad, paddingTop: btnPadY, paddingBottom: btnPadY }}
            >
              Edit
            </button>
          </div>

          {/* Divider */}
          <div
            className="bg-zinc-100 dark:bg-zinc-800"
            style={{ height: border, marginTop: sectionGap, marginBottom: sectionGap }}
          />

          {/* ── Form section ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: sectionGap }}>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Account
            </div>

            {/* Display Name field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: tightGap }}>
              <label className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">Display Name</label>
              <div
                className="rounded-lg text-xs text-zinc-700 dark:text-zinc-300"
                style={{
                  padding: inputPad,
                  borderWidth: Math.max(border, 1),
                  borderStyle: 'solid',
                  borderColor: '#e4e4e7',
                }}
              >
                Jane Doe
              </div>
            </div>

            {/* Email field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: tightGap }}>
              <label className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">Email</label>
              <div
                className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-700 dark:text-zinc-300"
                style={{ padding: inputPad }}
              >
                jane@example.com
              </div>
            </div>

            {/* Role tags */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: tightGap }}>
              <label className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">Role</label>
              <div className="flex flex-wrap" style={{ gap: tightGap }}>
                {['Admin', 'Editor', 'Viewer'].map((role, i) => (
                  <span
                    key={role}
                    className={`text-[10px] font-medium rounded-full ${
                      i === 0
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                    }`}
                    style={{ paddingLeft: tagPadX, paddingRight: tagPadX, paddingTop: btnPadY * 0.5, paddingBottom: btnPadY * 0.5 }}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div
            className="bg-zinc-100 dark:bg-zinc-800"
            style={{ height: border, marginTop: sectionGap, marginBottom: sectionGap }}
          />

          {/* ── Notifications section ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: tightGap }}>
            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" style={{ marginBottom: tightGap }}>
              Notifications
            </div>

            {['Email notifications', 'Push notifications', 'Weekly digest'].map((label, i) => (
              <div key={label}>
                <div
                  className="flex items-center justify-between"
                  style={{ padding: inputPad * 0.5 }}
                >
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">{label}</span>
                  {/* Toggle */}
                  <div
                    className={`rounded-full relative ${
                      i < 2 ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-200 dark:bg-zinc-700'
                    }`}
                    style={{ width: largeEl * 0.6, height: largeEl * 0.3 }}
                  >
                    <div
                      className="absolute top-0.5 rounded-full bg-white dark:bg-zinc-900 shadow-sm"
                      style={{
                        width: largeEl * 0.25,
                        height: largeEl * 0.25,
                        left: i < 2 ? largeEl * 0.3 : 2,
                      }}
                    />
                  </div>
                </div>
                {i < 2 && (
                  <div
                    className="bg-zinc-100 dark:bg-zinc-800"
                    style={{ height: Math.max(border, 1), marginTop: tightGap, marginBottom: tightGap }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div
            className="bg-zinc-100 dark:bg-zinc-800"
            style={{ height: border, marginTop: sectionGap, marginBottom: sectionGap }}
          />

          {/* ── Action buttons ── */}
          <div className="flex" style={{ gap: tightGap }}>
            <button
              className="text-xs font-medium rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              style={{
                paddingLeft: cardPad,
                paddingRight: cardPad,
                paddingTop: btnPadY,
                paddingBottom: btnPadY,
              }}
            >
              Save changes
            </button>
            <button
              className="text-xs font-medium rounded-full border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"
              style={{
                paddingLeft: cardPad * 0.75,
                paddingRight: cardPad * 0.75,
                paddingTop: btnPadY,
                paddingBottom: btnPadY,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* ── Token Legend ── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-mono text-zinc-400 dark:text-zinc-500">
        {[
          'borders', 'tight gaps', 'tag padding', 'button padding',
          'input padding', 'section gaps', 'card padding', 'avatar/icons',
          'large elements', 'page margins'
        ].map((label, i) => {
          const idx = Math.round((i / 9) * (steps - 1))
          const tok = tokens[idx]
          return tok ? (
            <span key={label} className="flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-sm bg-zinc-900 dark:bg-zinc-100" />
              {tok.name}: {label}
            </span>
          ) : null
        })}
      </div>
    </div>
  )
}
