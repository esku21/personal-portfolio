import { 
  Briefcase, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowUpRight, 
  Award, 
  GraduationCap, 
  Building2, 
  RefreshCw,
  Cpu
} from 'lucide-react'
import type { Stats, Project, ContactMessage, Profile } from '../../types'
import type { AdminTab } from './AdminSidebar'

export interface DashboardViewProps {
  stats?: Stats
  projects: Project[]
  messages: ContactMessage[]
  profile?: Profile
  onNavigate: (tab: AdminTab) => void
  onTogglePublish: (project: Project) => void
  onRefresh: () => void
  onResetSeed: () => void
}

export function DashboardView({
  stats,
  projects,
  messages,
  profile,
  onNavigate,
  onTogglePublish,
  onRefresh,
  onResetSeed
}: DashboardViewProps) {
  const publishedCount = projects.filter(p => p.isPublished !== false).length
  const unreadMessages = messages.filter(m => m.status === 'unread')
  const recentMessages = messages.slice(0, 4)
  const recentProjects = projects.slice(0, 4)

  return (
    <div className="admin-workspace-page space-y-6 animate-in fade-in duration-300 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="admin-dashboard-hero flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-[#0d5543] to-[#08362b] text-white shadow-lg shadow-[#0d5543]/15">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {profile?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm mt-1 max-w-xl">
            Manage your portfolio, review incoming inquiries, and keep your work up to date.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onRefresh}
            className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-xs font-medium text-white transition-colors flex items-center gap-1.5 backdrop-blur-sm"
          >
            <RefreshCw size={13} /> Refresh
          </button>
          <button
            onClick={() => onNavigate('projects')}
            className="px-3.5 py-2 rounded-xl bg-white text-[#0d5543] hover:bg-emerald-50 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={14} /> New Project
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-6">
        <button type="button"
          onClick={() => onNavigate('projects')}
          className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left hover:border-[#0d5543] dark:hover:border-[#2dd4bf] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Projects</span>
            <Briefcase size={16} className="group-hover:text-[#0d5543] dark:group-hover:text-[#2dd4bf] transition-colors" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats?.projects ?? projects.length}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 size={11} /> {publishedCount} published
          </div>
        </button>

        <button type="button"
          onClick={() => onNavigate('contact-messages')}
          className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left hover:border-rose-500 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Messages</span>
            <Mail size={16} className="group-hover:text-rose-500 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {messages.length}
          </div>
          <div className="text-[11px] text-rose-500 mt-1 flex items-center gap-1 font-medium">
            <AlertCircle size={11} /> {unreadMessages.length} unread
          </div>
        </button>

        <button type="button"
          onClick={() => onNavigate('skills')}
          className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left hover:border-[#0d5543] dark:hover:border-[#2dd4bf] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Skills</span>
            <Cpu size={16} className="group-hover:text-[#0d5543] dark:group-hover:text-[#2dd4bf] transition-colors" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats?.skills ?? 0}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Proficiencies
          </div>
        </button>

        <button type="button"
          onClick={() => onNavigate('certifications')}
          className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left hover:border-[#0d5543] dark:hover:border-[#2dd4bf] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Certifications</span>
            <Award size={16} className="group-hover:text-[#0d5543] dark:group-hover:text-[#2dd4bf] transition-colors" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats?.certifications ?? 0}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Verified credentials
          </div>
        </button>

        <button type="button"
          onClick={() => onNavigate('experience')}
          className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left hover:border-[#0d5543] dark:hover:border-[#2dd4bf] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Experience</span>
            <Building2 size={16} className="group-hover:text-[#0d5543] dark:group-hover:text-[#2dd4bf] transition-colors" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats?.experiences ?? 0}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Career roles
          </div>
        </button>

        <button type="button"
          onClick={() => onNavigate('education')}
          className="w-full p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-left hover:border-[#0d5543] dark:hover:border-[#2dd4bf] hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Education</span>
            <GraduationCap size={16} className="group-hover:text-[#0d5543] dark:group-hover:text-[#2dd4bf] transition-colors" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats?.educations ?? 0}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Degrees
          </div>
        </button>
      </div>

      {/* Two Column Grid: Projects Preview & Recent Inbound Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Projects Table Preview */}
        <div className="lg:col-span-7 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Projects Overview
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Your latest portfolio work
              </p>
            </div>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-medium text-[#0d5543] dark:text-[#2dd4bf] hover:underline flex items-center gap-1"
            >
              View all ({projects.length}) <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div 
                key={project.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/80 gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                      {project.title}
                    </span>
                    {project.acronym && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shrink-0">
                        {project.acronym}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                    {project.category || 'Engineering'} · {project.techStack?.slice(0, 3).join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onTogglePublish(project)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                      project.isPublished !== false
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {project.isPublished !== false ? 'Published' : 'Draft'}
                  </button>
                </div>
              </div>
            ))}

            {recentProjects.length === 0 && (
              <div className="text-center py-8 text-neutral-400 text-xs">
                No projects found in database. Click 'New Project' to add one.
              </div>
            )}
          </div>
        </div>

        {/* Inbound Contact Messages */}
        <div className="lg:col-span-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span>Recent Inquiries</span>
                {unreadMessages.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                    {unreadMessages.length} new
                  </span>
                )}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                From public portfolio contact form
              </p>
            </div>
            <button
              onClick={() => onNavigate('contact-messages')}
              className="text-xs font-medium text-[#0d5543] dark:text-[#2dd4bf] hover:underline flex items-center gap-1"
            >
              View Inbox <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {recentMessages.map((msg) => (
              <button
                type="button"
                key={msg.id}
                onClick={() => onNavigate('contact-messages')}
                className={`w-full p-3.5 rounded-xl border text-left transition-all hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/40 ${
                  msg.status === 'unread'
                    ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20'
                    : 'border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {msg.name}
                  </span>
                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                    msg.status === 'unread'
                      ? 'bg-rose-500 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}>
                    {msg.status}
                  </span>
                </div>
                <div className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                  {msg.subject}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                  {msg.message}
                </p>
              </button>
            ))}

            {recentMessages.length === 0 && (
              <div className="text-center py-8 text-neutral-400 text-xs">
                No contact messages yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-3 rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 dark:border-rose-900/50 dark:bg-rose-950/20 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">Development tools</h2>
          <p className="mt-1 max-w-2xl text-[11px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Restore the portfolio to its initial sample content. This replaces the current records.
          </p>
        </div>
        <button
          onClick={onResetSeed}
          className="inline-flex min-h-10 items-center justify-center self-start rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 dark:border-rose-900 dark:bg-neutral-900 dark:text-rose-300 dark:hover:bg-rose-950/50 sm:self-auto"
        >
          Restore sample data
        </button>
      </section>
    </div>
  )
}

export default DashboardView