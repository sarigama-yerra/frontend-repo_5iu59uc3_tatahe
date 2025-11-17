import { useCallback, useState } from 'react'
import Hero from './components/Hero'
import HUD from './components/HUD'
import Game from './components/Game'

function App() {
  const [activated, setActivated] = useState(false)
  const [energy, setEnergy] = useState(10)
  const [phase, setPhase] = useState('Standby')

  const handleActivate = useCallback(() => {
    setActivated(true)
    setPhase('Calibration')
  }, [])

  const handleReset = useCallback(() => {
    window.location.href = '/'
  }, [])

  return (
    <div className="min-h-screen w-full bg-black">
      {!activated ? (
        <Hero onActivate={handleActivate} />
      ) : (
        <>
          <HUD phase={phase} energy={energy} onReset={handleReset} />
          <Game onComplete={() => {}} />
        </>
      )}
    </div>
  )
}

export default App
