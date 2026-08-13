import { areasByDepartment, departmentsBySite, membersByArea, siteOptions } from '../../data/filterCatalog'
import type { DashboardFilters } from '../../types/dashboard'

interface DashboardFiltersProps {
  value: DashboardFilters
  onChange: (filters: DashboardFilters) => void
}

/**
 * Cascading dashboard filters. Only this component knows how child selections
 * reset when a parent filter changes; pages only receive the completed state.
 */
export function DashboardFilters({ value, onChange }: DashboardFiltersProps) {
  const departments = value.site === 'All Pilbara sites'
    ? [...new Set(Object.values(departmentsBySite).flat())].sort()
    : departmentsBySite[value.site] ?? []
  const areas = value.department ? areasByDepartment[value.department] ?? [] : []
  const members = value.team ? membersByArea[value.team] ?? ['Team member examples coming soon'] : []

  const update = (key: keyof DashboardFilters, next: string) => {
    const reset = key === 'site'
      ? { department: '', team: '', member: '' }
      : key === 'department'
        ? { team: '', member: '' }
        : key === 'team'
          ? { member: '' }
          : {}

    onChange({ ...value, ...reset, [key]: next })
  }

  return <div className="filters enhanced-filters">
    <label>Site<select value={value.site} onChange={event => update('site', event.target.value)}>{siteOptions.map(option => <option key={option}>{option}</option>)}</select></label>
    <label>Department<select value={value.department} onChange={event => update('department', event.target.value)}><option value="">All departments</option>{departments.map(option => <option key={option}>{option}</option>)}</select></label>
    <label>Team / area<select value={value.team} disabled={!value.department} onChange={event => update('team', event.target.value)}><option value="">{value.department ? 'All teams / areas' : 'Select a department first'}</option>{areas.map(option => <option key={option}>{option}</option>)}</select></label>
    <label>Team member<select value={value.member} disabled={!value.team} onChange={event => update('member', event.target.value)}><option value="">{value.team ? 'All team members' : 'Select a team / area first'}</option>{members.map(option => <option key={option}>{option}</option>)}</select></label>
    <label className="date-range">Timeframe<span><input aria-label="Start date" type="date" value={value.from} max={value.to} onChange={event => update('from', event.target.value)} /><b>–</b><input aria-label="End date" type="date" value={value.to} min={value.from} onChange={event => update('to', event.target.value)} /></span></label>
  </div>
}
