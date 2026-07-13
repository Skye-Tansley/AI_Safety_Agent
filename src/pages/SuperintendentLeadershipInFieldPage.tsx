import { useEffect, useMemo, useState } from 'react'
import {
  months,
  siteOptions,
  spotlightRecommendations,
  scheduleRows,
  topThemes,
  departmentOptions,
} from '../data/suptLifData'

export default function SuperintendentLeadershipInFieldPage() {
  const [site, setSite] = useState('gnam')
  const [department, setDepartment] = useState('mine')
  const [team, setTeam] = useState('all')
  const [month, setMonth] = useState('May 2026')
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table')
  const [activeTab, setActiveTab] = useState<'LiF Plan' | 'Completed Interactions'>('LiF Plan')
  const [insightTab, setInsightTab] = useState<'Overview' | 'By Theme' | 'By Area' | 'By Person' | 'By Report' | 'Trends Over Time'>('Overview')
  const [selectedReport, setSelectedReport] = useState('PTHA')
  const [selectedActionMenu, setSelectedActionMenu] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)


  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  const lifecycleStatuses = useMemo(() => {
    const countByStatus: Record<string, number> = {}
    scheduleRows.forEach((row) => {
      countByStatus[row.status] = (countByStatus[row.status] ?? 0) + 1
    })
    return countByStatus
  }, [])

  const filteredRows = useMemo(() => {
    if (activeTab === 'Completed Interactions') {
      return scheduleRows.filter((row) => row.status === 'Completed')
    }
    return scheduleRows.filter((row) => row.status !== 'Completed')
  }, [activeTab])

  const areaRows = [
    { label: 'Workshop', interactionCount: 82, quality: 68, hours: 14, riskThemes: 5 },
    { label: 'Processing Plant', interactionCount: 64, quality: 81, hours: 11, riskThemes: 4 },
    { label: 'ROM Pad', interactionCount: 48, quality: 76, hours: 9, riskThemes: 6 },
    { label: 'Crushing Plant', interactionCount: 39, quality: 72, hours: 8, riskThemes: 5 },
    { label: 'Admin / Other', interactionCount: 24, quality: 84, hours: 6, riskThemes: 3 },
  ]

  const personRows = [
    { name: 'M. Williams', interactions: 48, quality: 84, areas: 4, hours: '9.2 hrs' },
    { name: 'T. Kelly', interactions: 42, quality: 79, areas: 3, hours: '8.5 hrs' },
    { name: 'L. Smith', interactions: 36, quality: 76, areas: 2, hours: '6.9 hrs' },
    { name: 'A. Roberts', interactions: 31, quality: 74, areas: 3, hours: '5.4 hrs' },
  ]

  const reportContent: Record<string, { title: string; metrics: Array<{ label: string; value: string }>; findings: string[]; quality: Array<{ label: string; value: string }>; tableRows?: Array<{ label: string; value: string }> }> = {
    PTHA: {
      title: 'PTHA Quality Overview',
      metrics: [
        { label: 'Reviews Completed', value: '58' },
        { label: 'Average Quality', value: '79%' },
        { label: 'Overdue', value: '8' },
      ],
      findings: ['Control verification', 'Procedural compliance', 'PPE fit'],
      quality: [
        { label: 'Excellent', value: '34%' },
        { label: 'Good', value: '33%' },
        { label: 'Fair', value: '21%' },
        { label: 'Poor', value: '12%' },
      ],
    },
    'CCC Review': {
      title: 'CCC Review Summary',
      metrics: [
        { label: 'Reviews Completed', value: '58' },
        { label: 'Average Quality', value: '79%' },
        { label: 'Overdue', value: '8' },
      ],
      findings: ['Control verification', 'Procedural compliance', 'PPE fit'],
      quality: [
        { label: 'Excellent', value: '42%' },
        { label: 'Good', value: '28%' },
        { label: 'Fair', value: '19%' },
        { label: 'Poor', value: '11%' },
      ],
    },
    'Leadership Interaction': {
      title: 'Leadership Interaction Summary',
      metrics: [
        { label: 'Interactions', value: '214' },
        { label: 'Average Quality', value: '72%' },
        { label: 'Follow-Up Rate', value: '63%' },
      ],
      findings: ['Coachable moments', 'Follow-up action closure', 'PPE coaching'],
      quality: [
        { label: 'Excellent', value: '24%' },
        { label: 'Good', value: '48%' },
        { label: 'Fair', value: '21%' },
        { label: 'Poor', value: '7%' },
      ],
    },
    'Workplace Inspection': {
      title: 'Workplace Inspection Summary',
      metrics: [
        { label: 'Inspections', value: '92' },
        { label: 'Quality Score', value: '78%' },
        { label: 'Open Actions', value: '15' },
      ],
      findings: ['Repeat findings', 'Housekeeping risk', 'Barrier condition'],
      quality: [
        { label: 'Excellent', value: '31%' },
        { label: 'Good', value: '39%' },
        { label: 'Fair', value: '20%' },
        { label: 'Poor', value: '10%' },
      ],
    },
    'Hazard Observation': {
      title: 'Hazard Observation Summary',
      metrics: [
        { label: 'Observations', value: '147' },
        { label: 'Average Quality', value: '75%' },
        { label: 'Escalations', value: '19' },
      ],
      findings: ['Near miss detail', 'Control escalation', 'Task planning'],
      quality: [
        { label: 'Excellent', value: '26%' },
        { label: 'Good', value: '44%' },
        { label: 'Fair', value: '21%' },
        { label: 'Poor', value: '9%' },
      ],
    },
    'Safety Conversation': {
      title: 'Safety Conversation Summary',
      metrics: [
        { label: 'Conversations', value: '126' },
        { label: 'Average Quality', value: '77%' },
        { label: 'Coaching Hours', value: '58' },
      ],
      findings: ['Safe decision making', 'Risk awareness', 'Follow-up quality'],
      quality: [
        { label: 'Excellent', value: '36%' },
        { label: 'Good', value: '37%' },
        { label: 'Fair', value: '20%' },
        { label: 'Poor', value: '7%' },
      ],
    },
  }

  const report = reportContent[selectedReport] ?? reportContent.PTHA

  const renderLineChart = (values: number[], color: 'red' | 'amber' | 'green' = 'red') => {
    const max = Math.max(...values)
    const min = Math.min(...values)
    const points = values.map((value, index) => {
      const x = 6 + (index / (values.length - 1)) * 88
      const y = 88 - ((value - min) / (max - min || 1)) * 72
      return `${x},${y}`
    }).join(' ')

    return (
      <svg viewBox="0 0 100 100" className={`lif-svg-chart ${color}`}>
        <polyline points={points} />
        {values.map((value, index) => {
          const x = 6 + (index / (values.length - 1)) * 88
          const y = 88 - ((value - min) / (max - min || 1)) * 72
          return <circle key={`${value}-${index}`} cx={x} cy={y} r="2.2" />
        })}
      </svg>
    )
  }

  return (
    <div className="lif-page">
      <div className="lif-page-head">
        <div>
          <div className="lif-eyebrow">Leadership in the Field</div>
          <h2>Strengthen leadership presence and quality field interactions</h2>
        </div>
        <div className="lif-actions">
          <button type="button" className="secondary-button" onClick={() => setToast('Plan exported')}>Export Plan</button>
          <button type="button" className="primary-button" onClick={() => setToast('Plan regenerated')}>Regenerate Plan</button>
        </div>
      </div>

      <div className="lif-filter-row">
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
            <option value="all">All teams</option>
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

      <div className="lif-kpi-row">
        {[
          { title: 'Top Fatal Risk Focus Areas', value: '5', meta: 'High & Extreme Priority', trend: '↑ 2 from last month', icon: '⚠', tone: 'red' },
          { title: 'LiF Interactions', value: '214', meta: 'This Month', trend: '↑ 15%', icon: '👥', tone: 'muted' },
          { title: 'Quality Interactions', value: '72%', meta: 'Above Target', trend: '↑ 6%', icon: '✓', tone: 'green' },
          { title: 'Leadership Time in Field', value: '36.5 hrs', meta: 'This Month', trend: '↑ 8%', icon: '⏱', tone: 'muted' },
          { title: 'Areas Covered', value: '12', meta: 'Locations', trend: '↑ 2', icon: '📍', tone: 'muted' },
          { title: 'People Reached', value: '487', meta: 'Individuals', trend: '↑ 10%', icon: '👤', tone: 'muted' },
          { title: 'LiF Effectiveness', value: '78%', meta: 'Quality Score', trend: '↑ 5%', icon: '📊', tone: 'green' },
        ].map((item) => (
          <article key={item.title} className="lif-kpi-card">
            <div className="lif-kpi-head">
              <div className="lif-kpi-title">{item.title}</div>
              <div className={`lif-kpi-icon ${item.tone}`}>{item.icon}</div>
            </div>
            <div className="lif-kpi-value">{item.value}</div>
            <div className="lif-kpi-meta">{item.meta}</div>
            <div className="lif-kpi-trend">{item.trend}</div>
          </article>
        ))}
      </div>

      <div className="lif-main-row">
        <section className="lif-card lif-plan-card">
          <div className="lif-card-head">
            <div>
              <div className="lif-card-eyebrow">LiF Monthly Plan</div>
              <h3>LiF Monthly Plan – Planning & Execution</h3>
            </div>
            <div className="lif-tabs">
              {['LiF Plan', 'Completed Interactions'].map((tab) => (
                <button key={tab} type="button" className={`lif-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab as typeof activeTab)}>{tab}</button>
              ))}
            </div>
          </div>

          <div className="lif-summary-row">
            <div><span>Planned</span><strong>{scheduleRows.length}</strong></div>
            <div><span>Completed</span><strong>{lifecycleStatuses['Completed'] ?? 0}</strong></div>
            <div><span>Completion</span><strong>{Math.round(((lifecycleStatuses['Completed'] ?? 0) / scheduleRows.length) * 100)}%</strong></div>
            <div className="lif-progress-bar"><span style={{ width: `${Math.round(((lifecycleStatuses['Completed'] ?? 0) / scheduleRows.length) * 100)}%` }} /></div>
          </div>

          <div className="lif-views">
            <button type="button" className={`lif-pill ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>Table View</button>
            <button type="button" className={`lif-pill ${viewMode === 'calendar' ? 'active' : ''}`} onClick={() => setViewMode('calendar')}>Calendar View</button>
          </div>

          {viewMode === 'table' ? (
            <div className="lif-table-wrap">
              <table className="lif-table">
                <thead>
                  <tr>
                    <th>Priority</th>
                    <th>Theme</th>
                    <th>Area</th>
                    <th>Reason</th>
                    <th>Planned Week</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Quality</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row) => (
                    <tr key={row.id}>
                      <td><span className={`lif-priority-badge priority-${row.priority}`}>{row.priority}</span></td>
                      <td>
                        <div className="lif-theme-title">{row.theme}</div>
                        <div className="lif-theme-subtitle">{row.interactionType}</div>
                      </td>
                      <td>{row.area}</td>
                      <td>{row.rationale}</td>
                      <td>{row.plannedDate}</td>
                      <td>{row.owner}</td>
                      <td><span className={`lif-status-badge status-${row.status.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{row.status}</span></td>
                      <td><span className="lif-quality-badge">Good</span></td>
                      <td className="lif-actions-cell">
                        <button type="button" className="lif-menu-button" onClick={() => setSelectedActionMenu(selectedActionMenu === row.id ? null : row.id)}>⋯</button>
                        {selectedActionMenu === row.id && (
                          <div className="lif-menu">
                            <button type="button" onClick={() => setToast(`Viewing ${row.theme}`)}>View Details</button>
                            <button type="button" onClick={() => setToast(`Editing ${row.theme}`)}>Edit Interaction</button>
                            <button type="button" onClick={() => setToast(`Ask AI about ${row.theme}`)}>Ask AI</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="lif-mini-calendar">
              <div className="lif-mini-calendar-grid">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                  <div key={day} className="lif-mini-day-label">{day}</div>
                ))}
                {Array.from({ length: 14 }).map((_, index) => {
                  const day = index + 1
                  const event = index % 3 === 0 ? 'PTHA' : index % 3 === 1 ? 'PPE' : 'Mobile Eq'
                  return (
                    <div key={day} className="lif-mini-day">
                      <span>{day}</span>
                      {day % 4 === 0 && <div className="lif-mini-chip">{event}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        <aside className="lif-card lif-ai-card">
          <div className="lif-card-head compact">
            <h3>AI Focus & Recommendations</h3>
          </div>

          <div className="lif-ai-section">
            <div className="lif-ai-section-title">Top 5 Focus Areas This Month</div>
            <div className="lif-focus-list">
              {['Line of Fire', 'PPE Quality', 'Hazard Reporting', 'Energy Isolation', 'Follow-up Conversations'].map((item, idx) => (
                <div key={item} className="lif-focus-item">
                  <span className="lif-focus-number">{idx + 1}</span>
                  <span className="lif-focus-label">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lif-ai-section">
            <div className="lif-ai-section-title">AI Insights</div>
            <div className="lif-ai-insight">
              <p>Line of Fire conversations have increased 24% this month. However conversation quality remains below target across Workshop and Concentrator areas.</p>
            </div>
          </div>

          <div className="lif-ai-section">
            <div className="lif-ai-section-title">Recommended Actions</div>
            <div className="lif-actions-list">
              {['Schedule coaching conversations on Line of Fire', 'Improve completion quality of follow-up observations', 'Increase PPE quality reviews in ROM operations'].map((action) => (
                <div key={action} className="lif-action-item">
                  <span className="lif-action-check">✓</span>
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lif-ai-section">
            <div className="lif-ai-section-title">Emerging Trends</div>
            <div className="lif-trends-list">
              <div className="lif-trend-item positive">
                <span className="lif-trend-icon">↑</span>
                <div>
                  <span className="lif-trend-label">Positive Trend</span>
                  <span className="lif-trend-value">Safety Fundamentals</span>
                </div>
              </div>
              <div className="lif-trend-item negative">
                <span className="lif-trend-icon">↓</span>
                <div>
                  <span className="lif-trend-label">Negative Trend</span>
                  <span className="lif-trend-value">Follow-up completion quality</span>
                </div>
              </div>
              <div className="lif-trend-item emerging">
                <span className="lif-trend-icon">→</span>
                <div>
                  <span className="lif-trend-label">Emerging</span>
                  <span className="lif-trend-value">PPE Condition observations</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="lif-card lif-insights-explorer">
        <div className="lif-card-head">
          <h3>LiF Insights Explorer</h3>
          <div className="lif-insights-tabs">
            {['Overview', 'By Theme', 'By Area', 'By Person', 'By Report', 'Trends Over Time'].map((tab) => (
              <button key={tab} type="button" className={`lif-insights-tab ${insightTab === tab ? 'active' : ''}`} onClick={() => setInsightTab(tab as typeof insightTab)}>{tab}</button>
            ))}
          </div>
        </div>

        {insightTab === 'Overview' ? (
          <div className="lif-insights-content">
            <div className="lif-overview-grid">
              <div className="lif-report-card">
                <div className="lif-report-title">KPI Summary</div>
                <div className="lif-kpi-summary-list">
                  <div><span>LiF Interactions</span><strong>214</strong></div>
                  <div><span>Quality Interactions</span><strong>72%</strong></div>
                  <div><span>Leadership Time in Field</span><strong>36.5 hrs</strong></div>
                  <div><span>Areas Covered</span><strong>12</strong></div>
                </div>
                <div className="lif-meta-note">vs previous month +8%</div>
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Interaction Quality Distribution</div>
                <div className="lif-donut-row">
                  <div className="lif-donut-chart">
                    <div className="lif-donut-center">72%</div>
                  </div>
                  <div className="lif-donut-legend">
                    <div><span className="lif-legend-dot green" />High Quality 72% (154)</div>
                    <div><span className="lif-legend-dot amber" />Medium Quality 21% (45)</div>
                    <div><span className="lif-legend-dot red" />Low Quality 7% (15)</div>
                  </div>
                </div>
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Common Themes in Comments</div>
                <div className="lif-bar-stack">
                  {['Risk Awareness', 'Safe Decision Making', 'Equipment Condition', 'PPE and Fit', 'Communication'].map((label, index) => (
                    <div key={label} className="lif-bar-row">
                      <span>{label}</span>
                      <div className="lif-bar-track"><div className="lif-bar-fill red" style={{ width: `${[28, 22, 18, 17, 15][index]}%` }} /></div>
                      <strong>{[28, 22, 18, 17, 15][index]}%</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Comment Sentiment</div>
                <div className="lif-donut-row">
                  <div className="lif-donut-chart amber">
                    <div className="lif-donut-center">61%</div>
                  </div>
                  <div className="lif-donut-legend">
                    <div><span className="lif-legend-dot green" />Positive 61%</div>
                    <div><span className="lif-legend-dot amber" />Neutral 25%</div>
                    <div><span className="lif-legend-dot red" />Negative 14%</div>
                  </div>
                </div>
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">PTHA Quality Overview</div>
                <div className="lif-kpi-summary-list compact">
                  <div><span>Average Quality Score</span><strong>3.4 / 5</strong></div>
                  <div><span>Excellent</span><strong>34%</strong></div>
                  <div><span>Good</span><strong>33%</strong></div>
                  <div><span>Fair</span><strong>21%</strong></div>
                  <div><span>Poor</span><strong>12%</strong></div>
                </div>
              </div>
            </div>
            <div className="lif-ai-insight-card">
              <div className="lif-ai-section-title">AI Summary</div>
              <p>Line of Fire and PPE observations continue to dominate interactions. Quality remains strong overall however repeat generic comments remain concentrated in Workshop operations.</p>
            </div>
          </div>
        ) : null}

        {insightTab === 'By Theme' ? (
          <div className="lif-insights-content">
            <div className="lif-theme-grid">
              <div className="lif-report-card">
                <div className="lif-report-title">Theme Selector</div>
                <div className="lif-theme-pills">
                  {['Safety Fundamentals', 'Risk Awareness', 'PPE Compliance', 'Line of Fire', 'Hazard Reporting'].map((theme) => (
                    <button key={theme} type="button" className="lif-theme-pill">{theme}</button>
                  ))}
                </div>
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Top Themes</div>
                <div className="lif-bar-stack">
                  {[
                    ['Safety Fundamentals', 32],
                    ['Risk Awareness', 24],
                    ['PPE Compliance', 16],
                    ['Line of Fire', 11],
                    ['Hazard Reporting', 10],
                    ['Work Zone Safety', 9],
                    ['Other', 8],
                  ].map(([label, value]) => (
                    <div key={label} className="lif-bar-row">
                      <span>{label}</span>
                      <div className="lif-bar-track"><div className="lif-bar-fill red" style={{ width: `${value}%` }} /></div>
                      <strong>{value}%</strong>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Trend Chart</div>
                {renderLineChart([44, 51, 48, 58, 62, 64], 'red')}
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Theme Quality Breakdown</div>
                <div className="lif-bar-stack">
                  {[
                    ['Safety Fundamentals', '82%'],
                    ['Risk Awareness', '79%'],
                    ['PPE Compliance', '74%'],
                    ['Line of Fire', '68%'],
                    ['Hazard Reporting', '71%'],
                  ].map(([label, value]) => (
                    <div key={label} className="lif-bar-row">
                      <span>{label}</span>
                      <div className="lif-bar-track"><div className="lif-bar-fill amber" style={{ width: `${value.replace('%', '')}%` }} /></div>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lif-ai-insight-card">
              <div className="lif-ai-section-title">AI Insight</div>
              <p>Line of Fire has increased 24% this month but quality of coaching conversations remains below benchmark.</p>
            </div>
          </div>
        ) : null}

        {insightTab === 'By Area' ? (
          <div className="lif-insights-content">
            <div className="lif-area-grid">
              <div className="lif-report-card">
                <div className="lif-report-title">Area Heatmap</div>
                <div className="lif-heatmap-table">
                  <div className="lif-heatmap-head">
                    <span>Area</span><span>Interaction Count</span><span>Avg Quality</span><span>Leadership Hours</span><span>Risk Themes</span>
                  </div>
                  {areaRows.map((row) => (
                    <div key={row.label} className="lif-heatmap-row">
                      <span>{row.label}</span>
                      <span>{row.interactionCount}</span>
                      <span>{row.quality}%</span>
                      <span>{row.hours} hrs</span>
                      <span>{row.riskThemes}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Area Ranking</div>
                <div className="lif-ranking-list">
                  {['Workshop', 'Processing Plant', 'ROM Pad', 'Crushing Plant', 'Admin'].map((item, index) => (
                    <div key={item} className="lif-ranking-item">
                      <span className="lif-ranking-number">{index + 1}</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Area Quality Distribution</div>
                <div className="lif-bar-stack">
                  {areaRows.map((row) => (
                    <div key={row.label} className="lif-bar-row">
                      <span>{row.label}</span>
                      <div className="lif-bar-track"><div className="lif-bar-fill green" style={{ width: `${row.quality}%` }} /></div>
                      <strong>{row.quality}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lif-ai-insight-card">
              <div className="lif-ai-section-title">AI Insight</div>
              <p>Workshop interactions remain highest however quality continues to trail Processing Plant performance.</p>
            </div>
          </div>
        ) : null}

        {insightTab === 'By Person' ? (
          <div className="lif-insights-content">
            <div className="lif-person-grid">
              <div className="lif-report-card">
                <div className="lif-report-title">Person Performance</div>
                <div className="lif-person-table">
                  <div className="lif-person-row head">
                    <span>Person</span><span>Interactions</span><span>Quality Score</span><span>Areas Visited</span><span>Hours in Field</span>
                  </div>
                  {personRows.map((row) => (
                    <div key={row.name} className="lif-person-row">
                      <span>{row.name}</span>
                      <span>{row.interactions}</span>
                      <span>{row.quality}%</span>
                      <span>{row.areas}</span>
                      <span>{row.hours}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Quality Score Distribution</div>
                <div className="lif-bar-stack">
                  {personRows.map((row) => (
                    <div key={row.name} className="lif-bar-row">
                      <span>{row.name}</span>
                      <div className="lif-bar-track"><div className={`lif-bar-fill ${row.quality >= 80 ? 'green' : row.quality >= 75 ? 'amber' : 'red'}`} style={{ width: `${row.quality}%` }} /></div>
                      <strong>{row.quality}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lif-ai-insight-card">
              <div className="lif-ai-section-title">AI Insight</div>
              <p>M. Williams demonstrates the strongest interaction quality and breadth of area coverage this month.</p>
            </div>
          </div>
        ) : null}

        {insightTab === 'By Report' ? (
          <div className="lif-insights-content">
            <div className="lif-report-selector">
              <label>
                <span>Select Report</span>
                <select value={selectedReport} onChange={(event) => setSelectedReport(event.target.value)}>
                  {['PTHA', 'CCC Review', 'Leadership Interaction', 'Workplace Inspection', 'Safety Conversation', 'Hazard Observation'].map((report) => (
                    <option key={report} value={report}>{report}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="lif-report-content">
              <div className="lif-report-card">
                <div className="lif-report-title">{report.title}</div>
                <div className="lif-kpi-summary-list compact">
                  {report.metrics.map((metric) => (
                    <div key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong></div>
                  ))}
                </div>
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Most Common Findings</div>
                <ul className="lif-focus-list-items">
                  {report.findings.map((finding) => (<li key={finding}>{finding}</li>))}
                </ul>
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Review Quality Distribution</div>
                <div className="lif-quality-bars">
                  {report.quality.map((entry) => (
                    <div key={entry.label}>
                      <span>{entry.label}</span>
                      <div className="lif-bar"><span style={{ width: entry.value }} /></div>
                      <span>{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {insightTab === 'Trends Over Time' ? (
          <div className="lif-insights-content">
            <div className="lif-trend-grid">
              <div className="lif-report-card">
                <div className="lif-report-title">Interaction Volume Trend</div>
                {renderLineChart([58, 62, 66, 69, 74, 78, 81, 84, 86, 91, 96, 102], 'red')}
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Quality Score Trend</div>
                {renderLineChart([68, 70, 71, 72, 74, 76, 77, 78, 79, 80, 81, 82], 'green')}
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Top Themes Trend</div>
                <div className="lif-area-chart">
                  <div className="lif-area-bar red" style={{ height: '58%' }} />
                  <div className="lif-area-bar amber" style={{ height: '44%' }} />
                  <div className="lif-area-bar green" style={{ height: '36%' }} />
                  <div className="lif-area-bar red" style={{ height: '52%' }} />
                  <div className="lif-area-bar amber" style={{ height: '41%' }} />
                  <div className="lif-area-bar green" style={{ height: '34%' }} />
                </div>
              </div>
              <div className="lif-report-card">
                <div className="lif-report-title">Leadership Time in Field Trend</div>
                <div className="lif-bar-stack">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                    <div key={month} className="lif-bar-row">
                      <span>{month}</span>
                      <div className="lif-bar-track"><div className="lif-bar-fill amber" style={{ width: `${60 + index * 5}%` }} /></div>
                      <strong>{30 + index * 2} hrs</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lif-ai-insight-card">
              <div className="lif-ai-section-title">AI Insight Panel</div>
              <p><strong>Positive Trend:</strong> Safety Fundamentals<br /><strong>Declining Trend:</strong> Follow-up completion quality<br /><strong>Emerging Trend:</strong> PPE Condition observations</p>
            </div>
          </div>
        ) : null}
      </section>

      <div className="lif-bottom-row">
        <article className="lif-card lif-themes-card">
          <div className="lif-card-head compact">
            <h4>Top LiF Themes</h4>
          </div>
          <div className="lif-theme-bars">
            {topThemes.map((theme) => (
              <div key={theme.id} className="lif-theme-bar-row">
                <span className="lif-theme-bar-label">{theme.theme}</span>
                <div className="lif-bar-track"><div className="lif-bar-fill red" style={{ width: `${parseInt(theme.share)}%` }} /></div>
                <strong>{theme.share}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="lif-card lif-spotlight-card">
          <div className="lif-card-head compact">
            <h4>Spotlight Recommendations</h4>
          </div>
          <div className="lif-spotlight-list">
            {spotlightRecommendations.map((item) => (
              <div key={item.id} className="lif-spotlight-item">
                <div className="lif-spotlight-head">
                  <span className={`lif-severity-pill ${item.severity.toLowerCase()}`}>{item.severity}</span>
                </div>
                <div className="lif-spotlight-title">{item.title}</div>
                <div className="lif-spotlight-copy">{item.description}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="lif-card lif-focus-card">
          <div className="lif-card-head compact">
            <h4>Leadership Focus Areas</h4>
          </div>
          <div className="lif-focus-sections">
            <div className="lif-focus-section">
              <div className="lif-section-title">Coaching Recommendations</div>
              <ul className="lif-focus-list-items">
                <li>Line of Fire field conversations</li>
                <li>PPE compliance coaching</li>
                <li>PTHA quality standards</li>
              </ul>
            </div>
            <div className="lif-focus-section">
              <div className="lif-section-title">Upcoming Work</div>
              <ul className="lif-focus-list-items">
                <li>Mobile equipment focus group</li>
                <li>Housekeeping inspection cycle</li>
                <li>Energy isolation reviews</li>
              </ul>
            </div>
          </div>
        </article>
      </div>

      {toast && <div className="lif-toast">{toast}</div>}
    </div>
  )
}
