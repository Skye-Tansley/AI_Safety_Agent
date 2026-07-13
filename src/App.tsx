import { useEffect, useMemo, useRef, useState } from 'react'
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import './App.css'
import AiInsightsPage from './pages/AiInsightsPage'
import AssurancePage from './pages/AssurancePage'
import ControlHealthPage from './pages/ControlHealthPage'
import IndividualRiskDetailPage from './pages/IndividualRiskDetailPage'
import OverviewPage from './pages/OverviewPage'
import RiskDetailsOverviewPage from './pages/RiskDetailsOverviewPage'
import CcvsAssurancePlanningPage from './pages/CcvsAssurancePlanningPage'
import SuperintendentLeadershipInFieldPage from './pages/SuperintendentLeadershipInFieldPage'

import {
  areaOptionsBySite,
  notifications,
  riskLensOptions,
  siteOptions,
  timeframeOptions,
} from './data/gmDashboardData'
import type { DashboardState, NotificationItem, TopRisk, WeakSignal } from './types/dashboard'

type DrawerState =
  | { type: 'none' }
  | { type: 'kpi'; item: { title: string; value: string; detail: string; actions: string[] } }
  | { type: 'risk'; item: TopRisk }
  | { type: 'weakSignal'; item: WeakSignal }
  | { type: 'notification'; item: NotificationItem }

const initialState: DashboardState = {
  site: 'all',
  area: 'all',
  timeframe: '30d',
  riskLens: 'fatal-injury',
  customFrom: '2026-06-01',
  customTo: '2026-06-30',
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [filters, setFilters] = useState<DashboardState>(initialState)
  const [activeNav, setActiveNav] = useState('Overview')
  const [, setSelectedRiskId] = useState<string | undefined>(undefined)
  const [selectedInsightId] = useState<string | undefined>(undefined)
  const [drawer, setDrawer] = useState<DrawerState>({ type: 'none' })
  const [toast, setToast] = useState<string | null>(null)
  const [aiOpen, setAiOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [aiQuestion, setAiQuestion] = useState('')
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'Focus on vehicle interaction risk and traffic separation controls. The current signal is strongest in Load & Haul and contractor road movements.',
    },
  ])

  // Role management
  type Role = 'general-manager' | 'manager' | 'superintendent' | 'supervisor'
  const roleFromStorage = ((): Role => {
    try {
      const raw = localStorage.getItem('asa_role')
      if (!raw) return 'general-manager'
      return raw as Role
    } catch {
      return 'general-manager'
    }
  })()
  const [role, setRole] = useState<Role>(roleFromStorage)
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const roleDropdownRef = useRef<HTMLDivElement | null>(null)

  const sidebarNavItems = useMemo(() => {
    if (role === 'general-manager') {
      return ['Overview', 'AI Insights', 'Risk Detail', 'Control Health', 'Assurance', 'Field Priorities', 'Shift Guidance', 'Alerts']
    }
    if (role === 'manager') {
      return ['CCVS Assurance Planning']
    }
    if (role === 'superintendent') {
      return ['CCVS Assurance Planning', 'Leadership in the Field']
    }
    return ['Coming Soon']
  }, [role])

  useEffect(() => {
    try { localStorage.setItem('asa_role', role) } catch {}
  }, [role])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(timer)
  }, [toast])

  const siteLabel = siteOptions.find((option) => option.value === filters.site)?.label ?? 'All Pilbara Sites'
  const areaLabel = (areaOptionsBySite[filters.site] ?? areaOptionsBySite.all).find((option) => option.value === filters.area)?.label ?? 'All areas'
  const timeframeLabel = timeframeOptions.find((option) => option.value === filters.timeframe)?.label ?? 'Last 30 days'
  const riskLensLabel = riskLensOptions.find((option) => option.value === filters.riskLens)?.label ?? 'Fatal + Injury Combined'
  const availableAreas = areaOptionsBySite[filters.site] ?? areaOptionsBySite.all

  useEffect(() => {
    if (!availableAreas.some((option) => option.value === filters.area)) {
      setFilters((prev) => ({ ...prev, area: availableAreas[0]?.value ?? 'all' }))
    }
  }, [availableAreas, filters.area])

  const metricContext = useMemo(() => {
    const siteFactor = filters.site === 'all' ? 0 : filters.site === 'west' ? -2 : 2
    const areaFactor = filters.area === 'haul' || filters.area === 'contractor' || filters.area === 'mine' ? 3 : 0
    const timeframeFactor =
      filters.timeframe === 'week' ? -2 : filters.timeframe === 'last-week' ? -1 : filters.timeframe === '30d' ? 0 : filters.timeframe === '90d' ? 3 : 1
    const lensFactor = filters.riskLens === 'fatal' ? 2 : filters.riskLens === 'controls' ? -1 : filters.riskLens === 'assurance' ? -2 : 0
    const riskIndex = Math.min(96, Math.max(62, 82 + siteFactor + areaFactor + timeframeFactor + lensFactor))
    const movement = Math.min(24, Math.max(6, 14 + siteFactor + areaFactor + (filters.timeframe === 'week' ? 1 : 0)))
    const stable = Math.min(80, Math.max(56, 68 + (filters.timeframe === '90d' ? -2 : 0) + (filters.riskLens === 'assurance' ? -1 : 0)))
    const atRisk = Math.min(34, Math.max(18, 24 + (filters.area === 'haul' ? 2 : 0) + (filters.riskLens === 'fatal' ? 2 : 0)))
    const degrading = 100 - stable - atRisk
    const assurance = Math.min(90, Math.max(60, 74 + (filters.riskLens === 'assurance' ? 3 : 0) - (filters.site === 'west' ? 1 : 0)))
    const weakSignals = filters.timeframe === 'week' ? 5 : filters.timeframe === 'last-week' ? 6 : 4
    const openActions = filters.site === 'all' ? 11 : 9
    const overdue = filters.timeframe === 'week' ? 3 : 2
    const sitesIncreasing = filters.site === 'all' ? 2 : 1

    return {
      riskIndex,
      movement,
      stable,
      atRisk,
      degrading,
      assurance,
      weakSignals,
      openActions,
      overdue,
      sitesIncreasing,
    }
  }, [filters])

  const showToast = (label: string) => setToast(label)
  const roleLabel = role === 'general-manager' ? 'General Manager' : role === 'manager' ? 'Manager' : role === 'superintendent' ? 'Superintendent' : 'Supervisor'
  const roleInitials = role === 'general-manager' ? 'GM' : role === 'manager' ? 'MGR' : role === 'superintendent' ? 'SupT' : 'SupV'

  const isCcvsPage = location.pathname.includes('/ccvs-assurance-planning')

  const drawerContext = (() => {
    const path = location.pathname
    if (path === '/supervisor') return `Context: ${roleLabel} | Placeholder view`
    if (path.includes('/ccvs-assurance-planning')) return `Context: ${roleLabel} | CCVS Assurance Planning | selected site | selected department | selected team | selected month`
    if (path.includes('/leadership-in-field')) return `Context: ${roleLabel} | Leadership in the Field | selected site | selected department | selected team | selected month`
    return `Context: ${roleLabel} | ${activeNav} | ${siteLabel} | ${areaLabel} | ${timeframeLabel} | ${riskLensLabel}`
  })()

  const handleRoleSelect = (newRole: Role) => {
    setRoleDropdownOpen(false)
    setRole(newRole)
    if (newRole === 'general-manager') navigate('/overview')
    else if (newRole === 'superintendent') navigate('/superintendent/ccvs-assurance-planning')
    else if (newRole === 'manager') navigate('/manager/ccvs-assurance-planning')
    else if (newRole === 'supervisor') navigate('/supervisor')
  }

  const promptAi = (question: string) => {
    setAiQuestion(question)
    setAiOpen(true)
  }

  const handleSubmitQuestion = (event: React.FormEvent) => {
    event.preventDefault()
    const value = aiQuestion.trim()
    if (!value) return
    setChatMessages((prev) => [...prev, { role: 'user', text: value }])

    const lower = value.toLowerCase()
    let reply = `Focus on vehicle interaction risk and traffic separation controls. The risk index has increased by ${metricContext.movement}%, verification completion has reduced in ${areaLabel.toLowerCase()}, and near-miss language around light vehicle interaction has increased.`
    if (lower.includes('manager')) {
      reply = `Ask Managers to confirm whether the current assurance plan covers contractor road movements and whether overdue traffic management actions have owners.`
    } else if (lower.includes('control')) {
      reply = `The most unstable controls are traffic separation verification and energy isolation confirmation. These should be reviewed before the next leadership meeting.`
    } else if (lower.includes('why')) {
      reply = `The increase is being driven by repeated blind spot observations, a rise in vehicle-pedestrian near-misses and lower checks in contractor work areas.`
    }

    setChatMessages((prev) => [...prev, { role: 'assistant', text: reply }])
    setAiQuestion('')
  }

  useEffect(() => {
    const path = location.pathname
    if (path === '/insights') {
      setActiveNav('AI Insights')
    } else if (path.startsWith('/risk-detail')) {
      setActiveNav('Risk Detail')
    } else if (path === '/control-health') {
      setActiveNav('Control Health')
    } else if (path === '/assurance') {
      setActiveNav('Assurance')
    } else if (path.includes('/ccvs-assurance-planning')) {
      setActiveNav('CCVS Assurance Planning')
    } else if (path.includes('/leadership-in-field')) {
      setActiveNav('Leadership in the Field')
    } else if (path === '/supervisor') {
      setActiveNav('Supervisor')
    } else {
      setActiveNav('Overview')
    }
  }, [location.pathname])

  const renderMainContent = () => {
    const path = location.pathname
    if (path === '/supervisor') {
      return (
        <div className="placeholder-page">
          <h1>Supervisor view will be added in a later prototype step.</h1>
        </div>
      )
    }
    if (path.includes('/ccvs-assurance-planning')) {
      return <CcvsAssurancePlanningPage />
    }
    if (path.includes('/leadership-in-field')) {
      return <SuperintendentLeadershipInFieldPage />
    }
    if (activeNav === 'AI Insights') {
      return (
        <AiInsightsPage
          filters={filters}
          initialSelectedInsightId={selectedInsightId}
          onOpenRisk={(id) => { setSelectedRiskId(id); navigate(`/risk-detail/${id}`); setToast('Opening risk detail: ' + id) }}
          onOpenControlHealth={() => { navigate('/control-health'); setToast('Opening Control Health') }}
          onOpenAssurance={() => { navigate('/assurance'); setToast('Opening Assurance Oversight') }}
          onAskAI={(q) => promptAi(q)}
          onShowToast={(message) => showToast(message)}
        />
      )
    }

    if (activeNav === 'Control Health') {
      return (
        <ControlHealthPage
          filters={filters}
          onOpenRisk={(id) => { setSelectedRiskId(id); navigate(`/risk-detail/${id}`); setToast('Opening risk detail: ' + id) }}
          onOpenAssurance={() => { navigate('/assurance'); setToast('Opening Assurance Oversight') }}
          onAskAI={(q) => promptAi(q)}
          onShowToast={(message) => showToast(message)}
        />
      )
    }

    if (activeNav === 'Assurance') {
      return (
        <AssurancePage
          filters={filters}
          onOpenRisk={(id) => { setSelectedRiskId(id); navigate(`/risk-detail/${id}`); setToast('Opening risk detail: ' + id) }}
          onOpenControlHealth={() => { navigate('/control-health'); setToast('Opening Control Health') }}
          onAskAI={(q) => promptAi(q)}
          onShowToast={(message) => showToast(message)}
        />
      )
    }

    if (activeNav === 'Risk Detail') {
      return (
        <Routes>
          <Route path="/risk-detail" element={<RiskDetailsOverviewPage filters={filters} onAskAI={(q) => promptAi(q)} onShowToast={(message) => showToast(message)} onOpenRisk={(id) => { navigate(`/risk-detail/${id}`) }} />} />
          <Route path="/risk-detail/:riskItemId" element={<IndividualRiskDetailPage filters={filters} onAskAI={(q) => promptAi(q)} onShowToast={(message) => showToast(message)} onOpenAssurance={() => navigate('/assurance')} onOpenControlHealth={() => navigate('/control-health')} />} />
        </Routes>
      )
    }

    return (
      <OverviewPage
        filters={filters}
        onOpenRisk={(id) => { setSelectedRiskId(id); setActiveNav('Risk Detail'); navigate(`/risk-detail/${id}`); setToast('Opening risk detail: ' + id) }}
        onOpenControlHealth={() => { navigate('/control-health'); setActiveNav('Control Health'); setToast('Opening Control Health') }}
        onOpenAssurance={() => { navigate('/assurance'); setActiveNav('Assurance'); setToast('Opening Assurance Oversight') }}
        onAskAI={(q) => promptAi(q)}
        onShowToast={(message) => showToast(message)}
      />
    )
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">AI</div>
          <div>
            <div className="brand-title">AI SAFETY</div>
            <div className="brand-title">RISK</div>
            <div className="brand-title">ASSURANCE</div>
            <div className="brand-title">MVP</div>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary">
          {sidebarNavItems.map((item) => {
            const isActive = item === activeNav || (item === 'CCVS Assurance Planning' && location.pathname.includes('/ccvs-assurance-planning')) || (item === 'Leadership in the Field' && location.pathname.includes('/leadership-in-field'))
            return (
              <button
                key={item}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (item === 'CCVS Assurance Planning') {
                    if (role === 'superintendent') navigate('/superintendent/ccvs-assurance-planning')
                    else if (role === 'manager') navigate('/manager/ccvs-assurance-planning')
                    setActiveNav('CCVS Assurance Planning')
                    return
                  }
                  if (item === 'Leadership in the Field') {
                    navigate('/superintendent/leadership-in-field')
                    setActiveNav('Leadership in the Field')
                    return
                  }
                  if (item === 'Overview') { setActiveNav('Overview'); navigate('/overview'); return }
                  if (item === 'AI Insights') { setActiveNav('AI Insights'); navigate('/insights'); return }
                  if (item === 'Risk Detail') { setActiveNav('Risk Detail'); navigate('/risk-detail'); return }
                  if (item === 'Control Health') { setActiveNav('Control Health'); navigate('/control-health'); return }
                  if (item === 'Assurance') { setActiveNav('Assurance'); navigate('/assurance'); return }
                  if (item === 'Coming Soon') { showToast('Supervisor view will be added in a later prototype step.'); return }
                  showToast('This page will be added in the next prototype step')
                }}
              >
                {item}
              </button>
            )
          })}
        </nav>

        <div className="sidebar-user">
          <div className="avatar">{roleInitials}</div>
          <div>
            <div className="user-name">{roleLabel}</div>
            <div className="user-role">{role === 'general-manager' ? 'Pilbara Operations' : role === 'manager' ? 'Mine Operations / Site A' : role === 'superintendent' ? 'Mine Operations / Site A' : 'Shift Execution / Site A'}</div>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-brand-row">
            <div className="brand-square" aria-hidden="true" />
            <div>
              <p className="topbar-app-label">Rio Tinto</p>
              <h1>Safety AI Agent</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="role-dropdown-wrapper" ref={roleDropdownRef}>
              <button
                type="button"
                className={`role-dropdown ${roleDropdownOpen ? 'open' : ''}`}
                onClick={() => setRoleDropdownOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={roleDropdownOpen}
              >
                {roleLabel}
                <span className="chevron">▾</span>
              </button>
              {roleDropdownOpen && (
                <div className="role-dropdown-menu" role="menu">
                  {['general-manager', 'manager', 'superintendent', 'supervisor'].map((value) => {
                    const label = value === 'general-manager' ? 'General Manager' : value === 'manager' ? 'Manager' : value === 'superintendent' ? 'Superintendent' : 'Supervisor'
                    return (
                      <button
                        key={value}
                        type="button"
                        className={`role-dropdown-item ${role === value ? 'selected' : ''}`}
                        onClick={() => handleRoleSelect(value as Role)}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="icon-button-wrap">
              <button
                type="button"
                className="icon-button"
                aria-label="Open notifications"
                onClick={() => setNotificationsOpen((prev) => !prev)}
              >
                🔔
              </button>
              <span className="badge">3</span>
            </div>
            <button type="button" className="secondary-button" onClick={() => promptAi('What should I focus on before this week’s safety leadership meeting?')}>
              Ask AI
            </button>
            <button type="button" className="primary-button" onClick={() => showToast('Dashboard summary exported using current filters')}>
              Export
            </button>
          </div>
        </header>

        {notificationsOpen && (
          <div className="popover-card notification-popover">
            <div className="card-title-row">
              <h3>Notifications</h3>
              <button type="button" className="text-button" onClick={() => setNotificationsOpen(false)}>
                Close
              </button>
            </div>
            <div className="notification-list">
              {notifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="notification-item"
                  onClick={() => {
                    setDrawer({ type: 'notification', item })
                    setNotificationsOpen(false)
                  }}
                >
                  <span className={`priority-chip ${item.priority.toLowerCase().replace(/[^a-z]+/g, '-')}`}>{item.priority}</span>
                  <p>{item.title}</p>
                  <span className="mini-action">{item.actionLabel}</span>
                </button>
              ))}
            </div>
            <button type="button" className="secondary-button wide" onClick={() => showToast('Notification center will be added in the next prototype step')}>
              Open Notification Center
            </button>
          </div>
        )}

        {!isCcvsPage && (
          <section className="filter-bar" aria-label="Dashboard filters">
            <label className="filter-control">
              <span>Site</span>
              <select value={filters.site} onChange={(event) => setFilters((prev) => ({ ...prev, site: event.target.value, area: 'all' }))}>
                {siteOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-control">
              <span>Area</span>
              <select value={filters.area} onChange={(event) => setFilters((prev) => ({ ...prev, area: event.target.value }))}>
                {availableAreas.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="filter-control timeframe-block">
              <span>Timeframe</span>
              <div className="timeframe-row">
                {timeframeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`pill ${filters.timeframe === option.value ? 'active' : ''}`}
                    onClick={() => setFilters((prev) => ({ ...prev, timeframe: option.value }))}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {filters.timeframe === 'custom' && (
                <div className="date-row">
                  <label>
                    <span>From</span>
                    <input type="date" value={filters.customFrom} onChange={(event) => setFilters((prev) => ({ ...prev, customFrom: event.target.value }))} />
                  </label>
                  <label>
                    <span>To</span>
                    <input type="date" value={filters.customTo} onChange={(event) => setFilters((prev) => ({ ...prev, customTo: event.target.value }))} />
                  </label>
                </div>
              )}
            </div>

            <label className="filter-control">
              <span>Risk lens</span>
              <select value={filters.riskLens} onChange={(event) => setFilters((prev) => ({ ...prev, riskLens: event.target.value }))}>
                {riskLensOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </section>
        )}

        {renderMainContent()}

      </main>

      {aiOpen && (
        <div className="flyout-backdrop" onClick={() => setAiOpen(false)} role="presentation" />
      )}
      <aside className={`ask-ai-drawer ${aiOpen ? 'open' : ''}`} aria-label="Ask AI panel">
        <div className="card-title-row">
          <h3>Ask AI</h3>
          <button type="button" className="text-button" onClick={() => setAiOpen(false)}>
            Close
          </button>
        </div>
        <p className="drawer-context">{drawerContext}</p>
        <div className="prompt-list">
          {[
            'What should I focus on this week?',
            'Why is vehicle interaction increasing?',
            'Which controls are degrading?',
          ].map((prompt) => (
            <button key={prompt} type="button" className="prompt-pill" onClick={() => setAiQuestion(prompt)}>
              {prompt}
            </button>
          ))}
        </div>
        <form className="chat-form" onSubmit={handleSubmitQuestion}>
          <label className="sr-only" htmlFor="ai-question">Ask AI</label>
          <textarea id="ai-question" value={aiQuestion} onChange={(event) => setAiQuestion(event.target.value)} placeholder="Ask a question about the current dashboard context" />
          <button type="submit" className="primary-button">Submit</button>
        </form>
        <div className="ai-response-card">
          <h4>Example AI response</h4>
          <p>Focus on vehicle interaction risk and traffic separation controls. The risk index has increased by {metricContext.movement}%, verification completion has reduced in {areaLabel.toLowerCase()}, and near-miss language around light vehicle interaction has increased.</p>
          <div className="response-section">
            <h5>Recommendation</h5>
            <p>Review traffic separation assurance coverage and confirm overdue actions have named owners before the next meeting.</p>
          </div>
          <div className="response-section">
            <h5>Why AI is saying this</h5>
            <p>Repeated blind spot observations and a drop in control verification completion are increasing assurance risk.</p>
          </div>
          <div className="response-section">
            <h5>Evidence signals</h5>
            <p>Near-miss wording, line-of-fire coaching observations and contractor verification lag.</p>
          </div>
          <div className="response-section">
            <h5>Suggested leadership questions</h5>
            <p>Are contractor road movements included in the current assurance plan? Who owns the overdue traffic management actions?</p>
          </div>
        </div>
        <div className="chat-thread">
          {chatMessages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`chat-bubble ${message.role}`}>
              <p>{message.text}</p>
            </div>
          ))}
        </div>
        <div className="drawer-actions">
          <button type="button" className="secondary-button" onClick={() => { setActiveNav('Risk Detail'); setSelectedRiskId((prev) => prev ?? 'vehicle-interaction'); }}>
            Open Risk Detail
          </button>
          <button type="button" className="secondary-button" onClick={() => showToast('Control health opened')}>
            Open Control Health
          </button>
          <button type="button" className="primary-button" onClick={() => showToast('Added to leadership meeting')}>
            Add to leadership meeting
          </button>
          <button type="button" className="secondary-button" onClick={() => showToast('Summary exported')}>
            Export summary
          </button>
        </div>
      </aside>

      {drawer.type !== 'none' && (
        <div className="flyout-backdrop" onClick={() => setDrawer({ type: 'none' })} role="presentation" />
      )}
      <aside className={`detail-drawer ${drawer.type !== 'none' ? 'open' : ''}`}>
        {drawer.type === 'kpi' && drawer.item && (
          <>
            <div className="card-title-row">
              <h3>{drawer.item.title}</h3>
              <button type="button" className="text-button" onClick={() => setDrawer({ type: 'none' })}>Close</button>
            </div>
            <p className="large-stat">{drawer.item.value}</p>
            <p>{drawer.item.detail}</p>
            <ul className="detail-list">
              {drawer.item.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </>
        )}
        {drawer.type === 'risk' && drawer.item && (
          <>
            <div className="card-title-row">
              <h3>{drawer.item.name}</h3>
              <button type="button" className="text-button" onClick={() => setDrawer({ type: 'none' })}>Close</button>
            </div>
            <p className="large-stat">{drawer.item.severity} • {drawer.item.trend}</p>
            <p>{drawer.item.whyFlagged}</p>
            <h4>Evidence signals</h4>
            <ul className="detail-list">
              {drawer.item.evidenceSignals.map((signal) => (
                <li key={signal}>{signal}</li>
              ))}
            </ul>
            <h4>Controls involved</h4>
            <ul className="detail-list">
              {drawer.item.controls.map((control) => (
                <li key={control}>{control}</li>
              ))}
            </ul>
            <div className="drawer-actions">
              <button type="button" className="secondary-button" onClick={() => { setActiveNav('Risk Detail'); setSelectedRiskId(drawer.item?.id); setDrawer({ type: 'none' }); }}>
                Open Risk Detail
              </button>
              <button type="button" className="secondary-button" onClick={() => showToast('Control health opened')}>
                Open Control Health
              </button>
              <button type="button" className="primary-button" onClick={() => showToast('Added to leadership meeting')}>
                Add to leadership meeting
              </button>
              <button type="button" className="secondary-button" onClick={() => showToast('Manager review requested')}>
                Request Manager review
              </button>
            </div>
          </>
        )}
        {drawer.type === 'weakSignal' && drawer.item && (
          <>
            <div className="card-title-row">
              <h3>{drawer.item.title}</h3>
              <button type="button" className="text-button" onClick={() => setDrawer({ type: 'none' })}>Close</button>
            </div>
            <p>{drawer.item.detail}</p>
            <p className="muted">Severity: {drawer.item.severity}</p>
          </>
        )}
        {drawer.type === 'notification' && drawer.item && (
          <>
            <div className="card-title-row">
              <h3>Notification</h3>
              <button type="button" className="text-button" onClick={() => setDrawer({ type: 'none' })}>Close</button>
            </div>
            <p className="large-stat">{drawer.item.title}</p>
            <p>Action: {drawer.item.actionLabel}</p>
          </>
        )}
      </aside>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App
