export type OverviewKpi = {
  id: string
  label: string
  value: string
  supportingText: string
  statusLabel: string
  statusTone: 'critical' | 'amber' | 'green' | 'blue' | 'purple'
  sparkline: number[]
  action: 'risk' | 'control' | 'assurance' | 'weak-signal' | 'actions'
  route?: string
}

export type TopRisk = {
  id: string
  name: string
  description: string
  index: number
  trend: string
  controlHealth: 'Degrading' | 'At Risk' | 'Stable'
  mainDriver: string
  route: string
}

export type TrendSeries = {
  label: string
  color: string
  values: number[]
}

export type ControlHealthItem = {
  id: string
  title: string
  status: 'Degrading' | 'At Risk' | 'Stable'
  detail: string
  progress: number
  route: string
}

export type AssuranceBar = {
  label: string
  value: number
}

export type AreaMatrixCell = {
  label: 'High' | 'Med' | 'Low' | 'Watch'
  tone: 'critical' | 'amber' | 'green' | 'blue'
}

export type AreaMatrixRow = {
  area: string
  cells: Record<string, AreaMatrixCell>
}

export type LeadershipFocusItem = {
  id: string
  title: string
  description: string
  role: string
}

export const overviewKpis: OverviewKpi[] = [
  {
    id: 'top-material-risk',
    label: 'Top material risk',
    value: 'Vehicles',
    supportingText: 'Risk index 82/100 - highest exposure',
    statusLabel: 'High - increasing',
    statusTone: 'critical',
    sparkline: [12, 18, 22, 30],
    action: 'risk',
    route: 'vehicle-interaction-north-mine-haul-road',
  },
  {
    id: 'critical-control-health',
    label: 'Critical control health',
    value: '69% stable',
    supportingText: '22% at risk / 9% degrading',
    statusLabel: 'Watch - degrading controls',
    statusTone: 'amber',
    sparkline: [42, 61, 48, 69],
    action: 'control',
  },
  {
    id: 'assurance-alignment',
    label: 'Assurance alignment',
    value: '74%',
    supportingText: 'Target 85% coverage of top risks',
    statusLabel: '2 plan gaps found',
    statusTone: 'blue',
    sparkline: [35, 55, 75, 74],
    action: 'assurance',
  },
  {
    id: 'emerging-weak-signals',
    label: 'Emerging weak signals',
    value: '12',
    supportingText: '4 new signals this period',
    statusLabel: 'AI confidence high',
    statusTone: 'purple',
    sparkline: [16, 40, 38, 49],
    action: 'weak-signal',
  },
  {
    id: 'open-safety-actions',
    label: 'Open safety actions',
    value: '46',
    supportingText: '13 overdue / 7 due this week',
    statusLabel: 'Escalation required',
    statusTone: 'critical',
    sparkline: [80, 65, 55, 46],
    action: 'actions',
  },
]

export const topRisks: TopRisk[] = [
  {
    id: 'vehicle-interaction',
    name: 'Vehicle interaction',
    description: 'Haul roads, light vehicle separation, mobile equipment',
    index: 82,
    trend: '+18%',
    controlHealth: 'Degrading',
    mainDriver: 'Traffic separation exceptions and near-miss increase',
    route: 'vehicle-interaction-north-mine-haul-road',
  },
  {
    id: 'energy-isolation',
    name: 'Energy isolation',
    description: 'Maintenance shutdowns, permits, verification checks',
    index: 76,
    trend: '+9%',
    controlHealth: 'At Risk',
    mainDriver: 'Isolation verification pass rate declined to 71%',
    route: 'energy-isolation',
  },
  {
    id: 'line-of-fire',
    name: 'Line of fire',
    description: 'Fixed plant, suspended loads, stored energy',
    index: 69,
    trend: '+6%',
    controlHealth: 'At Risk',
    mainDriver: 'Repeated LiF observations during maintenance tasks',
    route: 'line-of-fire',
  },
  {
    id: 'working-at-heights',
    name: 'Working at heights',
    description: 'Scaffolds, access platforms, fixed plant work',
    index: 61,
    trend: '0%',
    controlHealth: 'Stable',
    mainDriver: 'Stable controls, minor gap in planned verification',
    route: 'working-at-heights',
  },
]

export const trendSeries: TrendSeries[] = [
  { label: 'Vehicle interaction', color: '#dc2626', values: [64, 66, 65, 67, 73, 78, 82] },
  { label: 'Overall risk index', color: '#2563eb', values: [58, 59, 60, 61, 62, 63, 64] },
  { label: 'Control exceptions', color: '#f59e0b', values: [65, 66, 67, 65, 66, 68, 69] },
]

export const controlHealthItems: ControlHealthItem[] = [
  {
    id: 'traffic-separation',
    title: 'Traffic separation',
    status: 'Degrading',
    detail: 'Pass rate 63%, repeated interface exceptions',
    progress: 58,
    route: 'control-health',
  },
  {
    id: 'isolation-verification',
    title: 'Isolation verification',
    status: 'At Risk',
    detail: 'Pass rate 71%, permit close-out gaps',
    progress: 74,
    route: 'control-health',
  },
  {
    id: 'pre-start-equipment',
    title: 'Pre-start equipment checks',
    status: 'Stable',
    detail: 'Pass rate 89%, stable over 4 weeks',
    progress: 89,
    route: 'control-health',
  },
]

export const assuranceBars: AssuranceBar[] = [
  { label: 'CCV', value: 78 },
  { label: 'CCFV', value: 69 },
  { label: 'LiF', value: 83 },
]

export const areaMatrix: AreaMatrixRow[] = [
  {
    area: 'North Mine',
    cells: {
      vehicles: { label: 'High', tone: 'critical' },
      isolation: { label: 'Med', tone: 'amber' },
      lif: { label: 'Med', tone: 'amber' },
      heights: { label: 'Low', tone: 'green' },
      fatigue: { label: 'Low', tone: 'green' },
    },
  },
  {
    area: 'Rail Loadout',
    cells: {
      vehicles: { label: 'High', tone: 'critical' },
      isolation: { label: 'Low', tone: 'green' },
      lif: { label: 'Med', tone: 'amber' },
      heights: { label: 'Low', tone: 'green' },
      fatigue: { label: 'Watch', tone: 'blue' },
    },
  },
  {
    area: 'Processing Plant',
    cells: {
      vehicles: { label: 'Med', tone: 'amber' },
      isolation: { label: 'High', tone: 'critical' },
      lif: { label: 'High', tone: 'critical' },
      heights: { label: 'Med', tone: 'amber' },
      fatigue: { label: 'Low', tone: 'green' },
    },
  },
  {
    area: 'MEM Workshop',
    cells: {
      vehicles: { label: 'Med', tone: 'amber' },
      isolation: { label: 'Med', tone: 'amber' },
      lif: { label: 'Low', tone: 'green' },
      heights: { label: 'Low', tone: 'green' },
      fatigue: { label: 'Watch', tone: 'blue' },
    },
  },
]

export const leadershipFocusItems: LeadershipFocusItem[] = [
  {
    id: 'traffic-separation',
    title: 'Challenge traffic separation controls',
    description: 'Ask Manager to confirm controls and plan coverage.',
    role: 'Manager',
  },
  {
    id: 'north-mine-leadership',
    title: 'Direct visible leadership to North Mine',
    description: 'Superintendent field presence recommended this fortnight.',
    role: 'SupT',
  },
  {
    id: 'review-actions',
    title: 'Review overdue safety actions',
    description: '13 overdue actions, 5 linked to top two risks.',
    role: 'GM',
  },
]

export const aiSummaryPoints = [
  {
    id: 'movement',
    title: 'Risk movement is concentrated',
    description: 'North Mine haul roads and Rail Loadout show the largest uplift.',
  },
  {
    id: 'controls',
    title: 'Controls need leadership attention',
    description: 'Traffic separation, positive communication and pre-start checks are weakening.',
  },
  {
    id: 'assurance',
    title: 'Assurance plan gap detected',
    description: 'Two high-risk activities have no planned CCFV coverage this week.',
  },
]

export const askAiPrompts = [
  'Summarise the top 3 risks for my leadership meeting.',
  'Why is vehicle interaction increasing?',
  'Which controls are degrading across areas?',
  'What questions should I ask Managers?',
]

const overviewPageData = {
  overviewKpis,
  topRisks,
  trendSeries,
  controlHealthItems,
  assuranceBars,
  areaMatrix,
  leadershipFocusItems,
  aiSummaryPoints,
  askAiPrompts,
}

export default overviewPageData
