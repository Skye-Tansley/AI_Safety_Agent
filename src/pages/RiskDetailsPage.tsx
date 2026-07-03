import { useMemo, useState } from 'react'
import risksData from '../data/gmRisksData'
import type { DashboardState } from '../types/dashboard'

type Props = {
  filters: DashboardState
  initialRiskId?: string
  onAskAI: (question: string) => void
}

export default function RiskDetailsPage({ filters, initialRiskId, onAskAI }: Props) {
  const defaultId = initialRiskId ?? 'vehicle-interaction'
  const [selectedRiskId, setSelectedRiskId] = useState(defaultId)
  const risk = useMemo(() => risksData.find((r) => r.id === selectedRiskId) ?? risksData[0], [selectedRiskId])

  return (
    <div className="page-content">
      <div className="page-header">
        <p className="eyebrow">Risk Detail: {risk.name}</p>
        <h2>General Manager deep-dive into risk drivers, control health, evidence signals and assurance coverage</h2>
        <p className="muted">Context: {filters.site} • {filters.area} • {filters.timeframe} • {filters.riskLens}</p>
      </div>

      <section className="filter-row">
        <label>
          Risk
          <select value={selectedRiskId} onChange={(event) => setSelectedRiskId(event.target.value)}>
            {risksData.map((riskItem) => (
              <option key={riskItem.id} value={riskItem.id}>
                {riskItem.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="decision-banner small">
        <div>
          <p className="eyebrow">Decision required</p>
          <h3>{risk.name} risk is {risk.trendPct > 0 ? 'increasing' : 'changing' } and requires leadership review. AI has linked the movement to primary drivers and control verification trends.</h3>
        </div>
        <div className="banner-actions">
          <button className="secondary-button" onClick={() => onAskAI(`Why is ${risk.name} increasing?`)}>Ask AI why this risk is increasing</button>
          <button className="secondary-button" onClick={() => alert('Added to leadership meeting')}>Add to leadership meeting</button>
          <button className="primary-button" onClick={() => alert('Requested manager review')}>Request Manager review</button>
        </div>
      </section>

      <section className="kpi-strip">
        <div className="kpi-card">
          <h4>Current Risk Index</h4>
          <h3>{risk.riskIndex} / 100</h3>
          <p className="muted">+{risk.trendPct}% vs previous period</p>
        </div>
        <div className="kpi-card">
          <h4>Severity</h4>
          <h3>{risk.severity}</h3>
          <p className="muted">Fatal + injury potential</p>
        </div>
        <div className="kpi-card">
          <h4>Control Health</h4>
          <h3>{risk.controlHealth}</h3>
          <p className="muted">{Math.max(1, Math.round((risk.assuranceCoverage / 100) * 3))} controls require attention</p>
        </div>
        <div className="kpi-card">
          <h4>Assurance Coverage</h4>
          <h3>{risk.assuranceCoverage}%</h3>
          <p className="muted">Gap detected</p>
        </div>
        <div className="kpi-card">
          <h4>Related Events</h4>
          <h3>{risk.relatedEvents}</h3>
          <p className="muted">3 near misses, 6 weak signals</p>
        </div>
        <div className="kpi-card">
          <h4>Open Actions</h4>
          <h3>{risk.openActions}</h3>
          <p className="muted">2 overdue</p>
        </div>
      </section>

      <section className="risk-grid">
        <aside className="risk-left">
          <div className="card">
            <h4>AI explanation: Why this risk is increasing</h4>
            <p>{risk.primaryDriver}</p>
            <p className="muted">Confidence: High • Last refreshed: 2026-06-30</p>
          </div>

          <div className="card">
            <h4>Risk Movement Trend</h4>
            <svg viewBox="0 0 260 120" className="mini-line">
              <polyline points="20,80 90,70 160,60 230,20" className="trend-line" />
            </svg>
            <p className="muted">Up {risk.trendPct}% compared with previous 30 days.</p>
          </div>

          <div className="card">
            <h4>Evidence signals</h4>
            <ul>
              <li>Near miss language: +3 reports mentioning blind spot / light vehicle</li>
              <li>Verification completion: down 18%</li>
              <li>LiF observations: 5 linked to mobile equipment interaction</li>
              <li>Contractor road comments: increase in time pressure / road condition notes</li>
              <li>Open actions: 2 overdue traffic management actions</li>
            </ul>
          </div>

          <div className="card">
            <h4>Linked critical controls</h4>
            <table>
              <thead>
                <tr><th>Control</th><th>Health</th><th>Last verification</th><th>Action</th></tr>
              </thead>
              <tbody>
                <tr><td>Traffic separation verification</td><td>Degrading</td><td>61%</td><td><button className="secondary-button small" onClick={() => alert('Open control health placeholder')}>Review</button></td></tr>
                <tr><td>Light vehicle / heavy vehicle interaction controls</td><td>At Risk</td><td>72%</td><td><button className="secondary-button small" onClick={() => alert('Ask AI about controls')}>Ask AI</button></td></tr>
                <tr><td>Pedestrian exclusion zones</td><td>At Risk</td><td>78%</td><td><button className="secondary-button small" onClick={() => alert('View actions')}>View</button></td></tr>
                <tr><td>Journey management / road access</td><td>Stable</td><td>86%</td><td><button className="secondary-button small" onClick={() => alert('Monitor')}>Monitor</button></td></tr>
              </tbody>
            </table>
          </div>

        </aside>

        <aside className="risk-right">
          <div className="card">
            <h4>Affected locations and tasks</h4>
            <ul>
              <li>Gudai-Darri / Load & Haul / haul road intersections — High — Traffic separation verification decline</li>
              <li>Brockman / Contractor Roads / light vehicle access — High — near miss wording increased</li>
              <li>West Angelas / ROM / mobile equipment interface — Medium — LiF observations</li>
              <li>Yandicoogina / Maintenance access roads — Medium — congestion and route changes</li>
            </ul>
          </div>

          <div className="card">
            <h4>Incident & weak signal timeline</h4>
            <ol>
              <li>27 Jun: Near miss report references light vehicle blind spot</li>
              <li>24 Jun: Traffic separation verification missed in contractor work area</li>
              <li>21 Jun: LiF observation: pedestrian entered mobile equipment interaction zone</li>
              <li>17 Jun: Field note mentions time pressure and congested road movement</li>
              <li>13 Jun: Corrective action overdue for signage / separation review</li>
            </ol>
          </div>

          <div className="card">
            <h4>Behaviour themes / LiF signals</h4>
            <ul>
              <li>Line of fire exposure</li>
              <li>Separation standards not consistently verified</li>
              <li>Time pressure during shift change</li>
              <li>Contractor unfamiliarity with road rules</li>
              <li>Coaching conversations not consistent across crews</li>
            </ul>
          </div>

          <div className="card">
            <h4>Assurance coverage</h4>
            <p>Coverage score: {risk.assuranceCoverage}% • Target: 85% • Gap: -{85 - risk.assuranceCoverage}%</p>
            <p className="muted">Planned CCV: 6 • Planned CCFV: 4 • Overdue: 2</p>
            <button className="secondary-button" onClick={() => alert('Open Assurance Oversight placeholder')}>Open Assurance Oversight</button>
          </div>

          <div className="card">
            <h4>Recommended GM leadership actions</h4>
            <ul>
              <li>Request Manager review of traffic separation assurance coverage <button className="secondary-button small" onClick={() => alert('Added to meeting')}>Add to meeting</button></li>
              <li>Ask Superintendent to increase field presence in Load & Haul <button className="secondary-button small" onClick={() => alert('Requested review')}>Request review</button></li>
              <li>Confirm overdue traffic management actions have owners <button className="secondary-button small" onClick={() => alert('Marked reviewed')}>Mark as reviewed</button></li>
              <li>Add vehicle interaction to weekly leadership meeting agenda <button className="secondary-button small" onClick={() => alert('Added')}>Add</button></li>
            </ul>
          </div>

          <div className="card">
            <h4>Related pages</h4>
            <div className="card-actions">
              <button className="secondary-button" onClick={() => window.alert('Open AI Insight placeholder')}>Open AI Insight</button>
              <button className="secondary-button" onClick={() => alert('Open Control Health placeholder')}>Open Control Health</button>
              <button className="secondary-button" onClick={() => alert('Open Assurance Oversight placeholder')}>Open Assurance Oversight</button>
              <button className="primary-button" onClick={() => onAskAI(`Why is ${risk.name} increasing?`)}>Ask AI</button>
              <button className="secondary-button" onClick={() => alert('Exported risk summary')}>Export Risk Summary</button>
            </div>
          </div>

        </aside>
      </section>

      <footer className="footer-note">Synthetic demo data only. Not connected to live operational systems.</footer>
    </div>
  )
}
