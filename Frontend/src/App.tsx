import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { HashRouter as Router, Link, Route, Routes, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  ArrowUpRight, 
  Check, 
  ChevronRight, 
  GitBranch, 
  LayoutTemplate, 
  Layers3, 
  Compass, 
  Menu, 
  Moon, 
  Send, 
  Sun, 
  X, 
  Mail, 
  ShieldCheck
} from 'lucide-react'
import { portfolioApi } from './services/api'
import type { Portfolio, Project } from './types'
import { SectionHeading } from './components/SectionHeading'
import { About } from './components/About'
import { Projects } from './components/Projects'
import { AdminLogin } from './components/AdminLogin'
import { AdminDashboard } from './components/AdminDashboard'
import './App.css'

const emptyPortfolio: Portfolio = { 
  profile: null, 
  projects: [], 
  skills: [], 
  experience: [], 
  education: [], 
  certifications: [], 
  services: [] 
}

const iconMap = { LayoutTemplate, Layers3, Compass }

function usePortfolio() {
  const [data, setData] = useState<Portfolio>(emptyPortfolio)
  const [loading, setLoading] = useState(true)

  const fetchPortfolio = () => {
    setLoading(true)
    portfolioApi
      .get()
      .then(({ data: value }) => setData(value))
      .catch(() => undefined)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPortfolio()
  }, [])

  return { data, loading, refresh: fetchPortfolio }
}

function Layout({ 
  children, 
  dark, 
  setDark 
}: { 
  children: ReactNode
  dark: boolean
  setDark: (value: boolean) => void 
}) {
  const [open, setOpen] = useState(false)
  
  const links = [
    ['Overview', '#about'],
    ['Projects', '#work'],
    ['Expertise', '#services'],
    ['Timeline', '#timeline'],
    ['Connect', '#contact']
  ]

  return (
    <div className={dark ? 'app dark' : 'app'}>
      <div className="bg-neutral-900 text-neutral-300 py-1.5 px-4 text-[11px] flex items-center justify-between border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-emerald-300">Portfolio_db</span>
          <span className="text-neutral-500 hidden sm:inline">· 10 PostgreSQL Tables Active</span>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            to="/admin" 
            className="text-white hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
          >
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>Admin Console</span>
            <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>

      <header className="nav">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          E<span>.</span>
        </Link>
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {links.map(([label, href]) => (
            <a href={href} key={label} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
          <Link to="/admin" className="nav-admin" onClick={() => setOpen(false)}>
            Admin <ArrowUpRight size={14} />
          </Link>
        </nav>
        <div className="nav-actions">
          <button 
            aria-label="Toggle theme" 
            onClick={() => setDark(!dark)}
            className="hover:text-neutral-900 dark:hover:text-white"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            className="menu" 
            aria-label="Toggle menu" 
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {children}

      <footer className="footer">
        <div>
          <div className="brand">E<span>.</span></div>
          <p>Digital products with architectural purpose & PostgreSQL precision.</p>
        </div>
        <a href="mailto:hello@eskedar.dev">
          hello@eskedar.dev <ArrowUpRight size={15} />
        </a>
        <small>© {new Date().getFullYear()} · Eskedar Tesfaye Portfolio</small>
      </footer>
    </div>
  )
}

function Home() {
  const { data, loading, refresh } = usePortfolio()
  const profile = data.profile

  return (
    <main>
      <section className="hero">
        <div className="eyebrow">
          <span className="status-dot" /> {profile?.availability ?? 'Open to select opportunities'}
        </div>
        <h1>
          {profile?.role?.split(' ').slice(0, 2).join(' ') ?? 'Digital products'}<br />
          <em>{profile?.role?.split(' ').slice(2).join(' ') || 'with purpose.'}</em>
        </h1>
        <p className="hero-copy">
          {profile?.bio ?? 'Specialized in high-reliability municipal administrative software, automated FinTech transaction clearing, and scalable web architectures.'}
        </p>
        <div className="hero-actions">
          <a href="#work" className="button primary">
            Explore my work <ArrowUpRight size={17} />
          </a>
          <a href="#contact" className="button ghost">
            Let’s talk <ChevronRight size={17} />
          </a>
          <Link to="/admin" className="button ghost text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800">
            <ShieldCheck size={16} /> Admin Portal
          </Link>
        </div>
        <div className="hero-meta">
          <span>Based in <strong>{profile?.location ?? 'Adama, Ethiopia'}</strong></span>
          <span className="line" />
          <span>{profile?.role ?? 'Full-Stack Software Engineer'}</span>
        </div>
      </section>
      
      <About profile={profile} />

      <div id="work">
        <Projects 
          projects={data.projects} 
          loading={loading} 
          onLoadSampleData={refresh}
        />
      </div>

      <section id="services" className="section services-section">
        <SectionHeading number="03" title="What I do" note="From database schema to a dependable product." />
        <div className="services">
          {data.services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] ?? Compass
            return (
              <motion.div 
                whileHover={{ y: -6 }} 
                className="service" 
                key={service.id}
              >
                <span>0{index + 1}</span>
                <Icon size={25} strokeWidth={1.5} />
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section id="timeline" className="section timeline-section">
        <SectionHeading number="04" title="Experience & education" />
        <div className="timeline">
          <div>
            <h2>Experience</h2>
            {data.experience.map((item) => (
              <div className="timeline-item" key={item.id}>
                <small>{item.startDate} — {item.endDate ?? 'Present'}</small>
                <h3>{item.role}</h3>
                <p>
                  <strong>{item.company}</strong>{item.location ? ` · ${item.location}` : ''}
                  <br />
                  {item.description}
                </p>
              </div>
            ))}

            <h2>Education</h2>
            {data.education.map((item) => (
              <div className="timeline-item" key={item.id}>
                <small>{item.startDate} — {item.endDate ?? 'Present'}</small>
                <h3>{item.degree}</h3>
                <p>
                  <strong>{item.institution}</strong>{item.location ? ` · ${item.location}` : ''}
                  <br />
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div>
            <h2>Skills & Technologies</h2>
            <div className="skills">
              {data.skills.map((skill) => (
                <div className="skill" key={skill.id}>
                  <div>
                    <span>{skill.name}</span>
                    <small>{skill.category} · {skill.level}%</small>
                  </div>
                  <div className="skill-bar">
                    <i style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <h2 className="subheading">Certifications</h2>
            {data.certifications.map((cert) => (
              <div className="timeline-item" key={cert.id}>
                <small>{cert.issueDate ?? 'Verified'}</small>
                <h3>{cert.name}</h3>
                <p>
                  {cert.issuer}
                  {cert.credentialUrl && (
                    <>
                      {' · '}
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-[#0d5543] dark:text-[#2dd4bf] hover:underline">
                        Verify
                      </a>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div>
          <SectionHeading number="05" title="Contact" />
          <h2>Have a good idea?<br /><em>Let’s make it real.</em></h2>
          <p className="text-sm text-neutral-500 max-w-sm mb-6 leading-relaxed">
            Inquiries sent here save straight into the PostgreSQL "ContactMessage" database table and appear instantly in your Admin Console.
          </p>
          {profile?.email && (
            <a className="text-link" href={`mailto:${profile.email}`}>
              <Mail size={15} /> {profile.email}
            </a>
          )}
        </div>
        <ContactForm />
      </section>
    </main>
  )
}

function ContactForm() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>

    try {
      await portfolioApi.contact(data)
      setSent(true)
      form.reset()
    } catch {
      setError('Please check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (sent) {
    return (
      <div className="sent">
        <Check size={30} />
        <h3>Message received.</h3>
        <p>Thanks for reaching out. Your inquiry is recorded and I will be in touch soon.</p>
        <button 
          onClick={() => setSent(false)} 
          className="mt-4 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium"
        >
          Send another note
        </button>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        Your name
        <input required name="name" placeholder="Abebe Bikila" />
      </label>
      <label>
        Email address
        <input required type="email" name="email" placeholder="you@example.com" />
      </label>
      <label>
        Subject
        <input required name="subject" placeholder="Project or consultation inquiry" />
      </label>
      <label>
        Message
        <textarea 
          required 
          name="message" 
          placeholder="Tell me a little about your project or inquiry…" 
          rows={4} 
        />
      </label>
      {error && <p className="form-error">{error}</p>}
      <button className="button primary" type="submit" disabled={submitting}>
        {submitting ? 'Sending...' : 'Send message'} <Send size={16} />
      </button>
    </form>
  )
}

function ProjectDetails() {
  const { slug } = useParams()
  const [project, setProject] = useState<Project>()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (slug) {
      portfolioApi
        .project(slug)
        .then(({ data }) => setProject(data))
        .catch(() => setFailed(true))
    }
  }, [slug])

  if (failed) {
    return (
      <main className="detail empty py-20 text-center">
        <p className="text-neutral-500 mb-4">Project not found.</p>
        <Link to="/" className="button ghost">← Back to work</Link>
      </main>
    )
  }

  if (!project) {
    return <main className="detail empty py-20 text-center">Loading project details…</main>
  }

  return (
    <main className="detail">
      <Link to="/" className="back flex items-center gap-1 hover:underline">
        ← Back to work
      </Link>
      {project.acronym && <span className="project-tag">{project.acronym}</span>}
      <h1>{project.title}</h1>
      <p className="lead">{project.description}</p>
      
      {project.imageUrl && (
        <img className="detail-image shadow-md" src={project.imageUrl} alt={project.title} />
      )}

      <div className="detail-grid">
        <div>
          <h2>The project</h2>
          <p>{project.details || project.description}</p>
        </div>
        <div>
          <h2>Built with</h2>
          <div className="chips">
            {project.techStack?.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <div className="space-y-2 mt-4">
            {project.githubUrl && (
              <div>
                <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">
                  View source <GitBranch size={15} />
                </a>
              </div>
            )}
            {project.liveUrl && (
              <div>
                <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer">
                  View live project <ArrowUpRight size={15} />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

function Admin({ dark, setDark }: { dark: boolean; setDark: (value: boolean) => void }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'))

  if (!token) {
    return <AdminLogin onLogin={setToken} />
  }

  return (
    <AdminDashboard 
      token={token} 
      onLogout={() => { 
        localStorage.removeItem('admin_token')
        setToken(null) 
      }}
      dark={dark}
      setDark={setDark}
    />
  )
}

export default function App() {
  const [dark, setDark] = useState<boolean>(localStorage.getItem('theme') === 'dark')

  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout dark={dark} setDark={setDark}>
              <AnimatePresence mode="wait">
                <Home />
              </AnimatePresence>
            </Layout>
          } 
        />
        <Route 
          path="/projects/:slug" 
          element={
            <Layout dark={dark} setDark={setDark}>
              <AnimatePresence mode="wait">
                <ProjectDetails />
              </AnimatePresence>
            </Layout>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <div className={dark ? 'dark' : ''}>
              <Admin dark={dark} setDark={setDark} />
            </div>
          } 
        />
        <Route 
          path="/admin/*" 
          element={
            <div className={dark ? 'dark' : ''}>
              <Admin dark={dark} setDark={setDark} />
            </div>
          } 
        />
      </Routes>
    </Router>
  )
}