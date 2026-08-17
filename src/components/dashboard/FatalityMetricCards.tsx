/**
 * Fixed-height, scrollable headline cards for Fatality Prevention.
 * Detail scrolling happens inside each card, keeping the plan table in place.
 */

type DetailTone = 'red' | 'green' | 'orange' | 'yellow'

interface DetailItem { label: string; description: string; badge: string; tone: DetailTone }
interface FatalityMetricCard { title: string; value: string; context: string; icon: string; footer: string; items: DetailItem[] }

const cards: FatalityMetricCard[] = [
  { title: 'Controls Requiring Attention', value: '14', context: 'Degrading Controls', icon: '◌', footer: '4 since last month', items: [
      { label: 'Isolation Procedure Compliance', description: 'Control Health 61%', badge: 'L', tone: 'red' }, { label: 'Vehicle Exclusion Zones', description: 'Control Health 64%', badge: 'V', tone: 'red' }, { label: 'Zero-energy Verification', description: 'Control Health 67%', badge: 'E', tone: 'red' }, { label: 'Working at Heights Planning', description: 'Control Health 69%', badge: 'H', tone: 'red' }, { label: 'PPE Selection and Use', description: 'Control Health 70%', badge: 'P', tone: 'red' }, { label: 'Permit to Work Accuracy', description: 'Control Health 72%', badge: 'T', tone: 'red' }, { label: 'Line of Fire Awareness', description: 'Control Health 73%', badge: 'O', tone: 'red' }, { label: 'Lifting Equipment Inspections', description: 'Control Health 74%', badge: 'I', tone: 'red' }, { label: 'Confined Space Gas Testing', description: 'Control Health 75%', badge: 'G', tone: 'red' }, { label: 'Mobile Equipment Pre-starts', description: 'Control Health 76%', badge: 'M', tone: 'red' }, { label: 'Haul-road Segregation Controls', description: 'Control Health 77%', badge: 'R', tone: 'red' }, { label: 'Electrical Isolation Records', description: 'Control Health 78%', badge: 'D', tone: 'red' }, { label: 'Dropped-object Prevention', description: 'Control Health 79%', badge: 'F', tone: 'red' }, { label: 'Emergency Response Readiness', description: 'Control Health 80%', badge: 'R', tone: 'red' },
  ] },
  { title: 'Emerging Risks', value: '3', context: 'Emerging Risks', icon: '◉', footer: '2 New · 1 Escalating', items: [
    { label: 'Mobile Equipment–Pedestrian Interface', description: 'Near-miss reports increasing at shared workshop access points.', badge: 'V', tone: 'green' }, { label: 'Dropped-object Exposure', description: 'Repeat observations of unsecured tools during fixed-plant maintenance.', badge: 'O', tone: 'green' }, { label: 'Heat Stress Exposure', description: 'Rising heat alerts and incomplete hydration checks across day shifts.', badge: 'H', tone: 'red' },
  ] },
  { title: 'AI Focus Areas', value: '3', context: 'High Priority', icon: '♧', footer: '2 High · 1 Medium', items: [
    { label: 'Energy Isolation Verification', description: 'Verify zero-energy testing and physical isolation before maintenance begins.', badge: 'S', tone: 'red' }, { label: 'Vehicle Exclusion Zones', description: 'Coach on pedestrian separation, spotter use and exclusion-zone discipline.', badge: 'V', tone: 'red' }, { label: 'Working at Heights Controls', description: 'Confirm fall-protection planning, anchor points and pre-start checks.', badge: 'H', tone: 'red' },
  ] },
]

export function FatalityMetricCards() {
  return <div className="kpis fatality-kpis">{cards.map(card => <article className="kpi fatality-kpi" key={card.title}>
    <header className="fatality-kpi__header"><h3>{card.title} <i aria-label="More information">ⓘ</i></h3><strong>{card.value}</strong><span className="kpi-icon" aria-hidden="true">{card.icon}</span><p>{card.context}</p></header>
    <div className="fatality-kpi__details" tabIndex={0} aria-label={`${card.title} details`}>{card.items.map(item => <div className={`fatality-kpi__item fatality-kpi__item--${item.tone}`} key={item.label}><i aria-hidden="true">•</i><span className="fatality-kpi__badge" aria-hidden="true">{item.badge}</span><span><b>{item.label}</b><small>{item.description}</small></span><em aria-hidden="true">↓</em></div>)}</div>
    <footer className="fatality-kpi__footer">↑ &nbsp;{card.footer}</footer>
  </article>)}</div>
}
