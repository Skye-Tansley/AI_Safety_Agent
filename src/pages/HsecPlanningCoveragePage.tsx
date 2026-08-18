import { useState, type ReactNode } from 'react'
import type { DashboardFilters } from '../types/dashboard'

type ScheduleStatus = 'completed' | 'current' | 'planned' | 'missed' | 'unplanned'

interface CoverageRow {
  criticalRisk: string
  criticalControl: string
  verification: 'Design' | 'Implementation' | 'Training'
  leader: string
  role: 'Superintendent' | 'Manager'
  schedule: ScheduleStatus[]
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Prototype annual CCVS schedule; replace with planning-service data in a live build. */
const coverageRows: CoverageRow[] = [
  { criticalRisk: 'Confined Spaces', criticalControl: 'Atmospheric Monitoring', verification: 'Design', leader: 'Wayne Steer', role: 'Superintendent', schedule: ['completed', 'completed', 'unplanned', 'completed', 'unplanned', 'unplanned', 'missed', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Confined Spaces', criticalControl: 'Atmospheric Monitoring', verification: 'Implementation', leader: 'Melissa Jones', role: 'Superintendent', schedule: ['unplanned', 'completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Confined Spaces', criticalControl: 'Entry Permit Execution', verification: 'Training', leader: 'Josh Jennings', role: 'Manager', schedule: ['unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Confined Spaces', criticalControl: 'Isolation and Lockout', verification: 'Design', leader: 'Tristan Raymer', role: 'Superintendent', schedule: ['completed', 'unplanned', 'unplanned', 'missed', 'unplanned', 'unplanned', 'completed', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Confined Spaces', criticalControl: 'Isolation and Lockout', verification: 'Implementation', leader: 'James Ellen', role: 'Manager', schedule: ['unplanned', 'completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Energy Isolation', criticalControl: 'Verification of Zero Energy', verification: 'Design', leader: 'Josh Jennings', role: 'Manager', schedule: ['unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Energy Isolation', criticalControl: 'Verification of Zero Energy', verification: 'Implementation', leader: 'Dylan Jones', role: 'Superintendent', schedule: ['completed', 'unplanned', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Energy Isolation', criticalControl: 'Access Control', verification: 'Training', leader: 'Melissa Jones', role: 'Superintendent', schedule: ['unplanned', 'completed', 'unplanned', 'unplanned', 'unplanned', 'completed', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Electrical Safety', criticalControl: 'Electrical Isolation and Lockout', verification: 'Design', leader: 'James Ellen', role: 'Manager', schedule: ['unplanned', 'completed', 'unplanned', 'unplanned', 'unplanned', 'unplanned', 'missed', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Electrical Safety', criticalControl: 'Electrical PPE', verification: 'Implementation', leader: 'Tristan Raymer', role: 'Superintendent', schedule: ['unplanned', 'unplanned', 'completed', 'unplanned', 'completed', 'unplanned', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Vehicle Interaction', criticalControl: 'Vehicle Exclusion Zones', verification: 'Design', leader: 'Wayne Steer', role: 'Superintendent', schedule: ['completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'unplanned', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Working at Heights', criticalControl: 'Fall Protection Systems', verification: 'Training', leader: 'Dylan Jones', role: 'Superintendent', schedule: ['unplanned', 'completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Vehicle Interaction', criticalControl: 'Pedestrian Segregation', verification: 'Implementation', leader: 'Melissa Jones', role: 'Superintendent', schedule: ['unplanned', 'completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Vehicle Interaction', criticalControl: 'Mobile Equipment Pre-starts', verification: 'Training', leader: 'Josh Jennings', role: 'Manager', schedule: ['completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'unplanned', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Working at Heights', criticalControl: 'Anchor Point Verification', verification: 'Design', leader: 'Tristan Raymer', role: 'Superintendent', schedule: ['unplanned', 'completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'missed', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Working at Heights', criticalControl: 'Work Positioning', verification: 'Implementation', leader: 'Dylan Jones', role: 'Superintendent', schedule: ['completed', 'unplanned', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Dropped Objects', criticalControl: 'Tool Tethering', verification: 'Design', leader: 'Wayne Steer', role: 'Superintendent', schedule: ['unplanned', 'completed', 'unplanned', 'unplanned', 'unplanned', 'completed', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Dropped Objects', criticalControl: 'Overhead Work Exclusion Zones', verification: 'Implementation', leader: 'James Ellen', role: 'Manager', schedule: ['completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'unplanned', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Hazardous Energy', criticalControl: 'Lockout Device Application', verification: 'Training', leader: 'Melissa Jones', role: 'Superintendent', schedule: ['unplanned', 'completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Hazardous Energy', criticalControl: 'Isolation Point Register', verification: 'Design', leader: 'Tristan Raymer', role: 'Superintendent', schedule: ['completed', 'unplanned', 'unplanned', 'unplanned', 'unplanned', 'completed', 'missed', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Hazardous Energy', criticalControl: 'Stored Energy Release', verification: 'Implementation', leader: 'Dylan Jones', role: 'Superintendent', schedule: ['unplanned', 'unplanned', 'completed', 'unplanned', 'completed', 'unplanned', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Lifting Operations', criticalControl: 'Lift Plan Quality', verification: 'Design', leader: 'Josh Jennings', role: 'Manager', schedule: ['completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'unplanned', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Lifting Operations', criticalControl: 'Crane Pre-start Inspection', verification: 'Implementation', leader: 'Wayne Steer', role: 'Superintendent', schedule: ['unplanned', 'completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Lifting Operations', criticalControl: 'Dogging Competency', verification: 'Training', leader: 'James Ellen', role: 'Manager', schedule: ['unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Ground Disturbance', criticalControl: 'Permit and Service Location', verification: 'Design', leader: 'Melissa Jones', role: 'Superintendent', schedule: ['completed', 'unplanned', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Ground Disturbance', criticalControl: 'Excavation Edge Protection', verification: 'Implementation', leader: 'Tristan Raymer', role: 'Superintendent', schedule: ['unplanned', 'completed', 'unplanned', 'unplanned', 'unplanned', 'completed', 'missed', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Chemical Exposure', criticalControl: 'Chemical Register and SDS', verification: 'Training', leader: 'Dylan Jones', role: 'Superintendent', schedule: ['completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'unplanned', 'current', 'planned', 'unplanned', 'unplanned', 'unplanned'] },
  { criticalRisk: 'Chemical Exposure', criticalControl: 'Respiratory Protection', verification: 'Implementation', leader: 'Josh Jennings', role: 'Manager', schedule: ['unplanned', 'completed', 'unplanned', 'unplanned', 'completed', 'unplanned', 'unplanned', 'current', 'planned', 'planned', 'unplanned', 'unplanned'] },
]

const statusSymbols: Record<ScheduleStatus, string> = { completed: '●', current: '○', planned: '○', missed: '×', unplanned: '–' }

/**
 * Advisor-only annual planning view. Its chat is intentionally local demo behaviour
 * until the Copilot Studio connection is available for this prototype.
 */
export function HsecPlanningCoveragePage({ filters }: { filters: DashboardFilters }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const rows = filters.member ? coverageRows.filter(row => row.leader.toLowerCase().includes(filters.member.toLowerCase().split(' ')[0])) : coverageRows

  function askAi(prompt = question) {
    if (!prompt.trim()) return
    setAnswer('Focus first on the August activities that are still in progress, then confirm September and October owners. Two HSEC-scheduled verifications should be protected in each monthly plan.')
    setQuestion('')
  }

  return <section className="hsec-coverage-layout">
    <div className="hsec-coverage">
      <div className="hsec-metrics">
        <CoverageMetric label="Leaders with Planned CCVS" value="37" context="Superintendents & Managers" tone="purple" />
        <CoverageMetric label="Planned This Year" value="324" context="CCVS activities" tone="green" />
        <CoverageMetric label="Completed (Jan – Jul)" value="196" context="61% of planned" tone="blue" />
        <CoverageMetric label="Current Month (Aug)" value="28" context="In progress" tone="orange" />
        <CoverageMetric label="Planned (Sep – Oct)" value="78" context="Upcoming activities" tone="green" />
        <CoverageMetric label="No Plan (Nov – Dec)" value="22" context="Activities require planning" tone="red" />
      </div>
      <section className="card hsec-schedule-card">
        <header className="hsec-schedule-card__header"><div><h2>CCVS Schedule & Coverage</h2><p>Monthly verification coverage across leaders, critical risks and controls.</p></div><button className="outline">Export</button></header>
        <div className="hsec-legend"><span className="completed">● Completed (Jan – Jul)</span><span className="current">○ Current month (Aug)</span><span className="planned">○ Planned (Sep – Oct)</span><span className="missed">× Overdue / missed</span><span className="unplanned">– No plan (Nov – Dec)</span></div>
        <div className="hsec-table-wrap"><table className="hsec-table"><thead><tr><th>Critical Risk</th><th>Critical Control</th><th>Verification Type</th><th>Site</th><th>Department</th><th>Role</th><th>Leader / Supervisor</th>{months.map(month => <th className={month === 'Aug' ? 'current-month' : ''} key={month}>{month}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={`${row.leader}-${row.criticalControl}-${row.verification}`}><td>{index === 0 || rows[index - 1]?.criticalRisk !== row.criticalRisk ? <strong>{row.criticalRisk}</strong> : ''}</td><td>{row.criticalControl}</td><td><span className={`verification verification--${row.verification.toLowerCase()}`}>{row.verification}</span></td><td>{filters.site === 'All Pilbara sites' ? 'GMA4 – Site A' : filters.site}</td><td>{filters.department || 'Fixed Plant Maintenance'}</td><td>{row.role}</td><td>{row.leader}</td>{row.schedule.map((status, monthIndex) => <td className={monthIndex === 7 ? 'current-month' : ''} key={`${row.leader}-${months[monthIndex]}`}><span className={`schedule-status schedule-status--${status}`} title={status}>{statusSymbols[status]}</span></td>)}</tr>)}</tbody></table></div>
        <footer className="hsec-schedule-card__footer">Showing {rows.length} of 28 planned verification activities</footer>
      </section>
    </div>
    <aside className="card hsec-ai-panel">
      <header className="hsec-ai-panel__heading"><h2>✦ AI Planning Recommendations</h2><span aria-hidden="true">☆</span></header>
      <AiRecommendation title="Coverage insight" icon="▥">Twenty-two activities have no plan in November and December. Keep the next two months focused on confirmed control owners.</AiRecommendation>
      <AiRecommendation title="Schedule risk" icon="◷">One July activity remains overdue and 28 August activities are in progress. Confirm completion evidence before the monthly close.</AiRecommendation>
      <AiRecommendation title="Recommended leadership focus" icon="◎">Prioritise Energy Isolation, Confined Spaces and Vehicle Interaction coverage where scheduled verification is incomplete.</AiRecommendation>
      <div className="hsec-ai-callout"><strong>✦ AI recommendation</strong><p>Assign September plans now and protect two HSEC-scheduled CCVS activities for each leader.</p></div>
      <section className="hsec-ai-chat">
        <h3>Ask AI about CCVS planning</h3><p>Get guidance on coverage, overdue activities and upcoming plans.</p>
        {answer && <div className="hsec-ai-answer">{answer}</div>}
        <form onSubmit={event => { event.preventDefault(); askAi() }}><input value={question} onChange={event => setQuestion(event.target.value)} placeholder="Ask a question..." /><button type="submit" aria-label="Send question">➤</button></form>
        <div className="hsec-ai-prompts"><button type="button" onClick={() => askAi('Which leaders need a CCVS plan?')}>Who needs a plan?</button><button type="button" onClick={() => askAi('What is overdue this month?')}>What is overdue?</button></div>
      </section>
    </aside>
  </section>
}

function AiRecommendation({ title, icon, children }: { title: string; icon: string; children: ReactNode }) {
  return <section className="hsec-ai-recommendation"><span>{icon}</span><div><h3>{title}</h3><p>{children}</p></div></section>
}

function CoverageMetric({ label, value, context, tone }: { label: string; value: string; context: string; tone: string }) {
  return <article className={`card hsec-metric hsec-metric--${tone}`}><span aria-hidden="true">◉</span><div><small>{label}</small><strong>{value}</strong><p>{context}</p></div></article>
}
