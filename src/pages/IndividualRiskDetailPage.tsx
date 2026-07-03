import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { riskItems } from '../data/gmRiskItemsData'
import type { DashboardState } from '../types/dashboard'

type Props = {
  filters: DashboardState
  onAskAI: (question: string) => void
  onShowToast: (message: string) => void
  onOpenAssurance: () => void
  onOpenControlHealth: () => void
}

export default function IndividualRiskDetailPage({ filters, onAskAI, onShowToast, onOpenAssurance, onOpenControlHealth }: Props) {
  const navigate = useNavigate()
  const params = useParams()
  const [selectedEvidence, setSelectedEvidence] = useState<string | undefined>(undefined)
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined)
  const [selectedControl, setSelectedControl] = useState<string | undefined>(undefined)
  const risk = useMemo(() => riskItems.find((item) => item.id === params.riskItemId) ?? riskItems[0], [params.riskItemId])

  const selectedEvidenceItem = risk.evidenceSignals.find((item) => item.title === selectedEvidence)
  const selectedLocationItem = risk.locations.find((item) => item.name === selectedLocation)
  const selectedControlItem = risk.controls.find((item) => item.control === selectedControl)

  return (
    <div className="page-content">
      <div className="page-header">
        <button type="button" className="secondary-button small" onClick={() => navigate('/risk-detail')}>← Back to all risks</button>
        <p className="eyebrow">Risk Detail: {risk.title}</p>
        <h2>General Manager deep-dive into selected risk, evidence, control health, locations, assurance coverage and recommended leadership action</h2>
        <p className="muted">Context: {filters.site} • {filters.area} • {filters.timeframe} • {filters.riskLens}</p>
      </div>

      <section className="card">
        <div className="card-title-row">
          <div>
            <h3>{risk.title}</h3>
            <p className="muted">Type: {risk.type} • Severity: {risk.severity} • Trend: {risk.trend} • Status: {risk.status}</p>
          </div>
          <div className="card-actions">
            <span className={`status-pill ${risk.severity.toLowerCase()}`}>{risk.severity}</span>
            <span className="status-pill medium">{risk.controlHealth}</span>
          </div>
        </div>
        <div className="summary-sections">
          <div><h4>Site</h4><p>{risk.site}</p></div>
          <div><h4>Area</h4><p>{risk.area}</p></div>
          <div><h4>Location</h4><p>{risk.location}</p></div>
          <div><h4>Date detected</h4><p>{risk.dateDetected}</p></div>
          <div><h4>AI confidence</h4><p>{risk.aiConfidence}%</p></div>
          <div><h4>Owner</h4><p>{risk.owner}</p></div>
        </div>
      </section>

      <section className="decision-banner small">
        <div>
          <p className="eyebrow">Decision required</p>
          <h3>Traffic separation controls are weakening in the same areas where near-miss signals are rising. AI recommends GM challenge on assurance coverage, traffic separation verification and overdue action ownership.</h3>
        </div>
        <div className="banner-actions">
          <button className="secondary-button" onClick={() => onAskAI('Why is this risk increasing?')}>Ask AI why this risk was flagged</button>
          <button className="primary-button" onClick={() => onShowToast('Added to leadership meeting')}>Add to leadership meeting</button>
          <button className="secondary-button" onClick={() => onShowToast('Manager review requested')}>Request Manager review</button>
          <button className="secondary-button" onClick={() => onShowToast('Risk pack exported')}>Export risk pack</button>
        </div>
      </section>

      <section className="kpi-grid">
        {[
          { title: 'Risk index', value: `${risk.riskIndex} / 100`, detail: 'High priority' },
          { title: 'Trend movement', value: risk.trend, detail: 'Compared with previous 30 days' },
          { title: 'Control health', value: risk.controlHealth, detail: 'Traffic separation verification below target' },
          { title: 'Assurance coverage', value: `${risk.assuranceCoverage}%`, detail: `Target ${risk.assurance.target}%` },
          { title: 'Evidence signals', value: `${risk.evidenceSignals.length}`, detail: 'Incidents, observations and verification checks' },
          { title: 'Open actions', value: `${risk.actions.length}`, detail: '2 overdue' },
        ].map((card) => (
          <button key={card.title} type="button" className="kpi-card" onClick={() => onShowToast(`${card.title} explained`)}>
            <p className="kpi-title">{card.title}</p>
            <h3>{card.value}</h3>
            <p>{card.detail}</p>
          </button>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="card">
          <div className="card-title-row"><h3>AI explanation: Why this risk was flagged</h3></div>
          <p>{risk.explanation}</p>
          <div className="summary-sections">
            <div><h4>Primary driver</h4><p>{risk.explanation}</p></div>
            <div><h4>Confidence score</h4><p>{risk.aiConfidence}%</p></div>
            <div><h4>Data used</h4><p>Near-miss reports, LiF observations, verification completion and field notes.</p></div>
            <div><h4>Last refreshed</h4><p>2026-06-30</p></div>
            <div><h4>Explainability view</h4><p>Available from Ask AI drawer</p></div>
            <div><h4>Recommended GM focus</h4><p>{risk.recommendedAction}</p></div>
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>What happened / what is predicted</h3></div>
          <p>{risk.whatHappens}</p>
          <p className="muted">This is {risk.type.toLowerCase()} rather than a single isolated incident. If not addressed, it could increase the likelihood of a serious interaction or exposure event.</p>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Evidence signals</h3></div>
          <div className="signal-list">
            {risk.evidenceSignals.map((signal) => (
              <button key={signal.title} type="button" className="signal-card" onClick={() => setSelectedEvidence(signal.title)}>
                <h4>{signal.title}</h4>
                <p>{signal.detail}</p>
              </button>
            ))}
          </div>
          {selectedEvidenceItem && <div className="signal-card" style={{ marginTop: 10 }}><h4>{selectedEvidenceItem.title}</h4><p>{selectedEvidenceItem.detail}</p></div>}
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Affected locations and tasks</h3></div>
          <div className="signal-list">
            {risk.locations.map((location) => (
              <button key={location.name} type="button" className="signal-card" onClick={() => setSelectedLocation(location.name)}>
                <h4>{location.name}</h4>
                <p>{location.issue}</p>
                <p className="muted">Risk score: {location.riskScore} • Trend: {location.trend} • Owner: {location.owner}</p>
              </button>
            ))}
          </div>
          {selectedLocationItem && <div className="signal-card" style={{ marginTop: 10 }}><h4>{selectedLocationItem.name}</h4><p>{selectedLocationItem.issue}</p><p className="muted">Action: {selectedLocationItem.action}</p></div>}
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Critical controls linked to this risk</h3></div>
          <div className="signal-list">
            {risk.controls.map((control) => (
              <button key={control.control} type="button" className="signal-card" onClick={() => setSelectedControl(control.control)}>
                <h4>{control.control}</h4>
                <p>Status: {control.status} • Health: {control.health}</p>
                <p className="muted">Evidence: {control.evidence}</p>
              </button>
            ))}
          </div>
          {selectedControlItem && <div className="signal-card" style={{ marginTop: 10 }}><h4>{selectedControlItem.control}</h4><p>{selectedControlItem.evidence}</p><p className="muted">Action: {selectedControlItem.action}</p></div>}
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Incident and weak signal timeline</h3></div>
          <div className="leadership-list">
            {risk.timeline.map((item) => (
              <div key={item.date} className="leadership-item">
                <div><h4>{item.date}</h4><p>{item.detail}</p></div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Behaviour themes and LiF signals</h3></div>
          <div className="signal-list">
            {risk.behaviourThemes.map((theme) => (
              <div key={theme.title} className="signal-card">
                <h4>{theme.title}</h4>
                <p>{theme.explanation}</p>
                <p className="muted">Evidence count: {theme.evidenceCount} • Linked control: {theme.linkedControl}</p>
                <p className="muted">Leadership question: {theme.leadershipQuestion}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Assurance coverage and gaps</h3></div>
          <p>Coverage against top risk locations: {risk.assurance.coverage}%</p>
          <p>Target: {risk.assurance.target}%</p>
          <p>Gap: {risk.assurance.gap}%</p>
          <ul>
            {risk.assurance.missingCoverage.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="muted">Planned activities: {risk.assurance.plannedActivities.join(' • ')} • Overdue: {risk.assurance.overdue.join(' • ') || 'None'}</p>
          <div className="card-actions">
            <button className="secondary-button" onClick={onOpenAssurance}>Open Assurance Plan</button>
            <button className="secondary-button" onClick={() => onShowToast('Coverage review requested')}>Request coverage review</button>
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Recommended GM actions</h3></div>
          <div className="leadership-list">
            {risk.actions.map((action) => (
              <div key={action} className="leadership-item">
                <div><h4>{action}</h4></div>
                <div className="card-actions">
                  <button className="secondary-button small" onClick={() => onShowToast('Added to meeting')}>Add to meeting</button>
                  <button className="secondary-button small" onClick={() => onShowToast('Manager review requested')}>Request review</button>
                  <button className="secondary-button small" onClick={() => onShowToast('Marked reviewed')}>Mark reviewed</button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Ask AI about this risk</h3></div>
          <div className="prompt-list">
            {['Why is this risk increasing?', 'What should I ask the Operations Manager?', 'Which control is driving the most exposure?', 'Is assurance coverage enough?', 'What field leadership focus is recommended?'].map((prompt) => (
              <button key={prompt} type="button" className="prompt-pill" onClick={() => onAskAI(prompt)}>{prompt}</button>
            ))}
          </div>
          <div className="card-actions">
            <button className="secondary-button" onClick={onOpenControlHealth}>Open Control Health</button>
            <button className="primary-button" onClick={() => onAskAI(`Why is ${risk.title} increasing?`)}>Ask AI</button>
          </div>
        </article>
      </section>

      <footer className="footer-note">Synthetic demo data only. Not connected to live operational systems.</footer>
    </div>
  )
}
