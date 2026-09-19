import { 
  LayoutDashboard, 
  FolderGit2, 
  Award, 
  Mail, 
  GraduationCap, 
  Building2, 
  Layers3, 
  Cpu, 
  UserCog, 
  LogOut, 
  X,
  ExternalLink,
  Database
} from 'lucide-react'
import { Link } from 'react-router-dom'

export type AdminTab = 
  | 'dashboard'
  | 'projects'
  | 'certifications'
  | 'contact-messages'
  | 'education'
  | 'experience'
  | 'services'
  | 'skills'
  | 'profile'

interface AdminSidebarProps {
  activeTab: AdminTab
  onSelectTab: (tab: AdminTab) => void
  unreadCount?: number
  projectsCount?: number
  mobileOpen: boolean
  onCloseMobile: () => void
  onLogout: () => void
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  unreadCount = 0,
  projectsCount = 0,
  mobileOpen,
  onCloseMobile,
  onLogout
}: AdminSidebarProps) {
  const navItems: {
    id: AdminTab
    label: string
    icon: typeof LayoutDashboard
    badge?: number | string
    badgeColor?: string
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderGit2, badge: projectsCount || undefined },
    { id: 'certifications', label: 'Certification', icon: Award },
    { 
      id: 'contact-messages', 
      label: 'ContactMessage', 
      icon: Mail, 
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeColor: 'bg-rose-500 text-white' 
    },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Building2 },
    { id: 'services', label: 'Services', icon: Layers3 },
    { id: 'skills', label: 'Skills', icon: Cpu },
    { id: 'profile', label: 'Profile Settings', icon: UserCog }
  ]

  const handleItemClick = (id: AdminTab) => {
    onSelectTab(id)
    onCloseMobile()
  }

  return (
    <>
      {mobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800
          flex flex-col transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:z-20
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0d5543] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              E
            </div>
            <div>
              <div className="font-semibold text-sm tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <span>Eskedar Portfolio</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">Console Admin v2.0</p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mx-3 mt-3 px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={13} className="text-emerald-500" />
            <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
              PostgreSQL Schema
            </span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
            Live
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all
                  ${
                    isActive
                      ? 'bg-[#0d5543] text-white shadow-xs font-semibold'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className={isActive ? 'text-white' : 'text-neutral-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 space-y-1">
          <Link
            to="/"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} />
              <span>View Public Portfolio</span>
            </span>
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}