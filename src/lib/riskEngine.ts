import type { Character, CharacterClass, Alignment } from '../types/character'
import type { Quote, RiskTier, CoverageLine } from '../types/quote'

// Base risk by class — reflects D&D survivability realities
const CLASS_RISK: Record<CharacterClass, number> = {
  Barbarian: 55,
  Bard: 40,
  Cleric: 35,
  Druid: 38,
  Fighter: 45,
  Monk: 42,
  Paladin: 37,
  Ranger: 48,
  Rogue: 52,
  Sorcerer: 62,
  Warlock: 58,
  Wizard: 65, // lowest HP, highest ambition
}

// Chaos axis modifier — lawful = predictable = cheaper
const ALIGNMENT_MODIFIER: Record<Alignment, number> = {
  'Lawful Good': -10,
  'Neutral Good': -5,
  'Chaotic Good': 5,
  'Lawful Neutral': -8,
  'True Neutral': 0,
  'Chaotic Neutral': 12,
  'Lawful Evil': 2,
  'Neutral Evil': 8,
  'Chaotic Evil': 18,
}

function levelModifier(level: number): number {
  // Low levels are risky (weak), mid levels sweet spot, high levels exponentially dangerous
  if (level <= 3) return 15
  if (level <= 6) return 5
  if (level <= 10) return 0
  if (level <= 15) return 10
  return 20 // level 16–20: you are actively attracting gods as enemies
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function getRiskTier(score: number): RiskTier {
  if (score < 30) return 'Low'
  if (score < 55) return 'Moderate'
  if (score < 75) return 'High'
  return 'Catastrophic'
}

function buildCoverageLines(character: Character, riskTier: RiskTier): CoverageLine[] {
  const multiplier =
    riskTier === 'Low' ? 1 :
    riskTier === 'Moderate' ? 1.8 :
    riskTier === 'High' ? 3.2 :
    6.0

  const base = (gp: number) => Math.round(gp * multiplier)

  const lines: CoverageLine[] = [
    {
      name: 'Death & Resurrection',
      description: 'Covers the cost of a Raise Dead or Resurrection spell. One claim per quarter. Suicide by dragon excluded.',
      premium: base(12),
    },
    {
      name: 'Petrification & Polymorph',
      description: 'Full coverage for involuntary transformation into stone, a newt, or any CR 0 creature.',
      premium: base(8),
    },
    {
      name: 'Third-Party Liability',
      description: 'Covers collateral damage to taverns, villages, and bystanders caught in the blast radius of your decisions.',
      premium: base(15),
    },
    {
      name: 'Cursed Item Removal',
      description: 'Because someone always picks up the glowing sword without identifying it first.',
      premium: base(6),
    },
  ]

  // Add a class-specific line
  const classLine = getClassSpecificLine(character.class, base)
  if (classLine) lines.push(classLine)

  return lines
}

function getClassSpecificLine(cls: CharacterClass, base: (n: number) => number): CoverageLine | null {
  const classLines: Partial<Record<CharacterClass, CoverageLine>> = {
    Wizard: {
      name: 'Arcane Misfire Insurance',
      description: 'Covers damages resulting from spell slots used under pressure, fatigue, or hubris.',
      premium: base(20),
    },
    Barbarian: {
      name: 'Rage Incident Coverage',
      description: 'Liability coverage for property and persons damaged during uncontrolled rage episodes.',
      premium: base(18),
    },
    Rogue: {
      name: 'Wrongful Accusation Defense',
      description: 'Legal representation in jurisdictions that still use trial by combat.',
      premium: base(14),
    },
    Warlock: {
      name: 'Patron Dispute Resolution',
      description: 'Covers soul-related liabilities arising from poorly worded infernal contracts.',
      premium: base(22),
    },
    Bard: {
      name: 'Defamation & Slander',
      description: 'Coverage for legal claims arising from your ballads. Does not cover intentional libel. Probably.',
      premium: base(10),
    },
    Paladin: {
      name: 'Oath Breach Indemnity',
      description: 'One-time coverage if you accidentally become an Oathbreaker. Requires a priest witness.',
      premium: base(9),
    },
    Cleric: {
      name: 'Divine Negligence',
      description: 'Covers situations where your god was clearly not watching. Claim subject to theological review.',
      premium: base(8),
    },
    Druid: {
      name: 'Wildshape Liability',
      description: 'Covers damages caused while in animal form. Bear attacks on allied party members included.',
      premium: base(11),
    },
    Monk: {
      name: 'Unarmed Combat Liability',
      description: 'Because "I am the weapon" is not a valid legal defense in most city-states.',
      premium: base(10),
    },
    Ranger: {
      name: 'Friendly Fire Coverage',
      description: 'Covers arrow-related incidents involving party members, livestock, and innkeepers.',
      premium: base(12),
    },
    Sorcerer: {
      name: 'Wild Magic Surge Cleanup',
      description: 'Emergency restoration services for areas affected by uncontrolled Wild Magic events.',
      premium: base(19),
    },
    Fighter: {
      name: 'Equipment Damage & Loss',
      description: 'Replacement coverage for weapons, armor, and shields destroyed, lost, or fed to a mimic.',
      premium: base(10),
    },
  }

  return classLines[cls] ?? null
}

export function calculateQuote(character: Character): Quote {
  const baseScore = CLASS_RISK[character.class]
  const alignmentMod = ALIGNMENT_MODIFIER[character.alignment]
  const levelMod = levelModifier(character.level)

  const riskScore = clamp(baseScore + alignmentMod + levelMod, 5, 98)
  const riskTier = getRiskTier(riskScore)
  const coverageLines = buildCoverageLines(character, riskTier)
  const totalPremium = coverageLines.reduce((sum, l) => sum + l.premium, 0)

  return {
    riskScore,
    riskTier,
    coverageLines,
    totalPremium,
    aiNarrative: null, // filled in iteration 3
  }
}
