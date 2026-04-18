import type { Character } from '../types/character'
import type { Quote } from '../types/quote'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

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
  if (!API_KEY) {
    console.warn('VITE_GEMINI_API_KEY is not set — skipping AI narrative')
    return null
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(character, quote) }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 300,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    })

    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text())
      return null
    }

    const data = await response.json()
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text

    return text?.trim() ?? null
  } catch (err) {
    console.error('Gemini request failed:', err)
    return null
  }
}
