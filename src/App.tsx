import { useRef, useState } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { CharacterForm } from './components/CharacterForm'
import { LoadingScreen } from './components/LoadingScreen'
import { QuoteResult } from './components/QuoteResult'
import { calculateQuote } from './lib/riskEngine'
import { generateNarrative } from './lib/gemini'
import type { Character } from './types/character'
import type { Quote } from './types/quote'

type Step = 'form' | 'loading' | 'result'

export default function App() {
  const [step, setStep] = useState<Step>('form')
  const [character, setCharacter] = useState<Character | null>(null)
  const [quote, setQuote] = useState<Quote | null>(null)

  // Hold the in-flight AI promise so the loading screen can await it
  const narrativePromise = useRef<Promise<string | null>>(Promise.resolve(null))

  function handleFormSubmit(c: Character) {
    const q = calculateQuote(c)
    setCharacter(c)
    setQuote(q)

    // Fire AI call immediately — runs in parallel with the loading animation
    narrativePromise.current = generateNarrative(c, q)

    setStep('loading')
  }

  async function handleLoadingComplete() {
    // Loading animation is done — wait for AI if it's still running
    const narrative = await narrativePromise.current

    if (narrative) {
      setQuote((prev) => prev ? { ...prev, aiNarrative: narrative } : prev)
    }

    setStep('result')
  }

  function handleReset() {
    setCharacter(null)
    setQuote(null)
    narrativePromise.current = Promise.resolve(null)
    setStep('form')
  }

  return (
    <>
      {step === 'form' && (
        <CharacterForm onSubmit={handleFormSubmit} />
      )}
      {step === 'loading' && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      {step === 'result' && character && quote && (
        <QuoteResult character={character} quote={quote} onReset={handleReset} />
      )}
      <Analytics />
    </>
  )
}
