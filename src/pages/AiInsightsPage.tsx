import { useEffect, useMemo, useState } from 'react'
import insightsPageData, { type Insight, type KpiCardDefinition } from '../data/gmInsightsData'
import type { DashboardState } from '../types/dashboard'

type Props = {
  filters: DashboardState
  initialSelectedInsightId?: string
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

export default function AiInsightsPage({ filters, initialSelectedInsightId, onOpenRisk, onOpenControlHealth, onOpenAssurance, onAskAI, onShowToast }: Props) {
  const [selectedTab, setSelectedTab] = useState<'all' | 'decision' | 'risk' | 'control' | 'behaviour' | 'weak' | 'assurance'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortMode, setSortMode] = useState<'severity' | 'newest' | 'movement' | 'action'>('severity')
  const [selectedInsightId, setSelectedInsightId] = useState<string | undefined>(initialSelectedInsightId)
  const [addedToMeetingIds, setAddedToMeetingIds] = useState<string[]>([])
  const [aiPromptDraft, setAiPromptDraft] = useState('')
  const [activeMetric, setActiveMetric] = useState<KpiCardDefinition | null>(null)
  const [activeInsightDetail, setActiveInsightDetail] = useState<Insight | null>(null)

  useEffect(() => {
    if (initialSelectedInsightId) {
      setSelectedInsightId(initialSelectedInsightId)
    }
  }, [initialSelectedInsightId])

  const selectedInsight = useMemo(() => {
    return insightsPageData.insights.find((item) => item.id === selectedInsightId) ?? null
  }, [selectedInsightId])

  const filteredInsights = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    const list = insightsPageData.insights.filter((insight) => {
      if (selectedTab !== 'all' && insight.filterGroup !== selectedTab) return false
      if (!query) return true

      const haystack = `${insight.title} ${insight.category} ${insight.site} ${insight.area} ${insight.whyFlagged} ${insight.whatChanged}`.toLowerCase()
      return haystack.includes(query)
    })

    const sorted = [...list]
    sorted.sort((a, b) => {
      if (sortMode === 'newest') return a.updated.localeCompare(b.updated)
      if (sortMode === 'movement') return b.metrics[3]?.value.localeCompare(a.metrics[3]?.value ?? '')
      if (sortMode === 'action') return Number(a.status === 'Decision required') < Number(b.status === 'Decision required') ? 1 : -1
      const severityOrder = { High: 3, Medium: 2, Monitor: 1, Low: 0 }
      const confidenceOrder = { High: 3, Medium: 2, Low: 1 }
      return confidenceOrder[b.confidence] - confidenceOrder[a.confidence] || severityOrder[b.severity] - severityOrder[a.severity]
    })

    return sorted
  }, [searchTerm, selectedTab, sortMode])

  const siteLabel = filters.site === 'all' ? 'All Pilbara sites' : formatLabel(filters.site)
  const areaLabel = filters.area === 'all' ? 'All areas' : formatLabel(filters.area)
  const timeframeLabel = formatLabel(filters.timeframe)

  const handleAddToMeeting = (id: string) => {
    setAddedToMeetingIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    onShowToast('Added to leadership meeting agenda')
  }

  return (
    <div className="insights-dashboard">
      <div className="insights-page-header">
        <div>
          <p className="eyebrow">AI Insights</p>
          <h2>AI Insights</h2>
          <p className="page-subtitle">General Manager view - aggregated insights that explain what is changing, why it matters and where leadership attention is needed.</p>
        </div>

        <div className="insights-header-rail">
          <div className="inline-pill-row" aria-label="Insight filters summary">
            <span className="detail-pill detail-pill-strong">GM: Executive Insight View</span>
            <span className="detail-pill">Site: {siteLabel}</span>
            <span className="detail-pill">Area: {areaLabel}</span>
            <span className="detail-pill">Timeframe: {timeframeLabel}</span>
            <span className="detail-pill">Severity: High + Medium</span>
          </div>
          <div className="action-row">
            <button type="button" className="secondary-button" onClick={() => onShowToast('AI insights summary exported using current filters.')}>Export</button>
            <button type="button" className="secondary-button" onClick={() => onAskAI('Summarise the top three AI insights for my SLT meeting.')}>Ask AI</button>
            <button type="button" className="icon-button ghost-button" aria-label="More AI insights options">⋯</button>
          </div>
        </div>
      </div>

      <section className="decision-banner insights-banner" aria-label="Decision support banner">
        <div className="decision-banner-copy">
          <div className="banner-icon">✦</div>
          <div>
            <p className="eyebrow">Decision support</p>
            <h3>3 insights need GM attention this week. Highest signal: Vehicle interaction risk +18% linked to traffic separation control degradation and repeated Line of Fire themes.</h3>
          </div>
        </div>
        <div className="banner-actions">
          <button type="button" className="secondary-button" onClick={() => onShowToast('Data refreshed 06:30 AWST')}>Data refreshed 06:30 AWST</button>
          <button type="button" className="primary-button" onClick={() => onAskAI('Summarise the top three AI insights for my SLT meeting.')}>Generate SLT summary</button>
        </div>
      </section>

      <section className="kpi-grid" aria-label="AI insights summary metrics">
        {insightsPageData.kpiCards.map((card) => (
          <button key={card.id} type="button" className="kpi-card insights-kpi-card" onClick={() => { setSelectedTab(card.filterGroup); setActiveMetric(card); onShowToast(`${card.title}: ${card.detail}`) }}>
            <div className="kpi-title-row">
              <p className="kpi-title">{card.title}</p>
              <span className="mini-chip">{card.badge}</span>
            </div>
            <h3>{card.value}</h3>
            <p>{card.supportingText}</p>
            <div className="mini-sparkline" aria-hidden="true">
              {card.sparkline.map((value, index) => <span key={`${card.id}-${index}`} style={{ height: `${value}%` }} />)}
            </div>
          </button>
        ))}
      </section>

      <section className="insights-filter-bar" aria-label="Insight filters">
        <div className="insight-tabs">
          {insightsPageData.insightTabs.map((tab) => (
            <button key={tab.id} type="button" className={`filter-chip ${selectedTab === tab.id ? 'active' : ''}`} onClick={() => setSelectedTab(tab.id)}>
              <span>{tab.label}</span>
              <span className="chip-count">{tab.count}</span>
            </button>
          ))}
        </div>
        <div className="insights-toolbar">
          <label className="search-field">
            <span className="sr-only">Search insights</span>
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search insights, controls, sites or risks…" />
          </label>
          <label className="sort-select">
            <span className="sr-only">Sort insights</span>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as 'severity' | 'newest' | 'movement' | 'action')}>
              <option value="severity">Sort: Severity + confidence</option>
              <option value="newest">Newest first</option>
              <option value="movement">Highest risk movement</option>
              <option value="action">Action required first</option>
            </select>
          </label>
          <div className="view-pill">View: Cards</div>
        </div>
      </section>

      <section className="insights-main-grid">
        <div className="insights-feed-card">
          <div className="card-title-row">
            <div>
              <h3>Executive insights requiring attention</h3>
              <p className="muted">AI-generated insights grouped by risk movement, control health, assurance coverage and behaviour themes.</p>
            </div>
            <div className="chip-cluster">
              <span className="status-chip status-red">3 require decision</span>
              <span className="status-chip status-blue">86% avg confidence</span>
            </div>
          </div>

          <div className="insight-list">
            {filteredInsights.map((insight) => {
              const isSelected = selectedInsight?.id === insight.id
              const isMeetingAdded = addedToMeetingIds.includes(insight.id)

              return (
                <article key={insight.id} className={`insight-card-item ${isSelected ? 'selected' : ''}`} tabIndex={0} onClick={() => setSelectedInsightId(insight.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedInsightId(insight.id) } }}>
                  <div className="insight-card-top">
                    <div className="insight-card-badge">{insight.category.split(' ')[0]}</div>
                    <div className="insight-card-heading">
                      <p className="insight-category-label">{insight.category}</p>
                      <h4>{insight.title}</h4>
                    </div>
                    <div className="insight-chip-stack">
                      <span className={`status-chip ${insight.severity === 'High' ? 'status-red' : insight.severity === 'Medium' ? 'status-amber' : insight.severity === 'Monitor' ? 'status-purple' : 'status-green'}`}>{insight.severity}</span>
                      <span className={`status-chip ${insight.status === 'Decision required' ? 'status-red' : insight.status === 'Assurance gap' ? 'status-purple' : insight.status === 'Plan review' ? 'status-amber' : insight.status === 'Emerging risk' ? 'status-amber' : 'status-green'}`}>{insight.status}</span>
                      <span className="status-chip status-blue">{insight.confidence} confidence</span>
                    </div>
                  </div>

                  <div className="insight-card-body">
                    <div className="insight-text-blocks">
                      <div className="insight-copy-block">
                        <h5>What changed</h5>
                        <p>{insight.whatChanged}</p>
                      </div>
                      <div className="insight-why-box">
                        <h5>Why AI flagged this</h5>
                        <p>{insight.whyFlagged}</p>
                      </div>
                    </div>
                    <div className="insight-metric-grid">
                      {insight.metrics.map((metric) => (
                        <div key={metric.label} className="mini-metric-card">
                          <strong>{metric.value}</strong>
                          <span>{metric.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="insight-card-footer">
                    <div className="tag-list">
                      {insight.tags.map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
                    </div>
                    <div className="insight-card-actions">
                      <button type="button" className="secondary-button small" onClick={(event) => { event.stopPropagation(); setActiveInsightDetail(insight) }}>Open Insight</button>
                      <button type="button" className="primary-button small" onClick={(event) => { event.stopPropagation(); if (insight.primaryActionTarget === 'risk') onOpenRisk(insight.routeId ?? 'vehicle-interaction'); if (insight.primaryActionTarget === 'control') onOpenControlHealth(); if (insight.primaryActionTarget === 'assurance') onOpenAssurance(); if (insight.primaryActionTarget === 'insight') setActiveInsightDetail(insight) }}>
                        {insight.primaryActionLabel}
                      </button>
                    </div>
                  </div>

                  <div className="insight-card-actions-row">
                    <button type="button" className="secondary-button small" onClick={(event) => { event.stopPropagation(); onAskAI(`Why is ${insight.title.toLowerCase()}?`) }}>Ask AI</button>
                    <button type="button" className={`secondary-button small ${isMeetingAdded ? 'added-state' : ''}`} onClick={(event) => { event.stopPropagation(); handleAddToMeeting(insight.id) }}>{isMeetingAdded ? 'Added' : 'Add to meeting'}</button>
                    <span className="timestamp">{insight.updated}</span>
                  </div>
                </article>
              )
            })}
          </div>
        </div>

        <aside className="insights-support-column">
          <div className="support-card">
            <div className="card-title-row">
              <div>
                <h3>AI summary - what matters</h3>
                <p className="muted">Plain-language explanation for General Managers</p>
              </div>
              <span className="status-chip status-red">High priority</span>
            </div>
            <div className="support-highlight-box">
              <h4>Leadership attention required</h4>
              <p>Risk is moving fastest where critical controls depend on consistent field behaviour: traffic separation, isolation verification and line of fire positioning.</p>
            </div>
            <ol className="support-list">
              <li><strong>Vehicle interaction</strong> is the highest-priority insight due to aligned incident, control and behaviour signals.</li>
              <li><strong>Assurance coverage</strong> is not keeping pace with the current top risk movement.</li>
              <li><strong>Superintendent</strong> field priorities should be aligned to the controls now showing degradation.</li>
            </ol>
          </div>

          <div className="support-card">
            <div className="card-title-row">
              <div>
                <h3>Evidence used by AI</h3>
                <p className="muted">Source signals that contributed to insights</p>
              </div>
              <button type="button" className="secondary-button small" onClick={() => onShowToast('Explainability added to the current view')}>Explainability</button>
            </div>
            <div className="evidence-grid">
              {insightsPageData.evidenceTiles.map((tile) => (
                <button key={tile.id} type="button" className="evidence-tile" onClick={() => setActiveMetric({ id: tile.id, title: tile.name, value: tile.count, supportingText: tile.detail, badge: tile.badge, sparkline: [14, 20, 18, 23], filterGroup: 'all', detail: tile.detail } as KpiCardDefinition)}>
                  <span className="evidence-badge">{tile.badge}</span>
                  <div>
                    <strong>{tile.name}</strong>
                    <p>{tile.count}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="support-card">
            <div className="card-title-row">
              <div>
                <h3>Ask AI</h3>
                <p className="muted">GM prompts based on this page and filters</p>
              </div>
            </div>
            <label className="search-field wide-field">
              <span className="sr-only">Ask about these insights</span>
              <input value={aiPromptDraft} onChange={(event) => setAiPromptDraft(event.target.value)} placeholder="Ask about these insights…" />
            </label>
            <button type="button" className="primary-button wide" onClick={() => onAskAI(aiPromptDraft.trim() || 'Summarise the top three insights for my SLT meeting')}>Ask</button>
            <div className="prompt-list">
              {insightsPageData.suggestedAskPrompts.map((prompt) => (
                <button key={prompt} type="button" className="prompt-pill" onClick={() => onAskAI(prompt)}>{prompt}</button>
              ))}
            </div>
            <p className="helper-copy">Responses use the current GM role, selected filters and the evidence visible on this page.</p>
          </div>

          <div className="support-card">
            <div className="card-title-row">
              <div>
                <h3>Leadership questions to ask</h3>
                <p className="muted">Suggested questions for Managers and Superintendents</p>
              </div>
            </div>
            <div className="leadership-question-list">
              {insightsPageData.leadershipQuestions.map((question) => (
                <div key={question.id} className="leadership-question-row">
                  <div>
                    <strong>{question.title}</strong>
                    <p>{question.text}</p>
                  </div>
                  <div className="question-actions">
                    <button type="button" className="secondary-button small" onClick={() => handleAddToMeeting(question.id)}>Add to meeting</button>
                    <button type="button" className="secondary-button small" onClick={() => { navigator.clipboard.writeText(question.text); onShowToast('Question copied to clipboard') }}>Copy</button>
                    <button type="button" className="secondary-button small" onClick={() => onAskAI(question.text)}>Ask AI</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="insights-bottom-grid" aria-label="Bottom insight summaries">
        {insightsPageData.bottomSummaryCards.map((card) => (
          <div key={card.id} className="bottom-summary-card">
            <div className="card-title-row">
              <div>
                <h3>{card.title}</h3>
                <p className="muted">{card.subtitle}</p>
              </div>
            </div>
            <div className="bottom-summary-list">
              {card.items.map((item) => (
                <div key={item.label} className={`bottom-summary-row ${item.tone}`}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <p className="footer-note">Synthetic demo data only. Not connected to live operational systems.</p>

      {(activeMetric || activeInsightDetail) && <div className="flyout-backdrop" role="presentation" onClick={() => { setActiveMetric(null); setActiveInsightDetail(null) }} />}
      <aside className={`detail-drawer ${activeMetric || activeInsightDetail ? 'open' : ''}`} aria-label="Insight detail drawer">
        {activeMetric && (
          <>
            <div className="card-title-row">
              <h3>{activeMetric.title}</h3>
              <button type="button" className="text-button" onClick={() => setActiveMetric(null)}>Close</button>
            </div>
            <p className="large-stat">{activeMetric.value}</p>
            <p>{activeMetric.detail}</p>
            <div className="mini-sparkline large-sparkline" aria-hidden="true">
              {activeMetric.sparkline.map((value, index) => <span key={`${activeMetric.id}-${index}`} style={{ height: `${value}%` }} />)}
            </div>
            <div className="drawer-actions">
              <button type="button" className="secondary-button" onClick={() => onShowToast(`${activeMetric.title} detail reviewed`)}>Review detail</button>
              <button type="button" className="primary-button" onClick={() => onAskAI(`Explain ${activeMetric.title.toLowerCase()} for my leadership review`)}>Ask AI</button>
            </div>
          </>
        )}
        {activeInsightDetail && !activeMetric && (
          <>
            <div className="card-title-row">
              <h3>{activeInsightDetail.title}</h3>
              <button type="button" className="text-button" onClick={() => setActiveInsightDetail(null)}>Close</button>
            </div>
            <p className="muted">{activeInsightDetail.category}</p>
            <div className="support-highlight-box compact-box">
              <h4>Why AI flagged this</h4>
              <p>{activeInsightDetail.whyFlagged}</p>
            </div>
            <div className="insight-detail-blocks">
              <div>
                <h4>What changed</h4>
                <p>{activeInsightDetail.whatChanged}</p>
              </div>
              <div>
                <h4>Recommended leadership action</h4>
                <p>{activeInsightDetail.metrics.map((metric) => `${metric.label}: ${metric.value}`).join(' • ')}</p>
              </div>
            </div>
            <div className="drawer-actions">
              <button type="button" className="secondary-button" onClick={() => { onOpenRisk(activeInsightDetail.routeId ?? 'vehicle-interaction'); setActiveInsightDetail(null) }}>Open risk detail</button>
              <button type="button" className="secondary-button" onClick={() => { onOpenControlHealth(); setActiveInsightDetail(null) }}>Open control health</button>
              <button type="button" className="primary-button" onClick={() => { handleAddToMeeting(activeInsightDetail.id); setActiveInsightDetail(null) }}>Add to meeting</button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
