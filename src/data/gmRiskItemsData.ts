export type RiskItemType = 'Actual event' | 'Emerging risk' | 'Predicted risk' | 'Weak signal' | 'Positive movement'

export type RiskSeverity = 'High' | 'Medium' | 'Low'

export type RiskStatus = 'Action required' | 'New' | 'Open' | 'Reviewed'

export type ControlHealthState = 'Degrading' | 'At Risk' | 'Stable'

export type RiskItem = {
  id: string
  title: string
  type: RiskItemType
  dateDetected: string
  site: string
  siteValue: string
  area: string
  location: string
  severity: RiskSeverity
  trend: string
  controlHealth: ControlHealthState
  assuranceCoverage: number
  status: RiskStatus
  recommendedAction: string
  category: string
  riskIndex: number
  aiConfidence: number
  owner: string
  explanation: string
  whatHappens: string
  evidenceSignals: Array<{ title: string; detail: string }>
  locations: Array<{ name: string; riskScore: string; trend: string; issue: string; owner: string; action: string }>
  controls: Array<{ control: string; status: string; health: string; evidence: string; action: string }>
  timeline: Array<{ date: string; detail: string }>
  behaviourThemes: Array<{ title: string; explanation: string; evidenceCount: number; linkedControl: string; leadershipQuestion: string }>
  assurance: {
    coverage: number
    target: number
    gap: number
    missingCoverage: string[]
    plannedActivities: string[]
    overdue: string[]
  }
  actions: string[]
}

export const riskItems: RiskItem[] = [
  {
    id: 'vehicle-interaction-north-mine-haul-road',
    title: 'Vehicle interaction risk increasing on North Mine haul road',
    type: 'Emerging risk',
    dateDetected: '27 Jun',
    site: 'Gudai-Darri',
    siteValue: 'gudai',
    area: 'Load & Haul',
    location: 'North Mine haul road and Rail Loadout interface',
    severity: 'High',
    trend: 'Increasing +24%',
    controlHealth: 'Degrading',
    assuranceCoverage: 67,
    status: 'Action required',
    recommendedAction: 'Challenge assurance coverage and traffic separation controls',
    category: 'Vehicle interaction',
    riskIndex: 89,
    aiConfidence: 87,
    owner: 'Mine Operations Manager',
    explanation: 'AI has flagged this risk because traffic separation verification is dropping while near-miss reports and LiF observations around shared access points are increasing.',
    whatHappens: 'This is an emerging risk signal rather than one single incident. The pattern suggests vehicle interaction exposure is increasing around shared access points and haul road interfaces. If not addressed, the risk could lead to a serious vehicle interaction or line of fire event.',
    evidenceSignals: [
      { title: '3 near-miss reports', detail: 'Blind spots and light vehicle interactions have been reported in the last 14 days.' },
      { title: 'Traffic separation verification down 18%', detail: 'Verification completion has deteriorated in the affected operational zones.' },
      { title: '5 LiF observations', detail: 'Shared access points are generating repeated exposure signals.' },
    ],
    locations: [
      { name: 'North Mine haul road / Load & Haul', riskScore: 'High', trend: 'Increasing', issue: 'Traffic separation and speeding observations', owner: 'Load & Haul Superintendent', action: 'Review field leadership focus' },
      { name: 'Rail Loadout interface / Fixed Plant', riskScore: 'High', trend: 'Increasing', issue: 'Positive communication missed during interaction points', owner: 'Fixed Plant Superintendent', action: 'Reinforce shift briefings' },
      { name: 'ROM access road / Mine Services', riskScore: 'Medium', trend: 'Increasing', issue: 'Congestion and light vehicle route changes', owner: 'Mine Services Manager', action: 'Rebrief mobile plant routes' },
    ],
    controls: [
      { control: 'Traffic separation', status: 'Degrading', health: '58%', evidence: '5 failed checks in 14 days', action: 'Review control' },
      { control: 'Positive communication', status: 'At Risk', health: '67%', evidence: '3 near misses had communication gaps', action: 'Field coaching' },
      { control: 'Journey / route planning', status: 'At Risk', health: '71%', evidence: 'Changed routes not always briefed', action: 'Manager review' },
    ],
    timeline: [
      { date: '27 Jun', detail: 'Near miss - light vehicle entered active haul route' },
      { date: '25 Jun', detail: 'CCFV exception - separation controls not verified' },
      { date: '22 Jun', detail: 'LiF observation cluster - shared access point' },
      { date: '18 Jun', detail: 'Field note - route congestion and time pressure' },
    ],
    behaviourThemes: [
      { title: 'Rushing at shift change', explanation: 'Workforces are moving quickly around shared access points.', evidenceCount: 4, linkedControl: 'Traffic separation', leadershipQuestion: 'Are we reinforcing route discipline at shift change?' },
      { title: 'Positive communication missed', explanation: 'Communication gaps increase ambiguity around mobile plant movement.', evidenceCount: 3, linkedControl: 'Positive communication', leadershipQuestion: 'Do supervisors observe this consistently?' },
    ],
    assurance: {
      coverage: 67,
      target: 85,
      gap: 18,
      missingCoverage: ['Contractor road movements', 'Night shift traffic separation', 'Rail Loadout interface checks'],
      plannedActivities: ['3 CCV', '2 CCFV'],
      overdue: ['2 traffic management actions'],
    },
    actions: ['Challenge assurance coverage', 'Direct field leadership focus', 'Request control review', 'Confirm action ownership'],
  },
  {
    id: 'traffic-separation-contractor-roads',
    title: 'Traffic separation verification decline in contractor road movements',
    type: 'Weak signal',
    dateDetected: '26 Jun',
    site: 'Brockman',
    siteValue: 'brockman',
    area: 'Contractor Roads',
    location: 'Contractor road access points',
    severity: 'High',
    trend: 'Increasing +18%',
    controlHealth: 'Degrading',
    assuranceCoverage: 62,
    status: 'New',
    recommendedAction: 'Request Manager review',
    category: 'Line of fire',
    riskIndex: 84,
    aiConfidence: 81,
    owner: 'Contractor Supervisor',
    explanation: 'The signal is being driven by lower verification completion and increasing field notes around unfamiliar traffic routes.',
    whatHappens: 'A weak signal shows the current controls for contractor road movements may not be verifying separation and escort practices consistently.',
    evidenceSignals: [
      { title: 'Route note count rising', detail: 'Field notes mention unfamiliar routes and congestion.' },
      { title: 'Verification completion down', detail: 'Inspections show reduced completion around contractor access points.' },
    ],
    locations: [
      { name: 'Contractor road access / Contractor Roads', riskScore: 'High', trend: 'Increasing', issue: 'Escort checks inconsistent', owner: 'Contractor Coordinator', action: 'Request review' },
    ],
    controls: [
      { control: 'Route planning', status: 'At Risk', health: '61%', evidence: 'Changed routes not briefed', action: 'Manager review' },
      { control: 'Escort controls', status: 'Degrading', health: '57%', evidence: 'Inspections inconsistent', action: 'Review control' },
    ],
    timeline: [
      { date: '26 Jun', detail: 'Field notes show route congestion and unfamiliarity' },
      { date: '23 Jun', detail: 'Verification checks missed around access points' },
    ],
    behaviourThemes: [
      { title: 'Unfamiliarity with site road rules', explanation: 'Contractor operators are showing gaps in local road rules.', evidenceCount: 2, linkedControl: 'Route planning', leadershipQuestion: 'What onboarding review is in place?' },
    ],
    assurance: {
      coverage: 62,
      target: 85,
      gap: 23,
      missingCoverage: ['Contractor road movements', 'Escort verification'],
      plannedActivities: ['2 CCV'],
      overdue: ['1 escort review'],
    },
    actions: ['Request Manager review', 'Add to leadership meeting', 'Review onboarding'],
  },
  {
    id: 'isolation-verification-maintenance-workshop',
    title: 'Isolation confirmation checks not consistently verified',
    type: 'Actual event',
    dateDetected: '25 Jun',
    site: 'Brockman',
    siteValue: 'brockman',
    area: 'Maintenance Workshop',
    location: 'Fixed plant maintenance work areas',
    severity: 'High',
    trend: 'Increasing +9%',
    controlHealth: 'At Risk',
    assuranceCoverage: 71,
    status: 'Open',
    recommendedAction: 'Validate isolation assurance plan',
    category: 'Energy isolation',
    riskIndex: 80,
    aiConfidence: 84,
    owner: 'Maintenance Manager',
    explanation: 'The event is linked to repeated gaps in isolation confirmation and delayed corrective actions in maintenance work areas.',
    whatHappens: 'A process assurance gap has been found where isolation confirmation checks were not consistently completed around planned maintenance tasks.',
    evidenceSignals: [
      { title: 'Isolation confirmation gaps', detail: 'Checks were missed during planned work.' },
      { title: 'Corrective action delay', detail: 'Actions remained open longer than expected.' },
    ],
    locations: [
      { name: 'Maintenance workshop / Fixed Plant', riskScore: 'High', trend: 'Increasing', issue: 'Isolation evidence not recorded', owner: 'Maintenance Manager', action: 'Validate assurance plan' },
    ],
    controls: [
      { control: 'Isolation confirmation', status: 'At Risk', health: '63%', evidence: 'Missed checks recorded', action: 'Review control' },
      { control: 'Permit to work', status: 'At Risk', health: '68%', evidence: 'Verification inconsistencies', action: 'Manager review' },
    ],
    timeline: [
      { date: '25 Jun', detail: 'Isolation confirmation checks missed' },
      { date: '21 Jun', detail: 'Corrective action remained open' },
    ],
    behaviourThemes: [
      { title: 'Verification not completed', explanation: 'Verification steps are being skipped in haste.', evidenceCount: 2, linkedControl: 'Isolation confirmation', leadershipQuestion: 'Do crews understand the standard?' },
    ],
    assurance: {
      coverage: 71,
      target: 85,
      gap: 14,
      missingCoverage: ['Isolation confirmation', 'Permit verification'],
      plannedActivities: ['2 CCV'],
      overdue: ['1 corrective action'],
    },
    actions: ['Validate isolation assurance plan', 'Request process check', 'Review maintenance controls'],
  },
  {
    id: 'line-of-fire-processing-plant',
    title: 'Line of fire exposure increasing during routine processing tasks',
    type: 'Emerging risk',
    dateDetected: '24 Jun',
    site: 'Gudai-Darri',
    siteValue: 'gudai',
    area: 'Processing Plant',
    location: 'Crusher and conveyor maintenance areas',
    severity: 'High',
    trend: 'Increasing +11%',
    controlHealth: 'At Risk',
    assuranceCoverage: 70,
    status: 'Open',
    recommendedAction: 'Align Superintendent field coaching',
    category: 'Line of fire',
    riskIndex: 86,
    aiConfidence: 85,
    owner: 'Processing Superintendent',
    explanation: 'The risk is increasing because line-of-fire observations are rising in routine processing work, especially around conveyors and maintenance interfaces.',
    whatHappens: 'The signal shows that exposure to line-of-fire situations may be increasing during routine work and maintenance tasks.',
    evidenceSignals: [
      { title: 'Line-of-fire observations rising', detail: 'Observations are increasing at conveyor and crusher interfaces.' },
      { title: 'Coaching conversations inconsistent', detail: 'Field coaching is not yet being applied consistently.' },
    ],
    locations: [
      { name: 'Crusher maintenance / Processing Plant', riskScore: 'High', trend: 'Increasing', issue: 'Line of fire exposure', owner: 'Processing Superintendent', action: 'Increase field coaching' },
    ],
    controls: [
      { control: 'Line of fire controls', status: 'At Risk', health: '64%', evidence: 'Observation cluster reported', action: 'Field coaching' },
      { control: 'Permit controls', status: 'Stable', health: '79%', evidence: 'No material degradation', action: 'Monitor' },
    ],
    timeline: [
      { date: '24 Jun', detail: 'Line of fire observation cluster' },
      { date: '20 Jun', detail: 'Routine processing task observation' },
    ],
    behaviourThemes: [
      { title: 'Complacency in familiar areas', explanation: 'Familiar tasks are creating exposure in routine areas.', evidenceCount: 2, linkedControl: 'Line of fire controls', leadershipQuestion: 'How are supervisors reinforcing the standard?' },
    ],
    assurance: {
      coverage: 70,
      target: 85,
      gap: 15,
      missingCoverage: ['Processing plant interfaces', 'Routine maintenance checks'],
      plannedActivities: ['2 CCV'],
      overdue: ['1 coaching follow-up'],
    },
    actions: ['Align Superintendent field coaching', 'Request review', 'Add to leadership meeting'],
  },
  {
    id: 'near-miss-light-vehicle-blind-spot',
    title: 'Near miss involving light vehicle blind spot',
    type: 'Actual event',
    dateDetected: '22 Jun',
    site: 'West Angelas',
    siteValue: 'west',
    area: 'ROM / Crushing',
    location: 'ROM access road',
    severity: 'High',
    trend: 'Increasing +15%',
    controlHealth: 'At Risk',
    assuranceCoverage: 69,
    status: 'Action required',
    recommendedAction: 'Confirm corrective actions have owners',
    category: 'Vehicle interaction',
    riskIndex: 78,
    aiConfidence: 80,
    owner: 'Operations Supervisor',
    explanation: 'A near miss around light vehicle interaction highlights a recurring blind spot risk in the ROM access road area.',
    whatHappens: 'A near miss event suggests a control breakdown at the interface of mobile equipment and light vehicles.',
    evidenceSignals: [
      { title: 'Near miss report', detail: 'Blind spot interaction reported.' },
      { title: 'Route changes', detail: 'Access route changes may be creating exposure.' },
    ],
    locations: [
      { name: 'ROM access road / ROM / Crushing', riskScore: 'High', trend: 'Increasing', issue: 'Blind spot interactions', owner: 'Operations Supervisor', action: 'Confirm owners' },
    ],
    controls: [
      { control: 'Traffic separation', status: 'At Risk', health: '66%', evidence: 'Verification down', action: 'Review control' },
    ],
    timeline: [
      { date: '22 Jun', detail: 'Near miss involving light vehicle' },
      { date: '20 Jun', detail: 'Route change note' },
    ],
    behaviourThemes: [
      { title: 'Complacency in familiar areas', explanation: 'Routine routes are creating blind spots.', evidenceCount: 1, linkedControl: 'Traffic separation', leadershipQuestion: 'How often do supervisors observe this area?' },
    ],
    assurance: {
      coverage: 69,
      target: 85,
      gap: 16,
      missingCoverage: ['ROM access points'],
      plannedActivities: ['1 CCV'],
      overdue: ['1 corrective action'],
    },
    actions: ['Confirm corrective actions', 'Request review', 'Add to meeting'],
  },
  {
    id: 'exclusion-zone-lifting-activity',
    title: 'Exclusion zone compliance issue during lifting activity',
    type: 'Actual event',
    dateDetected: '20 Jun',
    site: 'Yandicoogina',
    siteValue: 'yandi',
    area: 'Maintenance',
    location: 'Workshop laydown area',
    severity: 'Medium',
    trend: 'Stable',
    controlHealth: 'At Risk',
    assuranceCoverage: 78,
    status: 'Open',
    recommendedAction: 'Monitor and request Superintendent review',
    category: 'Lifting and cranage',
    riskIndex: 65,
    aiConfidence: 75,
    owner: 'Maintenance Supervisor',
    explanation: 'An exclusion zone issue during lifting activity is showing a control weakness that requires monitoring.',
    whatHappens: 'A lifting activity created an exclusion zone issue that may have exposed people to moving plant or suspended loads.',
    evidenceSignals: [
      { title: 'Exclusion zone issue', detail: 'Control compliance issue recorded during lifting activity.' },
    ],
    locations: [
      { name: 'Workshop laydown / Maintenance', riskScore: 'Medium', trend: 'Stable', issue: 'Exclusion zone issue', owner: 'Maintenance Supervisor', action: 'Monitor' },
    ],
    controls: [
      { control: 'Exclusion zones', status: 'At Risk', health: '69%', evidence: 'Issue recorded', action: 'Review control' },
    ],
    timeline: [
      { date: '20 Jun', detail: 'Exclusion zone issue during lifting activity' },
    ],
    behaviourThemes: [
      { title: 'Work area setup drift', explanation: 'The setup around the lift area drifted from standard.', evidenceCount: 1, linkedControl: 'Exclusion zones', leadershipQuestion: 'Does the crew have the right prestart setup?' },
    ],
    assurance: {
      coverage: 78,
      target: 85,
      gap: 7,
      missingCoverage: ['Laydown exclusion zones'],
      plannedActivities: ['1 CCV'],
      overdue: [],
    },
    actions: ['Monitor and request Superintendent review', 'Review exclusion zones'],
  },
  {
    id: 'working-at-heights-shutdown-prep',
    title: 'Working at heights exposure increasing before shutdown work',
    type: 'Predicted risk',
    dateDetected: '19 Jun',
    site: 'Tom Price',
    siteValue: 'tom',
    area: 'Processing Plant',
    location: 'Fixed plant shutdown preparation area',
    severity: 'Medium',
    trend: 'Increasing +3%',
    controlHealth: 'Stable',
    assuranceCoverage: 83,
    status: 'Reviewed',
    recommendedAction: 'Monitor exposure and confirm coverage',
    category: 'Working at heights',
    riskIndex: 69,
    aiConfidence: 76,
    owner: 'Shutdown Coordinator',
    explanation: 'The upcoming shutdown period is increasing exposure to working-at-heights tasks, but control status is currently stable.',
    whatHappens: 'An increase in shutdown preparation work is raising the probability of exposure to working-at-heights tasks.',
    evidenceSignals: [
      { title: 'Shutdown work increase', detail: 'Exposure is likely to increase in the next 7-10 days.' },
    ],
    locations: [
      { name: 'Shutdown preparation / Processing Plant', riskScore: 'Medium', trend: 'Increasing', issue: 'Working at heights exposure', owner: 'Shutdown Coordinator', action: 'Monitor' },
    ],
    controls: [
      { control: 'Fall prevention', status: 'Stable', health: '84%', evidence: 'No material degradation', action: 'Monitor' },
    ],
    timeline: [
      { date: '19 Jun', detail: 'Shutdown preparation work identified' },
    ],
    behaviourThemes: [
      { title: 'Short-cycle shutdown pressure', explanation: 'Preparation pressure can lead to rushed controls.', evidenceCount: 1, linkedControl: 'Fall prevention', leadershipQuestion: 'How are supervisors managing work sequencing?' },
    ],
    assurance: {
      coverage: 83,
      target: 85,
      gap: 2,
      missingCoverage: ['Shutdown preparation'],
      plannedActivities: ['1 CCV'],
      overdue: [],
    },
    actions: ['Monitor exposure', 'Confirm coverage'],
  },
  {
    id: 'fatigue-time-pressure-night-shift',
    title: 'Fatigue and time pressure weak signal on night shift road movements',
    type: 'Weak signal',
    dateDetected: '18 Jun',
    site: 'All Pilbara Sites',
    siteValue: 'all',
    area: 'Mine Operations',
    location: 'Night shift road movements',
    severity: 'Medium',
    trend: 'Increasing +8%',
    controlHealth: 'At Risk',
    assuranceCoverage: 72,
    status: 'New',
    recommendedAction: 'Ask Managers to review fatigue and journey controls',
    category: 'Contractor road movements',
    riskIndex: 71,
    aiConfidence: 74,
    owner: 'Operations Manager',
    explanation: 'The weak signal points to fatigue and time pressure occurring during night shift road movements across multiple sites.',
    whatHappens: 'A weak signal suggests fatigue and time pressure may be increasing the probability of exposure during night movements.',
    evidenceSignals: [
      { title: 'Time pressure notes', detail: 'Night shift road movements show repeated time pressure comments.' },
    ],
    locations: [
      { name: 'Night shift road movements / Mine Operations', riskScore: 'Medium', trend: 'Increasing', issue: 'Fatigue and time pressure', owner: 'Operations Manager', action: 'Review controls' },
    ],
    controls: [
      { control: 'Fatigue management', status: 'At Risk', health: '71%', evidence: 'Weak signal noted', action: 'Manager review' },
    ],
    timeline: [
      { date: '18 Jun', detail: 'Fatigue and time pressure weak signal' },
    ],
    behaviourThemes: [
      { title: 'Night shift time pressure', explanation: 'Shift timing is introducing pressure into journey controls.', evidenceCount: 1, linkedControl: 'Fatigue management', leadershipQuestion: 'How often are fatigue controls being checked at shift change?' },
    ],
    assurance: {
      coverage: 72,
      target: 85,
      gap: 13,
      missingCoverage: ['Night shift road movements'],
      plannedActivities: ['1 CCV'],
      overdue: [],
    },
    actions: ['Review fatigue controls', 'Ask Managers to review'],
  },
  {
    id: 'permit-to-work-fixed-plant',
    title: 'Permit to work verification inconsistencies in fixed plant',
    type: 'Actual event',
    dateDetected: '17 Jun',
    site: 'Brockman',
    siteValue: 'brockman',
    area: 'Fixed Plant',
    location: 'Conveyor maintenance areas',
    severity: 'Medium',
    trend: 'Stable',
    controlHealth: 'At Risk',
    assuranceCoverage: 76,
    status: 'Open',
    recommendedAction: 'Request process check',
    category: 'Energy isolation',
    riskIndex: 63,
    aiConfidence: 72,
    owner: 'Permit Coordinator',
    explanation: 'An issue with permit-to-work verification is showing a procedural weakness in fixed plant work.',
    whatHappens: 'Permit-to-work verification inconsistencies could create exposure if the correct controls are not applied.',
    evidenceSignals: [
      { title: 'Permit inconsistencies', detail: 'Verification checks were inconsistent.' },
    ],
    locations: [
      { name: 'Conveyor maintenance / Fixed Plant', riskScore: 'Medium', trend: 'Stable', issue: 'Permit verification inconsistencies', owner: 'Permit Coordinator', action: 'Request process check' },
    ],
    controls: [
      { control: 'Permit to work', status: 'At Risk', health: '70%', evidence: 'Inconsistencies recorded', action: 'Review control' },
    ],
    timeline: [
      { date: '17 Jun', detail: 'Permit-to-work verification inconsistencies identified' },
    ],
    behaviourThemes: [
      { title: 'Procedure discipline', explanation: 'The process standard is not being applied consistently.', evidenceCount: 1, linkedControl: 'Permit to work', leadershipQuestion: 'How often are permit checks observed?' },
    ],
    assurance: {
      coverage: 76,
      target: 85,
      gap: 9,
      missingCoverage: ['Permit verification'],
      plannedActivities: ['1 CCV'],
      overdue: [],
    },
    actions: ['Request process check', 'Review permit controls'],
  },
  {
    id: 'lifting-cranage-improving',
    title: 'Lifting and cranage controls improving after targeted verification',
    type: 'Positive movement',
    dateDetected: '15 Jun',
    site: 'West Angelas',
    siteValue: 'west',
    area: 'Maintenance',
    location: 'Heavy vehicle workshop',
    severity: 'Low',
    trend: 'Decreasing -4%',
    controlHealth: 'Stable',
    assuranceCoverage: 88,
    status: 'Reviewed',
    recommendedAction: 'Share positive practice',
    category: 'Lifting and cranage',
    riskIndex: 54,
    aiConfidence: 78,
    owner: 'Maintenance Supervisor',
    explanation: 'This is positive movement showing that targeted verification is improving control behaviour.',
    whatHappens: 'The recent targeted verification is improving conditions around lifting and cranage controls.',
    evidenceSignals: [
      { title: 'Improving trend', detail: 'Control performance is tracking positively.' },
    ],
    locations: [
      { name: 'Heavy vehicle workshop / Maintenance', riskScore: 'Low', trend: 'Decreasing', issue: 'Positive movement', owner: 'Maintenance Supervisor', action: 'Share practice' },
    ],
    controls: [
      { control: 'Lifting controls', status: 'Stable', health: '86%', evidence: 'No material degradation', action: 'Monitor' },
    ],
    timeline: [
      { date: '15 Jun', detail: 'Targeted verification introduced and performance improved' },
    ],
    behaviourThemes: [
      { title: 'Positive practice', explanation: 'The team is benefiting from targeted verification.', evidenceCount: 1, linkedControl: 'Lifting controls', leadershipQuestion: 'How can we replicate this approach?' },
    ],
    assurance: {
      coverage: 88,
      target: 85,
      gap: -3,
      missingCoverage: [],
      plannedActivities: ['1 CCV'],
      overdue: [],
    },
    actions: ['Share positive practice'],
  },
  {
    id: 'pedestrian-mobile-equipment-interface',
    title: 'Pedestrian and mobile equipment interface observations increasing',
    type: 'Emerging risk',
    dateDetected: '14 Jun',
    site: 'Gudai-Darri',
    siteValue: 'gudai',
    area: 'Load & Haul',
    location: 'Shared access points',
    severity: 'High',
    trend: 'Increasing +13%',
    controlHealth: 'At Risk',
    assuranceCoverage: 66,
    status: 'Action required',
    recommendedAction: 'Increase field leadership focus',
    category: 'Vehicle interaction',
    riskIndex: 83,
    aiConfidence: 79,
    owner: 'Operations Supervisor',
    explanation: 'Observations show the interface between pedestrians and mobile equipment is increasing around shared access points.',
    whatHappens: 'This is an emerging signal showing a rising exposure around shared access points.',
    evidenceSignals: [
      { title: 'Observation cluster', detail: 'Pedestrian and mobile equipment interface observations are increasing.' },
    ],
    locations: [
      { name: 'Shared access points / Load & Haul', riskScore: 'High', trend: 'Increasing', issue: 'Pedestrian and mobile equipment interface', owner: 'Operations Supervisor', action: 'Increase field leadership' },
    ],
    controls: [
      { control: 'Traffic separation', status: 'At Risk', health: '60%', evidence: 'Observation cluster', action: 'Review control' },
    ],
    timeline: [
      { date: '14 Jun', detail: 'Observation cluster identified' },
    ],
    behaviourThemes: [
      { title: 'Shared access point exposure', explanation: 'The access point is generating recurring exposure.', evidenceCount: 1, linkedControl: 'Traffic separation', leadershipQuestion: 'How is field leadership managing the interface?' },
    ],
    assurance: {
      coverage: 66,
      target: 85,
      gap: 19,
      missingCoverage: ['Shared access point checks'],
      plannedActivities: ['1 CCV'],
      overdue: ['1 action'],
    },
    actions: ['Increase field leadership focus', 'Add to meeting'],
  },
  {
    id: 'contractor-unfamiliar-road-rules',
    title: 'Contractor unfamiliarity with site road rules appearing in field notes',
    type: 'Weak signal',
    dateDetected: '13 Jun',
    site: 'West Angelas',
    siteValue: 'west',
    area: 'Contractor Roads',
    location: 'Contractor entry and access roads',
    severity: 'Medium',
    trend: 'Increasing +7%',
    controlHealth: 'At Risk',
    assuranceCoverage: 69,
    status: 'New',
    recommendedAction: 'Review onboarding and field verification',
    category: 'Contractor road movements',
    riskIndex: 68,
    aiConfidence: 73,
    owner: 'Contractor Coordinator',
    explanation: 'The weak signal shows that contractor unfamiliarity with site road rules is appearing more frequently in field notes.',
    whatHappens: 'The potential exposure is mainly due to contractor unfamiliarity with site road rules around access roads.',
    evidenceSignals: [
      { title: 'Field notes rising', detail: 'Contractor unfamiliarity is appearing more often.' },
    ],
    locations: [
      { name: 'Contractor entry roads / Contractor Roads', riskScore: 'Medium', trend: 'Increasing', issue: 'Unfamiliarity with road rules', owner: 'Contractor Coordinator', action: 'Review onboarding' },
    ],
    controls: [
      { control: 'Site orientation', status: 'At Risk', health: '70%', evidence: 'Field notes rising', action: 'Review onboarding' },
    ],
    timeline: [
      { date: '13 Jun', detail: 'Field note shows unfamiliarity with road rules' },
    ],
    behaviourThemes: [
      { title: 'Onboarding gaps', explanation: 'Contractor onboarding may not be reinforcing site road rules.', evidenceCount: 1, linkedControl: 'Site orientation', leadershipQuestion: 'Are new contractors receiving the right induction?' },
    ],
    assurance: {
      coverage: 69,
      target: 85,
      gap: 16,
      missingCoverage: ['Contractor onboarding'],
      plannedActivities: ['1 CCV'],
      overdue: [],
    },
    actions: ['Review onboarding and field verification'],
  },
]

export default riskItems
