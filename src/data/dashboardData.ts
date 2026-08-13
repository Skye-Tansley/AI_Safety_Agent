import type { AppRole, DashboardFilters, DashboardPage } from '../types/dashboard'

/** Navigation is data-driven so role/page navigation can grow without changing layout code. */
export const navigationItems: Array<{ label: DashboardPage; icon: string }> = [
  { label: 'Fatality Prevention', icon: '♢' },
  { label: 'Leadership in the Field', icon: '♙' },
  { label: 'Insight Explorer', icon: '◉' },
  { label: 'Spotlight Recommendations', icon: '✦' },
]

/** Mutable working rows maintained for compatibility with the current prototype interactions. */
export const focusRows = [
  ['Energy Isolation', 'Isolation – Verification of Zero Energy', 'Workshop / Isolation Bay', 'Repeated isolation concerns and control verification declining.', 'High'],
  ['Working at Heights', 'Fall Protection Systems', 'Plant / Concentrator', 'High exposure trend and repeat observations.', 'High'],
  ['Mobile Equipment', 'Pre-start & Operation', 'ROM Pad', 'Control effectiveness declining in mobile equipment operations.', 'Medium'],
  ['Confined Space', 'Entry – Gas Testing & Permit', 'Processing Plant / Area 2', 'Historical incidents and competency concerns.', 'Medium'],
  ['Line of Fire', 'Crushing & Conveying', 'Crushing Plant', 'Increasing exposure trend observed in interactions.', 'Low'],
]

export const lifRows = [
  ['Coaching Conversation', 'Leadership & Development', 'Workshop / Isolation Bay', 'PTHA quality below target and repeat isolation concerns.'],
  ['Triple C Review', 'Critical Control Verification', 'Plant / Concentrator', 'Control verification gaps and inconsistent evidence quality.'],
  ['Workplace Inspection', 'Work Environment & Hazards', 'ROM Pad', 'Housekeeping and equipment condition concerns.'],
  ['Spotlight Conversation', 'Specific Safety Focus Area', 'Crushing Plant', 'Line of Fire observations and exposure trend increasing.'],
  ['Follow-up Conversation', 'Follow-up & Accountability', 'Processing Plant / Area 2', 'Follow-up actions incomplete in recent interactions.'],
]

const baseFocusRows = focusRows.map(row => [...row])
const baseLifRows = lifRows.map(row => [...row])

/**
 * Deterministic prototype data. It mirrors how an API provider will use filters
 * and roles, while keeping the demo completely frontend-only for now.
 */
export function createDemoData(filters: DashboardFilters, role: AppRole) {
  const signature = `${filters.site}|${filters.department}|${filters.team}|${filters.member}|${filters.from}|${filters.to}`
  const seed = [...signature].reduce((total, character) => total + character.charCodeAt(0), 0)
  const scope = role === 'supervisor'
    ? filters.member || filters.team || 'Tom Kelly’s team'
    : filters.member || filters.team || filters.department || (filters.site === 'All Pilbara sites' ? 'all Pilbara operations' : filters.site)
  const location = role === 'supervisor'
    ? filters.team || 'Workshop / Isolation Bay'
    : filters.team || (filters.department ? `${filters.department} / ${filters.site === 'All Pilbara sites' ? 'Pilbara' : filters.site}` : filters.site === 'All Pilbara sites' ? 'Across Pilbara operations' : filters.site)
  const rotate = <T,>(items: T[]) => items.map((_, index) => items[(index + seed) % items.length])

  return {
    scope,
    location,
    seed,
    priorities: rotate(baseFocusRows).map((row, index) => [row[0], row[1], index === 0 ? location : row[2], `${row[3]} Filtered for ${scope}.`, row[4]]),
    lif: rotate(baseLifRows).map((row, index) => [row[0], row[1], index === 0 ? location : row[2], `${row[3]} Focused on ${scope}.`]),
  }
}
