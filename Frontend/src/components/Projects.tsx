import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowUpRight, 
  ExternalLink, 
  FolderGit2,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import type { Project } from '../types'

interface ProjectsProps {
  projects: Project[]
  loading?: boolean
  onLoadSampleData?: () => void
}

function ProjectImageCarousel({ project }: { project: Project }) {
  const images = [...(project.imageUrls ?? [])]
  if (project.imageUrl && !images.includes(project.imageUrl)) images.unshift(project.imageUrl)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const activeIndex = images.length ? currentIndex % images.length : 0

  useEffect(() => {
    if (images.length < 2 || isPaused) return
    const interval = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % images.length)
    }, 5000)
    return () => window.clearInterval(interval)
  }, [images.length, isPaused])

  const navigate = (direction: -1 | 1) => {
    setCurrentIndex((index) => (index + direction + images.length) % images.length)
  }

  return (
    <div
      className="group/carousel relative h-full w-full overflow-hidden bg-neutral-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {images.length > 0 ? (
        <>
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={`${activeIndex}-${images[activeIndex]}`}
              src={images[activeIndex]}
              alt={`${project.title} screenshot ${activeIndex + 1}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-center"
              initial={{ opacity: 0, scale: 1.015 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
            />
          </AnimatePresence>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => navigate(-1)}
                aria-label={`Previous ${project.title} image`}
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/30 bg-black/45 p-2 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover/carousel:opacity-100 sm:group-focus-within/carousel:opacity-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => navigate(1)}
                aria-label={`Next ${project.title} image`}
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/30 bg-black/45 p-2 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover/carousel:opacity-100 sm:group-focus-within/carousel:opacity-100"
              >
                <ChevronRight size={20} />
              </button>
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur-sm">
                {images.map((image, index) => (
                  <button
                    key={`${index}-${image.slice(0, 32)}`}
                    type="button"
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Show image ${index + 1} of ${images.length} for ${project.title}`}
                    aria-current={index === activeIndex ? 'true' : undefined}
                    className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                      index === activeIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200/60 text-neutral-400">
          <FolderGit2 size={48} strokeWidth={1.2} />
        </div>
      )}
    </div>
  )
}

export function Projects({ projects, loading = false, onLoadSampleData }: ProjectsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'municipal', label: 'Municipal & Civic Systems' },
    { id: 'fintech', label: 'FinTech & SaaS' },
    { id: 'utility', label: 'Tools & Utilities' },
  ]

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory === 'all') return true

    const category = (project.category ?? '').toLowerCase()
    const title = project.title.toLowerCase()

    if (selectedCategory === 'municipal') {
      return category.includes('government') || category.includes('municipal') || title.includes('adama')
    }

    if (selectedCategory === 'fintech') {
      return category.includes('fintech') || category.includes('saas') || title.includes('expense') || title.includes('subscription')
    }

    if (selectedCategory === 'utility') {
      return category.includes('utility') || category.includes('productivity') || title.includes('calculator')
    }

    return true
  })

  return (
    <section id="projects" className="w-full py-20 sm:py-28">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-10 2xl:px-12">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Projects
          </h2>

          <div className="flex max-w-full items-center gap-1.5 overflow-x-auto self-start rounded-2xl border border-neutral-200/70 bg-neutral-100/90 p-1 sm:self-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white text-neutral-900 shadow-sm font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[28rem] rounded-3xl bg-neutral-100 border border-neutral-200" />
            ))}
          </div>
        )}

        {!loading && (
          <motion.div layout className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-7">
            <AnimatePresence>
              {filteredProjects.map((project, index) => (
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  key={project.id}
                  id={`project-card-${project.slug}`}
                  className="group relative flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-3xl border border-neutral-200/95 bg-white shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0d5543]/30 hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)]"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-neutral-100 bg-neutral-100">
                    <ProjectImageCarousel project={project} />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
                    
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        {project.acronym && (
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white/95 text-[#0d5543] backdrop-blur-md shadow-sm">
                            {project.acronym}
                          </span>
                        )}
                        {project.isFeatured && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#0d5543] text-white shadow-sm">
                            <Sparkles size={12} /> Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <div>
                    <h3 className="text-xl font-serif font-semibold leading-tight text-neutral-900 transition-colors group-hover:text-[#0d5543] 2xl:text-2xl">
                        <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                      </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-600">
                        {project.description}
                      </p>
                    </div>

                  <div className="mt-5 flex flex-col gap-4 border-t border-neutral-100/80 pt-4">
                      <div className="flex flex-wrap gap-1.5">
                      {project.techStack.slice(0, 5).map((tech) => (
                          <span key={tech} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-neutral-100/80 text-neutral-700 border border-neutral-200/50">
                            {tech}
                          </span>
                        ))}
                      {project.techStack.length > 5 && (
                        <span className="rounded-md border border-neutral-200/50 bg-neutral-100/80 px-2.5 py-1 text-[11px] font-medium text-neutral-500">
                          +{project.techStack.length - 5}
                        </span>
                      )}
                    </div>
                      <div className="flex items-center justify-between pt-1">
                        <Link to={`/projects/${project.slug}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-[#0d5543]/10 px-3 text-sm font-semibold text-[#0d5543] transition-colors hover:bg-[#0d5543]/15 hover:text-[#093c30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/50 focus-visible:ring-offset-2">
                          <span>Case Study & Details</span>
                          <ArrowUpRight size={16} />
                        </Link>
                        <div className="flex items-center gap-2">
                          {project.githubUrl && (
                            <a 
                              href={project.githubUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              aria-label="GitHub Repository"
                              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                            >
                              <svg className="w-[17px] h-[17px] fill-current" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                              </svg>
                            </a>
                          )}
                          {project.liveUrl && project.liveUrl !== '#' && (
                            <a 
                              href={project.liveUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              aria-label="External Live Link"
                              className="p-2 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors"
                            >
                              <ExternalLink size={17} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200/80 p-8">
            <p className="text-neutral-500 text-sm">No projects found in this category.</p>
            <div className="mt-3 flex items-center justify-center gap-3 flex-wrap">
              <button type="button" onClick={() => setSelectedCategory('all')} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer">
                Reset filters
              </button>
              {onLoadSampleData && (
                <button type="button" onClick={onLoadSampleData} className="px-4 py-2 bg-[#0d5543] hover:bg-[#093c30] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer">
                  Load sample data
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
