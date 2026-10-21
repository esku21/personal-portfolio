import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  Award,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  FileSpreadsheet,
  FolderKanban,
  GraduationCap,
  Layers3,
  Mail,
  Printer,
  RefreshCw,
  ShieldCheck,
  Wrench,
} from 'lucide-react'
import { portfolioApi } from '../../services/api'
import type { PortfolioReport } from '../../types'

type PeriodChoice = '7d' | '30d' | '90d' | 'year' | 'all' | 'custom'

function localDateString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function dateFromString(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function offsetDate(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function getPeriodParams(choice: PeriodChoice, customFrom: string, customTo: string) {
  const today = new Date()
  const todayString = localDateString(today)
  let from: string | undefined
  let to: string | undefined
  let previousFromOverride: string | undefined
  let previousToOverride: string | undefined

  if (choice === '7d' || choice === '30d' || choice === '90d') {
    const days = Number(choice.slice(0, -1))
    from = localDateString(offsetDate(today, 1 - days))
    to = todayString
  } else if (choice === 'year') {
    from = `${today.getFullYear()}-01-01`
    to = todayString
    previousFromOverride = `${today.getFullYear() - 1}-01-01`
    const previousYearEnd = new Date(today)
    previousYearEnd.setFullYear(today.getFullYear() - 1)
    previousToOverride = localDateString(previousYearEnd)
  } else if (choice === 'custom' && customFrom && customTo) {
    from = customFrom
    to = customTo
  }

  const params = new URLSearchParams()
  if (choice === 'custom' && (!customFrom || !customTo)) {
    return { params, label: 'Custom range', error: 'Choose both a start and end date.' }
  }
  if (!from || !to) return { params, label: 'All available data', error: '' }
  if (from > to) return { params, label: `${from} to ${to}`, error: 'Start date must be before or equal to end date.' }

  params.set('from', from)
  params.set('to', to)
  const rangeDays = Math.floor((dateFromString(to).getTime() - dateFromString(from).getTime()) / 86_400_000) + 1
  const previousTo = previousToOverride ?? localDateString(offsetDate(dateFromString(from), -1))
  const previousFrom = previousFromOverride ?? localDateString(offsetDate(dateFromString(from), -rangeDays))
  params.set('previousFrom', previousFrom)
  params.set('previousTo', previousTo)

  const label = choice === 'custom' ? `${from} to ${to}` : choice === 'year' ? `Year to date (${today.getFullYear()})` : `Last ${choice.slice(0, -1)} days`
  return { params, label, error: '', ready: true }
}

function formatChange(current: number, previous: number | null) {
  if (previous === null) return 'No comparison'
  const change = current - previous
  if (previous === 0) return `${change > 0 ? '+' : ''}${change} · % N/A`
  const percentage = (change / previous) * 100
  return `${change > 0 ? '+' : ''}${change} · ${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`
}

function downloadCsv(report: PortfolioReport, periodLabel: string) {
  const rows: string[][] = [
    ['Portfolio report', periodLabel],
    ['Generated at', report.generatedAt],
    [],
    ['Metric', 'Value'],
    ...Object.entries(report.totals).map(([key, value]) => [key, String(value)]),
    [],
    ['Skill category', 'Count'],
    ...report.distributions.skillCategories.map(({ name, count }) => [name, String(count)]),
    [],
    ['Service type', 'Count'],
    ...report.distributions.serviceTypes.map(({ name, count }) => [name, String(count)]),
    [],
    ['Experience organization', 'Count'],
    ...report.distributions.experienceOrganizations.map(({ name, count }) => [name, String(count)]),
    [],
    ['Education qualification', 'Count'],
    ...report.distributions.educationQualifications.map(({ name, count }) => [name, String(count)]),
    [],
    ['Project status', 'Count'],
    ['Published', String(report.totals.publishedProjects)],
    ['Draft', String(report.totals.draftProjects)],
    [],
    ['Activity period', 'Projects created', 'Messages received'],
    ...report.activity.events.map(({ label, projects, messages }) => [label, String(projects), String(messages)]),
    [],
    ['Recent project', 'Status', 'Featured', 'Created at'],
    ...report.recentProjects.map((project) => [project.title, project.isPublished ? 'Published' : 'Draft', project.isFeatured ? 'Yes' : 'No', project.createdAt]),
    [],
    ['Data note', 'Historical creation timestamps are unavailable for some record types.'],
    ['Data note', 'Project completion status is not stored; no completion rate is calculated.'],
  ]
  const csv = rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'portfolio-report.csv'
  link.click()
  URL.revokeObjectURL(url)
}

function ActivityLineChart({ report }: { report: PortfolioReport }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const events = report.activity.events
  if (events.length === 0) {
    return <p className="py-16 text-center text-sm text-neutral-500">No project or message creation activity in this period.</p>
  }

  const width = 760
  const height = 250
  const padding = { top: 20, right: 20, bottom: 38, left: 34 }
  const maxValue = Math.max(1, ...events.flatMap((event) => [event.projects, event.messages]))
  const x = (index: number) => padding.left + index * (width - padding.left - padding.right) / Math.max(1, events.length - 1)
  const y = (value: number) => height - padding.bottom - value * (height - padding.top - padding.bottom) / maxValue
  const projectPoints = events.map((event, index) => `${x(index)},${y(event.projects)}`).join(' ')
  const messagePoints = events.map((event, index) => `${x(index)},${y(event.messages)}`).join(' ')
  const labelIndexes = Array.from(new Set([0, Math.floor((events.length - 1) / 2), events.length - 1]))
  const activeEvent = activeIndex === null ? null : events[activeIndex]
  const tooltipX = activeIndex === null ? 0 : Math.max(padding.left, Math.min(x(activeIndex) - 100, width - padding.right - 200))
  const tooltipY = activeIndex === null ? 0 : Math.max(padding.top, Math.min(y(activeEvent!.projects), y(activeEvent!.messages)) - 84)

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label="Projects created and contact messages received over time. Focus or hover a chart point for its daily totals." className="min-w-[600px] w-full">
        {[0, 0.5, 1].map((fraction) => {
          const gridY = padding.top + fraction * (height - padding.top - padding.bottom)
          return <g key={fraction}><line x1={padding.left} x2={width - padding.right} y1={gridY} y2={gridY} stroke="currentColor" className="text-neutral-200 dark:text-neutral-800" strokeDasharray="4 5" /><text x={padding.left - 8} y={gridY + 4} textAnchor="end" className="fill-neutral-400 text-[10px]">{Math.round(maxValue * (1 - fraction))}</text></g>
        })}
        {events.length > 1 && <polyline points={projectPoints} fill="none" stroke="#0d8062" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
        {events.length > 1 && <polyline points={messagePoints} fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />}
        {events.map((event, index) => (
          <g
            key={event.label}
            role="button"
            tabIndex={0}
            aria-label={`${event.label}: ${event.projects} projects created, ${event.messages} messages received`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(null)}
            className="cursor-pointer outline-none"
          >
            <circle cx={x(index)} cy={y(event.projects)} r={activeIndex === index ? 6 : 4} fill="#0d8062" />
            <circle cx={x(index)} cy={y(event.messages)} r={activeIndex === index ? 6 : 4} fill="#f59e0b" />
            <circle cx={x(index)} cy={y(event.projects)} r="12" fill="transparent" />
            <circle cx={x(index)} cy={y(event.messages)} r="12" fill="transparent" />
            <title>{`${event.label}: ${event.projects} projects created, ${event.messages} messages received`}</title>
          </g>
        ))}
        {labelIndexes.map((index) => <text key={events[index]?.label} x={x(index)} y={height - 12} textAnchor={index === 0 ? 'start' : index === events.length - 1 ? 'end' : 'middle'} className="fill-neutral-500 text-[10px]">{events[index]?.label}</text>)}
        {activeEvent && (
          <g role="tooltip" pointerEvents="none">
            <rect x={tooltipX} y={tooltipY} width="200" height="76" rx="10" fill="#111827" fillOpacity="0.96" />
            <text x={tooltipX + 12} y={tooltipY + 19} fill="white" fontSize="11" fontWeight="600">{activeEvent.label}</text>
            <circle cx={tooltipX + 15} cy={tooltipY + 37} r="3" fill="#34d399" />
            <text x={tooltipX + 25} y={tooltipY + 41} fill="#e5e7eb" fontSize="10">{`Projects created: ${activeEvent.projects}`}</text>
            <circle cx={tooltipX + 15} cy={tooltipY + 57} r="3" fill="#fbbf24" />
            <text x={tooltipX + 25} y={tooltipY + 61} fill="#e5e7eb" fontSize="10">{`Messages received: ${activeEvent.messages}`}</text>
          </g>
        )}
      </svg>
    </div>
  )
}

function Distribution({ title, icon: Icon, items }: { title: string; icon: typeof Layers3; items: Array<{ name: string; count: number }> }) {
  const max = Math.max(1, ...items.map((item) => item.count))
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100"><Icon size={16} className="text-[#0d8062]" />{title}</h3>
      {items.length === 0 ? <p className="py-8 text-center text-xs text-neutral-500">No records yet.</p> : (
        <div className="mt-5 space-y-4">
          {items.map((item) => (
            <div key={item.name}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="truncate text-neutral-600 dark:text-neutral-300">{item.name || 'Uncategorized'}</span>
                <span className="font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                <div className="h-full rounded-full bg-gradient-to-r from-[#0d5543] to-emerald-400" style={{ width: `${Math.max(4, (item.count / max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export function ReportsAdmin() {
  const [periodChoice, setPeriodChoice] = useState<PeriodChoice>('30d')
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')
  const [result, setResult] = useState<{ key: string; report: PortfolioReport | null; error: string } | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const period = useMemo(() => getPeriodParams(periodChoice, customFrom, customTo), [periodChoice, customFrom, customTo])
  const reportParams = period.params
  const periodParamsKey = reportParams.toString()
  const resultKey = `${periodParamsKey}:${refreshKey}`
  const report = result?.key === resultKey ? result.report : null
  const error = result?.key === resultKey ? result.error : ''
  const loading = !period.error && result?.key !== resultKey

  useEffect(() => {
    if (period.error) return
    let active = true
    portfolioApi.reports(reportParams)
      .then(({ data }) => {
        if (active) setResult({ key: resultKey, report: data, error: '' })
      })
      .catch((requestError: unknown) => {
        if (active) setResult({
          key: resultKey,
          report: null,
          error: requestError instanceof Error ? requestError.message : 'Could not load portfolio analytics.',
        })
      })
    return () => { active = false }
  }, [reportParams, periodParamsKey, period.error, refreshKey, resultKey])

  const metrics = report ? [
    { label: 'Projects', value: report.totals.projects, detail: `${report.totals.publishedProjects} published · ${report.totals.draftProjects} drafts`, icon: FolderKanban, color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300' },
    { label: 'Skills', value: report.totals.skills, detail: `${report.distributions.skillCategories.length} categories`, icon: Wrench, color: 'text-sky-700 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300' },
    { label: 'Experience', value: report.totals.experience, detail: 'Recorded roles', icon: BriefcaseBusiness, color: 'text-violet-700 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300' },
    { label: 'Education', value: report.totals.education, detail: 'Qualifications', icon: GraduationCap, color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300' },
    { label: 'Services', value: report.totals.services, detail: `${report.distributions.serviceTypes.length} service types`, icon: Layers3, color: 'text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-300' },
    { label: 'Certifications', value: report.totals.certifications, detail: 'Recorded credentials', icon: Award, color: 'text-orange-700 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-300' },
    { label: 'Messages', value: report.totals.messages, detail: `${report.totals.unreadMessages} unread`, icon: Mail, color: 'text-cyan-700 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-300' },
    { label: 'Featured projects', value: report.totals.featuredProjects, detail: `${report.totals.admins + report.totals.profiles} admin/profile records`, icon: ShieldCheck, color: 'text-fuchsia-700 bg-fuchsia-50 dark:bg-fuchsia-950/40 dark:text-fuchsia-300' },
  ] : []

  return (
    <div className="admin-workspace-page space-y-6">
      <header className="admin-page-header flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#0d8062]"><ChartNoAxesCombined size={15} /> Portfolio intelligence</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Reports &amp; Analytics</h1>
          <p className="mt-1 text-xs text-neutral-500">A clear view of your portfolio content and activity.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 reports-no-print">
          <select value={periodChoice} onChange={(event) => setPeriodChoice(event.target.value as PeriodChoice)} aria-label="Reporting period" className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="year">This year</option>
            <option value="all">All available data</option>
            <option value="custom">Custom range</option>
          </select>
          <button type="button" onClick={() => setRefreshKey((key) => key + 1)} aria-label="Refresh reports" className="rounded-xl border border-neutral-200 p-2 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
          <button type="button" disabled={!report} onClick={() => report && downloadCsv(report, period.label)} className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"><FileSpreadsheet size={15} />CSV</button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#0d5543] px-3 py-2 text-xs font-semibold text-white hover:bg-[#093c30]"><Printer size={15} />Print / PDF</button>
        </div>
      </header>

      {periodChoice === 'custom' && (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900 reports-no-print">
          <label className="grid gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-300">From<input type="date" value={customFrom} max={customTo || undefined} onChange={(event) => setCustomFrom(event.target.value)} className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800" /></label>
          <label className="grid gap-1 text-xs font-medium text-neutral-600 dark:text-neutral-300">To<input type="date" value={customTo} min={customFrom || undefined} onChange={(event) => setCustomTo(event.target.value)} className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-700 dark:bg-neutral-800" /></label>
          {period.error && <p role="alert" className="text-xs text-rose-600">{period.error}</p>}
        </div>
      )}

      {error && <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>}

      {period.error ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">{period.error}</div>
      ) : loading && !report ? (
        <div className="grid animate-pulse grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-28 rounded-2xl bg-neutral-200 dark:bg-neutral-800" />)}</div>
      ) : report ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
            <span>Selected period: <strong className="font-semibold text-neutral-700 dark:text-neutral-300">{period.label}</strong></span>
            <span>Generated {new Date(report.generatedAt).toLocaleString()}</span>
          </div>

          <section aria-label="Portfolio summary" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {metrics.map(({ label, value, detail, icon: Icon, color }) => (
              <article key={label} className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-5">
                <div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-neutral-500">{label}</span><span className={`rounded-lg p-2 ${color}`}><Icon size={16} /></span></div>
                <p className="mt-3 text-2xl font-bold tabular-nums text-neutral-900 dark:text-neutral-100">{value}</p>
                <p className="mt-1 truncate text-[11px] text-neutral-500">{detail}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Portfolio activity over time</h2><p className="mt-1 text-xs text-neutral-500">New projects and received messages · {report.activity.bucket === 'day' ? 'daily' : 'monthly'} buckets</p></div>
                <div className="flex gap-3 text-[11px]"><span className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300"><i className="h-2 w-2 rounded-full bg-emerald-700" />Projects</span><span className="inline-flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300"><i className="h-2 w-2 rounded-full bg-amber-500" />Messages</span></div>
              </div>
              <div className="mt-3"><ActivityLineChart report={report} /></div>
            </article>
            <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Period comparison</h2>
              <p className="mt-1 text-xs text-neutral-500">Compared with the immediately preceding equivalent period.</p>
              <div className="mt-5 space-y-4">
                {[
                  ['Projects created', report.period.projectsCreated],
                  ['Messages received', report.period.messagesReceived],
                ].map(([label, item]) => {
                  const metric = item as { current: number; previous: number | null }
                  return <div key={label as string} className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800/60"><div className="flex items-center justify-between gap-2"><span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">{label as string}</span><Activity size={14} className="text-[#0d8062]" /></div><p className="mt-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">{metric.current}</p><p className="mt-1 text-[11px] text-neutral-500">{formatChange(metric.current, metric.previous)}{metric.previous !== null && <span> (previous: {metric.previous})</span>}</p></div>
                })}
                <p className="text-[11px] leading-relaxed text-neutral-500">A percentage is not calculated when the previous period has zero records. All-time data has no preceding comparison.</p>
              </div>
            </article>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <Distribution title="Skills by category" icon={Wrench} items={report.distributions.skillCategories} />
            <Distribution title="Services by recorded type" icon={Layers3} items={report.distributions.serviceTypes} />
            <Distribution title="Experience by organization" icon={BriefcaseBusiness} items={report.distributions.experienceOrganizations} />
            <Distribution title="Education qualifications" icon={GraduationCap} items={report.distributions.educationQualifications} />
            <Distribution title="Project publication status" icon={FolderKanban} items={[
              { name: 'Published', count: report.totals.publishedProjects },
              { name: 'Draft', count: report.totals.draftProjects },
            ].filter(({ count }) => count > 0)} />
          </section>

          <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex flex-wrap items-center justify-between gap-2"><div><h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Project status &amp; records</h2><p className="mt-1 text-xs text-neutral-500">Current database status; project categories and completion state are not stored.</p></div><span className="rounded-lg bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">Showing latest {report.recentProjects.length} / {report.totals.projects}</span></div>
            {report.recentProjects.length === 0 ? <p className="py-10 text-center text-sm text-neutral-500">No projects are recorded yet.</p> : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-xs">
                  <thead><tr className="border-b border-neutral-200 text-neutral-500 dark:border-neutral-800"><th className="px-3 py-3 font-medium">Project</th><th className="px-3 py-3 font-medium">Status</th><th className="px-3 py-3 font-medium">Featured</th><th className="px-3 py-3 font-medium">Created</th></tr></thead>
                  <tbody>{report.recentProjects.map((project) => <tr key={project.id} className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/70"><td className="px-3 py-3 font-medium text-neutral-800 dark:text-neutral-200">{project.title}</td><td className="px-3 py-3"><span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${project.isPublished ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'}`}>{project.isPublished ? 'Published' : 'Draft'}</span></td><td className="px-3 py-3 text-neutral-600 dark:text-neutral-300">{project.isFeatured ? 'Yes' : 'No'}</td><td className="px-3 py-3 text-neutral-500">{new Date(project.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
                </table>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/50 dark:bg-amber-950/20">
            <h2 className="text-xs font-semibold text-amber-900 dark:text-amber-200">Data coverage &amp; limitations</h2>
            <ul className="mt-2 space-y-1 text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-100/80">
              <li>Creation timestamps are available for projects and contact messages. Other record types have no historical creation timestamps, so their past growth cannot be inferred ({report.dataQuality.recordsWithoutCreationTimestamps} current records across {report.dataQuality.recordTypesWithoutCreationTimestamps.join(', ')}).</li>
              <li>Projects store published/draft and featured flags, but no completion status; no completion rate is reported.</li>
              <li>Experience dates are free-form strings; duration totals are omitted because dates cannot be reliably parsed for every record.</li>
              <li>Project records in the table are capped at the newest 100; summary counts and charts use database aggregates across all records.</li>
            </ul>
          </section>
        </div>
      ) : null}
    </div>
  )
}
