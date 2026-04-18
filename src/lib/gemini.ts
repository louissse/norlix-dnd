import type { Character } from '../types/character'
import type { Quote } from '../types/quote'

function buildPrompt(character: Character, quote: Quote): string {
  const adventureContext = character.recentAdventure.trim()
    ? `\n- Recent adventure: ${character.recentAdventure.trim()}`
    : ''

  return `You are a risk underwriter at the Adventurer's Mutual Insurance Guild. Write exactly 2 sentences about this adventurer. The first sentence makes a dry, witty observation about their class, alignment, or recent adventure. The second sentence is a concrete underwriter's verdict — a coverage decision, a warning, a condition, or a recommendation. Deadpan tone, plain prose, no bullet points, under 50 words total.

Character:
- Name: ${character.name}
- Class: ${character.class}, Level ${character.level}
- Race: ${character.race}, Alignment: ${character.alignment}
- Risk tier: ${quote.riskTier}
- Monthly premium: ${quote.totalPremium} gp/month${adventureContext}`
}

export async function generateNarrative(
  character: Character,
  quote: Quote,
): Promise<string | null> {
  try {
    const response = await fetch('/api/narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: buildPrompt(character, quote) }),
    })

    if (!response.ok) {
      console.error('Narrative API error:', response.status)
      return null
    }

    const data = await response.json()
    return data.narrative ?? null
  } catch (err) {
    console.error('Narrative request failed:', err)
    return null
  }
}
