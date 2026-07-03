export type Role = 'general-manager' | 'manager' | 'superintendent' | 'supervisor'

export const siteOptions = [
  { value: 'gnam', label: 'GNAM - Site A' },
  { value: 'pilbara', label: 'Pilbara Ops - All' },
  { value: 'gudai', label: 'Gudai-Darri' },
  { value: 'brockman', label: 'Brockman' },
  { value: 'west', label: 'West Angelas' },
  { value: 'yandi', label: 'Yandicoogina' },
  { value: 'tom', label: 'Tom Price' },
]

export const departmentOptions = [
  { value: 'all', label: 'All departments' },
  { value: 'mine', label: 'Mine Operations' },
  { value: 'fixed', label: 'Fixed Plant' },
  { value: 'processing', label: 'Processing' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'rail', label: 'Rail' },
  { value: 'contractor', label: 'Contractor Management' },
]

export const teamsByDept: Record<string, { value: string; label: string }[]> = {
  all: [{ value: 'all', label: 'All teams' }],
  mine: [
    { value: 'all', label: 'All teams' },
    { value: 't1', label: 'Team 1 - Load & Haul' },
    { value: 't2', label: 'Team 2 - Drill & Blast' },
    { value: 't3', label: 'Team 3 - Mobile Equipment' },
    { value: 't4', label: 'Team 4 - Contractor Roads' },
  ],
  fixed: [
    { value: 'all', label: 'All teams' },
    { value: 't1', label: 'Team 1 - Shutdown' },
    { value: 't2', label: 'Team 2 - Processing Maintenance' },
    { value: 't3', label: 'Team 3 - Isolation / Permits' },
  ],
  processing: [
    { value: 'all', label: 'All teams' },
    { value: 't1', label: 'Team 1 - Crushing' },
    { value: 't2', label: 'Team 2 - Conveying' },
    { value: 't3', label: 'Team 3 - Plant Operations' },
  ],
}

export const months = ['May 2026', 'June 2026', 'July 2026', 'Custom month']
export const shiftOptions = ['All shifts', 'Day shift', 'Night shift', 'Weekday', 'Weekend']
export const riskLensOptions = ['Fatal + Injury Combined', 'Fatal Risk Only', 'Injury Risk Only', 'LiF Themes', 'Critical Controls']

export type KpiCard = {
  id: string
  label: string
  value: string
  subtext: string
  status: string
  colour: 'blue' | 'amber' | 'red' | 'purple' | 'green'
}

export const kpiCards: KpiCard[] = [
  { id: '1', label: 'LiF Interactions Planned', value: '42', subtext: 'This month', status: '11 high priority', colour: 'blue' },
  { id: '2', label: 'Completed Interactions', value: '28', subtext: '67% complete', status: 'On watch', colour: 'amber' },
  { id: '3', label: 'Top LiF Themes', value: '5', subtext: '3 trending up', status: 'Coaching focus', colour: 'red' },
  { id: '4', label: 'Coaching Opportunities', value: '14', subtext: 'Across 6 areas', status: 'Field focus', colour: 'purple' },
  { id: '5', label: 'Supervisor Handoffs', value: '8', subtext: 'Ready to push', status: 'Ready', colour: 'green' },
  { id: '6', label: 'Repeat Themes', value: '3', subtext: 'PTHA, PPE, Housekeeping', status: 'Needs attention', colour: 'amber' },
]

export type ThemeRow = {
  id: string
  theme: string
  share: string
  trend: string
  status: string
  badge: 'red' | 'amber' | 'green' | 'blue'
}

export const topThemes: ThemeRow[] = [
  { id: 'ptha', theme: 'PTHA Quality', share: '28%', trend: 'Up', status: 'Trending', badge: 'red' },
  { id: 'ppe', theme: 'PPE Compliance', share: '22%', trend: 'Up', status: 'Trending', badge: 'amber' },
  { id: 'housekeeping', theme: 'Housekeeping', share: '15%', trend: 'Down', status: 'Improving', badge: 'green' },
  { id: 'fatigue', theme: 'Fatigue Management', share: '12%', trend: 'Up', status: 'Watch', badge: 'amber' },
  { id: 'tools', theme: 'Tools & Equipment', share: '8%', trend: 'Stable', status: 'Monitor', badge: 'blue' },
]

export type SpotlightRecommendation = {
  id: string
  title: string
  description: string
  severity: 'High' | 'Medium'
  action: string
}

export const spotlightRecommendations: SpotlightRecommendation[] = [
  {
    id: 'energy-iso',
    title: 'Energy isolation incidents and control failures are increasing',
    description: 'Focus LiF conversations on isolation quality, lock / tag steps and residual energy checks.',
    severity: 'High',
    action: 'Add to field focus',
  },
  {
    id: 'ptha-quality',
    title: 'PTHA quality is the top LiF theme this week',
    description: 'Ask leaders to check whether hazards are being identified before work starts, not after work changes.',
    severity: 'Medium',
    action: 'Push coaching prompt',
  },
  {
    id: 'mobile-equipment',
    title: 'Mobile equipment controls show signs of degradation',
    description: 'Use field interactions to verify pre-start quality, separation controls and positive communication.',
    severity: 'Medium',
    action: 'Add to SupV guidance',
  },
]

export type CompletionMetrics = {
  planned: number
  completed: number
  remaining: number
  overdue: number
  rate: number
  breakdown: { label: string; planned: number; completed: number }[]
}

export const completionMetrics: CompletionMetrics = {
  planned: 42,
  completed: 28,
  remaining: 14,
  overdue: 5,
  rate: 67,
  breakdown: [
    { label: 'PTHA interactions', planned: 12, completed: 8 },
    { label: 'CCC reviews', planned: 10, completed: 6 },
    { label: 'Spotlight interactions', planned: 8, completed: 5 },
    { label: 'QS interactions', planned: 12, completed: 9 },
  ],
}

export type ScheduleRow = {
  id: string
  priority: number
  theme: string
  focus: string
  area: string
  rationale: string
  plannedDate: string
  owner: string
  interactionType: string
  status: 'Completed' | 'Planned' | 'Overdue' | 'Needs owner'
}

export const scheduleRows: ScheduleRow[] = [
  {
    id: '1',
    priority: 1,
    theme: 'PTHA Quality',
    focus: 'Workshop / Isolation Bay',
    area: 'Workshop / Isolation Bay',
    rationale: 'Poor quality identified in 28% of interactions; isolation risk is increasing.',
    plannedDate: '08 May 2026',
    owner: 'MW - M. Williams',
    interactionType: 'PTHA coaching',
    status: 'Completed',
  },
  {
    id: '2',
    priority: 2,
    theme: 'PPE Compliance',
    focus: 'Plant Concentrator',
    area: 'Plant Concentrator',
    rationale: 'PPE not used correctly in 21% of interactions.',
    plannedDate: '12 May 2026',
    owner: 'TK - T. Kelly',
    interactionType: 'Field coaching',
    status: 'Completed',
  },
  {
    id: '3',
    priority: 3,
    theme: 'Mobile Equipment Interaction',
    focus: 'ROM Pad',
    area: 'ROM Pad',
    rationale: 'Pre-start quality and positive communication showing early degradation.',
    plannedDate: '15 May 2026',
    owner: 'MW - M. Williams',
    interactionType: 'Spotlight interaction',
    status: 'Planned',
  },
  {
    id: '4',
    priority: 4,
    theme: 'Housekeeping',
    focus: 'Processing Plant Area 2',
    area: 'Processing Plant Area 2',
    rationale: 'Increase in housekeeping issues noted across workshop and plant access areas.',
    plannedDate: '20 May 2026',
    owner: 'LS - L. Smith',
    interactionType: 'QS check',
    status: 'Overdue',
  },
  {
    id: '5',
    priority: 5,
    theme: 'Line of Fire',
    focus: 'Crushing Plant',
    area: 'Crushing Plant',
    rationale: 'LiF observations show frequent exposure issues around crushing and conveying.',
    plannedDate: '26 May 2026',
    owner: 'TK - T. Kelly',
    interactionType: 'LiF field conversation',
    status: 'Planned',
  },
  {
    id: '6',
    priority: 6,
    theme: 'Fatigue Management',
    focus: 'Night shift haul roads',
    area: 'Night shift haul roads',
    rationale: 'Time pressure and fatigue comments increasing in field notes.',
    plannedDate: '28 May 2026',
    owner: 'AR - A. Roberts',
    interactionType: 'Leader conversation',
    status: 'Needs owner',
  },
]

export type InsightCard = {
  id: string
  title: string
  insight: string
  action: string
  trend: string
  tag: 'High priority' | 'Watch' | 'Trending up' | 'Improvement opportunity' | 'Needs attention'
}

export const insightTabs = ['PTHA', 'CCC Review', 'Spotlight', 'QS']

export const insightRecommendations: Record<string, InsightCard[]> = {
  PTHA: [
    {
      id: 'p1',
      title: 'PTHA Quality',
      insight: 'Poor quality identified in 28% of interactions.',
      action: 'Coach teams on changed conditions and control verification.',
      trend: 'Trending up',
      tag: 'Trending up',
    },
    {
      id: 'p2',
      title: 'Hazard identification',
      insight: 'Hazards are being listed but not always linked to the task step.',
      action: 'Ask crews to explain the highest consequence hazard before work starts.',
      trend: 'Watch',
      tag: 'Watch',
    },
    {
      id: 'p3',
      title: 'Control clarity',
      insight: 'Controls are often named but not verified before work begins.',
      action: 'Ask “How do you know this control is working today?”',
      trend: 'Trending up',
      tag: 'Trending up',
    },
  ],
  'CCC Review': [
    {
      id: 'c1',
      title: 'Critical control clarity',
      insight: 'Workers can name the control but do not always explain the verification step.',
      action: 'Ask teams to describe how the control is checked in the field.',
      trend: 'Trending up',
      tag: 'Trending up',
    },
    {
      id: 'c2',
      title: 'Verification quality',
      insight: 'Verification notes are inconsistent across Team 1 and Team 3.',
      action: 'Review examples of good verification evidence in pre-start coaching.',
      trend: 'Watch',
      tag: 'Watch',
    },
    {
      id: 'c3',
      title: 'Action closure',
      insight: 'Follow-up actions are being created but not always closed before the next interaction.',
      action: 'Confirm action owners and due dates during leadership routines.',
      trend: 'Overdue risk',
      tag: 'Needs attention',
    },
  ],
  Spotlight: [
    {
      id: 's1',
      title: 'Mobile equipment interaction',
      insight: 'Light vehicle and mobile equipment interface has increased in recent observations.',
      action: 'Run a spotlight discussion on separation and positive communication.',
      trend: 'High priority',
      tag: 'High priority',
    },
    {
      id: 's2',
      title: 'Energy isolation',
      insight: 'Isolation control health is degrading in workshop areas.',
      action: 'Use field spotlight to test understanding of lock / tag and zero energy verification.',
      trend: 'High priority',
      tag: 'High priority',
    },
    {
      id: 's3',
      title: 'Line of fire',
      insight: 'Workers are entering potential exposure zones during routine maintenance.',
      action: 'Run a field spotlight on body positioning and exclusion zones.',
      trend: 'Trending up',
      tag: 'Trending up',
    },
  ],
  QS: [
    {
      id: 'q1',
      title: 'Quality of field conversations',
      insight: 'Some interactions capture observations but not the quality of the coaching conversation.',
      action: 'Prompt leaders to record what was discussed and what changed after the conversation.',
      trend: 'Watch',
      tag: 'Watch',
    },
    {
      id: 'q2',
      title: 'Question quality',
      insight: 'Closed questions are being used more often than open coaching questions.',
      action: 'Use “what could fail today?” and “how do you know the control works?” prompts.',
      trend: 'Improvement opportunity',
      tag: 'Improvement opportunity',
    },
    {
      id: 'q3',
      title: 'Follow-up strength',
      insight: 'Actions are captured but escalation path is not always clear.',
      action: 'Add owner, due date and next review point for every follow-up.',
      trend: 'Needs attention',
      tag: 'Needs attention',
    },
  ],
}

export const aiRecommendation = {
  title: 'AI Recommendation',
  summary:
    'Based on current risk exposure, control health, incidents and LiF trends, focus field leadership on PTHA Quality, PPE Compliance and Mobile Equipment interactions across Workshop, ROM Pad and Crushing Plant areas.',
}

export const supervisorHandoff = {
  focus: 'PTHA Quality and Mobile Equipment Interaction',
  locations: ['Workshop / Isolation Bay', 'ROM Pad', 'Crushing Plant'],
  prompts: [
    'What has changed since the job was planned?',
    'Where could mobile equipment and people interact today?',
    'How do you know the critical control is working?',
  ],
  ready: 8,
  needOwner: 3,
  pushed: 5,
}

export type CoachingPrompt = {
  id: string
  prompt: string
}

export const coachingPrompts: CoachingPrompt[] = [
  { id: 'fp1', prompt: 'What has changed since this task was planned?' },
  { id: 'fp2', prompt: 'Which hazard could cause serious harm today?' },
  { id: 'fp3', prompt: 'What control must work for this task to continue safely?' },
  { id: 'fp4', prompt: 'How do you know the control is working right now?' },
  { id: 'fp5', prompt: 'What would make you stop the job?' },
  { id: 'fp6', prompt: 'What needs to be handed over to the next shift?' },
]

export type HeatmapRow = {
  label: string
  values: { column: string; status: string }[]
}

export const heatmapRows: HeatmapRow[] = [
  { label: 'Team 1 - Load & Haul', values: [
    { column: 'PTHA', status: 'High' },
    { column: 'PPE', status: 'Watch' },
    { column: 'Housekeeping', status: 'Low' },
    { column: 'Fatigue', status: 'Watch' },
    { column: 'Mobile Equipment', status: 'High' },
    { column: 'LiF', status: 'High' },
  ]},
  { label: 'Team 2 - Drill & Blast', values: [
    { column: 'PTHA', status: 'Watch' },
    { column: 'PPE', status: 'High' },
    { column: 'Housekeeping', status: 'Low' },
    { column: 'Fatigue', status: 'Low' },
    { column: 'Mobile Equipment', status: 'Watch' },
    { column: 'LiF', status: 'Watch' },
  ]},
  { label: 'Team 3 - Mobile Equipment', values: [
    { column: 'PTHA', status: 'High' },
    { column: 'PPE', status: 'High' },
    { column: 'Housekeeping', status: 'Watch' },
    { column: 'Fatigue', status: 'Low' },
    { column: 'Mobile Equipment', status: 'High' },
    { column: 'LiF', status: 'High' },
  ]},
  { label: 'Workshop', values: [
    { column: 'PTHA', status: 'High' },
    { column: 'PPE', status: 'Watch' },
    { column: 'Housekeeping', status: 'Watch' },
    { column: 'Fatigue', status: 'Low' },
    { column: 'Mobile Equipment', status: 'Watch' },
    { column: 'LiF', status: 'High' },
  ]},
  { label: 'Processing Plant', values: [
    { column: 'PTHA', status: 'Watch' },
    { column: 'PPE', status: 'High' },
    { column: 'Housekeeping', status: 'Low' },
    { column: 'Fatigue', status: 'Watch' },
    { column: 'Mobile Equipment', status: 'Watch' },
    { column: 'LiF', status: 'Watch' },
  ]},
  { label: 'Crushing Plant', values: [
    { column: 'PTHA', status: 'High' },
    { column: 'PPE', status: 'High' },
    { column: 'Housekeeping', status: 'Watch' },
    { column: 'Fatigue', status: 'Watch' },
    { column: 'Mobile Equipment', status: 'High' },
    { column: 'LiF', status: 'High' },
  ]},
]

export type LeadershipAction = {
  id: string
  title: string
  owner: string
  due: string
  status: string
}

export const leadershipActions: LeadershipAction[] = [
  { id: 'a1', title: 'Add PTHA Quality to this week’s field focus', owner: 'M. Williams', due: '07 May', status: 'Ready' },
  { id: 'a2', title: 'Push Mobile Equipment coaching prompt to Supervisor Shift Guidance', owner: 'T. Kelly', due: '08 May', status: 'Ready' },
  { id: 'a3', title: 'Review overdue Housekeeping LiF interaction', owner: 'L. Smith', due: '09 May', status: 'Overdue' },
  { id: 'a4', title: 'Confirm owner for Fatigue Management night shift interaction', owner: 'A. Roberts', due: '10 May', status: 'Needs owner' },
  { id: 'a5', title: 'Share Spotlight on Energy Isolation with field leaders', owner: 'M. Williams', due: '11 May', status: 'Ready' },
]
