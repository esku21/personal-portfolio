import { useState } from 'react'
import {
  ArrowUpRight,
  Download,
  MapPin,
  CheckCircle2,
  Code2,
  Layers,
  Cpu,
  Mail,
  FileText,
  Sparkles,
} from 'lucide-react'

import type { Profile } from '../types'
import { SectionHeading } from './SectionHeading'

interface AboutProps {
  profile: Profile | null
}

type AboutTab = 'stack' | 'principles' | 'background'

interface Stat {
  value: string
  label: string
}

interface SkillCategory {
  category: string
  items: string[]
}

interface Principle {
  title: string
  description: string
}

const DEFAULT_STATS: Stat[] = [
  {
    value: '4+',
    label: 'Years Learning & Building',
  },
  {
    value: '10+',
    label: 'Projects',
  },
  {
    value: 'Full Stack',
    label: 'Development Focus',
  },
  {
    value: '100%',
    label: 'Commitment to Quality',
  },
]

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

const DEFAULT_LEAD =
  'I am a full-stack web developer focused on building modern, responsive, and reliable digital solutions. I enjoy transforming real-world requirements into clean user interfaces, well-structured APIs, and maintainable applications.'

const DEFAULT_SUBTITLE =
  'Building thoughtful digital experiences with clean and reliable engineering.'

const DEFAULT_LOCATION =
  'Adama, Ethiopia — Available for Remote Opportunities'

const DEFAULT_AVAILABILITY =
  'Open to Software Engineering & Full-Stack Development Opportunities'

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

export function About({ profile }: AboutProps) {
  const [activeTab, setActiveTab] = useState<AboutTab>('stack')

  /*
   * ------------------------------------------------------------
   * Profile data with safe fallbacks
   * ------------------------------------------------------------
   */

  const name =
    profile?.name?.trim() || 'Eskedar'

  const subtitle =
    profile?.aboutSubtitle?.trim() || DEFAULT_SUBTITLE

  const lead =
    profile?.aboutText?.trim() ||
    profile?.bio?.trim() ||
    DEFAULT_LEAD

  const location =
    profile?.location?.trim() || DEFAULT_LOCATION

  const availability =
    profile?.availability?.trim() || DEFAULT_AVAILABILITY

  /*
   * ------------------------------------------------------------
   * Statistics
   * ------------------------------------------------------------
   */

  const stats: Stat[] =
    profile?.stats && profile.stats.length > 0
      ? profile.stats.map((stat) => ({
          value: String(stat.value ?? ''),
          label: String(stat.label ?? ''),
        }))
      : DEFAULT_STATS

  /*
   * ------------------------------------------------------------
   * Skills
   * ------------------------------------------------------------
   */

  const skillsCategories: SkillCategory[] =
    profile?.skills && profile.skills.length > 0
      ? profile.skills
          .map((group) => ({
            category: String(group.category ?? ''),
            items: Array.isArray(group.items)
              ? group.items.map(String).filter(Boolean)
              : [],
          }))
          .filter(
            (group) =>
              group.category.length > 0 &&
              group.items.length > 0,
          )
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
      className="w-full border-b border-neutral-200/80 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* =====================================================
            SECTION HEADER
        ====================================================== */}

        <SectionHeading
          number="01"
          title="About"
          subtitle="Profile & Engineering Philosophy"
        />

        {/* =====================================================
            TOP CONTENT
        ====================================================== */}

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">

          {/* ===================================================
              LEFT COLUMN
          ==================================================== */}

          <div className="space-y-6 lg:col-span-7">

            {/* Engineering Philosophy Badge */}

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#0d5543]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#0d5543]">
                <Sparkles
                  size={13}
                  aria-hidden="true"
                />

                <span>Engineering Philosophy</span>
              </div>

              <h2
                id="about-heading"
                className="font-serif text-3xl font-medium leading-[1.15] tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl"
              >
                {name}.
                <br />

                <span className="italic text-[#0d5543]">
                  {subtitle}
                </span>
              </h2>
            </div>

            {/* About Text */}

            <p className="max-w-3xl text-base font-normal leading-relaxed text-neutral-600 sm:text-lg">
              {lead}
            </p>

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

            {/* =================================================
                AVAILABILITY CARD
            ================================================== */}

            <div className="space-y-4 rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-[0_2px_16px_-4px_rgba(0,0,0,0.04)]">

              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">

                <div className="flex items-center gap-2.5">

                  <span
                    className="relative flex h-2.5 w-2.5"
                    aria-hidden="true"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#0d5543]" />
                  </span>

                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Status
                  </span>
                </div>

                <span className="rounded-full border border-emerald-200/50 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-[#0d5543]">
                  Available
                </span>
              </div>

              <div className="space-y-4 text-sm">

                {/* Current engagement */}

                <div>
                  <span className="block text-xs font-medium text-neutral-400">
                    Current Focus
                  </span>

                  <p className="mt-1 font-medium leading-relaxed text-neutral-800">
                    {availability}
                  </p>
                </div>

                {/* Location */}

                <div className="flex items-start gap-2 text-neutral-600">

                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-[#0d5543]"
                    aria-hidden="true"
                  />

                  <span className="text-xs font-medium leading-relaxed">
                    {location}
                  </span>
                </div>
              </div>
            </div>

            {/* =================================================
                STATISTICS
            ================================================== */}

            <div className="grid grid-cols-2 gap-3">

              {stats.map((stat, index) => (
                <div
                  key={`${stat.label}-${index}`}
                  className="rounded-xl border border-neutral-200/70 bg-white/80 p-4 transition-all duration-200 hover:border-[#0d5543]/30 hover:bg-white hover:shadow-sm"
                >
                  <div className="break-words font-serif text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
                    {stat.value}
                  </div>

                  <div className="mt-1 text-xs font-medium leading-relaxed text-neutral-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =====================================================
            INTERACTIVE EXPLORER
        ====================================================== */}

        <div className="mt-14 border-t border-neutral-200/70 pt-10">

          {/* =================================================
              TAB NAVIGATION
          ================================================== */}

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

            <span className="hidden font-mono text-xs text-neutral-400 md:inline-block">
              Interactive Explorer
            </span>
          </div>

          {/* =====================================================
              TECHNICAL STACK TAB
          ====================================================== */}

          {activeTab === 'stack' && (
            <div
              id="about-panel-stack"
              role="tabpanel"
              aria-label="Technical Stack"
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
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
                        key={`${skill}-${skillIndex}`}
                        className="inline-flex items-center rounded-lg border border-neutral-200/60 bg-neutral-50 px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors duration-200 hover:border-[#0d5543]/40 hover:bg-[#0d5543]/5"
                      >
                        {skill}
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
    </section>
  )
}