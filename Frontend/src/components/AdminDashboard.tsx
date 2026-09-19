import { useState, useEffect } from 'react'
import { 
  Menu, 
  Sun, 
  Moon, 
  Bell, 
  RefreshCw, 
  ChevronRight
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
  Service 
} from '../types'
import { portfolioApi } from '../services/api'
import { AdminSidebar, type AdminTab } from './admin/AdminSidebar'
import { DashboardView } from './admin/DashboardView'
import { ProjectsAdmin } from './admin/ProjectsAdmin'
import { ContactMessagesAdmin } from './admin/ContactMessagesAdmin'
import { CertificationsAdmin } from './admin/CertificationsAdmin'
import { EducationAdmin } from './admin/EducationAdmin'
import { ExperienceAdmin } from './admin/ExperienceAdmin'
import { ServicesAdmin } from './admin/ServicesAdmin'
import { SkillsAdmin } from './admin/SkillsAdmin'
import { ProfileAdmin } from './admin/ProfileAdmin'

interface AdminDashboardProps {
  token: string
  onLogout: () => void
  dark?: boolean
  setDark?: (value: boolean) => void
}

export function AdminDashboard({ token, onLogout, dark, setDark }: AdminDashboardProps) {
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
        srvRes
      ] = await Promise.all([
        portfolioApi.stats(),
        portfolioApi.projects(),
        portfolioApi.messages(),
        portfolioApi.profile(),
        portfolioApi.skills(),
        portfolioApi.experience(),
        portfolioApi.education(),
        portfolioApi.certifications(),
        portfolioApi.services()
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
    } catch (err) {
      setError('Could not fetch latest database records. Using local state.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void refreshAll()
  }, [token])

  const handleTogglePublish = async (project: Project) => {
    await portfolioApi.saveProject({ isPublished: !project.isPublished }, project.id)
    void refreshAll()
  }

  const handleResetSeed = async () => {
    if (confirm('Reset database records to initial seed data?')) {
      await portfolioApi.resetToSeed()
      void refreshAll()
    }
  }

  const unreadCount = messages.filter((m) => m.status === 'unread').length

  const getTabTitle = (tab: AdminTab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Overview'
      case 'projects': return 'Projects'
      case 'certifications': return 'Certification'
      case 'contact-messages': return 'ContactMessage'
      case 'education': return 'Education'
      case 'experience': return 'Experience'
      case 'services': return 'Services'
      case 'skills': return 'Skills'
      case 'profile': return 'Profile Settings'
    }
  }

  return (
    <div className="min-h-screen flex bg-neutral-100/70 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadCount={unreadCount}
        projectsCount={projects.length}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onLogout={onLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 px-4 sm:px-8 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Open navigation drawer"
            >
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
              <span className="hidden sm:inline">Admin</span>
              <ChevronRight size={13} className="hidden sm:inline text-neutral-400" />
              <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
                {getTabTitle(activeTab)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => void refreshAll()}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Refresh database records"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>

            {setDark && (
              <button
                onClick={() => setDark(!dark)}
                className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Toggle Theme"
              >
                {dark ? <Sun size={17} /> : <Moon size={17} />}
              </button>
            )}

            <button
              onClick={() => setActiveTab('contact-messages')}
              className="relative p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Inbox messages"
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
          <div className="mx-4 sm:mx-8 mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
            {error}
          </div>
        )}

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
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