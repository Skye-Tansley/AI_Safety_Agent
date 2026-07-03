export type RiskDetail = {
  id: string
  name: string
  riskIndex: number
  trendPct: number
  severity: 'High' | 'Medium' | 'Low'
  controlHealth: 'Degrading' | 'At Risk' | 'Stable'
  assuranceCoverage: number
  relatedEvents: number
  openActions: number
  primaryDriver: string
}

export const risks: RiskDetail[] = [
  {
    id: 'vehicle-interaction',
    name: 'Vehicle Interaction',
    riskIndex: 82,
    trendPct: 14,
    severity: 'High',
    controlHealth: 'Degrading',
    assuranceCoverage: 68,
    relatedEvents: 9,
    openActions: 5,
    primaryDriver:
      'Near-miss language and reduced traffic separation verification completion in Load & Haul and contractor road movements.',
  },
  {
    id: 'energy-isolation',
    name: 'Energy Isolation',
    riskIndex: 76,
    trendPct: 9,
    severity: 'High',
    controlHealth: 'At Risk',
    assuranceCoverage: 71,
    relatedEvents: 6,
    openActions: 4,
    primaryDriver: 'Inconsistent isolation confirmation checks and overdue corrective actions in maintenance work areas.',
  },
  {
    id: 'line-of-fire',
    name: 'Line of Fire',
    riskIndex: 79,
    trendPct: 11,
    severity: 'High',
    controlHealth: 'At Risk',
    assuranceCoverage: 70,
    relatedEvents: 7,
    openActions: 3,
    primaryDriver: 'Increased observations of people entering potential line of fire zones during routine work.',
  },
  {
    id: 'working-at-heights',
    name: 'Working at Heights',
    riskIndex: 64,
    trendPct: 3,
    severity: 'Medium',
    controlHealth: 'Stable',
    assuranceCoverage: 83,
    relatedEvents: 4,
    openActions: 2,
    primaryDriver: 'Exposure is increasing due to planned work, but controls are currently stable.',
  },
  {
    id: 'lifting-and-cranage',
    name: 'Lifting & Cranage',
    riskIndex: 59,
    trendPct: -4,
    severity: 'Medium',
    controlHealth: 'Stable',
    assuranceCoverage: 88,
    relatedEvents: 3,
    openActions: 1,
    primaryDriver: 'Risk trend is improving, with no major recent weak signal increase.',
  },
  {
    id: 'contractor-road-movements',
    name: 'Contractor Road Movements',
    riskIndex: 72,
    trendPct: 8,
    severity: 'Medium',
    controlHealth: 'At Risk',
    assuranceCoverage: 69,
    relatedEvents: 5,
    openActions: 2,
    primaryDriver:
      'Increased field notes around unfamiliar routes, time pressure and road condition concerns.',
  },
]

export default risks
