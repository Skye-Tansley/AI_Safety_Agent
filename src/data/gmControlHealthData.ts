export type ControlHealthRow = {
  id: string
  control: string
  linkedRisk: string
  health: 'Stable' | 'At Risk' | 'Degrading'
  trend: 'Improving' | 'Stable' | 'Worsening'
  verification: number
  areas: string
  openActions: number
  recommendedAction: string
  why: string
  evidence: string[]
  linkedRiskId: string
}

export const controlHealthRows: ControlHealthRow[] = [
  {
    id: 'traffic-separation',
    control: 'Traffic separation verification',
    linkedRisk: 'Vehicle interaction',
    health: 'Degrading',
    trend: 'Worsening',
    verification: 61,
    areas: 'Load & Haul, Contractor Roads, ROM',
    openActions: 4,
    recommendedAction: 'Manager review required',
    why: 'Verification completion has dropped and near-miss language is rising around blind spots and light vehicles.',
    evidence: ['Verification completion down 18%', '3 near-miss reports mention traffic separation', '4 overdue traffic management actions'],
    linkedRiskId: 'vehicle-interaction',
  },
  {
    id: 'isolation-confirmation',
    control: 'Isolation confirmation checks',
    linkedRisk: 'Energy isolation',
    health: 'Degrading',
    trend: 'Worsening',
    verification: 64,
    areas: 'Maintenance Workshop, Fixed Plant',
    openActions: 3,
    recommendedAction: 'Validate isolation process',
    why: 'Sign-off steps are missing from field verification notes and corrective actions remain overdue.',
    evidence: ['Missed sign-off steps in field verification', '2 overdue corrective actions', 'Maintenance work orders linked to isolation planning'],
    linkedRiskId: 'energy-isolation',
  },
  {
    id: 'exclusion-zones',
    control: 'Exclusion zone compliance',
    linkedRisk: 'Line of fire',
    health: 'At Risk',
    trend: 'Worsening',
    verification: 72,
    areas: 'Processing, Lifting activities',
    openActions: 2,
    recommendedAction: 'Superintendent field coaching',
    why: 'Line of fire observations have increased and coaching conversations are inconsistent across crews.',
    evidence: ['8 observations mention body positioning', '4 coaching records mention exclusion awareness', 'Related to vehicle and lifting risk'],
    linkedRiskId: 'line-of-fire',
  },
  {
    id: 'fatigue-checks',
    control: 'Fatigue management checks',
    linkedRisk: 'Vehicle interaction / fitness for work',
    health: 'At Risk',
    trend: 'Stable',
    verification: 78,
    areas: 'Night shift, Contractor Roads',
    openActions: 2,
    recommendedAction: 'Monitor and review weak signals',
    why: 'Field notes are showing increased time pressure and fatigue language during shift change.',
    evidence: ['Increase in time pressure wording', 'Two reports mention unfamiliar road rules', 'Verification completion inconsistent'],
    linkedRiskId: 'contractor-road-movements',
  },
  {
    id: 'permit-to-work',
    control: 'Permit to work verification',
    linkedRisk: 'Energy isolation / maintenance work',
    health: 'At Risk',
    trend: 'Improving',
    verification: 81,
    areas: 'Fixed Plant, Shutdown planning',
    openActions: 1,
    recommendedAction: 'Continue monitoring',
    why: 'Verification is improving but still needs follow-up in shutdown planning.',
    evidence: ['Verification trending up', 'One overdue action remains', 'No repeat control failure signal'],
    linkedRiskId: 'energy-isolation',
  },
]

export const controlSignals = [
  { id: 'signal-1', title: 'Verification completion dropped 18% in Load & Haul', detail: 'Traffic separation verification is below target and linked to vehicle interaction risk.', severity: 'High' },
  { id: 'signal-2', title: '5 LiF observations linked to mobile equipment interaction', detail: 'Field observations indicate repeated exposure around interaction zones.', severity: 'High' },
  { id: 'signal-3', title: '3 near-miss reports reference traffic separation or blind spots', detail: 'Near-miss themes are consistent with poor separation controls.', severity: 'Medium' },
  { id: 'signal-4', title: '4 overdue actions linked to traffic management', detail: 'Leadership follow-up is still required to close the action backlog.', severity: 'High' },
  { id: 'signal-5', title: 'Repeat isolation confirmation issues in maintenance work areas', detail: 'Verification notes continue to show missed sign-off steps.', severity: 'Medium' },
]

export const controlHealthTrend = [74, 72, 70, 68]

export const controlHealthDisposition = {
  stable: 34,
  atRisk: 12,
  degrading: 4,
}

export default controlHealthRows
