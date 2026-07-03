import { useEffect, useMemo, useState } from 'react'
import {
  aiRecommendation,
  coachingPrompts,
  completionMetrics,
  heatmapRows,
  leadershipActions,
  months,
  riskLensOptions,
  shiftOptions,
  siteOptions,
  spotlightRecommendations,
  scheduleRows,
  supervisorHandoff,
  teamsByDept,
  topThemes,
  departmentOptions,
  kpiCards,
} from '../data/suptLifData'

type Role = 'general-manager' | 'manager' | 'superintendent' | 'supervisor'

export default function SuperintendentLeadershipInFieldPage() {
  const role: Role = (localStorage.getItem('asa_role') as Role) || 'superintendent'
  const [site, setSite] = useState('gnam')
  const [department, setDepartment] = useState('mine')
  const [team, setTeam] = useState('all')
  const [month, setMonth] = useState('May 2026')
  const [shift, setShift] = useState('All shifts')
  const [riskLens, setRiskLens] = useState('LiF Themes')
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    setTeam('all')
  }, [department])

  const availableTeams = useMemo(() => teamsByDept[department] ?? teamsByDept.all, [department])

  const filteredSchedule = useMemo(() => {
    return scheduleRows.filter((row) => {
      if (query && !`${row.theme} ${row.focus} ${row.area} ${row.rationale} ${row.owner}`.toLowerCase().includes(query.toLowerCase())) {
        return false
      }
      if (riskLens === 'LiF Themes') {
        return row.theme.toLowerCase().includes('line of fire') || row.theme.toLowerCase().includes('mobile equipment') || row.theme.toLowerCase().includes('fatigue')
      }
      return true
    })
  }, [query, riskLens])

  return (
    <div className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Leadership in the Field</p>
          <h1>Superintendent LiF Planning</h1>
          <p className="hero-subtitle">Plan and align field leadership activity around Line of Fire, PTHA quality and critical control coaching for the next operational cycle.</p>
        </div>
        <div className="header-controls">
          <div className="role-pill">{role === 'superintendent' ? 'SupT: Superintendent View' : 'View'}</div>
          <label>
            Site
            <select value={site} onChange={(event) => setSite(event.target.value)}>
              {siteOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            Department
            <select value={department} onChange={(event) => setDepartment(event.target.value)}>
              {departmentOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            Team
            <select value={team} onChange={(event) => setTeam(event.target.value)}>
              {availableTeams.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
          <label>
            Month
            <select value={month} onChange={(event) => setMonth(event.target.value)}>
              {months.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            Shift
            <select value={shift} onChange={(event) => setShift(event.target.value)}>
              {shiftOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <label>
            Risk lens
            <select value={riskLens} onChange={(event) => setRiskLens(event.target.value)}>
              {riskLensOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </label>
          <button type="button" className="secondary-button" onClick={() => setToast('LiF plan refreshed for selected site, department, team, shift and lens')}>
            Refresh Plan
          </button>
          <button type="button" className="primary-button" onClick={() => setToast('LiF planning insights exported')}>
            Export Summary
          </button>
        </div>
      </div>

      <div className="kpi-row">
        {kpiCards.map((card) => (
          <div key={card.id} className="kpi-card">
            <div className="kpi-label">{card.label}</div>
            <div className="kpi-value">{card.value}</div>
            <div className="kpi-sub">{card.subtext}</div>
            <div className={`status-chip status-${card.colour}`}>{card.status}</div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <aside className="left-col">
          <div className="card">
            <h3>Top LiF Themes</h3>
            <table className="simple-table">
              <thead>
                <tr>
                  <th>Theme</th>
                  <th>Share</th>
                  <th>Trend</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {topThemes.map((theme) => (
                  <tr key={theme.id}>
                    <td>{theme.theme}</td>
                    <td>{theme.share}</td>
                    <td>{theme.trend}</td>
                    <td><span className={`status-chip status-${theme.badge}`}>{theme.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3>Spotlight Recommendations</h3>
            <div className="signal-list">
              {spotlightRecommendations.map((item) => (
                <div key={item.id} className="signal-card">
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <div className="card-actions">
                    <button type="button" className="text-button" onClick={() => setToast(`${item.action} for ${item.title}`)}>{item.action}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>AI Recommendation</h3>
            <p>{aiRecommendation.summary}</p>
            <button type="button" className="secondary-button" onClick={() => setToast('AI recommendation copied to briefing slide')}>
              Use in briefing
            </button>
          </div>
        </aside>

        <main className="centre-col">
          <div className="card">
            <div className="card-title-row">
              <div>
                <h3>Plan Completion Metrics</h3>
                <p className="muted">Current execution performance based on planned field leadership interactions.</p>
              </div>
              <button type="button" className="secondary-button" onClick={() => setToast('Review completion detail')}>
                Review details
              </button>
            </div>
            <div className="assurance-metrics">
              <div>
                <strong>{completionMetrics.planned}</strong>
                <span>Planned interactions</span>
              </div>
              <div>
                <strong>{completionMetrics.completed}</strong>
                <span>Completed</span>
              </div>
              <div>
                <strong>{completionMetrics.remaining}</strong>
                <span>Remaining</span>
              </div>
              <div>
                <strong>{completionMetrics.overdue}</strong>
                <span>Overdue</span>
              </div>
              <div>
                <strong>{completionMetrics.rate}%</strong>
                <span>Completion rate</span>
              </div>
            </div>
            <div className="summary-sections" style={{ marginTop: '16px' }}>
              {completionMetrics.breakdown.map((item) => (
                <div key={item.label}>
                  <h4>{item.label}</h4>
                  <p>{item.completed} of {item.planned} completed</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-title-row">
              <h3>Leadership Schedule</h3>
              <input placeholder="Search schedule" value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <table className="plan-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Theme</th>
                  <th>Focus area</th>
                  <th>Rationale</th>
                  <th>Planned</th>
                  <th>Owner</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSchedule.map((row) => (
                  <tr key={row.id}>
                    <td>{row.priority}</td>
                    <td>{row.theme}</td>
                    <td>{row.focus}</td>
                    <td>{row.rationale}</td>
                    <td>{row.plannedDate}</td>
                    <td>{row.owner}</td>
                    <td><span className={`status-chip status-${row.status.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <aside className="right-col">
          <div className="card">
            <h3>Supervisor Handoff</h3>
            <p><strong>Focus:</strong> {supervisorHandoff.focus}</p>
            <p><strong>Locations:</strong> {supervisorHandoff.locations.join(', ')}</p>
            <div className="overview-list">
              {supervisorHandoff.prompts.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </div>
            <div className="overview-list">
              <li>Ready to push: {supervisorHandoff.ready}</li>
              <li>Need owner: {supervisorHandoff.needOwner}</li>
              <li>Pushed: {supervisorHandoff.pushed}</li>
            </div>
            <button type="button" className="secondary-button" onClick={() => setToast('Supervisor handoff updated')}>
              Update handoff briefing
            </button>
          </div>

          <div className="card">
            <h3>Coaching prompts</h3>
            <div className="prompt-list">
              {coachingPrompts.map((item) => (
                <button key={item.id} type="button" className="prompt-pill" onClick={() => setToast(`Prompt copied: ${item.prompt}`)}>{item.prompt}</button>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Team heatmap</h3>
            <div className="heatmap-grid">
              <div className="heatmap-row">
                <div>Team</div>
                <div>PTHA</div>
                <div>PPE</div>
                <div>Housekeeping</div>
                <div>Fatigue</div>
                <div>Mobile Eq.</div>
                <div>LiF</div>
              </div>
              {heatmapRows.map((row) => (
                <div key={row.label} className="heatmap-row">
                  <div>{row.label}</div>
                  {row.values.map((value) => (
                    <div key={`${row.label}-${value.column}`} className={`cell ${value.status.toLowerCase()}`}>{value.column}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Leadership actions</h3>
            <div className="leadership-list">
              {leadershipActions.map((action) => (
                <div key={action.id} className="leadership-item">
                  <div>
                    <h4>{action.title}</h4>
                    <p>{action.owner} • due {action.due}</p>
                  </div>
                  <span className={`status-chip status-${action.status.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{action.status}</span>
                </div>
              ))}
            </div>
            <button type="button" className="secondary-button" onClick={() => setToast('Leadership actions synced to field meeting')}>
              Sync to field meeting
            </button>
          </div>
        </aside>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
