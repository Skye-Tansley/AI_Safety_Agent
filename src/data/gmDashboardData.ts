import type { AreaOption, NotificationItem, RecommendationAction, RiskLensOption, SiteOption, TimeframeOption, TopRisk, WeakSignal } from '../types/dashboard'

export const siteOptions: SiteOption[] = [
  { value: 'all', label: 'All Pilbara Sites' },
  { value: 'gudai', label: 'Gudai-Darri' },
  { value: 'brockman', label: 'Brockman' },
  { value: 'west', label: 'West Angelas' },
  { value: 'yandi', label: 'Yandicoogina' },
  { value: 'tom', label: 'Tom Price' },
]

export const areaOptionsBySite: Record<string, AreaOption[]> = {
  all: [
    { value: 'all', label: 'All areas' },
    { value: 'mine', label: 'Mine Operations' },
    { value: 'plant', label: 'Fixed Plant' },
    { value: 'processing', label: 'Processing' },
    { value: 'rail', label: 'Rail' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'port', label: 'Port / Logistics' },
  ],
  gudai: [
    { value: 'all', label: 'All areas' },
    { value: 'haul', label: 'Load & Haul' },
    { value: 'drill', label: 'Drill & Blast' },
    { value: 'workshop', label: 'Maintenance Workshop' },
    { value: 'processing', label: 'Processing Plant' },
    { value: 'rom', label: 'ROM / Crushing' },
    { value: 'contractor', label: 'Contractor Work Areas' },
  ],
  brockman: [
    { value: 'all', label: 'All areas' },
    { value: 'haul', label: 'Load & Haul' },
    { value: 'drill', label: 'Drill & Blast' },
    { value: 'workshop', label: 'Maintenance Workshop' },
    { value: 'processing', label: 'Processing Plant' },
    { value: 'rom', label: 'ROM / Crushing' },
    { value: 'contractor', label: 'Contractor Work Areas' },
  ],
  west: [
    { value: 'all', label: 'All areas' },
    { value: 'haul', label: 'Load & Haul' },
    { value: 'drill', label: 'Drill & Blast' },
    { value: 'workshop', label: 'Maintenance Workshop' },
    { value: 'processing', label: 'Processing Plant' },
    { value: 'rom', label: 'ROM / Crushing' },
    { value: 'contractor', label: 'Contractor Work Areas' },
  ],
  yandi: [
    { value: 'all', label: 'All areas' },
    { value: 'haul', label: 'Load & Haul' },
    { value: 'drill', label: 'Drill & Blast' },
    { value: 'workshop', label: 'Maintenance Workshop' },
    { value: 'processing', label: 'Processing Plant' },
    { value: 'rom', label: 'ROM / Crushing' },
    { value: 'contractor', label: 'Contractor Work Areas' },
  ],
  tom: [
    { value: 'all', label: 'All areas' },
    { value: 'haul', label: 'Load & Haul' },
    { value: 'drill', label: 'Drill & Blast' },
    { value: 'workshop', label: 'Maintenance Workshop' },
    { value: 'processing', label: 'Processing Plant' },
    { value: 'rom', label: 'ROM / Crushing' },
    { value: 'contractor', label: 'Contractor Work Areas' },
  ],
}

export const timeframeOptions: TimeframeOption[] = [
  { value: 'week', label: 'This week' },
  { value: 'last-week', label: 'Last week' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'custom', label: 'Custom' },
]

export const riskLensOptions: RiskLensOption[] = [
  { value: 'fatal-injury', label: 'Fatal + Injury Combined' },
  { value: 'fatal', label: 'Fatal Risk Only' },
  { value: 'injury', label: 'Injury Risk Only' },
  { value: 'controls', label: 'Critical Controls' },
  { value: 'behavior', label: 'LiF / Behaviour Themes' },
  { value: 'assurance', label: 'Assurance Coverage' },
]

export const topRisks: TopRisk[] = [
  {
    id: 'vehicle-interaction',
    name: 'Vehicle interaction',
    severity: 'High',
    trend: 'Increasing',
    controlHealth: 'Degrading',
    affectedAreas: ['Load & Haul', 'ROM', 'Contractor Roads'],
    recommendedAction: 'Manager review required',
    whyFlagged: 'Repeated traffic separation observations and rising near-miss reports are increasing exposure.',
    evidenceSignals: ['Blind spot near-miss wording', 'Lower verification completion', 'Road movement observations'],
    controls: ['Traffic separation verification', 'Light vehicle exclusion zones', 'Site speed management'],
    gmActions: ['Open Risk Detail', 'Open Control Health', 'Request Manager review'],
  },
  {
    id: 'energy-isolation',
    name: 'Energy isolation',
    severity: 'High',
    trend: 'Increasing',
    controlHealth: 'At Risk',
    affectedAreas: ['Maintenance Workshop', 'Fixed Plant'],
    recommendedAction: 'Validate isolation checks',
    whyFlagged: 'Isolation verification completion is slipping in maintenance windows and shutdowns.',
    evidenceSignals: ['Incomplete isolation confirmation', 'Work pack review gaps', 'Permit handover issues'],
    controls: ['Isolation verification', 'Permit-to-work checks', 'Shutdown readiness'],
    gmActions: ['Open Risk Detail', 'Open Control Health', 'Request Manager review'],
  },
  {
    id: 'working-at-heights',
    name: 'Working at heights',
    severity: 'Medium',
    trend: 'Stable',
    controlHealth: 'At Risk',
    affectedAreas: ['Processing Plant'],
    recommendedAction: 'Field verification',
    whyFlagged: 'Edge protection checks are mixed and coaching completion is inconsistent.',
    evidenceSignals: ['Protection verification lag', 'Observation frequency down', 'Task risk review variability'],
    controls: ['Edge protection verification', 'Permit controls', 'Anchor point checks'],
    gmActions: ['Open Risk Detail', 'Open Control Health', 'Request Manager review'],
  },
  {
    id: 'lifting-and-cranage',
    name: 'Lifting and cranage',
    severity: 'Medium',
    trend: 'Decreasing',
    controlHealth: 'Stable',
    affectedAreas: ['Maintenance', 'Shutdown Work'],
    recommendedAction: 'Monitor',
    whyFlagged: 'This risk remains steady with fewer adverse observations over the period.',
    evidenceSignals: ['Stable lift planning', 'Improved pre-start checks', 'Lower incident rates'],
    controls: ['Lift plan verification', 'Lift team briefing', 'Load test records'],
    gmActions: ['Open Risk Detail', 'Open Control Health', 'Request Manager review'],
  },
  {
    id: 'line-of-fire',
    name: 'Line of fire exposure',
    severity: 'High',
    trend: 'Increasing',
    controlHealth: 'At Risk',
    affectedAreas: ['Load & Haul', 'Maintenance', 'Processing'],
    recommendedAction: 'Leadership coaching focus',
    whyFlagged: 'Field observations point to increased exposure around mobile equipment and exclusion zones.',
    evidenceSignals: ['Coaching observations rising', 'Exclusion zone concerns', 'Near-miss wording on blind spots'],
    controls: ['Exclusion zone compliance', 'Spotter controls', 'Mobile plant interaction'],
    gmActions: ['Open Risk Detail', 'Open Control Health', 'Request Manager review'],
  },
]

export const weakSignals: WeakSignal[] = [
  {
    id: 'blind-spot',
    title: 'Increase in near-miss wording around “blind spot” and “light vehicle”',
    detail: 'Vehicle interaction signals are rising in field notes and incident narratives.',
    severity: 'High',
  },
  {
    id: 'pedestrian',
    title: 'Repeated observations for pedestrians near mobile equipment',
    detail: 'The issue is concentrated around haul roads and contractor movement points.',
    severity: 'High',
  },
  {
    id: 'contractor-verification',
    title: 'Verification completion dropped in contractor work areas',
    detail: 'Verification quality has reduced in more dynamic contractor zones.',
    severity: 'Medium',
  },
  {
    id: 'line-of-fire-coaching',
    title: 'Line of fire coaching observations increasing',
    detail: 'Coaching activity is higher but the underlying risk signals remain elevated.',
    severity: 'Medium',
  },
  {
    id: 'fatigue',
    title: 'Fatigue/time pressure comments appearing in field notes',
    detail: 'Field notes suggest operational pressure is contributing to weaker controls.',
    severity: 'Medium',
  },
]

export const leadershipActions: RecommendationAction[] = [
  {
    id: 'traffic-assurance',
    title: 'Ask Manager to review traffic separation assurance coverage',
    detail: 'Confirm whether current assurance plans cover contractor road movements and load & haul interfaces.',
    primaryAction: 'Add to meeting',
  },
  {
    id: 'visible-leadership',
    title: 'Ask Superintendent to increase visible leadership in Load & Haul',
    detail: 'Prioritise field time around mobile equipment and pedestrian separation.',
    primaryAction: 'Assign follow-up',
  },
  {
    id: 'overdue-actions',
    title: 'Confirm overdue actions have owners before next safety meeting',
    detail: 'Three overdue items require active ownership and closure dates this week.',
    primaryAction: 'Mark as reviewed',
  },
]

export const notifications: NotificationItem[] = [
  { id: 'notify-1', priority: 'High', title: 'Vehicle interaction risk increased across two operating areas', actionLabel: 'Open insight' },
  { id: 'notify-2', priority: 'High', title: 'Traffic separation control moved from At Risk to Degrading', actionLabel: 'Open control detail' },
  { id: 'notify-3', priority: 'Medium', title: 'Assurance plan under-covers two current top risks', actionLabel: 'Open assurance oversight' },
  { id: 'notify-4', priority: 'Company-wide', title: 'Line of fire focus message issued for this week', actionLabel: 'View message' },
  { id: 'notify-5', priority: 'Positive', title: 'Energy isolation verification improved at West Angelas', actionLabel: 'View trend' },
]
