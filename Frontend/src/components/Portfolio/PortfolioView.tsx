import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Award, BriefcaseBusiness, Camera, CheckCircle2, ChevronLeft, ChevronRight, Code, Compass, GraduationCap, Layers3, LayoutTemplate, Loader2, Mail, Phone, Send, Server, Shield, X, type LucideIcon } from 'lucide-react'
import { About } from '../About'
import { Projects } from '../Projects'
import { GithubIcon } from '../icons/GithubIcon'
import { portfolioApi } from '../../services/api'
import type { Education, Experience, Portfolio, Service, Certification } from '../../types'

interface PortfolioViewProps {
  dark?: boolean
  setDark?: (value: boolean) => void
}

const serviceIcons: Record<string, LucideIcon> = {
  Layers3,
  LayoutTemplate,
  Compass,
  Code,
  Server,
  Shield,
}

function ExperienceImageSlideshow({ images, label }: { images: string[]; label: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [previewOpen, setPreviewOpen] = useState(false)

  useEffect(() => {
    if (images.length < 2 || previewOpen) return
    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length)
    }, 2400)
    return () => window.clearInterval(interval)
  }, [images.length, previewOpen])

  useEffect(() => {
    if (!previewOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [previewOpen])

  const navigate = (offset: -1 | 1) => {
    setActiveIndex((index) => (index + offset + images.length) % images.length)
  }

  return (
    <div className="group/experience relative mt-4 aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100 shadow-sm sm:aspect-[16/8] xl:aspect-[16/7]">
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={`${activeIndex}-${images[activeIndex]}`}
          src={images[activeIndex]}
          alt={`${label} image ${activeIndex + 1}`}
          loading="lazy"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
        />
      </AnimatePresence>
      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        aria-label={`View full image for ${label}`}
        className="absolute inset-0 z-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-black/45 p-2 text-white opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover/experience:opacity-100 group-focus-within/experience:opacity-100" aria-hidden="true">
        <Camera size={16} />
      </span>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={`Previous ${label} image`}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover/experience:opacity-100 sm:group-focus-within/experience:opacity-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => navigate(1)}
            aria-label={`Next ${label} image`}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/45 p-1.5 text-white backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover/experience:opacity-100 sm:group-focus-within/experience:opacity-100"
          >
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-2 py-1.5 backdrop-blur-sm">
            {images.map((image, index) => (
              <button
                key={`${index}-${image.slice(0, 24)}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show image ${index + 1} of ${images.length} for ${label}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all ${index === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/60 hover:bg-white'}`}
              />
            ))}
          </div>
        </>
      )}
      {previewOpen && createPortal(
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-950/90 p-3 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${label} image preview`}
          onClick={() => setPreviewOpen(false)}
        >
          <div className="relative flex max-h-[94vh] w-full max-w-6xl items-center justify-center" onClick={(event) => event.stopPropagation()}>
            <img
              src={images[activeIndex]}
              alt={`${label} image ${activeIndex + 1}`}
              className="max-h-[88vh] max-w-full rounded-xl object-contain shadow-2xl"
            />
            <button
              type="button"
              aria-label="Close image preview"
              onClick={() => setPreviewOpen(false)}
              className="absolute right-2 top-2 rounded-full bg-black/65 p-2 text-white transition hover:bg-black/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-0 sm:top-0 sm:-translate-y-12"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}

function Timeline({ items, type }: { items: Experience[] | Education[]; type: 'experience' | 'education' }) {
  if (items.length === 0) return <p className="text-sm text-neutral-500">No published records yet.</p>

  return (
    <div className={type === 'experience' ? 'grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 xl:gap-6' : 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'}>
      {items.map((item) => {
        const isExperience = type === 'experience'
        const experience = item as Experience
        const education = item as Education

        return (
          <article
            key={item.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_12px_24px_-18px_rgba(15,31,28,0.28)] transition-all duration-200 hover:-translate-y-1 hover:border-[#0d5543]/40 hover:shadow-[0_18px_36px_-18px_rgba(15,31,28,0.3)]"
          >
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-neutral-100 pb-3">
              <span className="rounded-full bg-[#0d5543]/8 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0d5543]">
                {isExperience ? 'Role' : 'Study'}
              </span>
              <span className="text-[11px] font-medium text-neutral-500">
                {item.startDate} - {item.endDate || (isExperience ? 'Present' : 'Completed')}
              </span>
            </div>

            <div className="flex flex-1 flex-col">
              <h3 className="text-lg font-semibold leading-snug text-neutral-900">
                {isExperience ? experience.role : education.degree}
              </h3>

              <p className="mt-2 text-sm font-medium text-[#0d5543]">
                {isExperience ? experience.company : education.institution}
              </p>

              {item.location && <p className="mt-1 text-xs text-neutral-500">{item.location}</p>}

              {item.description && (
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  {item.description}
                </p>
              )}
            </div>

            {isExperience && experience.imageUrls && experience.imageUrls.length > 0 && (
              <div className="mt-4">
                <ExperienceImageSlideshow
                  images={experience.imageUrls}
                  label={`${experience.role} at ${experience.company}`}
                />
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}

export function PortfolioView({}: PortfolioViewProps) {
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    portfolioApi.portfolio()
      .then(({ data }) => { if (active) setPortfolio(data) })
      .catch((requestError) => { if (active) setError(requestError instanceof Error ? requestError.message : 'Could not load portfolio.') })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!selectedService) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedService(null)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [selectedService])

  if (error) return <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 text-center"><p className="text-sm text-rose-600">{error}</p></main>
  if (!portfolio) return <main className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin text-[#0d5543]" aria-label="Loading portfolio" /></main>

  return (
    <main id="top" className="bg-[#fafaf9]">
      <About profile={portfolio.profile} skills={portfolio.skills} />

      <section id="experience" className="scroll-mt-24 border-t border-neutral-200/80 py-20">
        <div className="mx-auto w-full max-w-[1500px] px-3 sm:px-4 lg:px-6">
          <ExperienceHeading />
          <Timeline items={portfolio.experience} type="experience" />
        </div>
      </section>

      <section id="education" className="scroll-mt-24 border-t border-neutral-200/80 py-20">
        <div className="mx-auto w-full max-w-[1500px] px-3 sm:px-4 lg:px-6">
          <SectionTitle icon={GraduationCap} title="Education" />
          <Timeline items={portfolio.education} type="education" />
        </div>
      </section>

      <div id="projects" className="scroll-mt-24"><Projects projects={portfolio.projects} /></div>

      <section id="services" className="scroll-mt-24 border-t border-neutral-200/80 py-20">
        <div className="mx-auto w-full max-w-[1500px] px-3 sm:px-4 lg:px-6">
          <SectionTitle icon={Server} title="Services" />
          {portfolio.services.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {portfolio.services.map((service: Service, index) => {
                const ServiceIcon = serviceIcons[service.icon] ?? Layers3
                return (
                  <button
                    type="button"
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    aria-label={`Read more about ${service.title}`}
                    className="group relative flex h-full min-h-64 w-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white p-5 text-left shadow-[0_14px_34px_-24px_rgba(15,31,28,0.35)] transition-all duration-200 hover:-translate-y-1 hover:border-[#0d5543]/35 hover:shadow-[0_22px_42px_-24px_rgba(15,31,28,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/50 focus-visible:ring-offset-2 sm:p-6"
                  >
                    <span className="absolute right-5 top-5 font-mono text-xs text-neutral-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0d5543]/8 text-[#0d5543] transition-colors group-hover:bg-[#0d5543] group-hover:text-white">
                      <ServiceIcon size={22} strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold leading-snug text-neutral-900">{service.title}</h3>
                    <p className="mt-3 flex-1 line-clamp-5 text-[15px] leading-relaxed text-neutral-600">{service.description}</p>
                    <span className="mt-4 flex min-h-10 items-center justify-between border-t border-neutral-100 pt-3 text-sm font-semibold text-[#0d5543]">
                      View service details <ArrowUpRight size={16} aria-hidden="true" />
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">Services will be added soon.</p>
          )}
        </div>
      </section>

      {selectedService && createPortal(
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-neutral-950/70 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-detail-title"
          onClick={() => setSelectedService(null)}
        >
          <div className="relative my-auto w-full max-w-2xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-2xl sm:p-8" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              aria-label="Close service details"
              onClick={() => setSelectedService(null)}
              className="absolute right-4 top-4 rounded-full p-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/50"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-[#0d5543]">Service</p>
            <h2 id="service-detail-title" className="mt-2 pr-10 text-xl font-semibold leading-snug text-neutral-900 sm:text-2xl">{selectedService.title}</h2>
            <p className="mt-6 max-h-[60vh] overflow-y-auto whitespace-pre-line text-base leading-7 text-neutral-600">
              {selectedService.description}
            </p>
          </div>
        </div>,
        document.body,
      )}

      <section id="certifications" className="scroll-mt-24 border-t border-neutral-200/80 py-20">
        <div className="mx-auto w-full max-w-[1500px] px-3 sm:px-4 lg:px-6">
          <SectionTitle icon={Award} title="Certifications" />
          {portfolio.certifications.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {portfolio.certifications.map((certification: Certification) => (
              <button
                type="button"
                key={certification.id}
                onClick={() => setSelectedCertification(certification)}
                aria-label={`View certificate: ${certification.name}`}
                className="flex min-h-44 w-full flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-4 text-left shadow-[0_12px_24px_-18px_rgba(15,31,28,0.26)] transition-all duration-200 hover:-translate-y-1 hover:border-[#0d5543]/40 hover:shadow-[0_18px_36px_-18px_rgba(15,31,28,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/50 focus-visible:ring-offset-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#0d5543]/8 text-[#0d5543]">
                    {certification.imageUrl ? (
                      <img src={certification.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Award size={24} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0d5543]">
                      Credential
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-base font-semibold text-neutral-900">
                      {certification.name}
                    </h3>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-neutral-600">{certification.issuer}</p>
                  {certification.issueDate && <p className="mt-1 text-xs text-neutral-500">{certification.issueDate}</p>}
                </div>
              </button>
            ))}
          </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6 text-sm text-neutral-500">Certificates will be added soon.</p>
          )}
        </div>
      </section>

      {selectedCertification && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-neutral-950/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="certificate-preview-title"
          onClick={() => setSelectedCertification(null)}
        >
          <div className="relative my-auto max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6" onClick={(event) => event.stopPropagation()}>
            <button type="button" aria-label="Close certificate preview" onClick={() => setSelectedCertification(null)} className="absolute right-3 top-3 z-10 rounded-full bg-neutral-900/80 p-2 text-white hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]">
              <span aria-hidden="true">×</span>
            </button>
            <div className="pr-10">
              <h2 id="certificate-preview-title" className="text-xl font-semibold text-neutral-900">{selectedCertification.name}</h2>
              <p className="mt-1 text-sm text-neutral-600">{selectedCertification.issuer}{selectedCertification.issueDate ? ` · ${selectedCertification.issueDate}` : ''}</p>
            </div>
            {selectedCertification.imageUrl ? (
              <img src={selectedCertification.imageUrl} alt={`${selectedCertification.name} certificate`} className="mt-5 max-h-[68vh] w-full rounded-xl bg-neutral-100 object-contain" />
            ) : (
              <div className="mt-5 flex min-h-52 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400"><Award size={48} aria-hidden="true" /></div>
            )}
            {selectedCertification.credentialUrl && (
              <a href={selectedCertification.credentialUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#0d5543] px-4 py-2 text-sm font-semibold text-white hover:bg-[#093c2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/50 focus-visible:ring-offset-2">
                Verify credential <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      )}

      <section id="contact" className="scroll-mt-24 border-t border-neutral-200/80 py-20">
        <div className="mx-auto grid w-full max-w-[1500px] gap-10 px-3 sm:px-4 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-6">
          <div className="flex flex-col justify-center">
            <SectionTitle icon={Mail} title="Let&apos;s talk" />
            <p className="max-w-xl text-base leading-relaxed text-neutral-600">
              Have a project, a question, or an opportunity in mind? Send me a note and I&apos;ll get back to you.
            </p>
            <div className="mt-8 space-y-4">
              <a href="mailto:eskedarteesfayeketema@gmail.com" className="group flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 transition hover:border-[#0d5543]/30 hover:shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0d5543]/8 text-[#0d5543]"><Mail size={19} /></span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">Email</span>
                  <span className="mt-1 block break-all text-sm font-medium text-neutral-800">{portfolio.profile?.email || 'eskedarteesfayeketema@gmail.com'}</span>
                </span>
                <ArrowUpRight size={16} className="ml-auto shrink-0 text-neutral-400 transition group-hover:text-[#0d5543]" />
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0d5543]/8 text-[#0d5543]"><Phone size={19} /></span>
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">Phone</span>
                  <span className="mt-1 block text-sm font-medium text-neutral-800">+251 955 235 444</span>
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-[0_20px_60px_-40px_rgba(15,31,28,0.35)] sm:p-8 lg:p-10">
            <div className="mb-7">
              <h3 className="font-serif text-2xl font-semibold text-neutral-900">Send a message</h3>
              <p className="mt-2 text-sm text-neutral-500">All fields are required so I can get back to you.</p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>

      <PortfolioFooter profile={portfolio.profile} />
    </main>
  )
}

function PortfolioFooter({ profile }: { profile: Portfolio['profile'] }) {
  const name = profile?.name?.trim() || 'Eskedar'
  const email = profile?.email || 'eskedarteesfayeketema@gmail.com'
  return (
    <footer id="footer" className="border-t border-neutral-200/80 bg-[#f2f5f1]">
      <div className="mx-auto w-full max-w-[1500px] px-3 py-10 sm:px-4 sm:py-12 lg:px-6">
        <div className="grid gap-8 rounded-[28px] bg-[#0b3f33] p-6 text-white shadow-[0_16px_40px_-28px_rgba(9,60,48,0.55)] sm:p-8 md:grid-cols-[1.1fr_0.9fr] md:items-center lg:gap-10 lg:p-10">
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">Let&apos;s work together</p>
            <h2 className="mt-3 max-w-2xl font-serif text-3xl font-semibold tracking-tight sm:text-4xl">Have a project in mind?</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-emerald-50/85">
              {profile?.role || 'Full-Stack Developer'} building thoughtful, reliable digital experiences with care and precision.
            </p>
            <a
              href="#contact"
              aria-label="Let's talk about a project"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0b3f33] transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b3f33]"
            >
              Let&apos;s Talk <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="min-w-0 rounded-2xl border border-white/20 bg-white/[0.06] p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Connect with me</p>
            <nav className="mt-4 flex flex-wrap gap-3" aria-label="Social media profiles">
              <FooterLink href="https://t.me/mehaluaynegerem" label="Telegram" brand="telegram" icon={<Send size={18} aria-hidden="true" />} />
              <FooterLink href="https://www.instagram.com/esku21" label="Instagram" brand="instagram" icon={<Camera size={18} aria-hidden="true" />} />
              <FooterLink href={profile?.githubUrl || 'https://github.com/esku21'} label="GitHub" brand="github" icon={<GithubIcon size={18} />} />
              {profile?.linkedinUrl && (
                <FooterLink href={profile.linkedinUrl} label="LinkedIn" brand="linkedin" icon={<BriefcaseBusiness size={18} aria-hidden="true" />} />
              )}
            </nav>
            <div className="mt-5 space-y-3 border-t border-white/20 pt-4 text-sm text-emerald-50">
              <a href={`mailto:${email}`} className="flex min-w-0 items-center gap-3 rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <Mail size={16} className="shrink-0 text-emerald-200" aria-hidden="true" />
                <span className="break-all">{email}</span>
              </a>
              <a href="tel:+251955235444" className="flex items-center gap-3 rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <Phone size={16} className="shrink-0 text-emerald-200" aria-hidden="true" /> +251 955 235 444
              </a>
              <a href="tel:+251714905173" className="flex items-center gap-3 rounded-sm transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <Phone size={16} className="shrink-0 text-emerald-200" aria-hidden="true" /> +251 714 905 173
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-3 px-2 pt-7 text-xs text-neutral-500 sm:flex-row">
          <span>© {new Date().getFullYear()} {name}. All rights reserved.</span>
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault()
              window.scrollTo({
                top: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
              })
            }}
            className="inline-flex items-center gap-1 rounded-sm font-medium text-[#0d5543] transition-colors hover:text-[#093c30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]"
          >
            Back to top <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, label, brand, icon }: { href: string; label: string; brand: 'telegram' | 'instagram' | 'github' | 'linkedin'; icon: ReactNode }) {
  const brandStyles = {
    telegram: 'bg-[#229ed9] text-white hover:bg-[#168ac2]',
    instagram: 'bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white hover:brightness-110',
    github: 'bg-[#24292f] text-white hover:bg-[#111418]',
    linkedin: 'bg-[#0a66c2] text-white hover:bg-[#084f96]',
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b3f33] ${brandStyles[brand]}`}
    >
      {icon}
    </a>
  )
}

function SectionTitle({ icon: Icon, title }: { icon: typeof BriefcaseBusiness; title: string }) {
  return <div className="mb-8 flex items-center gap-3"><Icon className="text-[#0d5543]" size={22} /><h2 className="font-serif text-3xl text-neutral-900">{title}</h2></div>
}

function ExperienceHeading() {
  const prefersReducedMotion = useReducedMotion()
  const letters = 'Experience'.split('')

  return (
    <div className="mb-8 flex items-center gap-3">
      <BriefcaseBusiness className="text-[#0d5543]" size={22} aria-hidden="true" />
      <h2 className="font-serif text-3xl text-neutral-900" aria-label="Experience">
        {prefersReducedMotion ? (
          'Experience'
        ) : (
          <>
            <span className="sr-only">Experience</span>
            <motion.span
              className="inline-flex"
              aria-hidden="true"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.8 }}
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {letters.map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  className="inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 18 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.38, ease: 'easeOut' }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.span>
          </>
        )}
      </h2>
    </div>
  )
}

function ContactForm() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<'name' | 'email' | 'phone' | 'subject' | 'message', string>>>({})

  const validate = (data: { name: string; email: string; phone: string; subject: string; message: string }) => {
    const errors: typeof fieldErrors = {}
    const trimmedName = data.name.trim()
    if (trimmedName.length < 2 || trimmedName.length > 100 || !/^[\p{L}\p{M}]+(?:[ '\u2019.-][\p{L}\p{M}]+)*$/u.test(trimmedName)) {
      errors.name = 'Enter a valid name using letters, spaces, apostrophes, periods, or hyphens.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      errors.email = 'Enter a valid email address.'
    }

    const compactPhone = data.phone.trim().replace(/[().\s-]/g, '')
    if (!/^(?:\+|00)?\d+$/.test(compactPhone)) {
      errors.phone = 'Use digits and standard phone separators only.'
    } else {
      const digits = compactPhone.replace(/^(?:\+|00)/, '')
      const ethiopianLocal = /^0[79]\d{8}$/.test(digits)
      const ethiopianInternational = /^(?:251)?[79]\d{8}$/.test(digits) && digits.length >= 10
      const international = /^[+]|^00/.test(compactPhone) && /^[1-9]/.test(digits) && digits.length >= 7 && digits.length <= 15
      if (!ethiopianLocal && !ethiopianInternational && !international) {
        errors.phone = 'Enter an Ethiopian number (09/07 or +251) or an international number with country code.'
      }
    }

    const subject = data.subject.trim()
    if (subject.length < 2 || subject.length > 160 || !/^(?=.*\p{L})[\p{L}\p{M}\p{N} .,'’!?():&/-]+$/u.test(subject)) {
      errors.subject = 'Enter a subject with text; letters, numbers, spaces, and common punctuation are allowed.'
    }

    const message = data.message.trim()
    if (message.length < 10 || message.length > 3000) {
      errors.message = 'Your message must be between 10 and 3,000 characters.'
    }

    return errors
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const form = new FormData(event.currentTarget)
    const data = {
      name: String(form.get('name') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      phone: String(form.get('phone') ?? '').trim(),
      subject: String(form.get('subject') ?? '').trim(),
      message: String(form.get('message') ?? '').trim(),
    }

    const validationErrors = validate(data)
    setFieldErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    const formElement = event.currentTarget
    setSending(true)
    try {
      await portfolioApi.contact(data)
      setSent(true)
      formElement.reset()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not send message.')
    } finally {
      setSending(false)
    }
  }
  if (sent) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800" role="status">
        <CheckCircle2 size={21} className="mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">Message sent successfully</p>
          <p className="mt-1 text-sm text-emerald-700">Thank you for reaching out. I&apos;ll be in touch soon.</p>
        </div>
      </div>
    )
  }

  const inputClass = (field: keyof typeof fieldErrors) =>
    `w-full rounded-xl border bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:bg-white focus:ring-4 ${
      fieldErrors[field]
        ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
        : 'border-neutral-200 focus:border-[#0d5543]/50 focus:ring-[#0d5543]/10'
    }`

  const fieldError = (field: keyof typeof fieldErrors) => fieldErrors[field] && (
    <p id={`${field}-error`} className="mt-1.5 text-xs text-rose-600">{fieldErrors[field]}</p>
  )

  const clearFieldError = (field: keyof typeof fieldErrors) => {
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
  }

  return (
    <form noValidate onSubmit={submit} className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
      <label className="block text-sm font-medium text-neutral-700">
        Full name <span className="text-rose-500">*</span>
        <input
          name="name"
          required
          autoComplete="name"
          maxLength={100}
          placeholder="Your name"
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? 'name-error' : undefined}
          onChange={() => clearFieldError('name')}
          className={`${inputClass('name')} mt-2`}
        />
        {fieldError('name')}
      </label>
      <label className="block text-sm font-medium text-neutral-700">
        Email address <span className="text-rose-500">*</span>
        <input
          name="email"
          required
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="you@example.com"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'email-error' : undefined}
          onChange={() => clearFieldError('email')}
          className={`${inputClass('email')} mt-2`}
        />
        {fieldError('email')}
      </label>
      <label className="block text-sm font-medium text-neutral-700">
        Phone number <span className="text-rose-500">*</span>
        <input
          name="phone"
          required
          type="tel"
          autoComplete="tel"
          maxLength={30}
          placeholder="+251 9XX XXX XXX"
          aria-invalid={Boolean(fieldErrors.phone)}
          aria-describedby={fieldErrors.phone ? 'phone-error' : 'phone-help'}
          onChange={() => clearFieldError('phone')}
          className={`${inputClass('phone')} mt-2`}
        />
        {fieldError('phone') || <p id="phone-help" className="mt-1.5 text-xs text-neutral-400">Ethiopian and international formats supported.</p>}
      </label>
      <label className="block text-sm font-medium text-neutral-700">
        Subject <span className="text-rose-500">*</span>
        <input
          name="subject"
          required
          maxLength={160}
          placeholder="What would you like to discuss?"
          aria-invalid={Boolean(fieldErrors.subject)}
          aria-describedby={fieldErrors.subject ? 'subject-error' : undefined}
          onChange={() => clearFieldError('subject')}
          className={`${inputClass('subject')} mt-2`}
        />
        {fieldError('subject')}
      </label>
      <label className="block text-sm font-medium text-neutral-700 sm:col-span-2">
        Message <span className="text-rose-500">*</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={3000}
          rows={5}
          placeholder="Tell me a little about your project or question..."
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? 'message-error' : undefined}
          onChange={() => clearFieldError('message')}
          className={`${inputClass('message')} mt-2 resize-y`}
        />
        {fieldError('message')}
      </label>
      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:col-span-2">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d5543] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#093c30] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#0d5543]/20 disabled:cursor-wait disabled:opacity-60 sm:col-span-2"
      >
        {sending ? 'Sending message...' : 'Send message'}
        {!sending && <ArrowUpRight size={16} />}
      </button>
      <p className="text-center text-xs text-neutral-400 sm:col-span-2">Your details are only used to respond to your message.</p>
    </form>
  )
}
