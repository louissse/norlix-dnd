import type { VercelRequest, VercelResponse } from '@vercel/node'

const API_KEY = process.env.GEMINI_API_KEY
const API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const { prompt } = req.body

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Missing prompt' })
  }

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: 300,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Gemini API error:', response.status, error)
      return res.status(502).json({ error: 'Upstream API error' })
    }

    const data = await response.json()
    const text: string | undefined =
      data?.candidates?.[0]?.content?.parts?.[0]?.text

    return res.status(200).json({ narrative: text?.trim() ?? null })
  } catch (err) {
    console.error('Gemini request failed:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
