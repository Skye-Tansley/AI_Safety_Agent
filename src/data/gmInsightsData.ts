export type InsightSeverity = 'High' | 'Medium' | 'Monitor' | 'Low'
export type InsightStatus = 'Decision required' | 'Plan review' | 'Assurance gap' | 'Emerging risk' | 'Monitor' | 'Stable'
export type InsightConfidence = 'High' | 'Medium' | 'Low'

export type Insight = {
  id: string
  category: string
  filterGroup: 'decision' | 'risk' | 'control' | 'behaviour' | 'weak' | 'assurance'
  title: string
  severity: InsightSeverity
  confidence: InsightConfidence
  status: InsightStatus
  site: string
  area: string
  whatChanged: string
  whyFlagged: string
  metrics: Array<{ label: string; value: string }>
  tags: string[]
  updated: string
  primaryActionLabel: string
  primaryActionTarget: 'risk' | 'control' | 'assurance' | 'insight'
  routeId?: string
  supportActions: string[]
}

export type KpiCardDefinition = {
  id: string
  title: string
  value: string
  supportingText: string
  badge: string
  sparkline: number[]
  filterGroup: 'all' | 'decision' | 'risk' | 'control' | 'behaviour' | 'weak' | 'assurance'
  detail: string
}

export type InsightTabDefinition = {
  id: 'all' | 'decision' | 'risk' | 'control' | 'behaviour' | 'weak' | 'assurance'
  label: string
  count: number
}

export type EvidenceTileDefinition = {
  id: string
  name: string
  count: string
  detail: string
  badge: string
}

export type LeadershipQuestion = {
  id: string
  title: string
  text: string
  tag: string
}

export type BottomSummaryCard = {
  id: string
  title: string
  subtitle: string
  items: Array<{ label: string; value: string; tone: 'critical' | 'amber' | 'blue' | 'green' | 'purple' }>
}

export const kpiCards: KpiCardDefinition[] = [
  {
    id: 'new-insights',
    title: 'New Insights',
    value: '12 total',
    supportingText: '6 new since last review',
    badge: 'Across all sites',
    sparkline: [18, 24, 26, 29],
    filterGroup: 'all',
    detail: 'Signal volume is building across the current GM focus areas.',
  },
  {
    id: 'decision-required',
    title: 'Decision Required',
    value: '3',
    supportingText: 'Needs leadership direction',
    badge: 'Review this week',
    sparkline: [10, 12, 13, 15],
    filterGroup: 'decision',
    detail: 'Three insights need explicit GM direction this week.',
  },
  {
    id: 'emerging-risks',
    title: 'Emerging Risks',
    value: '4',
    supportingText: 'Weak signals detected',
    badge: '2 high confidence',
    sparkline: [8, 11, 10, 14],
    filterGroup: 'risk',
    detail: 'The strongest new movement is concentrated in vehicle interaction and control degradation.',
  },
  {
    id: 'degrading-controls',
    title: 'Degrading Controls',
    value: '7',
    supportingText: '3 linked to top material risks',
    badge: 'Traffic + Isolation',
    sparkline: [13, 11, 9, 7],
    filterGroup: 'control',
    detail: 'Control performance is declining in traffic separation and isolation verification.',
  },
  {
    id: 'assurance-gaps',
    title: 'Assurance Gaps',
    value: '2',
    supportingText: 'Top risks not fully covered',
    badge: 'Plan alignment 74%',
    sparkline: [6, 7, 8, 7],
    filterGroup: 'assurance',
    detail: 'Assurance activity is not yet aligned to the fastest-moving risks.',
  },
]

export const insightTabs: InsightTabDefinition[] = [
  { id: 'all', label: 'All insights', count: 12 },
  { id: 'decision', label: 'Decision required', count: 3 },
  { id: 'risk', label: 'Risk increasing', count: 4 },
  { id: 'control', label: 'Control health', count: 7 },
  { id: 'behaviour', label: 'Behaviour themes', count: 5 },
  { id: 'weak', label: 'Weak signals', count: 6 },
  { id: 'assurance', label: 'Assurance gaps', count: 2 },
]

export const insights: Insight[] = [
  {
    id: 'ins-vehicle-1',
    category: 'Risk increasing - material risk',
    filterGroup: 'risk',
    title: 'Vehicle interaction risk is increasing across rail interface and mobile equipment areas',
    severity: 'High',
    confidence: 'High',
    status: 'Decision required',
    site: 'All Pilbara sites',
    area: 'Rail interface',
    whatChanged: 'Risk index increased +18% over 30 days with repeated traffic separation observations, two near misses and lower verification pass rates on night shift routes.',
    whyFlagged: 'Incident, LiF and CCFV signals are pointing to the same control weakness: inconsistent separation between light vehicles, haul trucks and mobile plant during peak handover windows.',
    metrics: [
      { label: 'CCFV fail rate', value: '31%' },
      { label: 'LiF observations', value: '5' },
      { label: 'Near misses', value: '2' },
      { label: 'Risk trend', value: '+18%' },
    ],
    tags: ['Ops Manager', 'Rail interface'],
    updated: 'Updated 42 min ago',
    primaryActionLabel: 'Open Risk Detail',
    primaryActionTarget: 'risk',
    routeId: 'vehicle-interaction-north-mine-haul-road',
    supportActions: ['Ask AI', 'Add to meeting'],
  },
  {
    id: 'ins-isolation-1',
    category: 'Control health - at risk',
    filterGroup: 'control',
    title: 'Isolation and energy control checks are trending down during fixed plant shutdown work',
    severity: 'Medium',
    confidence: 'High',
    status: 'Plan review',
    site: 'Brockman',
    area: 'Fixed Plant',
    whatChanged: 'Lock-box verification and permit-to-work checks show declining pass rates over three weeks, concentrated around shutdown preparation and handback tasks.',
    whyFlagged: 'The same control appears in recent assurance misses, supervisor observations and corrective actions that have remained open for more than 14 days.',
    metrics: [
      { label: 'Control health', value: '74%' },
      { label: 'Open actions', value: '9' },
      { label: 'Trend vs prior', value: '-11%' },
      { label: 'Areas affected', value: '3' },
    ],
    tags: ['Manager Fixed Plant', 'Shutdown Planning'],
    updated: 'Updated 2 hrs ago',
    primaryActionLabel: 'Open Control Health',
    primaryActionTarget: 'control',
    supportActions: ['Ask AI', 'Add to meeting'],
  },
  {
    id: 'ins-assurance-1',
    category: 'Assurance gap - coverage alignment',
    filterGroup: 'assurance',
    title: 'Current assurance plan does not fully cover the two fastest-moving material risks',
    severity: 'High',
    confidence: 'High',
    status: 'Assurance gap',
    site: 'All Pilbara sites',
    area: 'Cross-site',
    whatChanged: 'Planned CCV / CCFV activities cover 74% of top risks, but vehicle interaction and isolation controls have lower planned field checks than their risk movement suggests.',
    whyFlagged: 'Risk weighting has shifted faster than the assurance schedule. Two high-priority controls have limited planned verification coverage for the next fortnight.',
    metrics: [
      { label: 'Plan coverage', value: '74%' },
      { label: 'Coverage gaps', value: '2' },
      { label: 'CCFV suggested', value: '6' },
      { label: 'CCV suggested', value: '4' },
    ],
    tags: ['HSE Manager', 'Assurance Lead'],
    updated: 'Updated today',
    primaryActionLabel: 'View Assurance Plan',
    primaryActionTarget: 'assurance',
    supportActions: ['Ask AI', 'Add to meeting'],
  },
  {
    id: 'ins-lif-1',
    category: 'Behaviour theme - weak signal',
    filterGroup: 'behaviour',
    title: 'Line of fire positioning is appearing as a repeat theme across maintenance and lifting activities',
    severity: 'Monitor',
    confidence: 'Medium',
    status: 'Emerging risk',
    site: 'Gudai-Darri',
    area: 'Maintenance',
    whatChanged: 'Coaching observations mention body positioning and spotter communication more frequently, especially during breakdown response and unplanned maintenance.',
    whyFlagged: 'LiF themes are increasing before injury events. The pattern is not yet severe but is becoming consistent enough to warrant leadership coaching focus.',
    metrics: [
      { label: 'LiF mentions', value: '14' },
      { label: 'Theme increase', value: '+22%' },
      { label: 'Serious events', value: '0' },
      { label: 'Teams affected', value: '4' },
    ],
    tags: ['Superintendents', 'Maintenance'],
    updated: 'Updated today',
    primaryActionLabel: 'Open Insight',
    primaryActionTarget: 'insight',
    supportActions: ['Ask AI', 'Add to meeting'],
  },
  {
    id: 'ins-contractor-1',
    category: 'Weak signal - contractor movement',
    filterGroup: 'weak',
    title: 'Contractor road movement behaviour is creating weak movement signals around fatigue and route clarity',
    severity: 'Medium',
    confidence: 'Medium',
    status: 'Emerging risk',
    site: 'West Angelas',
    area: 'Contractor roads',
    whatChanged: 'Field notes mention increasing time pressure, changing road conditions, and shorter handover windows during contractor shift changes.',
    whyFlagged: 'The pattern is not yet severe but it is recurring in contractor-facing observations and verification lag.',
    metrics: [
      { label: 'Observations', value: '9' },
      { label: 'Shift change risk', value: '+14%' },
      { label: 'Verification lag', value: '18%' },
      { label: 'Teams affected', value: '2' },
    ],
    tags: ['Superintendent', 'Contractors'],
    updated: 'Updated 6 hrs ago',
    primaryActionLabel: 'Open Insight',
    primaryActionTarget: 'insight',
    supportActions: ['Ask AI', 'Add to meeting'],
  },
  {
    id: 'ins-positive-1',
    category: 'Positive movement - stable control',
    filterGroup: 'control',
    title: 'Energy isolation verification is improving steadily at West Angelas',
    severity: 'Low',
    confidence: 'High',
    status: 'Stable',
    site: 'West Angelas',
    area: 'Fixed Plant',
    whatChanged: 'Verification completion improved by 12% over the last 30 days and repeat coaching has reduced.',
    whyFlagged: 'This is a positive movement signal and is useful for sharing practice with other operations.',
    metrics: [
      { label: 'Verification uplift', value: '+12%' },
      { label: 'Repeat coaching', value: '-8%' },
      { label: 'Open actions', value: '0' },
      { label: 'Site spread', value: '1' },
    ],
    tags: ['Maintenance lead', 'West Angelas'],
    updated: 'Updated yesterday',
    primaryActionLabel: 'Open Control Health',
    primaryActionTarget: 'control',
    supportActions: ['Ask AI', 'Add to meeting'],
  },
]

export const evidenceTiles: EvidenceTileDefinition[] = [
  { id: 'incidents', name: 'Incidents', count: '12 relevant events', detail: 'Near-miss and injury language aligned with current trend movement.', badge: 'I' },
  { id: 'ccfv', name: 'CCFV results', count: '124 control checks', detail: 'Field evidence shows lower verification confidence in the highest-risk locations.', badge: 'C' },
  { id: 'lif', name: 'LiF themes', count: '58 observations', detail: 'Repeat themes around positioning, blind spots and communication are emerging.', badge: 'L' },
  { id: 'assurance', name: 'Assurance', count: '32 planned activities', detail: 'Assurance coverage is not tracking the fastest-moving risk profile.', badge: 'A' },
  { id: 'schedule', name: 'Work schedule', count: '11 high-risk tasks', detail: 'Standalone tasks are increasing the exposure footprint for the next fortnight.', badge: 'W' },
  { id: 'actions', name: 'Open actions', count: '27 follow-ups', detail: 'Several corrective actions remain overdue and appear in the same themes.', badge: 'O' },
]

export const leadershipQuestions: LeadershipQuestion[] = [
  { id: 'traffic-separation', title: 'Traffic separation', text: 'What has changed in route layout, handover timing or verification quality?', tag: 'Ops' },
  { id: 'isolation-controls', title: 'Isolation controls', text: 'Which shutdown activities have the lowest verification confidence?', tag: 'Plant' },
  { id: 'assurance-coverage', title: 'Assurance coverage', text: 'How will the next plan be adjusted to match the current top risks?', tag: 'HSE' },
  { id: 'field-leadership', title: 'Field leadership', text: 'Where do Superintendents need to be visible this fortnight?', tag: 'SupT' },
]

export const bottomSummaryCards: BottomSummaryCard[] = [
  {
    id: 'risk-movement',
    title: 'Risk movement by category',
    subtitle: 'Shows where the largest AI-detected movement is occurring across fatal and injury risk groups.',
    items: [
      { label: 'Vehicle interaction', value: 'Strongest movement', tone: 'critical' },
      { label: 'Isolation', value: 'Medium movement', tone: 'amber' },
      { label: 'Line of fire', value: 'Increasing', tone: 'blue' },
      { label: 'Working at heights', value: 'Monitoring', tone: 'green' },
    ],
  },
  {
    id: 'insight-status',
    title: 'Insight status',
    subtitle: 'GM view prioritises high-confidence insights with a clear leadership action or escalation path.',
    items: [
      { label: 'Open', value: '7', tone: 'critical' },
      { label: 'Assigned', value: '3', tone: 'amber' },
      { label: 'Closed', value: '2', tone: 'green' },
    ],
  },
  {
    id: 'navigation-targets',
    title: 'Navigation targets',
    subtitle: 'Each insight links to the evidence page needed for leadership decision.',
    items: [
      { label: 'Risk Detail', value: 'Open', tone: 'blue' },
      { label: 'Control Health', value: 'Open', tone: 'purple' },
      { label: 'Assurance Plan', value: 'Open', tone: 'amber' },
      { label: 'Ask AI', value: 'Open', tone: 'green' },
    ],
  },
]

export const suggestedAskPrompts = [
  'Summarise the top three insights for my SLT meeting',
  'Why is vehicle interaction risk increasing?',
  'Which controls should I challenge my team on?',
  'What changed since last week?',
]

const insightsPageData = {
  kpiCards,
  insightTabs,
  insights,
  evidenceTiles,
  leadershipQuestions,
  bottomSummaryCards,
  suggestedAskPrompts,
}

export default insightsPageData
