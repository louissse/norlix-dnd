import type { Character } from '../types/character'
import type { Quote, RiskTier } from '../types/quote'
import { ShieldIcon } from './ShieldIcon'

interface QuoteResultProps {
  character: Character
  quote: Quote
  onReset: () => void
}

const TIER_STYLES: Record<RiskTier, { badge: string; bar: string; label: string }> = {
  Low: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bar: 'bg-emerald-500',
    label: 'Low risk',
  },
  Moderate: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    bar: 'bg-amber-400',
    label: 'Moderate risk',
  },
  High: {
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    bar: 'bg-orange-500',
    label: 'High risk',
  },
  Catastrophic: {
    badge: 'bg-red-50 text-red-700 border-red-200',
    bar: 'bg-red-500',
    label: 'Catastrophic risk',
  },
}

export function QuoteResult({ character, quote, onReset }: QuoteResultProps) {
  const tier = TIER_STYLES[quote.riskTier]

  return (
    <div className="min-h-screen bg-stone-50 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-8">
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest text-stone-400 uppercase mb-3">
            <ShieldIcon className="w-3.5 h-3.5 text-stone-400" />
            Adventurer's Mutual Insurance Guild
          </p>
          <h1 className="text-3xl font-semibold text-stone-900 tracking-tight">
            Insurance quote
          </h1>
          <p className="mt-1 text-stone-500 text-sm">
            Prepared for{' '}
            <span className="font-medium text-stone-700">{character.name}</span>
            {' '}— {character.race} {character.class}, Level {character.level}
          </p>
        </div>

        {/* Risk score card */}
        <div className="rounded-xl border border-stone-200 bg-white p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-stone-700">Risk profile</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${tier.badge}`}>
              {tier.label}
            </span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${tier.bar}`}
              style={{ width: `${quote.riskScore}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-stone-400">
            <span>Cleric on a holy mission</span>
            <span>Chaotic Evil Wizard, level 20</span>
          </div>
        </div>

        {/* AI narrative */}
        {quote.aiNarrative && (
          <div className="rounded-xl border border-stone-200 bg-stone-50 px-5 py-4 mb-4">
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-2">
              Underwriter's assessment
            </p>
            <p className="text-sm text-stone-600 leading-relaxed italic">
              "{quote.aiNarrative}"
            </p>
          </div>
        )}

        {/* Coverage lines */}
        <div className="rounded-xl border border-stone-200 bg-white divide-y divide-stone-100 mb-4">
          {quote.coverageLines.map((line) => (
            <div key={line.name} className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800">{line.name}</p>
                  <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">
                    {line.description}
                  </p>
                </div>
                <span className="text-sm font-semibold text-stone-700 whitespace-nowrap shrink-0">
                  {line.premium} gp/mo
                </span>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="px-5 py-4 bg-stone-50 rounded-b-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-stone-800">Total monthly premium</span>
              <span className="text-base font-bold text-stone-900">{quote.totalPremium} gp/mo</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-stone-400 leading-relaxed mb-6">
          This quote is valid for 30 days or until your next dungeon delve, whichever comes first.
          Coverage void if character willingly enters a lich's tomb without notifying your underwriter in writing.
        </p>

        {/* Reset */}
        <button
          onClick={onReset}
          className="w-full rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition"
        >
          Get a quote for another character
        </button>
      </div>
    </div>
  )
}
