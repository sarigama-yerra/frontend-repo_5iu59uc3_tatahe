import { useEffect } from 'react'
import Spline from '@splinetool/react-spline'

function Hero({ onActivate }) {
  // Allow keyboard E to activate
  useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() === 'e') {
        onActivate()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onActivate])

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4TrRyLcIHhcItjnk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Subtle gradient overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

      {/* Copy */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="max-w-3xl text-center text-white">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            ChronoLab: The Hourglass Protocol
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-white/85">
            Step into the lab as Dr. Elara Voss, a physicist racing to stabilize a rogue time machine.
            Interact with the hourglass core and initiate a jump.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={onActivate}
              className="rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-white px-6 py-3 font-semibold shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
            >
              Engage Time Core
            </button>
            <div className="flex items-center gap-2 text-white/80">
              <kbd className="rounded-md bg-white/10 px-2 py-1 text-sm border border-white/20">E</kbd>
              <span>to interact</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
