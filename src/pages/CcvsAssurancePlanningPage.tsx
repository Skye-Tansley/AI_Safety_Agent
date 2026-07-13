import { useEffect, useMemo, useState } from 'react'

type PlanRow = {
  id: string
  priority: number
  risk: string
  control: string
  area: string
  rationale: string
  plannedDate: string
  owner: string
  status: 'Completed' | 'Planned' | 'Overdue' | 'Due Soon' | 'In Progress'
  quality: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  planGroup: 'CCVS' | 'CCFV' | 'Combined'
}

const siteOptions = [
  { value: 'gnam', label: 'GMA4 - Site A' },
  { value: 'pilbara', label: 'All Departments' },
  { value: 'gudai', label: 'Gudai-Darri' },
  { value: 'brockman', label: 'Brockman' },
  { value: 'west', label: 'West Angelas' },
  { value: 'yandi', label: 'Yandicoogina' },
  { value: 'tom', label: 'Tom Price' },
]

const departmentOptions = [
  { value: 'all', label: 'All Departments' },
  { value: 'mine', label: 'Mine Operations' },
  { value: 'fixed', label: 'Fixed Plant' },
  { value: 'processing', label: 'Processing' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'rail', label: 'Rail' },
  { value: 'contractor', label: 'Contractor Management' },
]

const teamsByDept: Record<string, { value: string; label: string }[]> = {
  all: [{ value: 'all', label: 'All Teams' }],
  mine: [
    { value: 'all', label: 'All Teams' },
    { value: 't1', label: 'Team 1 - Load & Haul' },
    { value: 't2', label: 'Team 2 - Drill & Blast' },
    { value: 't3', label: 'Team 3 - Mobile Equipment' },
    { value: 't4', label: 'Team 4 - Contractor Roads' },
  ],
  fixed: [
    { value: 'all', label: 'All Teams' },
    { value: 't1', label: 'Team 1 - Shutdown' },
    { value: 't2', label: 'Team 2 - Processing Maintenance' },
    { value: 't3', label: 'Team 3 - Isolation / Permits' },
  ],
  processing: [
    { value: 'all', label: 'All Teams' },
    { value: 't1', label: 'Team 1 - Crushing' },
    { value: 't2', label: 'Team 2 - Conveying' },
    { value: 't3', label: 'Team 3 - Plant Operations' },
  ],
}

const months = ['May 2026', 'June 2026', 'July 2026']

const initialRows: PlanRow[] = [
  {
    id: '1',
    priority: 1,
    risk: 'Energy Isolation',
    control: 'Isolation – Verification of Zero Energy',
    area: 'Workshop / Isolation Bay',
    rationale: 'Degrading control health (85%), increase in near misses',
    plannedDate: '08 May 2026',
    owner: 'M. Williams',
    status: 'Overdue',
    quality: 'Good',
    planGroup: 'CCVS',
  },
  {
    id: '2',
    priority: 2,
    risk: 'Working at Heights',
    control: 'Fall Protection Systems',
    area: 'Plant / Concentrator',
    rationale: 'High exposure tasks, repeat issues in harness use',
    plannedDate: '12 May 2026',
    owner: 'T. Kelly',
    status: 'Due Soon',
    quality: 'Fair',
    planGroup: 'CCVS',
  },
  {
    id: '3',
    priority: 3,
    risk: 'Mobile Equipment',
    control: 'Pre-Start & Safe Operation',
    area: 'ROM Pad',
    rationale: '3 PFIs in last 96 days, control effectiveness declining',
    plannedDate: '15 May 2026',
    owner: 'M. Williams',
    status: 'Completed',
    quality: 'Excellent',
    planGroup: 'CCVS',
  },
  {
    id: '4',
    priority: 4,
    risk: 'Confined Space',
    control: 'Entry – Gas Testing & Permit',
    area: 'Processing Plant / Area 2',
    rationale: 'Past incidents, competency gaps identified',
    plannedDate: '20 May 2026',
    owner: 'L. Smith',
    status: 'In Progress',
    quality: 'Fair',
    planGroup: 'CCVS',
  },
  {
    id: '5',
    priority: 5,
    risk: 'Line of Fire',
    control: 'Crushing & Conveying',
    area: 'Crushing Plant',
    rationale: 'Exposure issues remain elevated in this area',
    plannedDate: '26 May 2026',
    owner: 'T. Kelly',
    status: 'Planned',
    quality: 'Poor',
    planGroup: 'CCVS',
  },
]

export default function CcvsAssurancePlanningPage() {
  const [site, setSite] = useState('gnam')
  const [department, setDepartment] = useState('mine')
  const [team, setTeam] = useState('all')
  const [month, setMonth] = useState('May 2026')
  const [activeTab, setActiveTab] = useState<'CCVS Plan' | 'CCFV Plan' | 'Combined View'>('CCVS Plan')
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')
  const [selectedActionMenu, setSelectedActionMenu] = useState<string | null>(null)
  const [activeDetail, setActiveDetail] = useState<{ type: 'recommendation' | 'insight'; id: string } | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const timeout = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timeout)
  }, [toast])

  useEffect(() => {
    setTeam('all')
  }, [department])

  const teamOptions = useMemo(() => teamsByDept[department] ?? teamsByDept.all, [department])

  const filteredRows = useMemo(() => {
    if (activeTab === 'CCVS Plan') return initialRows.filter((row) => row.planGroup === 'CCVS' || row.planGroup === 'Combined')
    if (activeTab === 'CCFV Plan') return initialRows.filter((row) => row.planGroup === 'CCFV' || row.planGroup === 'Combined')
    return initialRows
  }, [activeTab])

  const detailData = useMemo(
    () => ({
      recommendations: [
        {
          id: 'energy-isolation',
          priority: 'HIGH',
          title: 'Increase focus on Energy Isolation',
          description: 'Control failures and near misses are increasing around Workshop.',
          action: 'Increase CCFV focus on isolation quality.',
          icon: '⚑',
        },
        {
          id: 'ptha-quality',
          priority: 'HIGH',
          title: 'Strengthen PTHA Quality',
          description: 'Inspection data shows poor PTHA quality as a top behaviour trend.',
          action: 'Launch PTHA quality spotlight and coach to standard.',
          icon: '👥',
        },
        {
          id: 'mobile-equipment',
          priority: 'MEDIUM',
          title: 'Review Mobile Equipment Controls',
          description: 'Control effectiveness declining despite high verification rates.',
          action: 'Verify key controls in-field and reinforce pre-start standards.',
          icon: '⚙',
        },
      ],
      insights: [
        {
          id: 'risks-by-exposure',
          title: 'Top 5 Risks by Exposure',
          summary: 'AI selected risks with the highest exposure scores driven by incidents, safety themes and operational exposure.',
          details: 'Exposure scores are ranked to show where assurance focus should be elevated most urgently.',
        },
        {
          id: 'control-health',
          title: 'Control Health Summary',
          summary: 'AI identified controls with higher failure rates and negative trends impacting overall control effectiveness.',
          details: 'This summary highlights controls with degrading performance and those with improving status to guide assurance prioritisation.',
        },
        {
          id: 'risk-heatmap',
          title: 'Risk Heatmap (Exposure)',
          summary: 'AI highlights areas with the greatest concentration of high and extreme exposure risks.',
          details: 'The heatmap groups risk exposure by location and severity to help allocate assurance effort to the most material areas.',
        },
        {
          id: 'coverage-by-category',
          title: 'Coverage by Risk Category',
          summary: 'AI compares plan coverage against targets to identify priority gaps by risk category.',
          details: 'Use the coverage gaps to focus assurance effort on under-covered risk categories before the next review.',
        },
        {
          id: 'assurance-effort',
          title: 'Assurance Effort vs Risk Exposure',
          summary: 'AI evaluates alignment between assurance effort and risk exposure to focus resources effectively.',
          details: 'The alignment index helps leaders see whether current effort is proportionate to exposure risk across categories.',
        },
      ],
    }),
    [],
  )

  const qualityClass = (quality: PlanRow['quality']) => {
    switch (quality) {
      case 'Excellent':
        return 'ccvs-badge ccvs-badge-green'
      case 'Good':
        return 'ccvs-badge ccvs-badge-teal'
      case 'Fair':
        return 'ccvs-badge ccvs-badge-amber'
      case 'Poor':
        return 'ccvs-badge ccvs-badge-red'
      default:
        return 'ccvs-badge'
    }
  }

  const statusClass = (status: PlanRow['status']) => {
    switch (status) {
      case 'Overdue':
        return 'ccvs-badge ccvs-badge-red'
      case 'Due Soon':
        return 'ccvs-badge ccvs-badge-amber'
      case 'Completed':
        return 'ccvs-badge ccvs-badge-green'
      case 'In Progress':
        return 'ccvs-badge ccvs-badge-blue'
      default:
        return 'ccvs-badge ccvs-badge-muted'
    }
  }

  const priorityClass = (priority: number) => {
    if (priority === 1) return 'ccvs-priority ccvs-priority-red'
    if (priority === 2) return 'ccvs-priority ccvs-priority-orange'
    if (priority === 3) return 'ccvs-priority ccvs-priority-amber'
    return 'ccvs-priority ccvs-priority-muted'
  }

  return (
    <div className="ccvs-page">
      <div className="ccvs-page-head">
        <div>
          <div className="ccvs-eyebrow">CCVS Assurance Planning</div>
          <h2>AI-generated assurance plan aligned to highest risks and control health</h2>
        </div>
        <div className="ccvs-actions">
          <button type="button" className="secondary-button" onClick={() => setToast('Plan exported')}>Export Plan</button>
          <button type="button" className="primary-button" onClick={() => setToast('Plan regenerated')}>Regenerate Plan</button>
        </div>
      </div>

      <div className="ccvs-filter-row">
        <label>
          <span>Site</span>
          <select value={site} onChange={(event) => setSite(event.target.value)}>
            {siteOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Department</span>
          <select value={department} onChange={(event) => setDepartment(event.target.value)}>
            {departmentOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Team / Area</span>
          <select value={team} onChange={(event) => setTeam(event.target.value)}>
            {teamOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Month</span>
          <select value={month} onChange={(event) => setMonth(event.target.value)}>
            {months.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="ccvs-kpi-row">
        {[
          { title: 'Top Fatal Risk Focus Areas', value: '5', meta: 'High & Extreme Priority', trend: '↑ 2 from last month', icon: '⚠', tone: 'red' },
          { title: 'CCVS Planned', value: '18', meta: 'This Month · 12 Complete', trend: '67%', icon: '🛡', tone: 'muted' },
          { title: 'CCFV Planned', value: '42', meta: 'This Month · 26 Complete', trend: '62%', icon: '✓', tone: 'green' },
          { title: 'Controls Requiring Attention', value: '14', meta: 'Degrading Controls', trend: '↑ 4 since last month', icon: '⚙', tone: 'orange' },
          { title: 'Emerging Risks', value: '3', meta: '2 New · 1 Escalating', trend: 'Escalating', icon: '↗', tone: 'red' },
          { title: 'AI Recommendations', value: '3', meta: '2 High · 1 Medium', trend: 'High Priority', icon: '💡', tone: 'red' },
        ].map((item) => (
          <article key={item.title} className="ccvs-kpi-card">
            <div className="ccvs-kpi-head">
              <div className="ccvs-kpi-title">{item.title}</div>
              <div className={`ccvs-kpi-icon ${item.tone}`}>{item.icon}</div>
            </div>
            <div className="ccvs-kpi-value">{item.value}</div>
            <div className="ccvs-kpi-meta">{item.meta}</div>
            <div className="ccvs-kpi-trend">{item.trend}</div>
            {(item.title === 'CCVS Planned' || item.title === 'CCFV Planned') && (
              <div className="ccvs-progress-bar"><span style={{ width: item.title === 'CCVS Planned' ? '67%' : '62%' }} /></div>
            )}
          </article>
        ))}
      </div>

      <div className="ccvs-main-row">
        <section className="ccvs-card ccvs-table-card">
          <div className="ccvs-card-head">
            <div>
              <div className="ccvs-card-eyebrow">CCVS Plan</div>
              <h3>CCVS Plan – Monthly Schedule</h3>
            </div>
            <div className="ccvs-tabs">
              {['CCVS Plan', 'CCFV Plan', 'Combined View'].map((tab) => (
                <button key={tab} type="button" className={`ccvs-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab as typeof activeTab)}>{tab}</button>
              ))}
            </div>
          </div>

          <div className="ccvs-summary-row">
            <div><span>Planned</span><strong>18</strong></div>
            <div><span>Completed</span><strong>12</strong></div>
            <div><span>Completion</span><strong>67%</strong></div>
            <div className="ccvs-progress-bar compact"><span style={{ width: '67%' }} /></div>
          </div>

          <div className="ccvs-views">
            <button type="button" className={`ccvs-pill ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>Table View</button>
            <button type="button" className={`ccvs-pill ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>Calendar View</button>
          </div>

          {viewMode === 'table' ? (
            <div className="ccvs-table-wrap">
              <table className="ccvs-table">
                <thead>
                  <tr>
                    <th>Priority</th>
                    <th>Risk / Control Focus</th>
                    <th>Location / Area</th>
                    <th>Rationale</th>
                    <th>Planned Date</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>
                      <span className="ccvs-tooltip-trigger">
                        Quality of Responses
                        <span className="ccvs-tooltip">...</span>
                      </span>
                    </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id}>
                      <td><span className={priorityClass(row.priority)}>{row.priority}</span></td>
                      <td>
                        <div className="ccvs-risk-title">{row.risk}</div>
                        <div className="ccvs-risk-subtitle">{row.control}</div>
                      </td>
                      <td>{row.area}</td>
                      <td>{row.rationale}</td>
                      <td>{row.plannedDate}</td>
                      <td>{row.owner}</td>
                      <td><span className={statusClass(row.status)}>{row.status}</span></td>
                      <td><span className={qualityClass(row.quality)}>{row.quality}</span></td>
                      <td className="ccvs-actions-cell">
                        <button type="button" className="ccvs-menu-button" onClick={() => setSelectedActionMenu(selectedActionMenu === row.id ? null : row.id)}>⋯</button>
                        {selectedActionMenu === row.id && (
                          <div className="ccvs-menu">
                            <button type="button" onClick={() => setToast(`Viewing ${row.risk}`)}>View Details</button>
                            <button type="button" onClick={() => setToast(`Editing ${row.risk}`)}>Edit Plan</button>
                            <button type="button" onClick={() => setToast(`Ask AI about ${row.risk}`)}>Ask AI</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="ccvs-mini-calendar">
              <div className="ccvs-mini-calendar-grid">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                  <div key={day} className="ccvs-mini-day-label">{day}</div>
                ))}
                {Array.from({ length: 14 }).map((_, index) => {
                  const day = index + 1
                  const event = index % 3 === 0 ? 'Isolation' : index % 3 === 1 ? 'Heights' : 'Equipment'
                  return (
                    <div key={day} className="ccvs-mini-day">
                      <span>{day}</span>
                      {day % 4 === 0 && <div className="ccvs-mini-chip">{event}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        <aside className="ccvs-card ccvs-recommendations-card">
          <div className="ccvs-card-head compact">
            <h3>AI Recommendations</h3>
            <button type="button" className="text-button" onClick={() => setActiveDetail({ type: 'recommendation', id: 'all' })}>View all</button>
          </div>
          <div className="ccvs-recommendation-list">
            {detailData.recommendations.map((item) => (
              <button key={item.id} type="button" className={`ccvs-rec-card ${item.priority === 'HIGH' ? 'high' : 'medium'}`} onClick={() => setActiveDetail({ type: 'recommendation', id: item.id })}>
                <div className="ccvs-rec-top">
                  <span className={`ccvs-rec-pill ${item.priority === 'HIGH' ? 'high' : 'medium'}`}>{item.priority}</span>
                  <span className="ccvs-rec-icon">{item.icon}</span>
                </div>
                <div className="ccvs-rec-title">{item.title}</div>
                <div className="ccvs-rec-copy">{item.description}</div>
                <div className="ccvs-rec-action">Action: {item.action}</div>
              </button>
            ))}
          </div>
        </aside>
      </div>

      <div className="ccvs-insights-row">
        <article className="ccvs-card ccvs-insight-card">
          <div className="ccvs-card-head compact">
            <h4>Top 5 Risks by Exposure</h4>
            <button type="button" className="text-button" onClick={() => setActiveDetail({ type: 'insight', id: 'risks-by-exposure' })}>Learn more</button>
          </div>
          <div className="ccvs-rank-list">
            {[
              { label: 'Energy Isolation', score: '92', severity: 'Extreme', trend: '↑' },
              { label: 'Working at Heights', score: '78', severity: 'High', trend: '↑' },
              { label: 'Mobile Equipment', score: '67', severity: 'High', trend: '→' },
              { label: 'Line of Fire', score: '54', severity: 'Medium', trend: '↓' },
              { label: 'Confined Space', score: '41', severity: 'Medium', trend: '→' },
            ].map((item) => (
              <div key={item.label} className="ccvs-rank-item">
                <span className="ccvs-rank-icon">{item.trend}</span>
                <div className="ccvs-rank-label">{item.label}</div>
                <div className="ccvs-rank-score">{item.score}</div>
                <div className={`ccvs-rank-severity ${item.severity.toLowerCase()}`}>{item.severity}</div>
              </div>
            ))}
          </div>
          <p className="ccvs-card-foot">AI selected risks with the highest exposure scores driven by incidents, safety themes and operational exposure.</p>
          <div className="ccvs-inline-actions"><button type="button" className="secondary-button small" onClick={() => setActiveDetail({ type: 'insight', id: 'risks-by-exposure' })}>AI Summary</button><button type="button" className="secondary-button small" onClick={() => setActiveDetail({ type: 'insight', id: 'risks-by-exposure' })}>Learn more</button></div>
        </article>

        <article className="ccvs-card ccvs-insight-card">
          <div className="ccvs-card-head compact">
            <h4>Control Health Summary</h4>
            <button type="button" className="text-button" onClick={() => setActiveDetail({ type: 'insight', id: 'control-health' })}>Learn more</button>
          </div>
          <div className="ccvs-compact-list">
            {[
              ['Isolation Procedure Followed', 'Degrading', '32%'],
              ['Verification of Isolation', 'At Risk', '18%'],
              ['Isolation Devices Applied', 'Stable', '8%'],
              ['Lock / Tag Compliance', 'Degrading', '25%'],
              ['Residual Energy Check', 'Stable', '5%'],
            ].map((entry) => (
              <div key={entry[0]} className="ccvs-compact-row">
                <span>{entry[0]}</span>
                <span className={`ccvs-pill-status ${entry[1].toLowerCase().replace(/[^a-z]+/g, '-')}`}>{entry[1]}</span>
                <strong>{entry[2]}</strong>
              </div>
            ))}
          </div>
          <p className="ccvs-card-foot">AI identified controls with higher failure rates and negative trends impacting overall control effectiveness.</p>
          <div className="ccvs-inline-actions"><button type="button" className="secondary-button small" onClick={() => setActiveDetail({ type: 'insight', id: 'control-health' })}>AI Summary</button><button type="button" className="secondary-button small" onClick={() => setActiveDetail({ type: 'insight', id: 'control-health' })}>Learn more</button></div>
        </article>

        <article className="ccvs-card ccvs-insight-card">
          <div className="ccvs-card-head compact">
            <h4>Risk Heatmap</h4>
            <button type="button" className="text-button" onClick={() => setActiveDetail({ type: 'insight', id: 'risk-heatmap' })}>Learn more</button>
          </div>
          <div className="ccvs-heatmap">
            {['Workshop', 'Processing Plant', 'ROM Pad', 'Crushing Plant', 'Admin / Other'].map((row) => (
              <div key={row} className="ccvs-heatmap-row">
                <span>{row}</span>
                <div className="ccvs-heat-cell low" />
                <div className="ccvs-heat-cell medium" />
                <div className="ccvs-heat-cell high" />
                <div className="ccvs-heat-cell extreme" />
              </div>
            ))}
          </div>
          <p className="ccvs-card-foot">AI highlights areas with the greatest concentration of high and extreme exposure risks.</p>
          <div className="ccvs-inline-actions"><button type="button" className="secondary-button small" onClick={() => setActiveDetail({ type: 'insight', id: 'risk-heatmap' })}>AI Summary</button><button type="button" className="secondary-button small" onClick={() => setActiveDetail({ type: 'insight', id: 'risk-heatmap' })}>Learn more</button></div>
        </article>

        <article className="ccvs-card ccvs-insight-card">
          <div className="ccvs-card-head compact">
            <h4>Coverage by Risk Category</h4>
            <button type="button" className="text-button" onClick={() => setActiveDetail({ type: 'insight', id: 'coverage-by-category' })}>Learn more</button>
          </div>
          <div className="ccvs-bar-chart">
            {[
              ['Energy Isolation', 80],
              ['Working at Heights', 62],
              ['Mobile Equipment', 74],
              ['Line of Fire', 64],
              ['Confined Space', 61],
            ].map((item) => (
              <div key={item[0]} className="ccvs-bar-row">
                <span>{item[0]}</span>
                <div className="ccvs-bar-track"><div className="ccvs-bar-fill" style={{ width: `${item[1]}%` }} /></div>
                <strong>{item[1]}%</strong>
              </div>
            ))}
          </div>
          <p className="ccvs-card-foot">Overall Coverage 67% vs target 80%, gap -13%.</p>
          <div className="ccvs-inline-actions"><button type="button" className="secondary-button small" onClick={() => setActiveDetail({ type: 'insight', id: 'coverage-by-category' })}>AI Summary</button><button type="button" className="secondary-button small" onClick={() => setActiveDetail({ type: 'insight', id: 'coverage-by-category' })}>Learn more</button></div>
        </article>

        <article className="ccvs-card ccvs-insight-card">
          <div className="ccvs-card-head compact">
            <h4>Assurance Effort vs Risk Exposure</h4>
            <button type="button" className="text-button" onClick={() => setActiveDetail({ type: 'insight', id: 'assurance-effort' })}>Learn more</button>
          </div>
          <div className="ccvs-bar-chart stacked">
            {[
              ['Risk Exposure %', 72, 'red'],
              ['Assurance Effort %', 64, 'navy'],
            ].map((item) => (
              <div key={item[0]} className="ccvs-bar-row">
                <span>{item[0]}</span>
                <div className="ccvs-bar-track"><div className={`ccvs-bar-fill ${item[2]}` } style={{ width: `${item[1]}%` }} /></div>
                <strong>{item[1]}%</strong>
              </div>
            ))}
          </div>
          <div className="ccvs-alignment-box">Alignment Index 72%<span>Good Alignment</span></div>
          <p className="ccvs-card-foot">AI evaluates alignment between assurance effort and risk exposure to focus resources effectively.</p>
          <div className="ccvs-inline-actions"><button type="button" className="secondary-button small" onClick={() => setActiveDetail({ type: 'insight', id: 'assurance-effort' })}>AI Summary</button><button type="button" className="secondary-button small" onClick={() => setActiveDetail({ type: 'insight', id: 'assurance-effort' })}>Learn more</button></div>
        </article>
      </div>

      <div className="ccvs-legend">
        <span>Extreme / Critical</span>
        <span>High</span>
        <span>Medium</span>
        <span>Low / Stable</span>
        <span>Increasing / Worsening</span>
        <span>Stable / No Change</span>
        <span>Decreasing / Improving</span>
      </div>

      {activeDetail && (
        <div className="ccvs-modal-backdrop" onClick={() => setActiveDetail(null)}>
          <div className="ccvs-modal" onClick={(event) => event.stopPropagation()}>
            <div className="ccvs-card-head compact">
              <h3>{activeDetail.type === 'recommendation' ? detailData.recommendations.find((item) => item.id === activeDetail.id)?.title || 'Recommendation' : detailData.insights.find((item) => item.id === activeDetail.id)?.title || 'Insight'}</h3>
              <button type="button" className="text-button" onClick={() => setActiveDetail(null)}>Close</button>
            </div>
            <div className="ccvs-modal-body">
              <p className="ccvs-modal-label">{activeDetail.type === 'recommendation' ? 'Recommendation detail' : 'Insight summary'}</p>
              <p>{activeDetail.type === 'recommendation' ? detailData.recommendations.find((item) => item.id === activeDetail.id)?.description : detailData.insights.find((item) => item.id === activeDetail.id)?.summary}</p>
              <p>{activeDetail.type === 'recommendation' ? detailData.recommendations.find((item) => item.id === activeDetail.id)?.action : detailData.insights.find((item) => item.id === activeDetail.id)?.details}</p>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="ccvs-toast">{toast}</div>}
    </div>
  )
}