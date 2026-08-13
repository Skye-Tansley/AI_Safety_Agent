/**
 * Domain contracts shared by pages, UI components and future API adapters.
 * Keep backend-shaped data types here rather than in React components.
 */

export type AppRole = 'superintendent' | 'supervisor'

export type DashboardPage =
  | 'Fatality Prevention'
  | 'Leadership in the Field'
  | 'Insight Explorer'
  | 'Spotlight Recommendations'

export type PlanView = 'CCVS Plan' | 'CCFV Plan' | 'LIF Plan' | 'Team Focus'

/** The filter values that will eventually be supplied to a dashboard API. */
export interface DashboardFilters {
  site: string
  department: string
  team: string
  member: string
  from: string
  to: string
}

/** A fatality prevention or leadership headline metric. */
export interface Metric {
  label: string
  value: string
  change: string
  context: string
}

/** A recommended fatality-prevention focus area. */
export interface FocusArea {
  name: string
  control: string
  location: string
  recommendation: string
  priority: 'High' | 'Medium' | 'Low'
}

/** A recommended Leadership in the Field interaction. */
export interface LifInteraction {
  name: string
  type: string
  focus: string
  location: string
  recommendation: string
}
