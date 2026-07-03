import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { riskItems } from '../data/gmRiskItemsData'
import type { DashboardState } from '../types/dashboard'

const categoryBreakdown = [
  { label: 'Vehicle interaction', count: 4, severity: 'High', trend: 'Increasing' },
  { label: 'Line of fire', count: 3, severity: 'High', trend: 'Increasing' },
  { label: 'Energy isolation', count: 2, severity: 'High', trend: 'At Risk' },
  { label: 'Working at heights', count: 1, severity: 'Medium', trend: 'Stable' },
  { label: 'Lifting and cranage', count: 1, severity: 'Medium', trend: 'Stable' },
  { label: 'Contractor road movements', count: 1, severity: 'Medium', trend: 'Emerging' },
]

type Props = {
  filters: DashboardState
  onAskAI: (question: string) => void
  onShowToast: (message: string) => void
  onOpenRisk: (riskId: string) => void
}

export default function RiskDetailsOverviewPage({ filters, onAskAI, onShowToast, onOpenRisk }: Props) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [riskType, setRiskType] = useState('All')
  const [severity, setSeverity] = useState('All')
  const [status, setStatus] = useState('All')
  const [controlHealth, setControlHealth] = useState('All')
  const [sortBy, setSortBy] = useState('Highest priority')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSite, setSelectedSite] = useState('All')

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()
    let items = riskItems.filter((item) => {
      const matchesSearch = !normalizedSearch || [item.title, item.location, item.category, item.area].join(' ').toLowerCase().includes(normalizedSearch)
      const matchesType = riskType === 'All' || item.type === riskType
      const matchesSeverity = severity === 'All' || item.severity === severity
      const matchesStatus = status === 'All' || item.status === status
      const matchesControl = controlHealth === 'All' || item.controlHealth === controlHealth
      const matchesSite = selectedSite === 'All' || item.site === selectedSite || (selectedSite === 'All Pilbara Sites' && item.site === 'All Pilbara Sites')
      return matchesSearch && matchesType && matchesSeverity && matchesStatus && matchesControl && matchesSite
    })

    if (selectedCategory !== 'All') {
      items = items.filter((item) => item.category === selectedCategory)
    }

    const sorted = [...items].sort((a, b) => {
      if (sortBy === 'Newest') return a.dateDetected.localeCompare(b.dateDetected)
      if (sortBy === 'Highest risk movement') return Number.parseInt(b.trend.match(/[-+]?\d+/)?.[0] ?? '0') - Number.parseInt(a.trend.match(/[-+]?\d+/)?.[0] ?? '0')
      if (sortBy === 'Lowest assurance coverage') return a.assuranceCoverage - b.assuranceCoverage
      if (sortBy === 'Most open actions') return b.riskIndex - a.riskIndex
      return b.riskIndex - a.riskIndex
    })

    return sorted
  }, [controlHealth, riskType, search, selectedCategory, selectedSite, severity, sortBy, status])

  const overviewText = `12 risks and emerging risk signals detected for ${filters.site === 'all' ? 'All Pilbara Sites' : filters.site} in the last ${filters.timeframe === '30d' ? '30 days' : filters.timeframe}. Vehicle interaction, line of fire and energy isolation require leadership attention.`

  return (
    <div className="page-content">
      <div className="page-header">
        <p className="eyebrow">Risk Detail View</p>
        <h2>General Manager view of current, occurred and emerging risks across the selected site, area and timeframe</h2>
        <p className="muted">Context: {filters.site} • {filters.area} • {filters.timeframe} • {filters.riskLens}</p>
      </div>

      <section className="decision-banner small">
        <div>
          <p className="eyebrow">Leadership view</p>
          <h3>{overviewText}</h3>
        </div>
        <div className="banner-actions">
          <button className="secondary-button" onClick={() => onAskAI('What are the most important risks in this timeframe?')}>Ask AI what changed</button>
          <button className="secondary-button" onClick={() => onShowToast('Risk list exported')}>Export risk list</button>
          <button className="primary-button" onClick={() => onShowToast('Top risks added to leadership meeting')}>Add top risks to leadership meeting</button>
        </div>
      </section>

      <section className="kpi-grid">
        {[
          { title: 'Risks Detected', value: '12', detail: '7 actual events, 5 emerging signals' },
          { title: 'High Priority Risks', value: '4', detail: '2 require GM action' },
          { title: 'Increasing Risks', value: '5', detail: 'Vehicle interaction highest movement' },
          { title: 'Degrading Controls Linked', value: '7', detail: 'Traffic separation top concern' },
          { title: 'Open Actions', value: '11', detail: '3 overdue' },
          { title: 'Assurance Gaps', value: '2', detail: 'Vehicle interaction and line of fire' },
        ].map((card) => (
          <button key={card.title} type="button" className="kpi-card" onClick={() => onShowToast(`${card.title} explained`)}>
            <p className="kpi-title">{card.title}</p>
            <h3>{card.value}</h3>
            <p>{card.detail}</p>
          </button>
        ))}
      </section>

      <section className="filter-bar" aria-label="Risk overview filters">
        <label className="filter-control">
          <span>Search risks</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search risk, location, category" />
        </label>
        <label className="filter-control">
          <span>Risk type</span>
          <select value={riskType} onChange={(event) => setRiskType(event.target.value)}>
            {['All', 'Actual event', 'Emerging risk', 'Predicted risk', 'Weak signal', 'Positive movement'].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="filter-control">
          <span>Severity</span>
          <select value={severity} onChange={(event) => setSeverity(event.target.value)}>
            {['All', 'High', 'Medium', 'Low'].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="filter-control">
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {['All', 'New', 'Open', 'Reviewed', 'Action required'].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="filter-control">
          <span>Control health</span>
          <select value={controlHealth} onChange={(event) => setControlHealth(event.target.value)}>
            {['All', 'Stable', 'At Risk', 'Degrading'].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label className="filter-control">
          <span>Sort by</span>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            {['Highest priority', 'Newest', 'Highest risk movement', 'Lowest assurance coverage', 'Most open actions'].map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </section>

      <section className="dashboard-grid">
        <article className="card card-large">
          <div className="card-title-row">
            <h3>AI Summary — What the GM needs to know</h3>
            <button type="button" className="secondary-button small" onClick={() => onAskAI('Explain the most important changes in the risk list')}>Ask AI to explain</button>
          </div>
          <p className="summary-copy">Vehicle interaction is the strongest current risk signal, driven by traffic separation exceptions, near-miss reports and declining verification pass rates. Line of fire and energy isolation are also showing increased exposure. The main leadership question is whether assurance effort has shifted quickly enough toward the risks that are increasing.</p>
          <div className="summary-sections">
            <div><h4>What changed</h4><p>Risk detections increased from 5 to 12 over the last four weeks.</p></div>
            <div><h4>Why it matters</h4><p>Several increasing risks are linked to degrading controls and below-target assurance coverage.</p></div>
            <div><h4>Strongest signal</h4><p>Vehicle interaction and line of fire are the strongest signals.</p></div>
            <div><h4>Recommended GM focus</h4><p>Challenge assurance coverage and traffic separation controls.</p></div>
            <div><h4>Evidence sources used</h4><p>Near-miss reports, LiF observations, audit check completion and field notes.</p></div>
            <div><h4>Suggested action</h4><p>Open the highest priority risk and add to the leadership meeting.</p></div>
          </div>
          <div className="card-actions">
            <button className="secondary-button" onClick={() => onOpenRisk(riskItems[0]?.id ?? '')}>Open highest priority risk</button>
            <button className="secondary-button" onClick={() => onShowToast('Summary added to leadership meeting')}>Add summary to meeting</button>
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Risk occurrence and emerging signal trend</h3></div>
          <svg viewBox="0 0 260 120" className="trend-chart" role="img" aria-label="Risk trend chart">
            <line x1="20" y1="100" x2="240" y2="100" className="axis" />
            <line x1="20" y1="20" x2="20" y2="100" className="axis" />
            <polyline points="20,84 80,74 140,62 200,42" className="trend-line" />
          </svg>
          <p className="muted">Risk detections increased from 5 to 12 over the last four weeks, with the largest increase in vehicle interaction and line of fire related signals.</p>
          <div className="card-actions">
            <span className="status-pill high">Actual events: 7</span>
            <span className="status-pill medium">Emerging signals: 5</span>
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Risk category breakdown</h3></div>
          <div className="signal-list">
            {categoryBreakdown.map((category) => (
              <button key={category.label} type="button" className="signal-card" onClick={() => { setSelectedCategory(category.label); setSelectedSite('All'); }}>
                <h4>{category.label}</h4>
                <p>{category.count} items • {category.severity} • {category.trend}</p>
              </button>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Highest priority risks</h3></div>
          <div className="signal-list">
            {riskItems.slice(0, 3).map((item) => (
              <div key={item.id} className="signal-card">
                <h4>{item.title}</h4>
                <p>{item.severity} • {item.trend} • {item.recommendedAction}</p>
                <div className="card-actions">
                  <button className="secondary-button small" onClick={() => navigate(`/risk-detail/${item.id}`)}>Open detail</button>
                  <button className="secondary-button small" onClick={() => onAskAI(`Why is ${item.title} important?`)}>Ask AI</button>
                  <button className="secondary-button small" onClick={() => onShowToast(`${item.title} added to meeting`)}>Add to meeting</button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card card-table">
          <div className="card-title-row">
            <h3>Risk list / risk events</h3>
            <span className="muted">{filteredItems.length} visible items</span>
          </div>
          <div className="signal-list">
            {filteredItems.map((item) => (
              <div key={item.id} className="signal-card" onClick={() => navigate(`/risk-detail/${item.id}`)}>
                <div className="card-title-row">
                  <h4>{item.title}</h4>
                  <span className={`status-pill ${item.severity.toLowerCase()}`}>{item.severity}</span>
                </div>
                <p>{item.type} • {item.dateDetected} • {item.site} • {item.area}</p>
                <p className="muted">Trend: {item.trend} • Control: {item.controlHealth} • Assurance: {item.assuranceCoverage}% • Status: {item.status}</p>
                <p>{item.recommendedAction}</p>
                <div className="card-actions">
                  <button className="secondary-button small" onClick={(event) => { event.stopPropagation(); navigate(`/risk-detail/${item.id}`) }}>Open</button>
                  <button className="secondary-button small" onClick={(event) => { event.stopPropagation(); onAskAI(`Why is ${item.title} important?`) }}>Ask AI</button>
                  <button className="secondary-button small" onClick={(event) => { event.stopPropagation(); onShowToast(`${item.title} added to meeting`) }}>Add to meeting</button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Risk map / location overview</h3></div>
          <div className="signal-list">
            {[
              { label: 'Gudai-Darri', count: 4 },
              { label: 'Brockman', count: 3 },
              { label: 'West Angelas', count: 3 },
              { label: 'Yandicoogina', count: 1 },
              { label: 'Tom Price', count: 1 },
            ].map((site) => (
              <button key={site.label} type="button" className="signal-card" onClick={() => setSelectedSite(site.label)}>
                <h4>{site.label}</h4>
                <p>{site.count} risk items</p>
              </button>
            ))}
          </div>
        </article>

        <article className="card">
          <div className="card-title-row"><h3>Recommended GM actions</h3></div>
          <div className="leadership-list">
            {[
              'Add vehicle interaction and line of fire to weekly leadership meeting',
              'Request Manager review of assurance coverage for top two under-covered risks',
              'Ask Superintendents to confirm field priorities match the active risk profile',
              'Confirm overdue traffic management actions have owners',
            ].map((action) => (
              <div key={action} className="leadership-item">
                <div><h4>{action}</h4></div>
                <div className="card-actions">
                  <button className="secondary-button small" onClick={() => onShowToast('Added to meeting')}>Add to meeting</button>
                  <button className="secondary-button small" onClick={() => onShowToast('Requested review')}>Request review</button>
                  <button className="secondary-button small" onClick={() => onShowToast('Marked reviewed')}>Mark reviewed</button>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <footer className="footer-note">Synthetic demo data only. Not connected to live operational systems.</footer>
    </div>
  )
}
