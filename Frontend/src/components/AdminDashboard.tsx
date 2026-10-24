import { useState, useEffect } from 'react'
import {
  Menu,
  Sun,
  Moon,
  Bell,
  RefreshCw,
  ChevronRight,
} from 'lucide-react'

import type {
  Project,
  Stats,
  ContactMessage,
  Profile,
  Skill,
  Experience,
  Education,
  Certification,
  Service,
} from '../types'

import { portfolioApi } from '../services/api'
import { AdminSidebar, type AdminTab } from './Admin/AdminSidebar'
import { DashboardView } from './Admin/DashboardView'
import { ProjectsAdmin } from './Admin/ProjectsAdmin'
import { ContactMessagesAdmin } from './Admin/ContactMessagesAdmin'
import { CertificationsAdmin } from './Admin/CertificationsAdmin'
import { EducationAdmin } from './Admin/EducationAdmin'
import { ExperienceAdmin } from './Admin/ExperienceAdmin'
import { ServicesAdmin } from './Admin/ServicesAdmin'
import { SkillsAdmin } from './Admin/SkillsAdmin'
import { ProfileAdmin } from './Admin/ProfileAdmin'
import { ReportsAdmin } from './Admin/ReportsAdmin'

export interface AdminDashboardProps {
  token: string
  onLogout: () => void
  dark?: boolean
  setDark?: (value: boolean) => void
}

export function AdminDashboard({
  token,
  onLogout,
  dark,
  setDark,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)

  const [stats, setStats] = useState<Stats>()
  const [projects, setProjects] = useState<Project[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [profile, setProfile] = useState<Profile>()
  const [skills, setSkills] = useState<Skill[]>([])
  const [experience, setExperience] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [services, setServices] = useState<Service[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshAll = async () => {
    setLoading(true)
    setError('')

    try {
      const [
        sRes,
        pRes,
        mRes,
        profRes,
        skRes,
        expRes,
        eduRes,
        certRes,
        srvRes,
      ] = await Promise.all([
        portfolioApi.stats(),
        portfolioApi.projects(),
        portfolioApi.messages(),
        portfolioApi.profile(),
        portfolioApi.skills(),
        portfolioApi.experience(),
        portfolioApi.education(),
        portfolioApi.certifications(),
        portfolioApi.services(),
      ])

      setStats(sRes.data)
      setProjects(pRes.data)
      setMessages(mRes.data)
      setProfile(profRes.data)
      setSkills(skRes.data)
      setExperience(expRes.data)
      setEducation(eduRes.data)
      setCertifications(certRes.data)
      setServices(srvRes.data)
    } catch {
      setError('Could not refresh admin data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refreshAll()
  }, [token])

  const handleTogglePublish = async (project: Project) => {
    try {
      await portfolioApi.saveProject(
        { isPublished: !project.isPublished },
        project.id,
      )
      await refreshAll()
    } catch {
      setError('Could not update the project. Please try again.')
    }
  }

  // The reset-seed API endpoint is not currently available.
  // Keep the callback for DashboardView, but do not call a nonexistent API.
  const handleResetSeed = () => {
    setError(
      'Reset to seed data is unavailable because the backend reset endpoint has not been configured.',
    )
  }

  const unreadCount = messages.filter(
    (message) => message.status === 'unread',
  ).length

  const getTabTitle = (tab: AdminTab) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard Overview'
      case 'projects':
        return 'Projects'
      case 'certifications':
        return 'Certifications'
      case 'contact-messages':
        return 'Messages'
      case 'education':
        return 'Education'
      case 'experience':
        return 'Experience'
      case 'services':
        return 'Services'
      case 'skills':
        return 'Skills'
      case 'reports':
        return 'Reports & Analytics'
      case 'profile':
        return 'Profile Settings'
    }
  }

  return (
    <div className="admin-shell min-h-screen flex bg-[#f4f7f5] text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadCount={unreadCount}
        projectsCount={projects.length}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={onLogout}
      />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="print:hidden sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-200/80 bg-white/90 px-3 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/90 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2.5 text-neutral-600 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/40 dark:text-neutral-300 dark:hover:bg-neutral-800 md:hidden"
              aria-label="Open navigation drawer"
              aria-expanded={mobileOpen}
              aria-controls="admin-navigation"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
              <span className="hidden sm:inline">Admin</span>
              <ChevronRight
                size={13}
                className="hidden sm:inline text-neutral-400"
              />
              <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
                {getTabTitle(activeTab)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => void refreshAll()}
              className="rounded-xl p-2.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/40 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              title="Refresh database records"
              aria-label="Refresh admin data"
            >
              <RefreshCw
                size={16}
                className={loading ? 'animate-spin' : ''}
              />
            </button>

            {setDark && (
              <button
                onClick={() => setDark(!dark)}
                className="rounded-xl p-2.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/40 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                title="Toggle Theme"
                aria-label="Toggle color theme"
              >
                {dark ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            )}

            <button
              onClick={() => setActiveTab('contact-messages')}
              className="relative rounded-xl p-2.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/40 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
              title="Inbox messages"
              aria-label={`Inbox messages${unreadCount ? `, ${unreadCount} unread` : ''}`}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0d5543] text-white flex items-center justify-center text-xs font-semibold">
                {profile?.name?.charAt(0) || 'E'}
              </div>
              <span className="text-xs font-medium hidden md:inline">
                {profile?.name?.split(' ')[0] || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="mx-4 sm:mx-8 mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300"
          >
            {error}
          </div>
        )}

        <main
          id="admin-content"
          className="admin-content mx-auto w-full max-w-[1600px] flex-1 p-3 sm:p-5 lg:p-8"
        >
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              projects={projects}
              messages={messages}
              profile={profile}
              onNavigate={setActiveTab}
              onTogglePublish={handleTogglePublish}
              onRefresh={refreshAll}
              onResetSeed={handleResetSeed}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsAdmin
              projects={projects}
              onRefresh={refreshAll}
            />
          )}

          {activeTab === 'contact-messages' && (
            <ContactMessagesAdmin
              messages={messages}
              onRefresh={refreshAll}
            />
          )}

          {activeTab === 'certifications' && (
            <CertificationsAdmin
              certifications={certifications}
              onRefresh={refreshAll}
            />
          )}

          {activeTab === 'education' && (
            <EducationAdmin
              education={education}
              onRefresh={refreshAll}
            />
          )}

          {activeTab === 'experience' && (
            <ExperienceAdmin
              experience={experience}
              onRefresh={refreshAll}
            />
          )}

          {activeTab === 'services' && (
            <ServicesAdmin
              services={services}
              onRefresh={refreshAll}
            />
          )}

          {activeTab === 'skills' && (
            <SkillsAdmin
              skills={skills}
              onRefresh={refreshAll}
            />
          )}

          {activeTab === 'reports' && <ReportsAdmin />}

          {activeTab === 'profile' && (
            <ProfileAdmin
              profile={profile}
              onRefresh={refreshAll}
            />
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard