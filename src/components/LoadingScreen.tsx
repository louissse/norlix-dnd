import { useEffect, useState } from 'react'
import { ShieldIcon } from './ShieldIcon'

const MESSAGES = [
  'Consulting the actuarial guild...',
  'Cross-referencing your alignment with historical mortality data...',
  'Reviewing prior claims in your dungeon district...',
  'Checking the dragon collision database...',
  'Adjusting for chaotic tendencies...',
  'Calculating resurrection surcharge...',
]

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => {
        if (i < MESSAGES.length - 1) return i + 1
        return i
      })
    }, 600)

    const timeout = setTimeout(() => {
      clearInterval(interval)
      onComplete()
    }, 2200)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [onComplete])

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center gap-6 px-4">
      {/* Spinner */}
      <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-stone-900 animate-spin" />

      <div className="text-center">
        <p className="flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
          <ShieldIcon className="w-3.5 h-3.5 text-stone-400" />
          Adventurer's Mutual Insurance Guild
        </p>
        <p className="text-sm text-stone-600 h-5 transition-all duration-300">
          {MESSAGES[messageIndex]}
        </p>
      </div>
    </div>
  )
}
