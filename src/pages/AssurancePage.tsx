import { useMemo, useState } from 'react'
import type { DashboardState } from '../types/dashboard'
import { accountabilityRows, assuranceGaps, assuranceRows, assuranceSchedule, assuranceEvidence } from '../data/gmAssuranceData'

type Props = {
  filters: DashboardState
  onOpenRisk: (riskId: string) => void
  onOpenControlHealth: () => void
  onAskAI: (question: string) => void
  onShowToast: (message: string) => void
}

export default function AssurancePage({ filters, onOpenRisk, onOpenControlHealth, onAskAI, onShowToast }: Props) {
  const [selectedRiskId, setSelectedRiskId] = useState<string | undefined>(undefined)
  const [selectedGapId, setSelectedGapId] = useState<string | undefined>(undefined)
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | undefined>(undefined)

  const selectedRisk = useMemo(() => assuranceRows.find((row) => row.id === selectedRiskId) ?? assuranceRows[0], [selectedRiskId])
  const selectedGap = assuranceGaps.find((gap) => gap.id === selectedGapId)
  const selectedEvidence = assuranceEvidence.find((item) => item.id === selectedEvidenceId)

  const toggleAction = (_id: string, label: string) => {
    onShowToast(label)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <p className="eyebrow">Assurance Oversight</p>
        <h2>General Manager view of whether assurance activity is aligned to current and emerging risk</h2>
        <p className="muted">Context: {filters.site} • {filters.area} • {filters.timeframe} • {filters.riskLens}</p>
      </div>

      <section className="decision-banner small">
        <div>
          <p className="eyebrow">Decision required</p>
          <h3>Current assurance coverage is 74% aligned to the active risk profile. Vehicle interaction and line of fire have coverage gaps. AI recommends reviewing the next fortnight’s CCV and CCFV schedule before finalising leadership priorities.</h3>
        </div>
        <div className="banner-actions">
          <button className="secondary-button" onClick={() => document.getElementById('coverage-gaps')?.scrollIntoView({ behavior: 'smooth' })}>Review coverage gaps</button>
          <button className="secondary-button" onClick={() => onAskAI('Why is assurance coverage below the current risk profile?')}>Ask AI why</button>
          <button className="primary-button" onClick={() => onShowToast('Added to leadership meeting')}>Add to leadership meeting</button>
          <button className="secondary-button" onClick={() => onShowToast('Assurance oversight summary exported using current filters')}>Export plan summary</button>
        </div>
      </section>

      <section className="kpi-strip">
        <button className="kpi-card" type="button" onClick={() => onShowToast('Coverage explained')}><h4>Risk-Aligned Coverage</h4><h3>74%</h3><p className="muted">Target 85%</p></button>
        <button className="kpi-card" type="button" onClick={() => onShowToast('Coverage gaps explained')}><h4>Top Risks Under-Covered</h4><h3>2</h3><p className="muted">Vehicle interaction, Line of fire</p></button>
        <button className="kpi-card" type="button" onClick={() => onShowToast('Planned CCV explained')}><h4>Planned CCV Activities</h4><h3>18</h3><p className="muted">Next fortnight</p></button>
        <button className="kpi-card" type="button" onClick={() => onShowToast('Planned CCFV explained')}><h4>Planned CCFV Activities</h4><h3>12</h3><p className="muted">Next fortnight</p></button>
        <button className="kpi-card" type="button" onClick={() => onShowToast('Overdue assurance items explained')}><h4>Overdue Assurance Items</h4><h3>3</h3><p className="muted">2 linked to vehicle interaction</p></button>
        <button className="kpi-card" type="button" onClick={() => onShowToast('Unassigned follow-ups explained')}><h4>Unassigned Follow-ups</h4><h3>4</h3><p className="muted">Manager ownership required</p></button>
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <div className="card-title-row"><h3>Why this plan has been recommended</h3></div>
          <p>The assurance plan has been adjusted because vehicle interaction risk has increased, traffic separation verification is degrading, and field observations show repeated line of fire exposure. Current planned assurance activity is still weighted toward routine checks, which leaves gaps in contractor road movements and night shift traffic separation.</p>
          <div className="summary-sections">
            <div><h4>What changed</h4><p>Vehicle interaction and line of fire have risen in the current period.</p></div>
            <div><h4>Why the plan changed</h4><p>Assurance activity needs to shift toward higher-risk and higher-movement areas.</p></div>
            <div><h4>Confidence</h4><p>High</p></div>
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Assurance alignment by top risk</h3></div>
          <table>
            <thead><tr><th>Risk</th><th>Planned coverage</th><th>Target</th><th>Gap</th><th>Status</th></tr></thead>
            <tbody>
              {assuranceRows.map((row) => (
                <tr key={row.id} onClick={() => setSelectedRiskId(row.id)}>
                  <td>{row.risk}</td>
                  <td>{row.plannedCoverage}%</td>
                  <td>{row.targetCoverage}%</td>
                  <td>{row.gap}%</td>
                  <td><span className={`status-pill ${row.status.toLowerCase().replace(/ /g, '-')}`}>{row.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Fortnight assurance schedule</h3></div>
          <div className="signal-list">
            {assuranceSchedule.map((item) => (
              <button key={item.id} type="button" className="signal-card" onClick={() => onShowToast(`${item.type} ${item.risk} selected`)}>
                <h4>{item.type} • {item.risk}</h4>
                <p>{item.area} • {item.owner} • {item.status}</p>
              </button>
            ))}
          </div>
        </article>

        <article id="coverage-gaps" className="card">
          <div className="card-title-row"><h3>Coverage gaps</h3></div>
          <div className="leadership-list">
            {assuranceGaps.map((gap) => (
              <div key={gap.id} className="leadership-item">
                <div><h4>{gap.title}</h4><p>{gap.reason}</p><p className="muted">Suggested activity: {gap.suggestedActivity}</p></div>
                <div className="card-actions">
                  <button className="secondary-button small" onClick={() => { setSelectedGapId(gap.id); toggleAction(gap.id + '-meeting', 'Added to meeting') }}>Add challenge</button>
                  <button className="secondary-button small" onClick={() => { setSelectedGapId(gap.id); toggleAction(gap.id + '-review', 'Requested review') }}>Request review</button>
                  <button className="secondary-button small" onClick={() => { setSelectedGapId(gap.id); toggleAction(gap.id + '-accepted', 'Marked accepted') }}>Mark accepted</button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Activity mix: CCV vs CCFV</h3></div>
          <p>CCV: 18 activities</p>
          <p>CCFV: 12 activities</p>
          <p>Leadership field focus: 8 activities</p>
          <p className="muted">Current mix is weighted toward technical verification. AI recommends adding more field verification for vehicle interaction and line of fire themes.</p>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Manager accountability and plan status</h3></div>
          <table>
            <thead><tr><th>Manager / Area</th><th>Status</th><th>Coverage</th><th>Open gaps</th><th>Next action</th></tr></thead>
            <tbody>
              {accountabilityRows.map((row) => (
                <tr key={row.id}>
                  <td>{row.manager}</td>
                  <td>{row.status}</td>
                  <td>{row.coverage}%</td>
                  <td>{row.openGaps}</td>
                  <td>{row.nextAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Evidence signals driving the plan</h3></div>
          <div className="signal-list">
            {assuranceEvidence.map((item) => (
              <button key={item.id} type="button" className="signal-card" onClick={() => setSelectedEvidenceId(item.id)}>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
                <span className={`signal-severity ${item.severity.toLowerCase()}`}>{item.severity}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>GM challenge points for leadership meeting</h3></div>
          <ul>
            <li>Ask whether current assurance work is risk-based or schedule-based</li>
            <li>Confirm vehicle interaction coverage is increased this fortnight</li>
            <li>Challenge ownership of overdue traffic management actions</li>
            <li>Ask Superintendents how field priorities will reflect assurance gaps</li>
            <li>Confirm whether contractor areas need additional leadership presence</li>
          </ul>
          <div className="card-actions">
            <button className="secondary-button" onClick={() => onShowToast('Added all challenge points to meeting')}>Add all to meeting</button>
            <button className="secondary-button" onClick={() => onShowToast('Exported challenge points')}>Export challenge points</button>
            <button className="primary-button" onClick={() => onAskAI('Is our assurance plan aligned to the top risks?')}>Ask AI to summarise</button>
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Related pages / next steps</h3></div>
          <div className="card-actions">
            <button className="secondary-button" onClick={() => onOpenRisk('vehicle-interaction')}>Open Vehicle Interaction Risk</button>
            <button className="secondary-button" onClick={onOpenControlHealth}>Open Control Health</button>
            <button className="secondary-button" onClick={() => onShowToast('Open AI Insights placeholder')}>Open AI Insights</button>
            <button className="primary-button" onClick={() => onAskAI('Is our assurance plan aligned to the top risks?')}>Ask AI about the assurance plan</button>
            <button className="secondary-button" onClick={() => onShowToast('Assurance oversight summary exported using current filters')}>Export Assurance Summary</button>
          </div>
        </article>
      </section>

      <section className="card">
        <h3>Selected assurance detail</h3>
        {selectedRisk ? (
          <div>
            <p><strong>{selectedRisk.risk}</strong></p>
            <p>Planned coverage: {selectedRisk.plannedCoverage}% • Target: {selectedRisk.targetCoverage}% • Gap: {selectedRisk.gap}%</p>
            <p className="muted">Challenge: {selectedRisk.challenge}</p>
          </div>
        ) : <p className="muted">Select a risk row to inspect the assurance coverage detail.</p>}
      </section>

      {selectedGap && <section className="card"><h3>{selectedGap.title}</h3><p>{selectedGap.reason}</p><p className="muted">Suggested activity: {selectedGap.suggestedActivity}</p></section>}
      {selectedEvidence && <section className="card"><h3>{selectedEvidence.title}</h3><p>{selectedEvidence.detail}</p></section>}

      <footer className="footer-note">Synthetic demo data only. Not connected to live operational systems.</footer>
    </div>
  )
}
