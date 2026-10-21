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
  ChevronRight,
  ChartNoAxesCombined,
} from 'lucide-react'

export type AdminTab =
  | 'dashboard'
  | 'projects'
  | 'certifications'
  | 'contact-messages'
  | 'education'
  | 'experience'
  | 'services'
  | 'skills'
  | 'reports'
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
  onLogout,
}: AdminSidebarProps) {
  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'projects' as AdminTab,
      label: 'Projects',
      icon: FolderGit2,
      badge: projectsCount > 0 ? projectsCount : undefined,
    },
    {
      id: 'certifications' as AdminTab,
      label: 'Certifications',
      icon: Award,
    },
    {
      id: 'contact-messages' as AdminTab,
      label: 'Messages',
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : undefined,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      id: 'education' as AdminTab,
      label: 'Education',
      icon: GraduationCap,
    },
    {
      id: 'experience' as AdminTab,
      label: 'Experience',
      icon: Building2,
    },
    {
      id: 'services' as AdminTab,
      label: 'Services',
      icon: Layers3,
    },
    {
      id: 'skills' as AdminTab,
      label: 'Skills',
      icon: Cpu,
    },
    {
      id: 'reports' as AdminTab,
      label: 'Reports & Analytics',
      icon: ChartNoAxesCombined,
    },
    {
      id: 'profile' as AdminTab,
      label: 'Profile Settings',
      icon: UserCog,
    },
  ]

  const handleItemClick = (id: AdminTab) => {
    onSelectTab(id)
    onCloseMobile()
  }

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          print:hidden
          fixed inset-y-0 left-0 z-50
          flex w-[min(86vw,280px)] shrink-0 flex-col overflow-hidden
          border-r border-neutral-200
          bg-white/95 shadow-2xl backdrop-blur-xl
          transition-transform duration-300 ease-in-out
          motion-reduce:transition-none

          dark:border-neutral-800
          dark:bg-neutral-950/95

          ${
            mobileOpen
              ? 'translate-x-0'
              : '-translate-x-full md:translate-x-0'
          }

          md:sticky
          md:top-0
          md:h-screen
          md:w-[264px]
          md:translate-x-0
          md:shadow-none
        `}
        id="admin-navigation"
        aria-label="Admin navigation"
      >
        {/* Header */}
        <div
          className="
            flex h-16 shrink-0 items-center
            justify-between
            border-b border-neutral-200
            px-4 sm:px-5 md:h-[76px]
            dark:border-neutral-800
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            {/* Logo */}
            <div
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-xl
                bg-[#0d5543]
                text-lg font-bold text-white
                shadow-sm
              "
            >
              E
            </div>

            {/* Brand */}
            <div className="min-w-0">
              <h1
                className="
                  truncate
                  text-sm font-bold
                  tracking-tight
                  text-neutral-900
                  dark:text-white
                "
              >
                Eskedar Portfolio
              </h1>

              <p
                className="
                  mt-0.5
                  truncate
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-wider
                  text-neutral-400
                "
              >
                Admin Console
              </p>
            </div>
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close sidebar"
            className="
              rounded-lg
              p-2
              text-neutral-400
              transition-colors
              hover:bg-neutral-100
              hover:text-neutral-900
              focus:outline-none
              focus:ring-2
              focus:ring-[#0d5543]/30
              dark:hover:bg-neutral-800
              dark:hover:text-white
              md:hidden
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="
            flex-1
            min-h-0
            overflow-y-auto
            overscroll-contain
            px-3
            py-3
          "
          aria-label="Admin menu"
        >
          <p
            className="
              mb-2
              px-3
              text-[10px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-neutral-400
            "
          >
            Management
          </p>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    group
                    flex w-full
                    items-center justify-between
                    rounded-xl
                    px-2.5 py-2
                    text-left
                    text-sm
                    transition-all
                    duration-200
                    focus:outline-none
                    focus:ring-2
                    focus:ring-[#0d5543]/30

                    ${
                      isActive
                        ? 'bg-[#0d5543] text-white shadow-sm'
                        : `
                          text-neutral-600
                          hover:bg-neutral-100
                          hover:text-neutral-950
                          dark:text-neutral-400
                          dark:hover:bg-neutral-900
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    {/* Icon */}
                    <span
                      className={`
                        flex h-8 w-8 shrink-0
                        items-center justify-center
                        rounded-lg
                        transition-colors

                        ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : `
                              bg-neutral-100
                              text-neutral-500
                              group-hover:text-neutral-900
                              dark:bg-neutral-800
                              dark:text-neutral-400
                              dark:group-hover:text-white
                            `
                        }
                      `}
                    >
                      <Icon size={16} strokeWidth={2} />
                    </span>

                    {/* Label */}
                    <span className="truncate font-medium">
                      {item.label}
                    </span>
                  </span>

                  <span className="ml-2 flex shrink-0 items-center gap-2">
                    {/* Badge */}
                    {item.badge !== undefined && (
                      <span
                        className={`
                          min-w-[22px]
                          rounded-full
                          px-1.5 py-0.5
                          text-center
                          text-[10px]
                          font-bold
                          ${
                            item.badgeColor
                              ? item.badgeColor
                              : isActive
                                ? 'bg-white/15 text-white'
                                : `
                                  bg-neutral-200
                                  text-neutral-700
                                  dark:bg-neutral-800
                                  dark:text-neutral-300
                                `
                          }
                        `}
                      >
                        {item.badge}
                      </span>
                    )}

                    {/* Active Arrow */}
                    {isActive && (
                      <ChevronRight
                        size={14}
                        className="text-white/70"
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div
          className="
            shrink-0
            border-t border-neutral-200
            bg-white/80 p-3
            dark:border-neutral-800
            dark:bg-neutral-950/80
          "
        >
          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            className="
              group
              mt-1
              flex w-full
              items-center gap-3
              rounded-xl
              px-3 py-2.5
              text-sm
              font-medium
              text-rose-500
              transition-colors
              hover:bg-rose-50
              hover:text-rose-600
              focus:outline-none
              focus:ring-2
              focus:ring-rose-500/30
              dark:hover:bg-rose-950/30
            "
          >
            <span
              className="
                flex h-8 w-8
                items-center justify-center
                rounded-lg
                bg-rose-50
                text-rose-500
                dark:bg-rose-950/30
              "
            >
              <LogOut size={15} />
            </span>

            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}