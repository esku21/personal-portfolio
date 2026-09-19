import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowUpRight, 
  ExternalLink, 
  FolderGit2,
  Sparkles
} from 'lucide-react'
import type { Project } from '../types'
import { SectionHeading } from './SectionHeading'

interface ProjectsProps {
  projects: Project[]
  loading?: boolean
}

export function Projects({ projects, loading = false }: ProjectsProps) {
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
    <section id="work" className="w-full py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <SectionHeading 
              number="02" 
              title="Selected Work" 
              note="Enterprise systems & digital products shipped with purpose." 
            />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-neutral-900 tracking-tight mt-2">
              Featured Engineering Projects.
            </h2>
            <p className="mt-3 text-neutral-600 max-w-2xl text-base sm:text-lg leading-relaxed">
              Real-world administrative software, municipal asset management, financial analytics, and interactive productivity tools designed for speed, scale, and clarity.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-neutral-100/90 rounded-2xl border border-neutral-200/70 overflow-x-auto self-start md:self-auto max-w-full">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-neutral-100 border border-neutral-200" />
            ))}
          </div>
        )}

        {!loading && (
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
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
                  className="group relative flex flex-col bg-white rounded-3xl border border-neutral-200/95 overflow-hidden shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.08)] hover:border-[#0d5543]/30 transition-all duration-300"
                >
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100 border-b border-neutral-100">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200/60 text-neutral-400">
                        <FolderGit2 size={48} strokeWidth={1.2} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
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

                  <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-serif font-semibold text-neutral-900 group-hover:text-[#0d5543] transition-colors leading-tight">
                        <Link to={`/projects/${project.slug}`}>{project.title}</Link>
                      </h3>
                      <p className="text-sm text-neutral-600 leading-relaxed mt-2 line-clamp-3">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-neutral-100/80 flex flex-col gap-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.map((tech) => (
                          <span key={tech} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-neutral-100/80 text-neutral-700 border border-neutral-200/50">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <Link to={`/projects/${project.slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0d5543] hover:text-[#093c30] transition-colors">
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
            <button type="button" onClick={() => setSelectedCategory('all')} className="mt-3 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer">
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  )
}