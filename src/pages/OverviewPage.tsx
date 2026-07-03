import overviewPageData from '../data/gmOverviewData'
import type { DashboardState } from '../types/dashboard'

type Props = {
  filters: DashboardState
  onOpenRisk: (riskId: string) => void
  onOpenControlHealth: () => void
  onOpenAssurance: () => void
  onAskAI: (question: string) => void
  onShowToast: (message: string) => void
}

function formatLabel(value: string) {
  return value
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function toneClass(tone: string) {
  if (tone === 'critical') return 'status-red'
  if (tone === 'amber') return 'status-amber'
  if (tone === 'green') return 'status-green'
  if (tone === 'purple') return 'status-purple'
  return 'status-blue'
}

function matrixToneClass(tone: string) {
  if (tone === 'critical') return 'matrix-critical'
  if (tone === 'amber') return 'matrix-amber'
  if (tone === 'green') return 'matrix-green'
  return 'matrix-blue'
}

export default function OverviewPage({ filters, onOpenRisk, onOpenControlHealth, onOpenAssurance, onAskAI, onShowToast }: Props) {
  const siteLabel = filters.site === 'all' ? 'All Pilbara sites' : formatLabel(filters.site)
  const areaLabel = filters.area === 'all' ? 'All operating areas' : formatLabel(filters.area)
  const timeframeLabel = formatLabel(filters.timeframe)
  const riskLensLabel = formatLabel(filters.riskLens)

  return (
    <div className="overview-page">
      <div className="overview-context-row">
        <div className="context-pill-row">
          <span className="context-pill context-pill-strong">GM: General Manager View</span>
          <span className="context-pill">Site: {siteLabel}</span>
          <span className="context-pill">Area: {areaLabel}</span>
          <span className="context-pill">Timeframe: {timeframeLabel}</span>
          <span className="context-pill">Risk lens: {riskLensLabel}</span>
        </div>
        <div className="action-row">
          <button type="button" className="secondary-button" onClick={() => onShowToast('Overview dashboard exported using current filters.')}>Export</button>
          <button type="button" className="secondary-button" onClick={() => onAskAI('Summarise the top 3 risks for my leadership meeting.')}>Ask AI</button>
          <button type="button" className="icon-button ghost-button" aria-label="More overview options">⋯</button>
        </div>
      </div>

      <button type="button" className="decision-banner overview-banner" onClick={() => onOpenRisk('vehicle-interaction-north-mine-haul-road')}>
        <div className="decision-banner-copy">
          <span className="banner-chip">Decision required</span>
          <div>
            <h3>Vehicle interaction risk is increasing (+18%) across mobile equipment interfaces, with traffic separation controls moving to Degrading in two areas.</h3>
            <p className="banner-muted">Last updated 06:12 WST • Synthetic demo data</p>
          </div>
        </div>
        <button type="button" className="secondary-button small" onClick={(event) => { event.stopPropagation(); onShowToast('Decision banner refreshed from synthetic data') }}>Refresh</button>
      </button>

      <section className="overview-kpi-grid" aria-label="Overview KPI cards">
        {overviewPageData.overviewKpis.map((kpi) => (
          <button key={kpi.id} type="button" className="overview-kpi-card" onClick={() => {
            if (kpi.action === 'risk') onOpenRisk(kpi.route ?? 'vehicle-interaction-north-mine-haul-road')
            if (kpi.action === 'control') onOpenControlHealth()
            if (kpi.action === 'assurance') onOpenAssurance()
            if (kpi.action === 'weak-signal') onShowToast('Weak signal summary opened from dashboard')
            if (kpi.action === 'actions') onShowToast('Safety action breakdown opened from dashboard')
          }}>
            <div className="kpi-title-row">
              <p className="kpi-title">{kpi.label}</p>
              <span className={`status-chip ${toneClass(kpi.statusTone)}`}>{kpi.statusLabel}</span>
            </div>
            <h3>{kpi.value}</h3>
            <p>{kpi.supportingText}</p>
            <div className="mini-sparkline" aria-hidden="true">
              {kpi.sparkline.map((value, index) => <span key={`${kpi.id}-${index}`} style={{ height: `${value}%` }} />)}
            </div>
          </button>
        ))}
      </section>

      <section className="overview-grid">
        <article className="overview-card overview-card-wide">
          <div className="card-title-row">
            <div>
              <h3>Top risks - fatal + injury combined</h3>
              <p className="muted">Ranked using incident trends, control health, LiF themes and weak signals</p>
            </div>
            <span className="detail-pill">Click any risk to drill into detail</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Risk</th>
                  <th>Index</th>
                  <th>Trend</th>
                  <th>Control Health</th>
                  <th>Main Driver</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {overviewPageData.topRisks.map((risk) => (
                  <tr key={risk.id} onClick={() => onOpenRisk(risk.route)}>
                    <td>
                      <strong>{risk.name}</strong>
                      <p className="table-subtext">{risk.description}</p>
                    </td>
                    <td>{risk.index}</td>
                    <td><span className={`status-chip ${risk.trend.includes('+') ? 'status-red' : 'status-grey'}`}>{risk.trend}</span></td>
                    <td><span className={`status-chip ${risk.controlHealth === 'Degrading' ? 'status-red' : risk.controlHealth === 'At Risk' ? 'status-amber' : 'status-green'}`}>{risk.controlHealth}</span></td>
                    <td>{risk.mainDriver}</td>
                    <td><button type="button" className="secondary-button small" onClick={(event) => { event.stopPropagation(); onOpenRisk(risk.route) }}>Open</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="overview-card">
          <div className="card-title-row">
            <div>
              <h3>AI summary - what matters</h3>
              <p className="muted">Plain-language explanation for leadership focus</p>
            </div>
          </div>
          <div className="summary-highlight">
            <h4>Explainability summary</h4>
            <p>Vehicle interaction risk has increased because traffic separation observations, light vehicle near misses and CCFV failures are moving in the same direction.</p>
          </div>
          <div className="summary-list">
            {overviewPageData.aiSummaryPoints.map((point, index) => (
              <button key={point.id} type="button" className="summary-row" onClick={() => onShowToast(`${point.title} detail reviewed`) }>
                <span className="summary-index">{index + 1}</span>
                <div>
                  <strong>{point.title}</strong>
                  <p>{point.description}</p>
                </div>
              </button>
            ))}
          </div>
        </article>

        <article className="overview-card overview-card-wide">
          <div className="card-title-row">
            <div>
              <h3>Risk trend</h3>
              <p className="muted">30 day movement by risk index and recorded signals</p>
            </div>
            <button type="button" className="secondary-button small" onClick={() => onShowToast('Previous period comparison opened')}>Compare previous period</button>
          </div>
          <div className="trend-chart-card">
            <svg viewBox="0 0 320 180" className="trend-chart" role="img" aria-label="Risk trend chart">
              <g className="grid-lines">
                {[0, 1, 2, 3, 4].map((line) => <line key={line} x1="20" x2="300" y1={30 + line * 30} y2={30 + line * 30} />)}
              </g>
              {overviewPageData.trendSeries.map((series) => {
                const points = series.values.map((value, index) => `${20 + index * 46},${160 - ((value - 58) / 24) * 110}`).join(' ')
                return <polyline key={series.label} points={points} className={`trend-line ${series.color === '#dc2626' ? 'trend-critical' : series.color === '#f59e0b' ? 'trend-amber' : 'trend-blue'}`} />
              })}
              {overviewPageData.trendSeries.map((series) => {
                const last = series.values[series.values.length - 1]
                const x = 20 + (series.values.length - 1) * 46
                const y = 160 - ((last - 58) / 24) * 110
                return <circle key={`${series.label}-point`} cx={x} cy={y} r="4" className={`trend-dot ${series.color === '#dc2626' ? 'trend-critical' : series.color === '#f59e0b' ? 'trend-amber' : 'trend-blue'}`} />
              })}
            </svg>
            <div className="legend-row">
              {overviewPageData.trendSeries.map((series) => (
                <span key={series.label} className="legend-item"><span className={`legend-swatch ${series.color === '#dc2626' ? 'trend-critical' : series.color === '#f59e0b' ? 'trend-amber' : 'trend-blue'}`} />{series.label}</span>
              ))}
            </div>
          </div>
        </article>

        <article className="overview-card">
          <div className="card-title-row">
            <div>
              <h3>Control health summary</h3>
              <p className="muted">Current classification across critical controls</p>
            </div>
          </div>
          <div className="control-health-layout">
            <div className="donut-wrap overview-donut" aria-label="Control health visual">
              <svg viewBox="0 0 120 120" className="donut-chart">
                <circle cx="60" cy="60" r="44" className="track" />
                <circle cx="60" cy="60" r="44" className="segment stable" strokeDasharray="276 276" />
                <circle cx="60" cy="60" r="44" className="segment at-risk" strokeDasharray="86 276" strokeDashoffset="-276" />
                <circle cx="60" cy="60" r="44" className="segment degrading" strokeDasharray="25 276" strokeDashoffset="-362" />
              </svg>
              <div>
                <p className="donut-value">69%</p>
                <p className="muted">Stable</p>
              </div>
            </div>
            <div className="control-row-list">
              {overviewPageData.controlHealthItems.map((item) => (
                <button key={item.id} type="button" className="control-row" onClick={() => { onOpenControlHealth(); onShowToast(`${item.title} control detail opened`) }}>
                  <div className="control-row-top">
                    <strong>{item.title}</strong>
                    <span className={`status-chip ${item.status === 'Degrading' ? 'status-red' : item.status === 'At Risk' ? 'status-amber' : 'status-green'}`}>{item.status}</span>
                  </div>
                  <p>{item.detail}</p>
                  <div className="progress-bar"><span style={{ width: `${item.progress}%` }} /></div>
                </button>
              ))}
            </div>
          </div>
        </article>

        <article className="overview-card">
          <div className="card-title-row">
            <div>
              <h3>Assurance alignment</h3>
              <p className="muted">Is planned assurance matched to highest risks?</p>
            </div>
          </div>
          <div className="assurance-ring-wrap">
            <div className="assurance-ring">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="44" className="track" />
                <circle cx="60" cy="60" r="44" className="segment blue" strokeDasharray="233 276" />
              </svg>
              <div>
                <p className="donut-value">74%</p>
                <p className="muted">Below 85% target</p>
              </div>
            </div>
            <p className="assurance-copy">CCV and CCFV effort is not fully aligned to the top five risks this period.</p>
            <div className="assurance-bar-list">
              {overviewPageData.assuranceBars.map((bar) => (
                <div key={bar.label} className="assurance-bar-row">
                  <div className="bar-meta"><span>{bar.label}</span><strong>{bar.value}%</strong></div>
                  <div className="progress-bar"><span style={{ width: `${bar.value}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="warning-box">Gap: Rail Loadout traffic management and maintenance isolation checks need assurance coverage this week.</div>
          </div>
        </article>

        <article className="overview-card overview-card-wide">
          <div className="card-title-row">
            <div>
              <h3>Site / area risk comparison</h3>
              <p className="muted">Where the GM should look first</p>
            </div>
          </div>
          <div className="legend-row">
            <span className="legend-item"><span className="legend-swatch matrix-critical" />High attention</span>
            <span className="legend-item"><span className="legend-swatch matrix-amber" />Monitor</span>
            <span className="legend-item"><span className="legend-swatch matrix-green" />Stable</span>
            <span className="legend-item"><span className="legend-swatch matrix-blue" />Weak signal</span>
          </div>
          <div className="heatmap-table-wrap">
            <table className="heatmap-table">
              <thead>
                <tr>
                  <th>Area</th>
                  <th>Vehicles</th>
                  <th>Isolation</th>
                  <th>LiF</th>
                  <th>Heights</th>
                  <th>Fatigue</th>
                </tr>
              </thead>
              <tbody>
                {overviewPageData.areaMatrix.map((row) => (
                  <tr key={row.area}>
                    <td>{row.area}</td>
                    {Object.entries(row.cells).map(([key, cell]) => (
                      <td key={`${row.area}-${key}`}>
                        <button type="button" className={`heatmap-cell ${matrixToneClass(cell.tone)}`} onClick={() => onShowToast(`${row.area} ${key} signal reviewed`)}>{cell.label}</button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="overview-card">
          <div className="card-title-row">
            <div>
              <h3>Recommended leadership focus</h3>
              <p className="muted">Actions the GM can take into leader routines</p>
            </div>
          </div>
          <div className="leadership-list compact-list">
            {overviewPageData.leadershipFocusItems.map((item, index) => (
              <div key={item.id} className="leadership-item compact-item">
                <div className="leadership-number">{index + 1}</div>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.description}</p>
                </div>
                <span className="detail-pill">{item.role}</span>
              </div>
            ))}
          </div>
          <div className="row-actions">
            <button type="button" className="secondary-button small" onClick={() => onShowToast('Added to leadership meeting agenda')}>Add to meeting</button>
            <button type="button" className="secondary-button small" onClick={() => onShowToast('Review requested from leadership team')}>Request review</button>
            <button type="button" className="secondary-button small" onClick={() => onShowToast('Marked reviewed in leadership routine')}>Mark reviewed</button>
          </div>
        </article>

        <article className="overview-card">
          <div className="card-title-row">
            <div>
              <h3>Ask AI</h3>
              <p className="muted">On-demand explanation and meeting support</p>
            </div>
          </div>
          <label className="search-field wide-field">
            <span className="sr-only">Ask overview question</span>
            <input placeholder="Ask: What should I focus on?" />
          </label>
          <button type="button" className="primary-button wide" onClick={() => onAskAI('Summarise the top 3 risks for my leadership meeting.')}>Ask</button>
          <div className="prompt-list">
            {overviewPageData.askAiPrompts.map((prompt) => (
              <button key={prompt} type="button" className="prompt-pill" onClick={() => onAskAI(prompt)}>{prompt}</button>
            ))}
          </div>
          <p className="helper-copy">Answer uses current filters, role permissions, incident trends, assurance results, LiF observations and control verification data.</p>
        </article>
      </section>

      <p className="footer-note">Synthetic demo data only. Not connected to live operational systems.</p>
    </div>
  )
}
