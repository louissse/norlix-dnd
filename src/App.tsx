import { useState } from 'react'
import { CharacterForm } from './components/CharacterForm'
import type { Character } from './types/character'

type Step = 'form' | 'loading' | 'result'

export default function App() {
  const [step, setStep] = useState<Step>('form')
  const [character, setCharacter] = useState<Character | null>(null)

  function handleFormSubmit(c: Character) {
    setCharacter(c)
    setStep('loading')
  }

  return (
    <>
      {step === 'form' && <CharacterForm onSubmit={handleFormSubmit} />}
      {step === 'loading' && (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <p className="text-stone-500 text-sm">Consulting the actuarial guild...</p>
        </div>
      )}
      {step === 'result' && character && (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <p className="text-stone-500 text-sm">Quote for {character.name} — coming in iteration 2.</p>
        </div>
      )}
    </>
  )
}
