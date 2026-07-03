export type SiteOption = {
  value: string
  label: string
}

export type AreaOption = {
  value: string
  label: string
}

export type RiskLensOption = {
  value: string
  label: string
}

export type TimeframeOption = {
  value: string
  label: string
}

export type TopRisk = {
  id: string
  name: string
  severity: 'High' | 'Medium' | 'Low'
  trend: 'Increasing' | 'Stable' | 'Decreasing'
  controlHealth: 'Degrading' | 'At Risk' | 'Stable'
  affectedAreas: string[]
  recommendedAction: string
  whyFlagged: string
  evidenceSignals: string[]
  controls: string[]
  gmActions: string[]
}

export type WeakSignal = {
  id: string
  title: string
  detail: string
  severity: 'High' | 'Medium' | 'Low'
}

export type RecommendationAction = {
  id: string
  title: string
  detail: string
  primaryAction: string
}

export type NotificationItem = {
  id: string
  priority: 'High' | 'Medium' | 'Company-wide' | 'Positive'
  title: string
  actionLabel: string
}

export type DashboardState = {
  site: string
  area: string
  timeframe: string
  riskLens: string
  customFrom: string
  customTo: string
}
