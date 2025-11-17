import { useEffect, useMemo, useRef, useState } from 'react'

function rand(min, max) {
  return Math.random() * (max - min) + min
}

function useGameLoop(active) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf
    const loop = () => {
      setTick((t) => t + 1)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [active])
  return tick
}

function Game({ onComplete }) {
  const [running, setRunning] = useState(true)
  const [energy, setEnergy] = useState(10)
  const [phase, setPhase] = useState('Calibration')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)

  const tick = useGameLoop(running)

  // Spawn fragments
  const fragments = useRef([])
  const nextSpawn = useRef(0)

  useEffect(() => {
    if (!running) return
    const now = performance.now()
    if (now >= nextSpawn.current) {
      fragments.current.push({
        id: crypto.randomUUID(),
        x: rand(0.05, 0.95),
        y: -0.1,
        vx: rand(-0.001, 0.001),
        vy: rand(0.004, 0.008),
        size: rand(10, 22),
      })
      nextSpawn.current = now + rand(300, 900)
    }
  }, [tick, running])

  // Update physics and timers
  useEffect(() => {
    if (!running) return

    // Energy trends towards stability based on score
    setEnergy((e) => Math.max(0, Math.min(100, e + (score > 30 ? 0.06 : 0.03) - 0.015)))

    // Timer
    if (timeLeft <= 0) {
      setRunning(false)
      setPhase('Portal Open')
      onComplete?.(score)
      return
    }
    if (tick % 60 === 0) setTimeLeft((t) => t - 1)

    // Move fragments
    fragments.current = fragments.current
      .map((f) => ({ ...f, x: f.x + f.vx, y: f.y + f.vy, vy: f.vy + 0.00006 }))
      .filter((f) => f.y < 1.2)

    // Phase updates
    if (score > 50) setPhase('Stabilization')
    if (score > 100) setPhase('Synchronization')
    if (energy >= 95 && score > 120) setPhase('Portal Forming')
  }, [tick])

  // Click to collect
  const onClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    let collected = 0
    fragments.current = fragments.current.filter((f) => {
      const dx = f.x - px
      const dy = f.y - py
      const d = Math.hypot(dx, dy)
      if (d < f.size / rect.width * 1.6) {
        collected++
        return false
      }
      return true
    })
    if (collected) setScore((s) => s + collected * 2)
    setEnergy((e) => Math.min(100, e + collected * 1.2))
  }

  // Overload chance if clicking randomly
  useEffect(() => {
    if (!running) return
    if (energy > 98) {
      // brief overload drop
      setEnergy((e) => e - 5)
    }
  }, [score])

  const portalReady = energy > 90 && score > 120 && timeLeft > 0

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-cyan-900 text-white">
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#00e5ff22,transparent_40%),radial-gradient(circle_at_80%_80%,#a78bfa22,transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-10">
        <header className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold">ChronoLab: Core Stabilization</h2>
          <div className="flex items-center gap-4 text-white/80">
            <div className="rounded bg-white/10 px-3 py-1">Score: {score}</div>
            <div className="rounded bg-white/10 px-3 py-1">Time: {timeLeft}s</div>
          </div>
        </header>

        <div
          onClick={onClick}
          className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10 bg-black/30 backdrop-blur relative cursor-crosshair"
        >
          {/* Fragments */}
          {fragments.current.map((f) => (
            <div
              key={f.id}
              className="absolute rounded-full bg-cyan-300/80 shadow-[0_0_20px_4px_rgba(34,211,238,0.35)]"
              style={{ left: `${f.x * 100}%`, top: `${f.y * 100}%`, width: f.size, height: f.size, transform: 'translate(-50%, -50%)' }}
            />
          ))}

          {/* Portal cue */}
          {portalReady && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="animate-pulse text-center">
                <p className="text-cyan-300">Stability achieved</p>
                <p className="text-2xl font-semibold">Press E to jump</p>
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-white/80">
          Collect the glowing fragments to increase stability. Achieve high stability and score to open a portal. Avoid pushing the core to overload.
        </p>

        {!running && (
          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="text-lg font-semibold">Session complete.</p>
            <p className="text-white/80">Score: {score}</p>
            <button onClick={() => window.location.reload()} className="mt-3 rounded bg-cyan-500/90 hover:bg-cyan-400 px-4 py-2">Play Again</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Game
