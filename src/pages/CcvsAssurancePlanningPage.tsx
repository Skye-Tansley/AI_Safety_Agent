import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Role = 'general-manager' | 'manager' | 'superintendent' | 'supervisor'

const siteOptions = [
  { value: 'gnam', label: 'GNAM - Site A' },
  { value: 'pilbara', label: 'Pilbara Ops - All' },
  { value: 'gudai', label: 'Gudai-Darri' },
  { value: 'brockman', label: 'Brockman' },
  { value: 'west', label: 'West Angelas' },
  { value: 'yandi', label: 'Yandicoogina' },
  { value: 'tom', label: 'Tom Price' },
]

const departmentOptions = [
  { value: 'all', label: 'All departments' },
  { value: 'mine', label: 'Mine Operations' },
  { value: 'fixed', label: 'Fixed Plant' },
  { value: 'processing', label: 'Processing' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'rail', label: 'Rail' },
  { value: 'contractor', label: 'Contractor Management' },
]

const teamsByDept: Record<string, { value: string; label: string }[]> = {
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

const months = ['May 2026', 'June 2026', 'July 2026', 'Custom month']

type PlanRow = {
  id: string
  priority: number
  risk: string
  control: string
  area: string
  rationale: string
  plannedDate: string
  owner: string
  status: 'Completed' | 'Planned' | 'Overdue' | 'Not started'
  completion: 'VS complete' | 'FV complete' | 'Not started' | 'Not complete'
}

const initialRows: PlanRow[] = [
  {
    id: '1',
    priority: 1,
    risk: 'Energy Isolation',
    control: 'Isolation - Verification of Zero Energy',
    area: 'Workshop / Isolation Bay',
    rationale: 'Degrading control health 65%, increase in near misses 3',
    plannedDate: '08 May 2026',
    owner: 'MW - M. Williams',
    status: 'Completed',
    completion: 'VS complete',
  },
  {
    id: '2',
    priority: 2,
    risk: 'Working at Height',
    control: 'Fall Protection Systems',
    area: 'Plant Concentrator',
    rationale: 'High exposure tasks, repeat issues in LiF harness use',
    plannedDate: '12 May 2026',
    owner: 'TK - T. Kelly',
    status: 'Completed',
    completion: 'FV complete',
  },
  {
    id: '3',
    priority: 3,
    risk: 'Mobile Equipment',
    control: 'Pre-Start & Safe Operation',
    area: 'ROM Pad',
    rationale: '3 PFIs in last 90 days, control effectiveness declining',
    plannedDate: '15 May 2026',
    owner: 'MW - M. Williams',
    status: 'Planned',
    completion: 'Not started',
  },
  {
    id: '4',
    priority: 4,
    risk: 'Confined Space',
    control: 'Entry - Gas Testing & Permit',
    area: 'Processing Plant Area 2',
    rationale: 'Past incidents, competency gaps identified',
    plannedDate: '20 May 2026',
    owner: 'LS - L. Smith',
    status: 'Overdue',
    completion: 'Not complete',
  },
  {
    id: '5',
    priority: 5,
    risk: 'Line of Fire',
    control: 'Crushing & Conveying',
    area: 'Crushing Plant',
    rationale: 'LiF observations show frequent exposure issues',
    plannedDate: '26 May 2026',
    owner: 'TK - T. Kelly',
    status: 'Planned',
    completion: 'Not started',
  },
]

export default function CcvsAssurancePlanningPage() {
  const navigate = useNavigate()
  const role: Role = (localStorage.getItem('asa_role') as Role) || 'superintendent'
  const [site, setSite] = useState('gnam')
  const [department, setDepartment] = useState('mine')
  const [team, setTeam] = useState('all')
  const [month, setMonth] = useState('May 2026')
  const [tab, setTab] = useState('CCVS Plan')
  const [rows, setRows] = useState<PlanRow[]>(initialRows)
  const [query, setQuery] = useState('')
  const [selectedRow, setSelectedRow] = useState<PlanRow | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<string>(() => new Date().toLocaleString())

  useEffect(() => { if (!toast) return; const t = window.setTimeout(() => setToast(null), 2000); return () => clearTimeout(t) }, [toast])

  useEffect(() => { setTeam('all') }, [department])

  const teamOptions = useMemo(() => teamsByDept[department] ?? teamsByDept.all, [department])

  const kpis = useMemo(() => ({
    fatalFocus: 5,
    ccvsPlanned: 18,
    ccfvPlanned: 42,
    lifThemes: 3,
    coverage: 87,
    vsfvCompletedPct: 61,
    monthlyKpiTarget: 8,
    monthlyCompleted: 5,
    monthlyRemaining: 3,
  }), [])

  const filteredRows = useMemo(() => rows.filter((r) => {
    if (query && !`${r.risk} ${r.control} ${r.area} ${r.owner}`.toLowerCase().includes(query.toLowerCase())) return false
    if (tab === 'CCVS Plan') return true
    if (tab === 'CCFV Plan') return r.completion === 'FV complete' || r.status === 'Completed'
    if (tab === 'LiF Plan') return r.risk.toLowerCase().includes('line of fire') || r.risk.toLowerCase().includes('working at height')
    return true
  }), [rows, query, tab])

  const markVSComplete = (id: string) => setRows((prev) => prev.map((r) => r.id === id ? { ...r, completion: 'VS complete', status: 'Completed' } : r))
  const markFVComplete = (id: string) => setRows((prev) => prev.map((r) => r.id === id ? { ...r, completion: 'FV complete', status: 'Completed' } : r))
  const assignOwner = (id: string, owner: string) => setRows((prev) => prev.map((r) => r.id === id ? { ...r, owner } : r))

  return (
    <div className="page-grid">
      <div className="page-header">
        <div>
          <p className="eyebrow">Assurance Planning</p>
          <h1>Assurance Planning</h1>
          <p className="hero-subtitle">AI-generated assurance plan aligned to highest risks and control health</p>
        </div>
        <div className="header-controls">
          <div className="role-pill">{role === 'superintendent' ? 'SupT: Superintendent View' : 'MGR: Manager View'}</div>
          <label>
            Site
            <select value={site} onChange={(e) => setSite(e.target.value)}>
              {siteOptions.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <label>
            Department
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              {departmentOptions.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </label>
          <label>
            Team
            <select value={team} onChange={(e) => setTeam(e.target.value)}>
              {teamOptions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>
          <label>
            Month
            <select value={month} onChange={(e) => setMonth(e.target.value)}>
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </label>
          <button type="button" className="secondary-button" onClick={() => { setLastRefreshed(new Date().toLocaleString()); setToast('AI-generated assurance plan refreshed using selected site, department, team and month.') }}>Regenerate Plan</button>
          <button type="button" className="secondary-button" onClick={() => setToast('Assurance plan exported using current filters.')}>Export Plan</button>
          <button type="button" className="primary-button" onClick={() => { localStorage.setItem('askai_context', `${role} | CCVS Assurance Planning | ${site} | ${department} | ${team} | ${month}`); setToast('Ask AI context saved') }}>Ask AI</button>
          <div className="muted" style={{fontSize:12, marginTop:6}}>Last refreshed: {lastRefreshed}</div>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi-card clickable" onClick={() => setToast('Top Fatal Risk Focus Areas clicked')}>
          <div className="kpi-label">Top Fatal Risk Focus Areas</div>
          <div className="kpi-value">{kpis.fatalFocus}</div>
          <div className="kpi-sub">High & Extreme Priority</div>
        </div>
        <div className="kpi-card clickable" onClick={() => setToast('CCVS Planned clicked')}>
          <div className="kpi-label">CCVS Planned</div>
          <div className="kpi-value">{kpis.ccvsPlanned}</div>
          <div className="kpi-sub">+3 vs last month</div>
        </div>
        <div className="kpi-card clickable" onClick={() => setToast('CCFV Planned clicked')}>
          <div className="kpi-label">CCFV Planned</div>
          <div className="kpi-value">{kpis.ccfvPlanned}</div>
          <div className="kpi-sub">+6 vs last month</div>
        </div>
        <div className="kpi-card clickable" onClick={() => setToast('LiF Focus Themes clicked')}>
          <div className="kpi-label">LiF Focus Themes</div>
          <div className="kpi-value">{kpis.lifThemes}</div>
          <div className="kpi-sub">New this month</div>
        </div>
        <div className="kpi-card clickable" onClick={() => setToast('Coverage Alignment clicked')}>
          <div className="kpi-label">Coverage Alignment</div>
          <div className="kpi-value">{kpis.coverage}%</div>
          <div className="kpi-sub">Good</div>
        </div>
      </div>

      <div className="content-grid">
        <aside className="left-col">
          <div className="card">
            <h3>AI Insights</h3>
            <ul className="insights-list">
              <li className="insight danger">
                <strong>Energy isolation incidents and control failures are increasing</strong>
                <p>Focus CCFV on isolation in Workshops and Processing Plant.</p>
              </li>
              <li className="insight warn">
                <strong>PTHA quality issues are the top LiF theme this week</strong>
                <p>Consider PTHA refresher coaching and increased verification.</p>
              </li>
              <li className="insight warn">
                <strong>Mobile Equipment controls showing signs of degradation</strong>
                <p>Review seatbelt, exclusion zone and pre-start controls.</p>
              </li>
            </ul>
            <button type="button" className="secondary-button" onClick={() => navigate('/insights')}>View all AI insights</button>
          </div>

          <div className="card">
            <h3>Top 5 Risks by Exposure</h3>
            <table className="simple-table">
              <thead><tr><th>Rank</th><th>Risk</th><th>Exposure</th><th>Trend</th></tr></thead>
              <tbody>
                <tr onClick={() => { setToast('Filtered to Energy Isolation'); setQuery('Energy Isolation') }}><td>1</td><td>Energy Isolation</td><td><span className="chip extreme">Extreme</span></td><td>Up</td></tr>
                <tr onClick={() => { setToast('Filtered to Working at Height'); setQuery('Working at Height') }}><td>2</td><td>Working at Height</td><td><span className="chip high">High</span></td><td>Up</td></tr>
                <tr onClick={() => { setToast('Filtered to Mobile Equipment'); setQuery('Mobile Equipment') }}><td>3</td><td>Mobile Equipment</td><td><span className="chip high">High</span></td><td>Up</td></tr>
                <tr onClick={() => { setToast('Filtered to Line of Fire'); setQuery('Line of Fire') }}><td>4</td><td>Line of Fire</td><td><span className="chip medium">Medium</span></td><td>Down</td></tr>
                <tr onClick={() => { setToast('Filtered to Confined Space'); setQuery('Confined Space') }}><td>5</td><td>Confined Space</td><td><span className="chip medium">Medium</span></td><td>Stable</td></tr>
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3>Control Health Summary</h3>
            <table className="simple-table">
              <thead><tr><th>Control Name</th><th>Health</th><th>Failure Rate</th><th>Trend</th></tr></thead>
              <tbody>
                <tr><td>Isolation Procedure Followed</td><td>Degrading</td><td>32%</td><td>Up</td></tr>
                <tr><td>Verification of Isolation</td><td>At Risk</td><td>18%</td><td>Up</td></tr>
                <tr><td>Isolation Devices Applied</td><td>Stable</td><td>8%</td><td>Down</td></tr>
                <tr><td>Lock / Tag Compliance</td><td>Degrading</td><td>25%</td><td>Up</td></tr>
                <tr><td>Residual Energy Check</td><td>Stable</td><td>5%</td><td>Down</td></tr>
              </tbody>
            </table>
            <button type="button" className="secondary-button" onClick={() => navigate('/control-health')}>View all controls</button>
          </div>
        </aside>

        <main className="centre-col">
          <div className="tabs">
            {['CCVS Plan', 'CCFV Plan', 'LiF Plan', 'Combined View'].map((t) => (
              <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
            ))}
          </div>

          <div className="card">
            <div className="card-title-row">
              <h3>CCVS Plan - Monthly Schedule</h3>
              <div className="small-actions">
                <input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
                <select onChange={() => {}} aria-label="Priority filter"><option>All priorities</option></select>
                <select onChange={() => {}} aria-label="Status filter"><option>All status</option></select>
                <select onChange={() => {}} aria-label="Owner filter"><option>All owners</option></select>
              </div>
            </div>

            <table className="plan-table">
              <thead>
                <tr>
                  <th>Priority</th>
                  <th>Risk / Control Focus</th>
                  <th>Location / Area</th>
                  <th>Rationale</th>
                  <th>Planned Date</th>
                  <th>Owner</th>
                  <th>Status</th>
                  <th>Completion</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r) => (
                  <tr key={r.id} tabIndex={0} onClick={() => setSelectedRow(r)}>
                    <td><span className={`priority-chip p${r.priority}`}>{r.priority}</span></td>
                    <td>
                      <strong>{r.risk}</strong>
                      <div className="muted">{r.control}</div>
                    </td>
                    <td>{r.area}</td>
                    <td>{r.rationale}</td>
                    <td>{r.plannedDate}</td>
                    <td>{r.owner}</td>
                    <td><span className={`status-chip ${r.status.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{r.status}</span></td>
                    <td>{r.completion}</td>
                    <td><button type="button" className="text-button" onClick={(e) => { e.stopPropagation(); setSelectedRow(r) }}>Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="card-actions">
              <button type="button" className="secondary-button" onClick={() => setToast('Viewing full CCVS plan')}>View full CCVS plan</button>
            </div>
          </div>

          <div className="bottom-cards">
            <div className="card heatmap">
              <h4>Risk Heatmap (Exposure)</h4>
              <div className="heatmap-grid">
                <div className="heatmap-row"><div>Workshop</div><div className="cell high" /> <div className="cell extreme" /></div>
                <div className="heatmap-row"><div>Processing Plant</div><div className="cell high" /> <div className="cell extreme" /></div>
                <div className="heatmap-row"><div>ROM Pad</div><div className="cell medium" /> <div className="cell high" /></div>
                <div className="heatmap-row"><div>Crushing Plant</div><div className="cell medium" /> <div className="cell high" /></div>
                <div className="heatmap-row"><div>Admin / Other</div><div className="cell low" /> <div className="cell medium" /></div>
              </div>
              <button type="button" className="secondary-button" onClick={() => setToast('View heatmap details')}>View heatmap details</button>
            </div>

            <div className="card">
              <h4>Coverage by Risk Category</h4>
              <div className="bar-chart">
                <div className="bar"><div className="bar-label">Energy Isolation</div><div className="bar-fill" style={{width: '82%'}} /><div className="bar-gap">+2%</div></div>
                <div className="bar"><div className="bar-label">Working at Height</div><div className="bar-fill low" style={{width: '74%'}} /><div className="bar-gap">-6%</div></div>
                <div className="bar"><div className="bar-label">Mobile Equipment</div><div className="bar-fill low" style={{width: '71%'}} /><div className="bar-gap">-9%</div></div>
              </div>
            </div>

            <div className="card">
              <h4>Assurance Effort vs Risk Exposure</h4>
              <div className="effort-list">
                <div>Energy Isolation<div className="small-bars"><div className="fill risk" style={{width:'24%'}}/> <div className="fill effort" style={{width:'18%'}}/></div></div>
                <div>Working at Height<div className="small-bars"><div className="fill risk" style={{width:'22%'}}/> <div className="fill effort" style={{width:'12%'}}/></div></div>
              </div>
            </div>
          </div>

        </main>

        <aside className="right-col">
          <div className="card">
            <h3>Plan Overview</h3>
            <ul className="overview-list">
              <li>Total Risks Considered: 24</li>
              <li>High / Extreme Risks: 8</li>
              <li>Control Health - Degrading: 14</li>
              <li>Repeat Issues Identified: 6</li>
              <li>New / Emerging Risks: 3</li>
            </ul>
            <button type="button" className="text-button" onClick={() => setToast('View risk summary')}>View risk summary</button>
          </div>

          <div className="card">
            <h3>AI Recommendation</h3>
            <p>Based on current risk exposure, control health, incidents and LiF trends, focus assurance effort on Energy Isolation, Working at Heights and Mobile Equipment across Workshop and Plant areas.</p>
            <button type="button" className="secondary-button" onClick={() => setToast('Opening full rationale')}>View full rationale</button>
          </div>

          <div className="card">
            <h3>AI Assistant</h3>
            <p>I can help you understand this insight further. Try asking:</p>
            <div className="suggested-qs">
              <button type="button" className="prompt-pill" onClick={() => { localStorage.setItem('askai_context', `${role} | CCVS Assurance Planning | ${site} | ${department} | ${team} | ${month}`); setToast('Ask AI opened') }}>What is driving the increase in isolation risks?</button>
              <button type="button" className="prompt-pill" onClick={() => { localStorage.setItem('askai_context', `${role} | CCVS Assurance Planning | ${site} | ${department} | ${team} | ${month}`); setToast('Ask AI opened') }}>Which controls are failing most often?</button>
            </div>
            <div className="ai-input">
              <input placeholder="Ask a question..." />
              <button type="button" className="primary-button" onClick={() => setToast('Question sent to Ask AI')}>Send</button>
            </div>
          </div>
        </aside>
      </div>

      {selectedRow && (
        <div className="detail-drawer open">
          <div className="card-title-row">
            <h3>Assurance Activity Detail</h3>
            <button type="button" className="text-button" onClick={() => setSelectedRow(null)}>Close</button>
          </div>
          <div className="drawer-content">
            <p><strong>{selectedRow.risk}</strong> — {selectedRow.control}</p>
            <p>Location: {selectedRow.area}</p>
            <p>Owner: {selectedRow.owner}</p>
            <p>Planned Date: {selectedRow.plannedDate}</p>
            <p>Status: {selectedRow.status}</p>
            <p>Completion: {selectedRow.completion}</p>
            <p>KPI contribution: {selectedRow.priority <= 3 ? 'High' : 'Medium'}</p>
            <div className="drawer-actions">
              <button type="button" className="secondary-button" onClick={() => { markVSComplete(selectedRow.id); setSelectedRow((prev) => prev ? { ...prev, completion: 'VS complete', status: 'Completed' } : prev) }}>Mark VS complete</button>
              <button type="button" className="secondary-button" onClick={() => { markFVComplete(selectedRow.id); setSelectedRow((prev) => prev ? { ...prev, completion: 'FV complete', status: 'Completed' } : prev) }}>Mark FV complete</button>
              <button type="button" className="secondary-button" onClick={() => { assignOwner(selectedRow.id, 'New Owner - J. Doe'); setSelectedRow((prev) => prev ? { ...prev, owner: 'New Owner - J. Doe' } : prev); setToast('Owner assigned') }}>Assign owner</button>
              <button type="button" className="secondary-button" onClick={() => setToast('Pushed to Field Priorities')}>Push to Field Priorities</button>
              <button type="button" className="secondary-button" onClick={() => setToast('Pushed to Supervisor Shift Guidance')}>Push to Supervisor Shift Guidance</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
