import { useEffect, useState } from 'react'
import {
  ArrowUpRight,
  Download,
  Home,
  CheckCircle2,
  Code2,
  Layers,
  Cpu,
  Mail,
  BriefcaseBusiness,
  FileText,
  Menu,
  X,
  UserRound,
  Wrench,
  GraduationCap,
  FolderKanban,
  Server,
  Award,
} from 'lucide-react'
import type { Profile, Skill } from '../types'

interface AboutProps {
  profile: Profile | null
  skills?: Skill[]
}

type AboutTab = 'stack' | 'principles' | 'background'

interface SkillCategory {
  category: string
  items: Array<string | { name: string; imageUrl?: string | null }>
}

interface Principle {
  title: string
  description: string
}

const DEFAULT_SKILLS: SkillCategory[] = [
  {
    category: 'Frontend Development',
    items: [
      'HTML5',
      'CSS3',
      'JavaScript',
      'TypeScript',
      'React.js',
      'Vue.js',
      'Tailwind CSS',
      'Vite',
    ],
  },
  {
    category: 'Backend Development',
    items: [
      'Node.js',
      'Express.js',
      'PHP',
      'Laravel',
      'Python',
      'FastAPI',
      'REST APIs',
      'Authentication',
    ],
  },
  {
    category: 'Database & Tools',
    items: [
      'MySQL',
      'PostgreSQL',
      'Git',
      'GitHub',
      'Docker',
      'Axios',
      'Inertia.js',
      'API Integration',
    ],
  },
]

const DEFAULT_PRINCIPLES: Principle[] = [
  {
    title: 'Clean Architecture',
    description:
      'Build applications with clear separation of responsibilities, maintainable code, reusable components, and predictable data flow.',
  },
  {
    title: 'User-Centered Design',
    description:
      'Focus on creating interfaces that are responsive, accessible, intuitive, and easy to use across desktop, tablet, and mobile devices.',
  },
  {
    title: 'Reliable Engineering',
    description:
      'Prioritize secure APIs, proper validation, database integrity, error handling, testing, and maintainable development practices.',
  },
]

function isValidUrl(value?: string | null): boolean {
  if (!value) return false

  try {
    const url = new URL(value)

    return (
      url.protocol === 'http:' ||
      url.protocol === 'https:'
    )
  } catch {
    return false
  }
}

export function About({ profile, skills = [] }: AboutProps) {
  const [activeTab, setActiveTab] = useState<AboutTab>('stack')
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [cvPreviewOpen, setCvPreviewOpen] = useState(false)

  const navigationItems = [
    { label: 'Home', href: '#home', icon: Home },
    { label: 'About', href: '#about', icon: UserRound },
    { label: 'Skills', href: '#skills', icon: Wrench },
    { label: 'Experience', href: '#experience', icon: BriefcaseBusiness },
    { label: 'Education', href: '#education', icon: GraduationCap },
    { label: 'Projects', href: '#projects', icon: FolderKanban },
    { label: 'Services', href: '#services', icon: Server },
    { label: 'Certifications', href: '#certifications', icon: Award },
    { label: 'Contact', href: '#contact', icon: Mail },
  ]

  useEffect(() => {
    const updateActiveSection = () => {
      const hash = window.location.hash.replace('#', '')
      setActiveSection(hash || 'home')
    }

    updateActiveSection()
    window.addEventListener('hashchange', updateActiveSection)

    return () => window.removeEventListener('hashchange', updateActiveSection)
  }, [])

  /*
   * ------------------------------------------------------------
   * Profile data with safe fallbacks
   * ------------------------------------------------------------
   */

  const name =
    profile?.name?.trim() || 'Eskedar'

  /*
   * ------------------------------------------------------------
   * Skills
   * ------------------------------------------------------------
   */

  const skillsCategories: SkillCategory[] = skills.length > 0
    ? Object.entries(skills.reduce<Record<string, SkillCategory['items']>>((groups, skill) => {
        const category = skill.category.trim() || 'Other'
        groups[category] = [...(groups[category] ?? []), { name: skill.name, imageUrl: skill.imageUrl }]
        return groups
      }, {})).map(([category, items]) => ({ category, items }))
    : DEFAULT_SKILLS

  /*
   * ------------------------------------------------------------
   * Engineering principles
   * ------------------------------------------------------------
   */

  const principles: Principle[] =
    profile?.principles && profile.principles.length > 0
      ? profile.principles
          .map((item) => ({
            title: String(item.title ?? ''),
            description: String(item.description ?? ''),
          }))
          .filter(
            (item) =>
              item.title.length > 0 &&
              item.description.length > 0,
          )
      : DEFAULT_PRINCIPLES

  /*
   * ------------------------------------------------------------
   * Social / resume links
   * ------------------------------------------------------------
   */

  const hasResume = isValidUrl(profile?.resumeUrl)
  const hasGithub = isValidUrl(profile?.githubUrl)
  const hasLinkedIn = isValidUrl(profile?.linkedinUrl)

  /*
   * ------------------------------------------------------------
   * Tabs
   * ------------------------------------------------------------
   */

  const tabs: Array<{
    id: AboutTab
    label: string
    icon: typeof Cpu
  }> = [
    {
      id: 'stack',
      label: 'Technical Stack',
      icon: Cpu,
    },
    {
      id: 'principles',
      label: 'Core Principles',
      icon: Layers,
    },
    {
      id: 'background',
      label: 'Work Methodology',
      icon: Code2,
    },
  ]

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="w-full border-b border-neutral-200/80 pb-16 sm:pb-24"
    >
      <header id="home" className="sticky top-0 z-30 mb-10 border-b border-neutral-200/80 bg-white/95 backdrop-blur sm:mb-14">
        <div className="mx-auto flex h-[72px] max-w-screen-2xl items-center justify-start gap-4 px-4 sm:px-6 lg:pl-10 lg:pr-6 2xl:pl-12 2xl:pr-8 xl:gap-24">
          <a
            href="#home"
            className="group flex shrink-0 items-center gap-2 font-serif text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl"
            onClick={() => {
              setMobileNavOpen(false)
              setActiveSection('home')
            }}
          >
            <span>Eskedar.dev</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#0d5543] transition-transform duration-200 group-hover:scale-125" />
          </a>

          <nav className="relative ml-auto shrink-0 xl:ml-0" aria-label="Professional portfolio navigation">
            <button
              type="button"
              aria-expanded={mobileNavOpen}
              aria-controls="professional-navigation"
              aria-label={mobileNavOpen ? 'Close navigation' : 'Open navigation'}
              onClick={() => setMobileNavOpen((isOpen) => !isOpen)}
              className="rounded-lg p-2 text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#0d5543]/30 xl:hidden"
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div
              id="professional-navigation"
              className={`${mobileNavOpen ? 'flex' : 'hidden'} absolute right-0 top-full z-40 w-[min(22rem,calc(100vw-2rem))] flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-2 shadow-[0_16px_36px_-20px_rgba(15,31,28,0.4)] xl:static xl:flex xl:w-auto xl:flex-row xl:items-center xl:gap-2.5 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none`}
            >
              {navigationItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setMobileNavOpen(false)
                    setActiveSection(item.href.slice(1))
                  }}
                  className={`group inline-flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium tracking-normal transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/40 focus-visible:ring-offset-2 xl:px-3 xl:text-[15px] ${
                    activeSection === item.href.slice(1)
                      ? 'bg-[#0d5543]/10 text-[#0d5543]'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-[#0d5543]'
                  }`}
                >
                  {item.icon && (
                    <item.icon size={15} aria-hidden="true" className="xl:hidden" />
                  )}
                  {item.label}
                </a>
              ))}

            </div>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-10 2xl:px-12">

        {/* =====================================================
            TOP CONTENT
        ====================================================== */}

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-16 xl:gap-20">

          {/* ===================================================
              LEFT COLUMN
          ==================================================== */}

          <div className="space-y-6 lg:col-span-7">

            <div>
              <h2
                id="about-heading"
                className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl"
              >
                {profile?.aboutTitle?.trim() || profile?.role || 'Full-Stack Developer'}
              </h2>
            </div>

            {/* About Text */}

            <div className="max-w-3xl space-y-4 text-base font-normal leading-relaxed text-neutral-600 sm:text-lg">
              <p>
                {profile?.bio || 'I build modern, responsive, and reliable web applications from practical ideas and requirements.'}
              </p>

              <p>
                {profile?.aboutText || 'I solve practical problems through clean code, thoughtful design, and reliable software.'}
              </p>
            </div>

            {/* =================================================
                ACTION BUTTONS
            ================================================== */}

            <div className="flex flex-wrap items-center gap-3 pt-2">

              {/* Resume */}

              {hasResume ? (
                <a
                  href={profile?.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  aria-label="Download resume"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0d5543] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#093c30] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0d5543] focus:ring-offset-2"
                >
                  <FileText
                    size={16}
                    aria-hidden="true"
                  />

                  <span>Download Resume</span>

                  <Download
                    size={14}
                    className="opacity-70"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <a
                  href="#contact"
                  aria-label="Get in touch"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0d5543] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#093c30] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0d5543] focus:ring-offset-2"
                >
                  <Mail
                    size={16}
                    aria-hidden="true"
                  />

                  <span>Get in Touch</span>
                </a>
              )}

              <a
                href="/messi.jpg"
                download="Eskedar-CV.jpg"
                aria-label="Download CV"
                className="inline-flex items-center gap-2 rounded-xl border border-[#0d5543] bg-white px-4 py-2.5 text-sm font-medium text-[#0d5543] shadow-sm transition-all duration-200 hover:bg-[#0d5543]/5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#0d5543] focus:ring-offset-2"
              >
                <Download
                  size={16}
                  aria-hidden="true"
                />

                <span>Download CV</span>
              </a>

              {/* GitHub */}

              {hasGithub && (
                <a
                  href={profile?.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit GitHub profile"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#0d5543] focus:ring-offset-2"
                >
                  <span>GitHub</span>

                  <ArrowUpRight
                    size={15}
                    className="text-neutral-400"
                    aria-hidden="true"
                  />
                </a>
              )}

              {/* LinkedIn */}

              {hasLinkedIn && (
                <a
                  href={profile?.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit LinkedIn profile"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 transition-all duration-200 hover:border-neutral-300 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[#0d5543] focus:ring-offset-2"
                >
                  <span>LinkedIn</span>

                  <ArrowUpRight
                    size={15}
                    className="text-neutral-400"
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>
          </div>

          {/* ===================================================
              RIGHT COLUMN
          ==================================================== */}

          <div className="space-y-6 lg:col-span-5">

            <div className="mx-auto w-full max-w-[420px] rounded-[28px] border border-neutral-200/80 bg-white p-4 shadow-[0_10px_30px_-12px_rgba(15,31,28,0.18)] sm:p-5">
              <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-full border-[6px] border-white bg-neutral-100 shadow-[0_18px_35px_-10px_rgba(15,31,28,0.2)] sm:h-72 sm:w-72 lg:h-80 lg:w-80">
                <a
                  href="/esku.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${name}'s full profile image`}
                  className="block h-full w-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-[#0d5543] focus:ring-inset"
                >
                  <img
                    src={profile?.avatarUrl || '/esku.jpg'}
                    alt={`${name} profile`}
                    className="h-full w-full object-cover object-[center_30%]"
                  />
                </a>

                <span className="absolute bottom-3 right-3 flex h-5 w-5 items-center justify-center rounded-full border-4 border-white bg-[#0d5543] shadow-sm" aria-label="Available now" />
              </div>
            </div>

          </div>
        </div>

        {/* =====================================================
            INTERACTIVE EXPLORER
        ====================================================== */}

        <div id="skills" aria-labelledby="skills-heading" className="mt-14 scroll-mt-24 border-t border-neutral-200/70 pt-10">

          {/* =================================================
              TAB NAVIGATION
          ================================================== */}

          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id="skills-heading" className="font-serif text-2xl font-medium tracking-tight text-neutral-900 sm:text-3xl">
              Skills
            </h2>
            <span className="hidden pb-1 font-mono text-xs text-neutral-400 md:inline-block">
              Interactive Explorer
            </span>
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

            <div
              role="tablist"
              aria-label="About information"
              className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-neutral-200/60 bg-neutral-100/80 p-1 text-xs font-medium"
            >

              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`about-panel-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0d5543]/30 ${
                      isActive
                        ? 'bg-white font-semibold text-neutral-900 shadow-sm'
                        : 'text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    <Icon
                      size={14}
                      className={
                        isActive
                          ? 'text-[#0d5543]'
                          : 'text-neutral-400'
                      }
                      aria-hidden="true"
                    />

                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

          </div>

          {/* =====================================================
              TECHNICAL STACK TAB
          ====================================================== */}

          {activeTab === 'stack' && (
            <div
              id="about-panel-stack"
              role="tabpanel"
              aria-label="Technical Stack"
              className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6"
            >
              {skillsCategories.map((group, index) => (
                <div
                  key={`${group.category}-${index}`}
                  className="rounded-2xl border border-neutral-200/80 bg-white p-6 transition-all duration-200 hover:border-[#0d5543]/30 hover:shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between gap-4">

                    <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800">
                      {group.category}
                    </h3>

                    <span className="font-mono text-xs font-normal text-[#0d5543]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {group.items.map((skill, skillIndex) => (
                      <span
                        key={`${typeof skill === 'string' ? skill : skill.name}-${skillIndex}`}
                        className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-neutral-200/60 bg-neutral-50 px-3 py-2 text-sm font-medium leading-snug text-neutral-700 transition-colors duration-200 hover:border-[#0d5543]/40 hover:bg-[#0d5543]/5"
                      >
                        {typeof skill !== 'string' && skill.imageUrl && <img src={skill.imageUrl} alt="" className="h-5 w-5 rounded object-cover" />}
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =====================================================
              PRINCIPLES TAB
          ====================================================== */}

          {activeTab === 'principles' && (
            <div
              id="about-panel-principles"
              role="tabpanel"
              aria-label="Core Engineering Principles"
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {principles.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="rounded-2xl border border-neutral-200/80 bg-white p-6 transition-all duration-200 hover:border-[#0d5543]/30 hover:shadow-sm"
                >
                  <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-[#0d5543]/10 font-mono text-xs font-bold text-[#0d5543]">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <h3 className="mb-2 text-base font-semibold text-neutral-900">
                    {item.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-neutral-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* =====================================================
              WORK METHODOLOGY TAB
          ====================================================== */}

          {activeTab === 'background' && (
            <div
              id="about-panel-background"
              role="tabpanel"
              aria-label="Work Methodology"
              className="rounded-2xl border border-neutral-200/80 bg-white p-6 sm:p-8"
            >
              <div className="max-w-3xl space-y-5">

                <div>
                  <span className="mb-2 block font-mono text-xs uppercase tracking-wider text-[#0d5543]">
                    Development Approach
                  </span>

                  <h3 className="text-lg font-semibold text-neutral-900">
                    How I Approach Software Development
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-neutral-600">
                  Software development is a continuous process of
                  understanding problems, designing practical solutions,
                  implementing reliable systems, and improving them through
                  testing and feedback. Each project begins by understanding
                  the requirements and user workflow before selecting the
                  appropriate architecture, technologies, and implementation
                  strategy.
                </p>

                <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">

                  {/* Item 1 */}

                  <div className="flex items-start gap-2.5 text-xs font-medium text-neutral-700">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#0d5543]"
                      aria-hidden="true"
                    />

                    <span>
                      Clear requirements and structured application architecture
                    </span>
                  </div>

                  {/* Item 2 */}

                  <div className="flex items-start gap-2.5 text-xs font-medium text-neutral-700">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#0d5543]"
                      aria-hidden="true"
                    />

                    <span>
                      Responsive mobile-first interface development
                    </span>
                  </div>

                  {/* Item 3 */}

                  <div className="flex items-start gap-2.5 text-xs font-medium text-neutral-700">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#0d5543]"
                      aria-hidden="true"
                    />

                    <span>
                      Secure API integration, validation, and authentication
                    </span>
                  </div>

                  {/* Item 4 */}

                  <div className="flex items-start gap-2.5 text-xs font-medium text-neutral-700">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#0d5543]"
                      aria-hidden="true"
                    />

                    <span>
                      Git-based version control and maintainable code
                    </span>
                  </div>

                  {/* Item 5 */}

                  <div className="flex items-start gap-2.5 text-xs font-medium text-neutral-700">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#0d5543]"
                      aria-hidden="true"
                    />

                    <span>
                      Database design with reliable data relationships
                    </span>
                  </div>

                  {/* Item 6 */}

                  <div className="flex items-start gap-2.5 text-xs font-medium text-neutral-700">
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#0d5543]"
                      aria-hidden="true"
                    />

                    <span>
                      Testing, debugging, performance, and continuous improvement
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {cvPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="CV preview"
          onClick={() => setCvPreviewOpen(false)}
        >
          <div
            className="relative flex max-h-[92vh] max-w-5xl items-center justify-center rounded-2xl bg-white p-2 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src="/messi.jpg"
              alt="CV preview"
              className="max-h-[88vh] max-w-full rounded-xl object-contain"
            />

            <button
              type="button"
              aria-label="Close CV preview"
              onClick={() => setCvPreviewOpen(false)}
              className="absolute right-3 top-3 rounded-full bg-neutral-900/80 p-2 text-white transition-colors hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
