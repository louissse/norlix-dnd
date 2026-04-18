export type RiskTier = 'Low' | 'Moderate' | 'High' | 'Catastrophic'

export interface CoverageLine {
  name: string
  description: string
  premium: number // gp/month
}

export interface Quote {
  riskTier: RiskTier
  riskScore: number // 0–100
  coverageLines: CoverageLine[]
  totalPremium: number // gp/month
  aiNarrative: string | null
}
