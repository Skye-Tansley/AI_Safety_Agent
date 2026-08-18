/** Table variants used by the Fatality Prevention and LiF plans. */

/**
 * Superintendent CCVS plan. HSEC-scheduled items are intentionally pinned to
 * the top, ahead of AI-only recommendations for the selected month.
 */
export function FocusTable({ rows }: { rows: string[][] }) {
  const scheduledPlanNames = new Set(['Energy Isolation', 'Working at Heights'])
  const orderedRows = [...rows.filter(row => scheduledPlanNames.has(row[0])), ...rows.filter(row => !scheduledPlanNames.has(row[0]))]
  return <div className="table"><div className="thead focus-head"><span>Priority</span><span>Focus Area</span><span>Trend<br /><small>vs last month</small></span><span>Location / Area</span><span>Why Recommended</span></div>{orderedRows.map((row, index) => {
    const isScheduled = scheduledPlanNames.has(row[0])
    return <div className={`trow focus-row ${isScheduled ? 'focus-row--scheduled' : ''}`} key={row[0]}><b className={`rank r${index}`}>{index + 1}</b><div><strong>{row[0]}</strong>{isScheduled && <span className="scheduled-plan-flag">⚑ HSEC scheduled plan</span>}<small>{row[1]}</small></div><span className="up">↑<small>{22 - index * 3}%<br />Worsening</small></span><span>{row[2]}</span><span>{row[3]}</span></div>
  })}</div>
}

export function CcfvTable() {
  const rows = [['TK', 'T. Kelly', 'Energy Isolation', 'Isolation – Verification of Zero Energy', '18%', 'Workshop / Isolation Bay', 'Repeated isolation concerns and control verification declining.', 'High', '3 CCFVs this month'], ['MW', 'M. Williams', 'Working at Heights', 'Fall Protection Systems', '14%', 'Plant / Concentrator', 'High exposure trend and repeat observations.', 'High', '2–3 CCFVs this month'], ['TK', 'T. Kelly', 'Mobile Equipment', 'Pre-Start & Operation', '12%', 'ROM Pad', 'Control effectiveness declining in mobile equipment operations.', 'Medium', '2 CCFVs this month'], ['LS', 'L. Smith', 'Confined Space', 'Entry – Gas Testing & Permit', '8%', 'Processing Plant / Area 2', 'Historical incidents and competency concerns.', 'Medium', '2 CCFVs this month'], ['MW', 'M. Williams', 'Line of Fire', 'Crushing & Conveying', '16%', 'Crushing Plant', 'Increasing exposure trend observed in interactions.', 'Medium', '1–2 CCFVs this month'], ['LS', 'L. Smith', 'PPE Compliance', 'Gloves & Hand Protection', '11%', 'Plant / Maintenance Areas', 'Repeat PPE issues with hand injuries reported.', 'Low', '1–2 CCFVs this month']]
  return <div className="table"><div className="thead ccfv-head"><span>Priority</span><span>Supervisor</span><span>Focus Area</span><span>Trend<br /><small>vs last month</small></span><span>Location / Area</span><span>Why Recommended</span><span>Suggested Activity Frequency</span></div>{rows.map((row, index) => <div className="trow ccfv-row" key={row[1] + row[2]}><b className={`rank r${index}`}>{index + 1}</b><span className="supervisor"><b className="initial">{row[0]}</b>{row[1]}</span><div><strong>{row[2]}</strong><small>{row[3]}</small></div><span className="up">↑<small>{row[4]}<br />vs last month</small></span><span>{row[5]}</span><span>{row[6]}</span><div><em className={`priority ${row[7].toLowerCase()}`}>{row[7]}</em><small>{row[8]}</small></div></div>)}</div>
}

interface LifTableProps { rows: string[][]; teamFocus: boolean }

export function LifTable({ rows, teamFocus }: LifTableProps) {
  const team = [['TK', 'Tom Kelly', 'Energy Isolation', 'Recent isolation misses identified', 'Increase isolation verification around work areas and anchor points.', 'High'], ['MG', 'Maria Garcia', 'Working at Heights', 'Multiple repeat observations', 'Reinforce 3-point contact and pre-start checks for all work at heights.', 'High'], ['BW', 'Brandon Williams', 'Mobile Equipment', 'Pre-start checks not followed', 'Coach pre-start compliance and spot check critical equipment.', 'Medium'], ['SL', 'Sarah Lee', 'Confined Space', 'Permit quality inconsistent', 'Coach on permit quality and isolation verification.', 'Medium'], ['JT', 'James Taylor', 'Line of Fire', 'Line of fire risks observed', 'Lead LiF conversations on exposure and controls in the field.', 'Low']]
  if (teamFocus) return <div className="table"><div className="thead team-head"><span>Supervisor</span><span>Primary Focus Area</span><span>Why This Matters</span><span>Recommended Action</span><span>Priority</span></div>{team.map(row => <div className="trow team-row" key={row[1]}><span><b className="initial">{row[0]}</b>{row[1]}</span><strong>{row[2]}</strong><span>{row[3]}</span><span>{row[4]}</span><em>{row[5]}</em></div>)}</div>
  const interactionTypes = ['Supervisor Coaching', 'Observe & Coach', 'Team Engagement', 'Targeted Focus', 'Close the Loop']
  return <div className="table"><div className="thead lif-head"><span>Priority</span><span>Interaction</span><span>Purpose / Focus</span><span>Area / Location</span><span>Why Recommended</span></div>{rows.map((row, index) => <div className="trow lif-row" key={row[0]}><b className={`rank r${index}`}>{index + 1}</b><div><strong>{row[0]}</strong><small>{interactionTypes[index]}</small></div><span>{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span></div>)}</div>
}
