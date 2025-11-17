function HUD({ phase, energy, onReset }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col">
      <div className="mx-auto mt-6 w-full max-w-5xl px-6">
        <div className="flex items-center justify-between">
          <div className="pointer-events-auto rounded-xl bg-black/40 backdrop-blur px-4 py-2 text-white border border-white/10">
            <p className="text-sm uppercase tracking-widest text-white/70">Phase</p>
            <p className="text-xl font-semibold">{phase}</p>
          </div>

          <div className="pointer-events-auto rounded-xl bg-black/40 backdrop-blur px-4 py-2 text-white border border-white/10">
            <p className="text-sm uppercase tracking-widest text-white/70">Core Energy</p>
            <div className="mt-1 h-2 w-56 overflow-hidden rounded bg-white/10">
              <div
                className="h-full bg-cyan-400 transition-all"
                style={{ width: `${Math.min(100, Math.max(0, Math.round(energy)))}%` }}
              />
            </div>
          </div>

          <button
            onClick={onReset}
            className="pointer-events-auto rounded-lg bg-white/10 hover:bg-white/20 text-white px-4 py-2 border border-white/10 transition"
          >
            Reset Simulation
          </button>
        </div>
      </div>

      <div className="mt-auto w-full bg-gradient-to-t from-black/60 to-transparent p-6 text-center text-white/80">
        <p>Stabilize the time core to open a portal. Collect chrono-fragments and avoid overload.</p>
      </div>
    </div>
  )
}

export default HUD
