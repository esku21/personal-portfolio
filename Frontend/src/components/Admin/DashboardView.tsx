import { 
  Briefcase, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowUpRight, 
  Database, 
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
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-[#0d5543] to-[#08362b] text-white shadow-lg shadow-[#0d5543]/15">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-mono mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            PostgreSQL 18 · Portfolio_db
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {profile?.name?.split(' ')[0] || 'Admin'}
          </h1>
          <p className="text-emerald-100/80 text-xs sm:text-sm mt-1 max-w-xl">
            Manage your digital portfolio content, review incoming client inquiries, and monitor your 10 PostgreSQL database tables in real-time.
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div 
          onClick={() => onNavigate('projects')}
          className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 cursor-pointer hover:border-[#0d5543] dark:hover:border-[#2dd4bf] transition-all group"
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
        </div>

        <div 
          onClick={() => onNavigate('contact-messages')}
          className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 cursor-pointer hover:border-rose-500 transition-all group"
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
        </div>

        <div 
          onClick={() => onNavigate('skills')}
          className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 cursor-pointer hover:border-[#0d5543] dark:hover:border-[#2dd4bf] transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Skills</span>
            <Cpu size={16} className="group-hover:text-[#0d5543] dark:group-hover:text-[#2dd4bf] transition-colors" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats?.skills ?? 8}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Proficiencies
          </div>
        </div>

        <div 
          onClick={() => onNavigate('certifications')}
          className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 cursor-pointer hover:border-[#0d5543] dark:hover:border-[#2dd4bf] transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Certifications</span>
            <Award size={16} className="group-hover:text-[#0d5543] dark:group-hover:text-[#2dd4bf] transition-colors" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats?.certifications ?? 3}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Verified credentials
          </div>
        </div>

        <div 
          onClick={() => onNavigate('experience')}
          className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 cursor-pointer hover:border-[#0d5543] dark:hover:border-[#2dd4bf] transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Experience</span>
            <Building2 size={16} className="group-hover:text-[#0d5543] dark:group-hover:text-[#2dd4bf] transition-colors" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats?.experiences ?? 3}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Career roles
          </div>
        </div>

        <div 
          onClick={() => onNavigate('education')}
          className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 cursor-pointer hover:border-[#0d5543] dark:hover:border-[#2dd4bf] transition-all group"
        >
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-xs font-medium">Education</span>
            <GraduationCap size={16} className="group-hover:text-[#0d5543] dark:group-hover:text-[#2dd4bf] transition-colors" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {stats?.educations ?? 2}
          </div>
          <div className="text-[11px] text-neutral-500 mt-1">
            Degrees
          </div>
        </div>
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
                14-column PostgreSQL "Project" model records
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
              <div
                key={msg.id}
                onClick={() => onNavigate('contact-messages')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
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
              </div>
            ))}

            {recentMessages.length === 0 && (
              <div className="text-center py-8 text-neutral-400 text-xs">
                No contact messages yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Database Schema Status Footnote */}
      <div className="p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-2.5">
          <Database size={16} className="text-[#0d5543] dark:text-[#2dd4bf] shrink-0" />
          <span>
            Connected to <strong>Portfolio_db</strong>: tables synchronized for <strong>Project, Message, Skill, Education, Experience, Certification, Service, Profile</strong>.
          </span>
        </div>
        <button
          onClick={onResetSeed}
          className="self-start sm:self-auto text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white underline"
        >
          Reset Demo Sample Data
        </button>
      </div>
    </div>
  )
}

export default DashboardView