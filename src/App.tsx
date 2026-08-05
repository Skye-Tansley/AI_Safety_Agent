import { useEffect, useState } from 'react'
import './App.css'

type Page = 'Fatality Prevention' | 'Leadership in the Field' | 'Insight Explorer' | 'Spotlight Recommendations'

type FilterState = { site: string; department: string; team: string; member: string; from: string; to: string }

const siteOptions = ['All Pilbara sites', 'Brockman 4', 'Dampier Salt', 'Gudai-Darri', 'Marandoo', 'Mesa A', 'Nammuldi', 'Paraburdoo', 'Tom Price', 'Western Range', 'Perth Operations Centre']
const departmentsBySite: Record<string, string[]> = {
  'Brockman 4': ['Mining', 'Processing', 'Maintenance', 'Rail', 'HSE'],
  'Dampier Salt': ['Operations', 'Maintenance', 'Marine', 'HSE'],
  'Gudai-Darri': ['Mining', 'Processing', 'Maintenance', 'Projects', 'HSE'],
  Marandoo: ['Mining', 'Processing', 'Maintenance', 'HSE'],
  'Mesa A': ['Mining', 'Processing', 'Maintenance', 'Rail', 'HSE'],
  Nammuldi: ['Mining', 'Processing', 'Maintenance', 'HSE'],
  Paraburdoo: ['Mining', 'Processing', 'Maintenance', 'Rail', 'HSE'],
  'Tom Price': ['Mining', 'Processing', 'Maintenance', 'Rail', 'HSE'],
  'Western Range': ['Mining', 'Processing', 'Maintenance', 'HSE'],
  'Perth Operations Centre': ['Operations Centre', 'Planning & Scheduling', 'Technology', 'HSE', 'People & Culture'],
}
const areasByDepartment: Record<string, string[]> = {
  Mining: ['Load & Haul', 'Drill & Blast', 'Mine Services'], Processing: ['Crushing Plant', 'Concentrator', 'Processing Plant'], Maintenance: ['Fixed Plant Maintenance', 'Mobile Maintenance', 'Electrical & Instrumentation'], Rail: ['Rail Operations', 'Rail Maintenance'], HSE: ['Safety Systems', 'Field Safety', 'Emergency Services'], Operations: ['Harvest Operations', 'Port Operations'], Marine: ['Marine Operations', 'Shipping'], Projects: ['Project Delivery', 'Commissioning'], 'Operations Centre': ['Integrated Operations Centre', 'Remote Operations'], 'Planning & Scheduling': ['Mine Planning', 'Maintenance Planning'], Technology: ['Operational Technology', 'Digital Systems'], 'People & Culture': ['Workplace Relations', 'Learning & Development'],
}
const membersByArea: Record<string, string[]> = {
  'Load & Haul': ['Tom Kelly', 'Maria Garcia', 'Brandon Williams'], 'Drill & Blast': ['James Taylor', 'Aisha Patel'], 'Mine Services': ['Sarah Lee', 'Daniel Moore'], 'Crushing Plant': ['Mia Wilson', 'Liam Smith'], Concentrator: ['Noah Brown', 'Olivia Chen'], 'Processing Plant': ['Ethan Wright', 'Grace Walker'], 'Fixed Plant Maintenance': ['Jack Martin', 'Amelia King'], 'Mobile Maintenance': ['Ben Hall', 'Isla Young'], 'Electrical & Instrumentation': ['Lucas Green', 'Sophie Scott'], 'Rail Operations': ['Harry Davis', 'Emily White'], 'Rail Maintenance': ['Oscar Lewis', 'Ruby Harris'], 'Safety Systems': ['Mason Clark', 'Zoe Turner'], 'Field Safety': ['Tahlia Robinson', 'Cooper Evans'], 'Emergency Services': ['Jordan Allen', 'Chloe Baker'], 'Integrated Operations Centre': ['Ava Thompson', 'William Parker'], 'Remote Operations': ['Ella Mitchell', 'Leo Campbell'], 'Mine Planning': ['Harper Adams', 'Henry Collins'], 'Maintenance Planning': ['Charlotte Stewart', 'Thomas Morris'], 'Operational Technology': ['Nathan Rogers', 'Lucy Reed'], 'Digital Systems': ['Archie Bell', 'Eva Murphy'],
}

const nav: { label: Page; icon: string }[] = [
  { label: 'Fatality Prevention', icon: '♢' },
  { label: 'Leadership in the Field', icon: '♙' },
  { label: 'Insight Explorer', icon: '◉' },
  { label: 'Spotlight Recommendations', icon: '✦' },
]

const focusRows = [
  ['Energy Isolation', 'Isolation – Verification of Zero Energy', 'Workshop / Isolation Bay', 'Repeated isolation concerns and control verification declining.', 'High'],
  ['Working at Heights', 'Fall Protection Systems', 'Plant / Concentrator', 'High exposure trend and repeat observations.', 'High'],
  ['Mobile Equipment', 'Pre-start & Operation', 'ROM Pad', 'Control effectiveness declining in mobile equipment operations.', 'Medium'],
  ['Confined Space', 'Entry – Gas Testing & Permit', 'Processing Plant / Area 2', 'Historical incidents and competency concerns.', 'Medium'],
  ['Line of Fire', 'Crushing & Conveying', 'Crushing Plant', 'Increasing exposure trend observed in interactions.', 'Low'],
]

const lifRows = [
  ['Coaching Conversation', 'Leadership & Development', 'Workshop / Isolation Bay', 'PTHA quality below target and repeat isolation concerns.'],
  ['Triple C Review', 'Critical Control Verification', 'Plant / Concentrator', 'Control verification gaps and inconsistent evidence quality.'],
  ['Workplace Inspection', 'Work Environment & Hazards', 'ROM Pad', 'Housekeeping and equipment condition concerns.'],
  ['Spotlight Conversation', 'Specific Safety Focus Area', 'Crushing Plant', 'Line of Fire observations and exposure trend increasing.'],
  ['Follow-up Conversation', 'Follow-up & Accountability', 'Processing Plant / Area 2', 'Follow-up actions incomplete in recent interactions.'],
]
const baseFocusRows = focusRows.map(row => [...row])
const baseLifRows = lifRows.map(row => [...row])

function createDemoData(filters: FilterState, role: 'superintendent' | 'supervisor') {
  const signature = `${filters.site}|${filters.department}|${filters.team}|${filters.member}|${filters.from}|${filters.to}`
  const seed = [...signature].reduce((total, character) => total + character.charCodeAt(0), 0)
  const scope = role === 'supervisor' ? (filters.member || filters.team || 'Tom Kelly’s team') : (filters.member || filters.team || filters.department || (filters.site === 'All Pilbara sites' ? 'all Pilbara operations' : filters.site))
  const location = role === 'supervisor' ? (filters.team || 'Workshop / Isolation Bay') : (filters.team || (filters.department ? `${filters.department} / ${filters.site === 'All Pilbara sites' ? 'Pilbara' : filters.site}` : filters.site === 'All Pilbara sites' ? 'Across Pilbara operations' : filters.site))
  const rotate = <T,>(items: T[]) => items.map((_, index) => items[(index + seed) % items.length])
  return { scope, location, seed, priorities: rotate(baseFocusRows).map((row, index) => [row[0], row[1], index === 0 ? location : row[2], `${row[3]} Filtered for ${scope}.`, row[4]]), lif: rotate(baseLifRows).map((row, index) => [row[0], row[1], index === 0 ? location : row[2], `${row[3]} Focused on ${scope}.`]), fatal: [['Controls Requiring Attention', String(7 + seed % 12), `${2 + seed % 6} since last month`], ['Emerging Risks', String(1 + seed % 5), `${1 + seed % 3} New • ${seed % 2 + 1} Escalating`], ['AI Focus Areas', String(2 + seed % 3), `${1 + seed % 2} High • ${1 + seed % 2} Medium`]], lifKpis: [['Achieved LiF Interactions', String(46 + seed % 130), `${4 + seed % 18}%`], ['Quality Interactions', `${62 + seed % 27}%`, `${2 + seed % 9}%`], ['Team Members Reached', String(14 + seed % 58), `${3 + seed % 14}%`]] }
}

function App() {
  const [page, setPage] = useState<Page>('Fatality Prevention')
  const [plan, setPlan] = useState<'CCVS Plan' | 'CCFV Plan' | 'LIF Plan' | 'Team Focus'>('CCVS Plan')
  const [role, setRole] = useState<'superintendent' | 'supervisor'>('superintendent')
  const [message, setMessage] = useState('')
  const [filters, setFilters] = useState<FilterState>({ site: 'All Pilbara sites', department: '', team: '', member: '', from: '2026-05-01', to: '2026-05-31' })
  const dashboard = createDemoData(filters, role)
  focusRows.splice(0, focusRows.length, ...dashboard.priorities)
  lifRows.splice(0, lifRows.length, ...dashboard.lif)
  useEffect(() => {
    if (role === 'supervisor' && page === 'Leadership in the Field' && plan !== 'LIF Plan') {
      setPlan('LIF Plan')
      return
    }
    document.body.dataset.role = role
    document.body.dataset.page = page
    const profile = document.querySelector<HTMLElement>('.user')
    const avatar = document.querySelector<HTMLElement>('.avatar')
    if (profile) profile.innerHTML = role === 'supervisor' ? 'Tom Kelly<small>Supervisor</small>' : 'Jane Smith<small>Superintendent</small>'
    if (avatar) avatar.textContent = role === 'supervisor' ? 'TK' : 'JS'
    const supervisorLifValues = ['42', '72%', '24 / 30']
    const superintendentLifValues = ['142', '74%', '56']
    if (page === 'Leadership in the Field') document.querySelectorAll<HTMLElement>('.kpi strong').forEach((item, index) => { item.textContent = (role === 'supervisor' ? supervisorLifValues : superintendentLifValues)[index] })
    if (role === 'supervisor' && page === 'Fatality Prevention') {
      const heading = document.querySelector<HTMLElement>('.plan h2')
      if (heading) heading.textContent = 'Recommended CCFV Activities – My Team'
      const teamActivities = [
        ['Energy Isolation', 'Isolation & Verification of Zero Energy', '22%', 'Workshop / Isolation Bay', 'Isolation checks need more complete verification evidence.', '3 CCFVs this month'],
        ['Working at Heights', 'Fall Protection Systems', '8%', 'Plant / Concentrator', 'Repeat harness and anchor-point observations.', '2 CCFVs this month'],
        ['Mobile Equipment', 'Pre-start & Operation', '12%', 'ROM Pad', 'Pre-start checks need to be completed before equipment movement.', '2 CCFVs this month'],
        ['Confined Space', 'Entry, Gas Testing & Permit', '5%', 'Processing Plant / Area 2', 'Permit quality and gas-test evidence needs coaching.', '1 CCFV this month'],
      ]
      document.querySelectorAll<HTMLElement>('.ccfv-row').forEach((row, index) => {
        const activity = teamActivities[index]
        if (!activity) { row.style.display = 'none'; return }
        row.style.display = 'grid'
        const focus = row.children[2]?.querySelector('strong')
        if (focus) focus.textContent = activity[0]
        const subFocus = row.children[2]?.querySelector('small')
        if (subFocus) subFocus.textContent = activity[1]
        const trend = row.children[3]?.querySelector('small')
        if (trend) trend.textContent = `${activity[2]}\nWorsening`
        if (row.children[4]) row.children[4].textContent = activity[3]
        if (row.children[5]) row.children[5].textContent = activity[4]
        const frequency = row.children[6]?.querySelector('small')
        if (frequency) frequency.textContent = activity[5]
      })
    }
    if (page === 'Insight Explorer') {
      const mainColumn = document.querySelector<HTMLElement>('.spotlight .main-column')
      const aiPanel = document.querySelector<HTMLElement>('.spotlight .ai-panel')
      if (mainColumn) mainColumn.innerHTML = '<section class="draft-card"><span>◌</span><h2>Insight Explorer is in draft</h2><p>This workspace is being designed to help leaders explore safety patterns, drill into evidence and compare trends across their operations.</p><small>Coming soon</small></section>'
      if (aiPanel) aiPanel.innerHTML = '<section class="draft-side"><h2>What will be here</h2><p>Interactive insights, trend exploration and supporting evidence will be added in a future prototype update.</p><div>✦ &nbsp; In design</div></section>'
      return
    }
    if (page === 'Spotlight Recommendations') {
      const tiles = document.querySelector<HTMLElement>('.spotlight .bottom-cards')
      const supervisor = role === 'supervisor'
      const trends = supervisor
        ? [['Energy Isolation', '18', 'up'], ['Working at Heights', '12', 'up'], ['Mobile Equipment', '9', 'down'], ['PTHA Evidence Quality', '7', 'down'], ['Follow-up Completion', '5', 'up'], ['PPE Compliance', '3', 'up']]
        : [['Vehicle Exclusion Zones', '18', 'up'], ['Glove Use Compliance', '13', 'up'], ['PTHA Quality – Evidence', '6', 'down'], ['Follow-up Completion Quality', '4', 'down'], ['Lockout / Tagout', '7', 'up'], ['Housekeeping Standards', '5', 'down'], ['Line of Fire Awareness', '3', 'up'], ['Energy Isolation', '0', 'steady']]
      const score = supervisor ? 78 : 74
      const submitted = supervisor ? 42 : 156
      const highQuality = supervisor ? 33 : 115
      if (tiles) tiles.innerHTML = `<section class="spotlight-visuals"><article class="card spotlight-tile"><h3>${supervisor ? 'My Team Spotlight Trends' : 'Spotlight Theme Trends'} <i>ⓘ</i></h3><div class="trend-list">${trends.map(([label, amount, direction]) => `<p><span>${label}</span><b style="width:${Math.max(14, Number(amount) * 3)}%"></b><em class="${direction}">${direction === 'up' ? '↑' : direction === 'down' ? '↓' : '–'} ${amount}%</em></p>`).join('')}</div><div class="tile-axis">0%　10%　20%　30%　40%</div><small>${supervisor ? 'Change in team observations vs last month' : 'Change in negative evidence / observations vs last month'}</small><button>AI Summary　 ·　 Learn more →</button></article><article class="card spotlight-tile quality-tile"><h3>LiF Spotlight SafeDay Form Insights <i>ⓘ</i></h3><div class="quality-content"><div class="donut" style="--score:${score * 3.6}deg"><b>${score}%</b><small>Quality Score</small></div><div class="quality-stats"><p>▧ <b>${submitted}</b><small>Forms Submitted</small></p><p>◉ <b>${highQuality} (${score}%)</b><small>High Quality</small></p><p>◌ <b>${supervisor ? 7 : 28} (${supervisor ? 17 : 18}%)</b><small>Medium Quality</small></p><p>△ <b>${supervisor ? 2 : 13} (${supervisor ? 5 : 8}%)</b><small>Low Quality</small></p></div></div><small class="quality-note">↑ Quality score improved ${supervisor ? '6%' : '8%'} vs last month</small><button>AI Summary　 ·　 Learn more →</button></article><article class="card spotlight-tile feedback-tile"><h3>AI Performance Feedback <i>ⓘ</i></h3><div class="assessment"><b>Overall Assessment</b><p>${supervisor ? 'Your team is improving engagement. Focus on closing follow-ups and capturing clearer evidence.' : 'The site is trending in the right direction with improving engagement and quality in focus areas.'}</p></div><ul><li>✓　${supervisor ? '2 team focus areas' : '2 spotlights'} show improving trends</li><li>✓　Quality of LiF spotlight forms is above target</li><li>△　${supervisor ? '1 team activity' : '1 spotlight'} requires additional attention</li></ul><button>AI Summary　 ·　 Learn more →</button></article></section>`
    }
    if (page === 'Leadership in the Field') {
      const tiles = document.querySelector<HTMLElement>('.main-column .bottom-cards')
      const supervisor = role === 'supervisor'
      const themes = supervisor ? [['Safety Fundamentals','32','up'],['Risk Awareness','24','up'],['PPE Compliance','16','down'],['Line of Fire','11','up'],['Hazard Reporting','10','up'],['Work Zone Safety','9','down'],['Other','8','steady']] : [['Safety Fundamentals','46','up'],['Critical Control Verification','38','up'],['Quality Conversations','31','up'],['Follow-up & Accountability','26','down'],['Hazard Reporting','22','up'],['Work Zone Safety','18','steady']]
      const activities = supervisor ? [['CCVS Reviews Completed','42'],['PTHAs Completed','36'],['Workplace Inspections','28'],['Spotlight Conversations','18'],['Follow-up Conversations','14']] : [['LiF Interactions Completed','142'],['Quality Interactions','74%'],['Leaders Reached','14'],['Team Members Reached','56'],['Average LiF per Supervisor','18']]
      const risks = supervisor ? [['Electrical', 'Line of Fire controls and PPE compliance', 'High'],['Chemical Exposure', 'Ventilation and exposure controls at work areas', 'Medium'],['PPE Condition', 'Glove use and daily inspection coaching', 'Medium']] : [['Mobile Equipment', 'Vehicle exclusion zone observations increasing', 'High'],['Energy Isolation', 'Control verification evidence below target', 'High'],['Working at Heights', 'Repeat harness and anchor-point findings', 'Medium']]
      if (tiles) tiles.innerHTML = `<section class="lif-visuals"><article class="card lif-tile"><h3>Top LiF Themes <small>(This Month)</small><em>View all →</em></h3><div class="lif-bars">${themes.map(([label, amount, direction]) => `<p><span>${label}</span><b style="width:${Number(amount) * 2.1}%"></b><strong>${amount}%</strong><i class="${direction}">${direction === 'up' ? '↑' : direction === 'down' ? '↓' : '–'}</i></p>`).join('')}</div><div class="lif-axis">0%　　 10%　　 20%　　 30%　　 40%</div></article><article class="card lif-tile activity-tile"><h3>Team Activity Completion <small>(This Month)</small></h3><div class="activity-content"><div>${activities.map(([label, amount]) => `<p><span>◇</span>${label}<b>${amount}</b><i>✓</i></p>`).join('')}</div><div class="completion-ring"><b>${supervisor ? '76%' : '81%'}</b><small>Complete</small></div></div></article><article class="card lif-tile risk-tile"><h3>Emerging Risks <small>ⓘ</small><em>View all →</em></h3><div class="risk-head"><span>Trend</span><span>PEPPO</span><span>Recommended Focus</span></div>${risks.map(([name, focus, priority], index) => `<div class="risk-row"><small class="risk-tag">${index === 1 ? 'Escalating' : 'New'}</small><b>${name}</b><i>↑</i><em>${priority}</em><span>${focus}</span></div>`).join('')}</div></article></section>`
    }
    if (page === 'Fatality Prevention') {
      const tiles = document.querySelector<HTMLElement>('.main-column .bottom-cards')
      const controls = [['Isolation Procedure Followed','Degrading','32%','↑'],['Verification of Isolation','At Risk','10%','↑'],['Isolation Devices Applied','Stable','8%','↓'],['Lock / Tag Compliance','Degrading','25%','↑'],['Residual Energy Check','Stable','5%','↓']]
      const coverage = [['Energy Isolation','80%','20%'],['Working at Heights','62%','38%'],['Mobile Equipment','74%','6%'],['Line of Fire','64%','16%'],['Confined Space','61%','19%'],['Crane Operations','58%','22%'],['Excavation','41%','39%']]
      const alignment = [['Energy Isolation','29%'],['Working at Heights','32%'],['Mobile Equipment','20%'],['Line of Fire','18%'],['Confined Space','10%'],['Crane Operations','6%'],['Excavation','2%']]
      if (tiles) tiles.innerHTML = `<section class="fatality-visuals"><article class="card fatality-tile health-tile"><h3>Control Health Summary <i>ⓘ</i></h3><div class="health-head"><span>Control</span><span>Health</span><span>Failure Rate</span><span>Trend</span></div>${controls.map(([name, health, rate, trend]) => `<div class="health-row"><span>${name}</span><em class="${health.toLowerCase().replace(' ','-')}">${health}</em><b>${rate}</b><i class="${trend === '↑' ? 'bad' : 'good'}">${trend}</i></div>`).join('')}<p class="health-note">Isolation verification and procedure compliance are the top drivers of declining control performance.</p><button>AI Summary　 ·　 Learn more →</button></article><article class="card fatality-tile coverage-tile"><h3>Coverage by Risk Category <i>ⓘ</i></h3><div class="coverage-head"><span>Risk Category</span><span>Coverage</span><span>Gap vs Target</span></div>${coverage.map(([name, covered, gap]) => `<div class="coverage-row"><span>${name}</span><b><i style="width:${covered}"></i></b><strong>${covered}</strong><em>-${gap}</em></div>`).join('')}<p class="health-note">Coverage gaps indicate where additional assurance effort should be prioritised.</p><button>AI Summary　 ·　 Learn more →</button></article><article class="card fatality-tile alignment-tile"><h3>Assurance Effort vs Risk Exposure <i>ⓘ</i></h3><div class="alignment-key"><span>■ Risk Exposure %</span><span>■ Assurance Effort %</span><i>··· Optimal Alignment</i></div>${alignment.map(([name, amount], index) => `<div class="alignment-row"><span>${name}</span><b><i style="width:${amount}"></i><em style="width:${Math.max(8, Number(amount) - (index % 3) * 5)}%"></em></b><strong>${amount}</strong></div>`).join('')}<p class="health-note">AI evaluates alignment between assurance effort and risk exposure to focus resources effectively.</p><button>AI Summary　 ·　 Learn more →</button></article></section>`
    }
    if (page === 'Leadership in the Field' && role === 'superintendent') {
      const tiles = document.querySelector<HTMLElement>('.main-column .bottom-cards')
      if (tiles) tiles.innerHTML = `<section class="superintendent-lif-visuals"><article class="card lif-blank-tile"></article><article class="card superintendent-lif-tile"><h3>Team Activity Snapshot <small>(This Month) ⓘ</small></h3><div class="snapshot-list"><p><span>◇</span>LiF Interactions Completed <b>142</b><i>↑ 18%</i></p><p><span>◉</span>Quality Interactions <b>74%</b><i>↑ 6%</i></p><p><span>♙</span>Leaders Reached <b>14</b><i>↑ 8%</i></p><p><span>▧</span>Team Members Reached <b>56</b><i>↑ 12%</i></p><p><span>⌁</span>Avg. LiF per Supervisor <b>18</b><i>↑ 5%</i></p></div><button>AI Summary　 ·　 Learn more →</button></article><article class="card superintendent-lif-tile"><h3>Top LiF Themes <small>(This Month) ⓘ</small></h3><div class="super-theme-list"><p><span>Safety Fundamentals</span><b style="width:100%"></b><strong>32</strong><i>↑</i></p><p><span>Risk Awareness</span><b style="width:75%"></b><strong>24</strong><i>↑</i></p><p><span>PPE Compliance</span><b style="width:50%"></b><strong>16</strong><i class="down">↓</i></p><p><span>Line of Fire</span><b style="width:35%"></b><strong>11</strong><i>↑</i></p><p><span>Hazard Reporting</span><b style="width:29%"></b><strong>9</strong><i>↑</i></p><p><span>Work Zone Safety</span><b style="width:25%"></b><strong>8</strong><i class="down">↓</i></p><p><span>Other</span><b style="width:19%"></b><strong>6</strong><i>–</i></p></div><button>AI Summary　 ·　 Learn more →</button></article></section>`
    }
    const member = filters.member
    const ccfvRows = Array.from(document.querySelectorAll<HTMLElement>('.ccfv-row'))
    const teamRows = Array.from(document.querySelectorAll<HTMLElement>('.team-row'))
    const spotlightRows = Array.from(document.querySelectorAll<HTMLElement>('.spotlight-row'))
    if (!member) {
      ccfvRows.forEach(row => row.style.display = 'grid')
      teamRows.forEach(row => row.style.display = 'grid')
      return
    }
    const initials = member.split(' ').map(name => name[0]).join('').slice(0, 2).toUpperCase()
    ccfvRows.forEach((row, index) => {
      row.style.display = index === 0 ? 'grid' : 'none'
      if (index === 0) {
        const supervisor = row.querySelector<HTMLElement>('.supervisor')
        if (supervisor) supervisor.innerHTML = `<b class="initial">${initials}</b>${member}`
        const focus = row.querySelector('div:nth-child(3) strong')
        if (focus) focus.textContent = filters.team || 'Selected supervisor focus'
      }
    })
    let matchingTeamMember = false
    teamRows.forEach(row => { const matches = row.textContent?.includes(member) ?? false; matchingTeamMember ||= matches; row.style.display = matches ? 'grid' : 'none' })
    if (!matchingTeamMember && teamRows[0]) {
      teamRows[0].style.display = 'grid'
      const supervisor = teamRows[0].querySelector<HTMLElement>('span')
      if (supervisor) supervisor.innerHTML = `<b class="initial">${initials}</b>${member}`
    }
    spotlightRows.forEach((row, index) => {
      const heading = row.querySelector('strong')
      if (heading && index === 0) heading.textContent = `${member} – priority safety focus`
      const reason = row.children[2] as HTMLElement | undefined
      if (reason) reason.textContent = `Filtered evidence for ${member} in ${filters.team || filters.department || filters.site}.`
    })
  }, [filters.member, filters.team, filters.department, filters.site, page, plan, role])
  const lif = page === 'Leadership in the Field'
  const insightExplorer = page === 'Insight Explorer'
  const spotlight = page === 'Spotlight Recommendations' || insightExplorer
  const title = lif ? 'Leadership in the Field (LiF)' : insightExplorer ? 'Insight Explorer' : spotlight ? 'Spotlight Recommendations' : page
  const subtitle = lif ? 'Strengthen leadership presence and quality field interactions.' : insightExplorer ? 'A future workspace for exploring safety insights and trends.' : spotlight ? 'AI-driven focus areas to improve safety performance and reduce risk.' : 'AI-generated fatality prevention focus areas, control insights and recommended assurance activities.'

  return <div className="app-shell">
    <header className="topbar"><div className="rio">RioTinto</div><div className="product"><span>⬡</span> Safety AI Agent</div><div className="top-actions"><button className="bell">♧<b>3</b></button><button className="ask">⇧ &nbsp; Ask AI</button><span className="avatar">JS</span><span className="user">Jane Smith<small>Superintendent</small></span></div></header>
    <aside className="sidebar">{nav.map(item => <button key={item.label} className={page === item.label ? 'nav active' : 'nav'} onClick={() => setPage(item.label)}><span>{item.icon}</span>{item.label}</button>)}<button className="collapse">≪ &nbsp; Collapse</button></aside>
    <button className="role-switch" onClick={() => { const nextRole = role === 'superintendent' ? 'supervisor' : 'superintendent'; setRole(nextRole); setPlan(nextRole === 'supervisor' ? 'CCFV Plan' : 'CCVS Plan') }} title={role === 'superintendent' ? 'Switch to Supervisor view' : 'Switch to Superintendent view'} aria-label="Switch view">⌄</button>
    <main>
      <section className="page-heading"><div><h1>{title} <i>ⓘ</i></h1><p>{subtitle}</p></div><Filters value={filters} onChange={setFilters}/><button className="outline">⇧ &nbsp; Export Plan</button><button className="primary" onClick={() => setMessage('Plan regenerated with the latest available safety insights.')}>⟳ &nbsp; Regenerate Plan</button></section>
      {spotlight ? <Spotlight onAsk={() => setMessage('Ask AI is ready to help you explore the spotlight recommendations.')} /> : <div className="content-grid"><section className="main-column">
        <div className="kpis">{(lif ? [['Achieved LiF Interactions','142','18%'],['Quality Interactions','74%','6%'],['Team Members Reached','56','12%']] : [['Controls Requiring Attention','14','4 since last month'],['Emerging Risks','3','2 New  •  1 Escalating'],['AI Focus Areas','3','2 High  •  1 Medium']]).map((k,i) => <article className="kpi" key={k[0]}><h3>{k[0]}</h3><strong>{k[1]}</strong><span className="kpi-icon">{['◌','◉','♧'][i]}</span><p>{lif ? 'This Month' : ['Degrading Controls','Emerging Risks','High Priority'][i]}</p><small className="up">↑ &nbsp;{k[2]} {lif ? 'vs last month' : ''}</small>{lif && i < 2 && <div className="spark">⌁⌁⌁⌁⌁⌁⌁</div>}</article>)}</div>
        <section className="card plan"><h2>{lif ? 'LiF Plan – ' + (plan === 'Team Focus' ? 'Team Focus Areas' : 'Recommended Interactions') : 'Recommended Assurance Focus – May 2026'} <i>ⓘ</i></h2><div className="tabs">{(lif ? ['LIF Plan','Team Focus'] : ['CCVS Plan','CCFV Plan']).map(x => <button key={x} className={(plan === x || (x === 'LIF Plan' && plan !== 'Team Focus')) ? 'selected' : ''} onClick={() => setPlan(x as typeof plan)}>{x}</button>)}</div>{lif ? <LifTable rows={plan === 'Team Focus' ? [] : lifRows} teamFocus={plan === 'Team Focus'} /> : plan === 'CCFV Plan' ? <CcfvTable/> : <FocusTable/>}<button className="link-button">{lif ? (plan === 'Team Focus' ? 'View all supervisors  →' : 'View full plan  →') : plan === 'CCFV Plan' ? 'View full CCFV plan  →' : 'View full CCVS plan  →'}</button></section>
        <BottomCards lif={lif}/>
      </section><AiPanel lif={lif} onSend={() => { if (message.trim()) setMessage('AI response: Start with the highest-priority field verification and document follow-up actions within 7 days.'); }}/></div>}
    </main>
    {message && <div className="toast">{message}<button onClick={() => setMessage('')}>×</button></div>}
  </div>
}

function Filters({value,onChange}:{value:FilterState;onChange:(filters:FilterState)=>void}){
  const departments = value.site === 'All Pilbara sites' ? [...new Set(Object.values(departmentsBySite).flat())].sort() : departmentsBySite[value.site] ?? []
  const areas = value.department ? areasByDepartment[value.department] ?? [] : []
  const members = value.team ? membersByArea[value.team] ?? ['Team member examples coming soon'] : []
  const update = (key:keyof FilterState, next:string) => { const reset = key === 'site' ? { department:'', team:'', member:'' } : key === 'department' ? { team:'', member:'' } : key === 'team' ? { member:'' } : {}; onChange({...value,...reset,[key]:next}) }
  return <div className="filters enhanced-filters">
    <label>Site<select value={value.site} onChange={e=>update('site',e.target.value)}>{siteOptions.map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Department<select value={value.department} onChange={e=>update('department',e.target.value)}><option value="">All departments</option>{departments.map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Team / area<select value={value.team} disabled={!value.department} onChange={e=>update('team',e.target.value)}><option value="">{value.department ? 'All teams / areas' : 'Select a department first'}</option>{areas.map(x=><option key={x}>{x}</option>)}</select></label>
    <label>Team member<select value={value.member} disabled={!value.team} onChange={e=>update('member',e.target.value)}><option value="">{value.team ? 'All team members' : 'Select a team / area first'}</option>{members.map(x=><option key={x}>{x}</option>)}</select></label>
    <label className="date-range">Timeframe<span><input aria-label="Start date" type="date" value={value.from} max={value.to} onChange={e=>update('from',e.target.value)}/><b>–</b><input aria-label="End date" type="date" value={value.to} min={value.from} onChange={e=>update('to',e.target.value)}/></span></label>
  </div>
}
function FocusTable(){return <div className="table"><div className="thead focus-head"><span>Priority</span><span>Focus Area</span><span>Trend<br/><small>vs last month</small></span><span>Location / Area</span><span>Why Recommended</span></div>{focusRows.map((r,i)=><div className="trow focus-row" key={r[0]}><b className={'rank r'+i}>{i+1}</b><div><strong>{r[0]}</strong><small>{r[1]}</small></div><span className="up">↑<small>{22-i*3}%<br/>Worsening</small></span><span>{r[2]}</span><span>{r[3]}</span></div>)}</div>}
function CcfvTable(){const rows=[['TK','T. Kelly','Energy Isolation','Isolation – Verification of Zero Energy','18%','Workshop / Isolation Bay','Repeated isolation concerns and control verification declining.','High','3 CCFVs this month'],['MW','M. Williams','Working at Heights','Fall Protection Systems','14%','Plant / Concentrator','High exposure trend and repeat observations.','High','2–3 CCFVs this month'],['TK','T. Kelly','Mobile Equipment','Pre-Start & Operation','12%','ROM Pad','Control effectiveness declining in mobile equipment operations.','Medium','2 CCFVs this month'],['LS','L. Smith','Confined Space','Entry – Gas Testing & Permit','8%','Processing Plant / Area 2','Historical incidents and competency concerns.','Medium','2 CCFVs this month'],['MW','M. Williams','Line of Fire','Crushing & Conveying','16%','Crushing Plant','Increasing exposure trend observed in interactions.','Medium','1–2 CCFVs this month'],['LS','L. Smith','PPE Compliance','Gloves & Hand Protection','11%','Plant / Maintenance Areas','Repeat PPE issues with hand injuries reported.','Low','1–2 CCFVs this month']];return <div className="table"><div className="thead ccfv-head"><span>Priority</span><span>Supervisor</span><span>Focus Area</span><span>Trend<br/><small>vs last month</small></span><span>Location / Area</span><span>Why Recommended</span><span>Suggested Activity Frequency</span></div>{rows.map((r,i)=><div className="trow ccfv-row" key={r[1]+r[2]}><b className={'rank r'+i}>{i+1}</b><span className="supervisor"><b className="initial">{r[0]}</b>{r[1]}</span><div><strong>{r[2]}</strong><small>{r[3]}</small></div><span className="up">↑<small>{r[4]}<br/>vs last month</small></span><span>{r[5]}</span><span>{r[6]}</span><div><em className={'priority '+r[7].toLowerCase()}>{r[7]}</em><small>{r[8]}</small></div></div>)}</div>}
function LifTable({rows,teamFocus}:{rows:string[][];teamFocus:boolean}){ const team=[['TK','Tom Kelly','Energy Isolation','Recent isolation misses identified','Increase isolation verification around work areas and anchor points.','High'],['MG','Maria Garcia','Working at Heights','Multiple repeat observations','Reinforce 3-point contact and pre-start checks for all work at heights.','High'],['BW','Brandon Williams','Mobile Equipment','Pre-start checks not followed','Coach pre-start compliance and spot check critical equipment.','Medium'],['SL','Sarah Lee','Confined Space','Permit quality inconsistent','Coach on permit quality and isolation verification.','Medium'],['JT','James Taylor','Line of Fire','Line of fire risks observed','Lead LiF conversations on exposure and controls in the field.','Low']]; if(teamFocus) return <div className="table"><div className="thead team-head"><span>Supervisor</span><span>Primary Focus Area</span><span>Why This Matters</span><span>Recommended Action</span><span>Priority</span></div>{team.map(r=><div className="trow team-row" key={r[1]}><span><b className="initial">{r[0]}</b>{r[1]}</span><strong>{r[2]}</strong><span>{r[3]}</span><span>{r[4]}</span><em>{r[5]}</em></div>)}</div>; return <div className="table"><div className="thead lif-head"><span>Priority</span><span>Interaction</span><span>Purpose / Focus</span><span>Area / Location</span><span>Why Recommended</span></div>{rows.map((r,i)=><div className="trow lif-row" key={r[0]}><b className={'rank r'+i}>{i+1}</b><div><strong>{r[0]}</strong><small>{['Supervisor Coaching','Observe & Coach','Team Engagement','Targeted Focus','Close the Loop'][i]}</small></div><span>{r[1]}</span><span>{r[2]}</span><span>{r[3]}</span></div>)}</div>}
function BottomCards({lif}:{lif:boolean}){return <div className="bottom-cards"><BlankCard title={lif?'Team Activity Snapshot':'Control Health Summary'} /><BlankCard title={lif?'Top LiF Themes':'Coverage by Risk Category'} /><BlankCard title="Assurance Effort vs Risk Exposure" /></div>}
function BlankCard({title}:{title:string}){return <article className="card mini"><h3>{title} <i>ⓘ</i></h3><div className="chart-lines">{['Energy Isolation','Working at Heights','Mobile Equipment','Line of Fire','Confined Space'].map((x,i)=><p key={x}>{x}<b style={{width:`${80-i*11}%`}}></b><span>{80-i*8}%</span></p>)}</div><button>AI Summary &nbsp; · &nbsp; Learn more →</button></article>}
function AiPanel({lif,onSend}:{lif:boolean;onSend:()=>void}){return <aside className="card ai-panel"><h2>✦ &nbsp; AI Focus & Recommendations <i>☆</i></h2><Info title="AI Summary" text={lif?'Field leadership engagement is strong, with more people reached and quality interactions improving. Focus on closing follow-ups consistently and lifting quality in a few key areas.':'AI analysis has identified the areas below as the highest opportunities for leadership focus this month.'}/><Info title="Evidence & Insights" text={'• Rising observations, repeat findings, and lower quality scores contribute to higher risk and reduced control confidence.\n• Multiple near-miss reports linked to mobile equipment interactions.'}/><Info title="Leadership Coaching Guidance" text={'• Start conversations with a clear purpose\n• Ask open questions and listen actively\n• Verify controls together in the field\n• Close the loop and recognise progress'}/><div className="focus-callout"><b>◎ &nbsp; Recommended Leadership Focus</b><p>Verify critical controls in the field and coach teams on gaps. Improve evidence-based verification and follow-up quality.</p></div><div className="ask-box"><b>Ask AI about {lif?'LiF insights':'these insights'}</b><input placeholder="Ask a question..."/><button onClick={onSend}>How do I improve?</button><button onClick={onSend}>Which area needs my focus most?</button></div></aside>}
function Info({title,text}:{title:string;text:string}){return <section className="info"><h3>◈ &nbsp; {title}</h3>{text.split('\n').map(x=><p key={x}>{x}</p>)}</section>}
function Spotlight({onAsk}:{onAsk:()=>void}){return <div className="content-grid spotlight"><section className="main-column"><section className="card plan"><h2>Active Site-wide Spotlights</h2><div className="table"><div className="thead spotlight-head"><span>Priority</span><span>Spotlight Focus</span><span>Why This Is a Priority</span><span>Key Evidence</span></div>{[['Vehicle Exclusion Zones','Line of Fire','Increased observations of people entering vehicle exclusion zones during light vehicle interactions.'],['Glove Use Compliance','PPE','Incorrect glove selection leading to hand injuries and increased medical treatments.'],['PTHA Quality – Evidence Capture','Risk Management','High number of generic PTHA responses with limited evidence or control references.'],['Follow-up Completion Quality','Leadership & Follow-up','Follow-up actions remain open beyond 7 days with inconsistent closure.']].map((x,i)=><div className="trow spotlight-row" key={x[0]}><b className={'rank r'+i}>{i+1}</b><div><strong>{x[0]}</strong><small>{x[1]}</small></div><span>{x[2]}</span><span>• {14-i*2} observations this month<br/>• {3+i} near misses reported<br/>• Trend increasing</span></div>)}</div><button className="link-button">View all spotlight history →</button></section><BottomCards lif={false}/></section><AiPanel lif={false} onSend={onAsk}/></div>}
export default App
