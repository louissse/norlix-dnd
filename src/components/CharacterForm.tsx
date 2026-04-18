import { useState } from 'react'
import {
  CHARACTER_CLASSES,
  RACES,
  ALIGNMENTS,
  type Character,
  type CharacterClass,
  type Race,
} from '../types/character'
import { ShieldIcon } from './ShieldIcon'

interface CharacterFormProps {
  onSubmit: (character: Character) => void
}

const defaultCharacter: Character = {
  name: '',
  class: 'Fighter',
  level: 1,
  race: 'Human',
  alignment: 'True Neutral',
  recentAdventure: '',
}

export function CharacterForm({ onSubmit }: CharacterFormProps) {
  const [character, setCharacter] = useState<Character>(defaultCharacter)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit(character)
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-10">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">
            <ShieldIcon className="w-3.5 h-3.5 text-stone-400" />
            Adventurer's Mutual Insurance Guild
          </p>
          <h1 className="text-3xl font-semibold text-stone-900 tracking-tight">
            Get your insurance quote
          </h1>
          <p className="mt-2 text-stone-500 text-sm">
            Fill in your character details. We'll assess your risk profile and
            provide a personalised coverage estimate.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Character name */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Character name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Thorin Ironbeard"
              value={character.name}
              onChange={(e) =>
                setCharacter((c) => ({ ...c, name: e.target.value }))
              }
              className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition"
            />
          </div>

          {/* Class + Race */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Class
              </label>
              <select
                value={character.class}
                onChange={(e) =>
                  setCharacter((c) => ({
                    ...c,
                    class: e.target.value as CharacterClass,
                  }))
                }
                className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition appearance-none"
              >
                {CHARACTER_CLASSES.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Race
              </label>
              <select
                value={character.race}
                onChange={(e) =>
                  setCharacter((c) => ({
                    ...c,
                    race: e.target.value as Race,
                  }))
                }
                className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition appearance-none"
              >
                {RACES.map((race) => (
                  <option key={race} value={race}>
                    {race}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Level */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Level — <span className="font-normal text-stone-500">{character.level}</span>
            </label>
            <input
              type="range"
              min={1}
              max={20}
              value={character.level}
              onChange={(e) =>
                setCharacter((c) => ({
                  ...c,
                  level: Number(e.target.value),
                }))
              }
              className="w-full accent-stone-900"
            />
            <div className="flex justify-between text-xs text-stone-400 mt-1">
              <span>1 — Fresh adventurer</span>
              <span>20 — Demigod (uninsurable)</span>
            </div>
          </div>

          {/* Alignment */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Alignment
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ALIGNMENTS.map((alignment) => (
                <button
                  key={alignment}
                  type="button"
                  onClick={() =>
                    setCharacter((c) => ({ ...c, alignment }))
                  }
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    character.alignment === alignment
                      ? 'bg-stone-900 border-stone-900 text-white'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  {alignment}
                </button>
              ))}
            </div>
          </div>

          {/* Recent adventure */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">
              Tell us about your latest adventure{' '}
              <span className="font-normal text-stone-400">(optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. We descended into the Underdark and narrowly survived an encounter with a beholder. I may have accidentally polymorphed the paladin into a goat."
              value={character.recentAdventure}
              onChange={(e) =>
                setCharacter((c) => ({ ...c, recentAdventure: e.target.value }))
              }
              className="w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition resize-none"
            />
            <p className="text-xs text-stone-400 mt-1">
              Our underwriters use this to assess situational risk factors.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-lg bg-stone-900 px-4 py-3 text-sm font-semibold text-white hover:bg-stone-800 active:bg-stone-950 transition"
            >
              Assess my risk profile →
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
