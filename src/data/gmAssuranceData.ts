export type AssuranceRow = {
  id: string
  risk: string
  currentRiskLevel: 'High' | 'Medium'
  movement: string
  plannedCoverage: number
  targetCoverage: number
  gap: number
  status: 'Under-covered' | 'Watch' | 'Covered'
  challenge: string
  linkedRiskId: string
}

export const assuranceRows: AssuranceRow[] = [
  {
    id: 'vehicle-interaction',
    risk: 'Vehicle interaction',
    currentRiskLevel: 'High',
    movement: '+14%',
    plannedCoverage: 68,
    targetCoverage: 85,
    gap: -17,
    status: 'Under-covered',
    challenge: 'Confirm traffic separation and contractor road checks are scheduled',
    linkedRiskId: 'vehicle-interaction',
  },
  {
    id: 'line-of-fire',
    risk: 'Line of fire',
    currentRiskLevel: 'High',
    movement: '+11%',
    plannedCoverage: 70,
    targetCoverage: 85,
    gap: -15,
    status: 'Under-covered',
    challenge: 'Add field coaching and exclusion zone verification',
    linkedRiskId: 'line-of-fire',
  },
  {
    id: 'energy-isolation',
    risk: 'Energy isolation',
    currentRiskLevel: 'High',
    movement: '+9%',
    plannedCoverage: 79,
    targetCoverage: 85,
    gap: -6,
    status: 'Watch',
    challenge: 'Validate isolation confirmation process',
    linkedRiskId: 'energy-isolation',
  },
  {
    id: 'working-at-heights',
    risk: 'Working at heights',
    currentRiskLevel: 'Medium',
    movement: '+3%',
    plannedCoverage: 83,
    targetCoverage: 80,
    gap: 3,
    status: 'Covered',
    challenge: 'Monitor shutdown exposure',
    linkedRiskId: 'working-at-heights',
  },
  {
    id: 'lifting-and-cranage',
    risk: 'Lifting and cranage',
    currentRiskLevel: 'Medium',
    movement: '-4%',
    plannedCoverage: 88,
    targetCoverage: 80,
    gap: 8,
    status: 'Covered',
    challenge: 'Maintain current coverage',
    linkedRiskId: 'lifting-and-cranage',
  },
]

export const assuranceGaps = [
  {
    id: 'gap-1',
    title: 'Contractor road movements',
    linkedRisk: 'Vehicle interaction',
    reason: 'Not enough verification in current plan',
    suggestedActivity: 'Add CCFV for contractor traffic separation',
    priority: 'High',
  },
  {
    id: 'gap-2',
    title: 'Night shift traffic separation',
    linkedRisk: 'Vehicle interaction',
    reason: 'Increased risk signals but limited planned checks',
    suggestedActivity: 'Add CCV for night shift road interaction',
    priority: 'High',
  },
  {
    id: 'gap-3',
    title: 'Exclusion zone field coaching',
    linkedRisk: 'Line of fire',
    reason: 'Behaviour theme increasing',
    suggestedActivity: 'Add superintendent field coaching focus',
    priority: 'Medium',
  },
  {
    id: 'gap-4',
    title: 'Isolation confirmation quality',
    linkedRisk: 'Energy isolation',
    reason: 'Verification results declining',
    suggestedActivity: 'Add targeted CCV in maintenance workshop',
    priority: 'Medium',
  },
]

export const assuranceSchedule = [
  { id: 'week1-1', type: 'CCV', risk: 'Traffic separation verification', area: 'Load & Haul', owner: 'Mine Ops Manager', status: 'Planned', linkedRiskId: 'vehicle-interaction' },
  { id: 'week1-2', type: 'CCFV', risk: 'Leadership field verification', area: 'Contractor roads', owner: 'Contractor Manager', status: 'Needs owner', linkedRiskId: 'vehicle-interaction' },
  { id: 'week1-3', type: 'CCV', risk: 'Energy isolation confirmation', area: 'Maintenance Workshop', owner: 'Maintenance Manager', status: 'Planned', linkedRiskId: 'energy-isolation' },
  { id: 'week1-4', type: 'CCFV', risk: 'Line of fire coaching', area: 'Processing', owner: 'Processing Manager', status: 'Planned', linkedRiskId: 'line-of-fire' },
  { id: 'week2-1', type: 'CCV', risk: 'Exclusion zone compliance', area: 'Lifting activities', owner: 'Processing Manager', status: 'Planned', linkedRiskId: 'line-of-fire' },
  { id: 'week2-2', type: 'CCFV', risk: 'Night shift traffic separation', area: 'ROM', owner: 'Mine Ops Manager', status: 'Due', linkedRiskId: 'vehicle-interaction' },
  { id: 'week2-3', type: 'CCV', risk: 'Permit to work verification', area: 'Fixed Plant', owner: 'Maintenance Manager', status: 'Planned', linkedRiskId: 'energy-isolation' },
  { id: 'week2-4', type: 'CCFV', risk: 'Working at heights field verification', area: 'Processing Plant', owner: 'Processing Manager', status: 'Planned', linkedRiskId: 'working-at-heights' },
]

export const accountabilityRows = [
  { id: 'ops', manager: 'Mine Operations Manager', status: 'Review required', coverage: 69, openGaps: 2, overdue: 2, nextAction: 'Confirm vehicle interaction coverage' },
  { id: 'proc', manager: 'Processing Manager', status: 'On track', coverage: 82, openGaps: 1, overdue: 0, nextAction: 'Monitor line of fire coaching' },
  { id: 'maint', manager: 'Maintenance Manager', status: 'Watch', coverage: 76, openGaps: 1, overdue: 1, nextAction: 'Review isolation confirmation' },
  { id: 'contractor', manager: 'Contractor Management', status: 'Review required', coverage: 64, openGaps: 2, overdue: 0, nextAction: 'Add contractor road verification' },
]

export const assuranceEvidence = [
  { id: 'e1', title: 'Vehicle interaction risk index up 14%', detail: 'The highest movement risk is currently linked to traffic separation and contractor roads.', severity: 'High' },
  { id: 'e2', title: 'Traffic separation verification down 18%', detail: 'Verification completion is lagging in Load & Haul and contractor roads.', severity: 'High' },
  { id: 'e3', title: 'Line of fire observations increased across two areas', detail: 'Field observations indicate more exposure around exclusion zones.', severity: 'Medium' },
  { id: 'e4', title: 'Assurance activity not aligned to contractor road movement risk', detail: 'Current plan still lacks direct checks in contractor movement hotspots.', severity: 'High' },
  { id: 'e5', title: '3 overdue assurance items linked to top material risks', detail: 'Several assurance follow-ups remain unassigned or overdue.', severity: 'Medium' },
]

export default assuranceRows
