# D&D Character Insurance

A small side project built as part of an application to Norlix — a company building insurance and pension from scratch.

The idea: what if you could get an insurance quote for your D&D character? You fill in your class, race, level, and alignment. A rule-based risk engine calculates your coverage and premium (in gold pieces). Then an AI underwriter gives you a short, dry assessment of your risk profile.

It's small, it's playful, and it uses the same stack Norlix uses: React, TypeScript, and Tailwind.

**Live:** https://norlix-dnd.vercel.app

---

## Tech

- React + TypeScript + Vite
- Tailwind CSS
- Gemini 2.5 Flash (AI narrative, via Vercel serverless function)

No external UI libraries. No routing library. State lives in `App.tsx` and moves forward through three steps: form → loading → result.

---

## Structure

```
src/
  components/
    CharacterForm.tsx   # Step 1 — character input
    LoadingScreen.tsx   # Step 2 — animated loading with flavor text
    QuoteResult.tsx     # Step 3 — risk score, coverage lines, AI narrative
  lib/
    riskEngine.ts       # Pure scoring logic — no side effects
    gemini.ts           # Calls /api/narrative, builds the prompt
  types/
    character.ts        # Character shape + allowed values
    quote.ts            # Quote shape + RiskTier
api/
  narrative.ts          # Vercel serverless function — Gemini call lives here
```

The risk engine runs synchronously the moment the form is submitted. The Gemini call fires at the same time and runs in parallel with the loading animation. The result screen waits for both before rendering.

---

## A few decisions worth noting

**Thin client, logic in one place.** The risk scoring (`riskEngine.ts`) is self-contained and has no dependencies. It's easy to test, easy to swap out, and easy to reason about.

**AI as a layer on top, not a dependency.** If the Gemini call fails, the quote still works. The AI narrative is an enhancement, not load-bearing.

**API key stays on the server.** The Gemini call runs in a Vercel serverless function (`api/narrative.ts`), not in the browser. The key is never in the client bundle.

**Step state over a router.** Three screens, one flow, no URL changes needed. A `type Step` union in `App.tsx` is all it takes.

---

## Built with AI

This project was built using AI as a coding partner throughout — not just for boilerplate, but for the full process: planning, architecture decisions, iterating on the prompt design, and catching issues (including a potential API key exposure that was caught and fixed before it shipped).

The workflow was iterative: each step was reviewed and assessed before moving to the next. The AI suggested, I decided. Structure, naming, and the logic in `riskEngine.ts` reflect deliberate choices, not just generated output.

This is how I work day-to-day — AI as a tool that speeds things up, with a human owning the result.

---

## Taking it further

A few things that would be natural next steps:

**TanStack Query** for the AI call — right now it's a plain `fetch`. Adding TanStack Query would give proper caching (same character inputs, no duplicate API call), retry logic, and cleaner loading and error states.

**Error handling** — the app currently fails silently if the API call errors. A proper error state in the UI (with a way to retry) would make it production-ready.

**Tests** — `riskEngine.ts` is a pure function with no dependencies, which makes it straightforward to unit test. Each class, alignment, and level combination produces a deterministic output, so the coverage is easy to reason about.

**Shareable quotes** — the risk score is fully deterministic from the character inputs, so a quote could be encoded in the URL and shared with your party.

**More character depth** — subclasses, backgrounds, and party size could all feed into the risk engine in interesting ways.

---

## Run locally

```bash
npm install
npm install -g vercel
vercel login
```

Create a `.env` file (see `.env.example`):

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

```bash
vercel dev
```

`vercel dev` runs both the Vite frontend and the serverless function together. The app is available at `http://localhost:3000`.
