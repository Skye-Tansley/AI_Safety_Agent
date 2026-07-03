import { useMemo, useState } from 'react'
import type { DashboardState } from '../types/dashboard'
import { controlHealthRows, controlSignals } from '../data/gmControlHealthData'

type Props = {
  filters: DashboardState
  onOpenRisk: (riskId: string) => void
  onOpenAssurance: () => void
  onAskAI: (question: string) => void
  onShowToast: (message: string) => void
}

export default function ControlHealthPage({ filters, onOpenRisk, onOpenAssurance, onAskAI, onShowToast }: Props) {
  const [selectedControlId, setSelectedControlId] = useState<string | undefined>(undefined)
  const [selectedSignalId, setSelectedSignalId] = useState<string | undefined>(undefined)

  const selectedControl = useMemo(() => controlHealthRows.find((row) => row.id === selectedControlId) ?? controlHealthRows[0], [selectedControlId])
  const selectedSignal = controlSignals.find((row) => row.id === selectedSignalId)

  const toggleAction = (_id: string, label: string) => {
    onShowToast(label)
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <p className="eyebrow">Control Health Dashboard</p>
        <h2>General Manager view of critical control performance across selected Pilbara operations</h2>
        <p className="muted">Context: {filters.site} • {filters.area} • {filters.timeframe} • {filters.riskLens}</p>
      </div>

      <section className="decision-banner small">
        <div>
          <p className="eyebrow">Decision required</p>
          <h3>Traffic separation verification is the top degrading control and is linked to increasing vehicle interaction risk. AI recommends leadership review of verification coverage, overdue actions and field leadership focus in Load & Haul.</h3>
        </div>
        <div className="banner-actions">
          <button className="secondary-button" onClick={() => onOpenRisk('vehicle-interaction')}>Open linked risk</button>
          <button className="secondary-button" onClick={() => onAskAI('Why is traffic separation verification degrading?')}>Ask AI why</button>
          <button className="primary-button" onClick={() => onShowToast('Added to leadership meeting')}>Add to leadership meeting</button>
          <button className="secondary-button" onClick={onOpenAssurance}>Open Assurance Coverage</button>
        </div>
      </section>

      <section className="kpi-strip">
        <button className="kpi-card" type="button" onClick={() => onShowToast('Overall control health explained')}> <h4>Overall Control Health</h4><h3>68% Stable</h3><p className="muted">24% At Risk, 8% Degrading</p></button>
        <button className="kpi-card" type="button" onClick={() => onShowToast('Degrading controls explained')}><h4>Degrading Controls</h4><h3>7</h3><p className="muted">3 require leadership review</p></button>
        <button className="kpi-card" type="button" onClick={() => onShowToast('Verification completion explained')}><h4>Verification Completion</h4><h3>76%</h3><p className="muted">Down 9% vs previous period</p></button>
        <button className="kpi-card" type="button" onClick={() => onShowToast('Controls linked to top risks explained')}><h4>Controls Linked to Top Risks</h4><h3>11</h3><p className="muted">Vehicle interaction highest concern</p></button>
        <button className="kpi-card" type="button" onClick={() => onShowToast('Open control actions explained')}><h4>Open Control Actions</h4><h3>13</h3><p className="muted">4 overdue</p></button>
        <button className="kpi-card" type="button" onClick={() => onShowToast('Cross-site issues explained')}><h4>Cross-site Repeat Issues</h4><h3>3</h3><p className="muted">Same control weakness across multiple areas</p></button>
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <div className="card-title-row"><h3>Why control health is changing</h3><button className="secondary-button small" onClick={() => onAskAI('Summarise control health for my leadership meeting')}>Ask AI for leadership summary</button></div>
          <p>Control health has weakened due to lower verification completion, repeated field observations linked to traffic separation, and overdue corrective actions. The strongest deterioration is in vehicle interaction controls, followed by energy isolation confirmation and exclusion zone compliance.</p>
          <div className="summary-sections">
            <div><h4>Primary driver</h4><p>Traffic separation verification completion is falling and linked to near-miss language.</p></div>
            <div><h4>Supporting drivers</h4><p>Overdue actions, repeat field observations and reduced assurance follow-up.</p></div>
            <div><h4>Confidence</h4><p>High</p></div>
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Control health distribution</h3></div>
          <div className="donut-wrap">
            <svg viewBox="0 0 120 120" className="donut-chart">
              <circle cx="60" cy="60" r="44" className="track" />
              <circle cx="60" cy="60" r="44" className="segment stable" strokeDasharray={`${(68 / 100) * 276} 276`} />
              <circle cx="60" cy="60" r="44" className="segment at-risk" strokeDasharray={`${(24 / 100) * 276} 276`} strokeDashoffset={-((68 / 100) * 276)} />
              <circle cx="60" cy="60" r="44" className="segment degrading" strokeDasharray={`${(8 / 100) * 276} 276`} strokeDashoffset={-(((68 + 24) / 100) * 276)} />
            </svg>
            <div className="donut-labels"><p className="donut-value">68%</p><p>Stable controls</p></div>
          </div>
          <ul className="detail-list">
            <li>Stable: 34 controls</li>
            <li>At Risk: 12 controls</li>
            <li>Degrading: 4 controls</li>
          </ul>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Control trend over time</h3></div>
          <svg viewBox="0 0 260 120" className="mini-line">
            <polyline points="20,80 80,70 140,58 200,44" className="trend-line" />
          </svg>
          <p className="muted">Stable controls have reduced by 6 percentage points over the last four weeks.</p>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Top degrading controls requiring leadership attention</h3></div>
          <table>
            <thead><tr><th>Control</th><th>Linked risk</th><th>Health</th><th>Verification</th><th>Open actions</th></tr></thead>
            <tbody>
              {controlHealthRows.map((row) => (
                <tr key={row.id} onClick={() => setSelectedControlId(row.id)}>
                  <td>{row.control}</td>
                  <td>{row.linkedRisk}</td>
                  <td><span className={`status-pill ${row.health.toLowerCase().replace(/ /g, '-')}`}>{row.health}</span></td>
                  <td>{row.verification}%</td>
                  <td>{row.openActions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Site / Area control health comparison</h3></div>
          <div className="bar-list">
            {[
              { name: 'Gudai-Darri', value: 62 },
              { name: 'Brockman', value: 65 },
              { name: 'West Angelas', value: 71 },
              { name: 'Yandicoogina', value: 74 },
              { name: 'Tom Price', value: 77 },
            ].map((entry) => (
              <button key={entry.name} type="button" className="bar-row" onClick={() => onShowToast(`Site filter updated to ${entry.name}`)}>
                <div className="bar-meta"><span>{entry.name}</span><strong>{entry.value}% stable</strong></div>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${entry.value}%` }} /></div>
              </button>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Control health by risk category</h3></div>
          <div className="signal-list">
            {[
              { title: 'Vehicle interaction', detail: 'At Risk / degrading trend', link: 'vehicle-interaction' },
              { title: 'Energy isolation', detail: 'At Risk / worsening trend', link: 'energy-isolation' },
              { title: 'Line of fire', detail: 'At Risk / stable trend', link: 'line-of-fire' },
              { title: 'Working at heights', detail: 'Stable / monitoring', link: 'working-at-heights' },
              { title: 'Lifting and cranage', detail: 'Stable / improving', link: 'lifting-and-cranage' },
            ].map((item) => (
              <button key={item.title} type="button" className="signal-card" onClick={() => onOpenRisk(item.link)}>
                <h4>{item.title}</h4>
                <p>{item.detail}</p>
              </button>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Evidence signals behind control health</h3></div>
          <div className="signal-list">
            {controlSignals.map((signal) => (
              <button key={signal.id} type="button" className="signal-card" onClick={() => setSelectedSignalId(signal.id)}>
                <h4>{signal.title}</h4>
                <p>{signal.detail}</p>
                <span className={`signal-severity ${signal.severity.toLowerCase()}`}>{signal.severity}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Recommended GM leadership actions</h3></div>
          <div className="leadership-list">
            {[
              { title: 'Ask Managers to confirm owners for overdue traffic management actions', id: 'a1' },
              { title: 'Request review of isolation confirmation verification process', id: 'a2' },
              { title: 'Ask Superintendents to increase field presence in Load & Haul', id: 'a3' },
              { title: 'Confirm assurance plan covers top degrading controls', id: 'a4' },
            ].map((action) => (
              <div key={action.id} className="leadership-item">
                <div><h4>{action.title}</h4></div>
                <div className="card-actions">
                  <button className="secondary-button small" onClick={() => toggleAction(action.id, 'Added to meeting')}>Add to meeting</button>
                  <button className="secondary-button small" onClick={() => toggleAction(action.id, 'Requested review')}>Request review</button>
                  <button className="secondary-button small" onClick={() => toggleAction(action.id, 'Marked reviewed')}>Mark as reviewed</button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Related pages / next steps</h3></div>
          <div className="card-actions">
            <button className="secondary-button" onClick={() => onOpenRisk('vehicle-interaction')}>Open Vehicle Interaction Risk Detail</button>
            <button className="secondary-button" onClick={() => onOpenRisk('energy-isolation')}>Open Energy Isolation Risk Detail</button>
            <button className="secondary-button" onClick={onOpenAssurance}>Open Assurance Plan</button>
            <button className="primary-button" onClick={() => onAskAI('Why is control health degrading?')}>Ask AI about control health</button>
            <button className="secondary-button" onClick={() => onShowToast('Control health summary exported using current filters')}>Export Control Health Summary</button>
          </div>
        </article>
      </section>

      <section className="card">
        <h3>Selected control detail</h3>
        {selectedControl ? (
          <div>
            <p><strong>{selectedControl.control}</strong></p>
            <p>{selectedControl.why}</p>
            <p className="muted">Linked risk: {selectedControl.linkedRisk} • Verification: {selectedControl.verification}% • Open actions: {selectedControl.openActions}</p>
          </div>
        ) : <p className="muted">Select a control row to inspect the detail.</p>}
      </section>

      {selectedSignal && <section className="card"><h3>{selectedSignal.title}</h3><p>{selectedSignal.detail}</p></section>}

      <footer className="footer-note">Synthetic demo data only. Not connected to live operational systems.</footer>
    </div>
  )
}
