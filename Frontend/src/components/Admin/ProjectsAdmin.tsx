import { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Star,
  X,
  Code2,
  FolderKanban,
  Check,
  AlertCircle,
  ImagePlus
} from 'lucide-react'
import { GithubIcon } from '../icons/GithubIcon'
import type { Project } from '../../types'
import { portfolioApi } from '../../services/api'

export interface ProjectsAdminProps {
  projects: Project[]
  onRefresh: () => void | Promise<void>
}

interface ProjectFormData {
  title: string
  slug: string
  acronym: string
  category: string
  description: string
  details: string
  techStack: string[]
  githubUrl: string
  liveUrl: string
  imageUrls: string[]
  isPublished: boolean
  isFeatured: boolean
}

const MAX_PROJECT_IMAGES = 10
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error(`Could not read ${file.name}.`))
    }
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`))
    reader.readAsDataURL(file)
  })
}

const DEFAULT_CATEGORIES = [
  'Municipal & Civic Systems',
  'Enterprise Web Apps',
  'Geospatial & GIS Solutions',
  'Full-Stack Web',
  'AI & Machine Learning',
  'Developer Tooling',
]

const POPULAR_TECHS = [
  'TypeScript',
  'React',
  'Node.js',
  'Express',
  'Next.js',
  'PostgreSQL',
  'PostGIS',
  'Prisma',
  'Docker',
  'Tailwind CSS',
  'GraphQL',
  'Redis',
  'Leaflet',
  'AWS',
]

export function ProjectsAdmin({ projects = [], onRefresh }: ProjectsAdminProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [techInput, setTechInput] = useState('')
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [isAddingImages, setIsAddingImages] = useState(false)

  // Form state
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    slug: '',
    acronym: '',
    category: 'Municipal & Civic Systems',
    description: '',
    details: '',
    techStack: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    githubUrl: '',
    liveUrl: '',
    imageUrls: [],
    isPublished: true,
    isFeatured: false,
  })

  // Open modal for new project
  const handleOpenCreateModal = () => {
    setEditingProject(null)
    setFormData({
      title: '',
      slug: '',
      acronym: '',
      category: 'Municipal & Civic Systems',
      description: '',
      details: '',
      techStack: ['TypeScript', 'React', 'Node.js'],
      githubUrl: '',
      liveUrl: '',
      imageUrls: [],
      isPublished: true,
      isFeatured: false,
    })
    setTechInput('')
    setImageUrlInput('')
    setActionError(null)
    setIsModalOpen(true)
  }

  // Open modal for editing existing project
  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title || '',
      slug: project.slug || '',
      acronym: project.acronym || '',
      category: project.category || 'Municipal & Civic Systems',
      description: project.description || '',
      details: project.details || '',
      techStack: Array.isArray(project.techStack) ? [...project.techStack] : [],
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      imageUrls: Array.from(new Set([
        ...(Array.isArray(project.imageUrls) ? project.imageUrls : []),
        ...(project.imageUrl ? [project.imageUrl] : []),
      ])),
      isPublished: Boolean(project.isPublished),
      isFeatured: Boolean(project.isFeatured),
    })
    setTechInput('')
    setImageUrlInput('')
    setActionError(null)
    setIsModalOpen(true)
  }

  const addImageFiles = async (files: File[]) => {
    if (files.length === 0) return

    const remainingSlots = MAX_PROJECT_IMAGES - formData.imageUrls.length
    if (files.length > remainingSlots) {
      setActionError(`A project can have up to ${MAX_PROJECT_IMAGES} images.`)
      return
    }
    const invalidFile = files.find((file) => !ALLOWED_IMAGE_TYPES.includes(file.type))
    if (invalidFile) {
      setActionError(`${invalidFile.name} is not a supported image. Use PNG, JPEG, WEBP, or GIF.`)
      return
    }
    const oversizedFile = files.find((file) => file.size > MAX_IMAGE_SIZE)
    if (oversizedFile) {
      setActionError(`${oversizedFile.name} exceeds the 5 MB image size limit.`)
      return
    }

    setActionError(null)
    setIsAddingImages(true)
    try {
      const imageUrls = await Promise.all(files.map(readImageFile))
      setFormData((current) => ({ ...current, imageUrls: [...current.imageUrls, ...imageUrls] }))
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not read the selected images.')
    } finally {
      setIsAddingImages(false)
    }
  }

  const handleAddImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''
    void addImageFiles(files)
  }

  const handlePasteImages = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const files = Array.from(event.clipboardData.items)
      .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null)
    if (files.length === 0) return

    event.preventDefault()
    void addImageFiles(files)
  }

  const handleAddImageUrl = () => {
    const imageUrl = imageUrlInput.trim()
    if (!imageUrl) return
    try {
      const parsedUrl = new URL(imageUrl)
      if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
        throw new Error()
      }
    } catch {
      setActionError('Enter a valid HTTP or HTTPS image URL.')
      return
    }
    if (formData.imageUrls.length >= MAX_PROJECT_IMAGES) {
      setActionError(`A project can have up to ${MAX_PROJECT_IMAGES} images.`)
      return
    }
    setFormData((current) => ({ ...current, imageUrls: [...current.imageUrls, imageUrl] }))
    setImageUrlInput('')
    setActionError(null)
  }

  // Auto-slug generator on title change
  const handleTitleChange = (val: string) => {
    const isAutoSlug =
      !formData.slug ||
      formData.slug ===
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: isAutoSlug
        ? val
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : prev.slug,
    }))
  }

  // Handle tech stack tag addition
  const handleAddTech = (tech: string) => {
    const trimmed = tech.trim()
    if (!trimmed) return
    if (!formData.techStack.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, trimmed],
      }))
    }
    setTechInput('')
  }

  const handleRemoveTech = (techToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== techToRemove),
    }))
  }

  // Save project (Create or Update)
  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      setActionError('Project title is required.')
      return
    }

    setIsSubmitting(true)
    setActionError(null)

    try {
      const generatedSlug =
        formData.slug.trim() ||
        formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

      const payload: Partial<Project> = {
        title: formData.title.trim(),
        slug: generatedSlug,
        acronym: formData.acronym.trim() || undefined,
        category: formData.category.trim() || 'Municipal & Civic Systems',
        description: formData.description.trim(),
        details: formData.details.trim() || undefined,
        techStack: formData.techStack,
        githubUrl: formData.githubUrl.trim() || undefined,
        liveUrl: formData.liveUrl.trim() || undefined,
        imageUrl: formData.imageUrls[0] ?? null,
        imageUrls: formData.imageUrls,
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured,
      }

      await portfolioApi.saveProject(payload, editingProject?.id)
      setIsModalOpen(false)
      await onRefresh()
    } catch (err: any) {
      setActionError(err.message || 'Error saving project')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Quick toggle publish status
  const handleTogglePublish = async (project: Project) => {
    try {
      await portfolioApi.saveProject(
        { isPublished: !project.isPublished },
        project.id
      )
      await onRefresh()
    } catch (err: any) {
      alert(`Could not toggle publication: ${err.message}`)
    }
  }

  // Quick toggle featured status
  const handleToggleFeatured = async (project: Project) => {
    try {
      await portfolioApi.saveProject(
        { isFeatured: !project.isFeatured },
        project.id
      )
      await onRefresh()
    } catch (err: any) {
      alert(`Could not toggle featured: ${err.message}`)
    }
  }

  // Delete project
  const handleDeleteProject = async (id: string) => {
    try {
      await portfolioApi.deleteProject(id)
      setDeleteConfirmId(null)
      await onRefresh()
    } catch (err: any) {
      alert(`Could not delete project: ${err.message}`)
    }
  }

  // Extract unique categories for filter
  const categoriesList = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    DEFAULT_CATEGORIES.forEach((c) => set.add(c))
    return Array.from(set)
  }, [projects])

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search
      const query = search.toLowerCase()
      const matchesSearch =
        !query ||
        project.title?.toLowerCase().includes(query) ||
        project.acronym?.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query) ||
        project.techStack?.some((t) => t.toLowerCase().includes(query))

      // Category
      const matchesCategory =
        selectedCategory === 'all' || project.category === selectedCategory

      // Status
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && project.isPublished) ||
        (statusFilter === 'draft' && !project.isPublished)

      // Featured
      const matchesFeatured = !featuredOnly || project.isFeatured

      return matchesSearch && matchesCategory && matchesStatus && matchesFeatured
    })
  }, [projects, search, selectedCategory, statusFilter, featuredOnly])

  return (
    <div className="admin-workspace-page space-y-6">
      {/* Top Banner & Action */}
      <div className="admin-page-header flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <FolderKanban size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Projects Management
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Organize, publish, and showcase your portfolio work.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-xs transition-all hover:shadow-sm active:scale-95"
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="md:col-span-5 relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, acronym, tech stack, or description..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-900 dark:text-neutral-100 transition"
            >
              <option value="all">All Categories ({categoriesList.length})</option>
              {categoriesList.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-900 dark:text-neutral-100 transition"
            >
              <option value="all">Status: All</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>

          {/* Featured Toggle Button */}
          <div className="md:col-span-2 flex items-center">
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
                featuredOnly
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400'
                  : 'bg-neutral-50 dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Star
                size={13}
                className={featuredOnly ? 'fill-amber-500 text-amber-500' : ''}
              />
              <span>Featured Only</span>
            </button>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {(search || selectedCategory !== 'all' || statusFilter !== 'all' || featuredOnly) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500">
            <span>Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                "{search}"
                <button onClick={() => setSearch('')}>
                  <X size={10} />
                </button>
              </span>
            )}
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')}>
                  <X size={10} />
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')}>
                  <X size={10} />
                </button>
              </span>
            )}
            {featuredOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
                Featured
                <button onClick={() => setFeaturedOnly(false)}>
                  <X size={10} />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch('')
                setSelectedCategory('all')
                setStatusFilter('all')
                setFeaturedOnly(false)
              }}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline ml-auto"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto mb-3">
            <FolderKanban size={24} />
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
            No projects found
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-4">
            {search || selectedCategory !== 'all' || statusFilter !== 'all' || featuredOnly
              ? 'Try adjusting your search criteria or active filters.'
              : 'Get started by creating your first showcase project in the database.'}
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shadow-xs transition"
          >
            <Plus size={14} />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header of Project Card */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {project.imageUrls?.[0] || project.imageUrl ? (
                      <img
                        src={project.imageUrls?.[0] || project.imageUrl || undefined}
                        alt={project.title}
                        className="w-12 h-12 rounded-xl object-cover border border-neutral-200 dark:border-neutral-700 shrink-0"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                        {project.acronym || project.title.substring(0, 3).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                          {project.title}
                        </h3>
                        {project.acronym && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            {project.acronym}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  {/* Status & Featured badges */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className={`p-1.5 rounded-lg border transition ${
                        project.isFeatured
                          ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-500'
                          : 'bg-neutral-50 dark:bg-neutral-800/80 border-neutral-200 dark:border-neutral-700 text-neutral-300 hover:text-amber-400'
                      }`}
                      title={project.isFeatured ? 'Featured on home' : 'Click to feature on home'}
                    >
                      <Star
                        size={14}
                        className={project.isFeatured ? 'fill-amber-500' : ''}
                      />
                    </button>

                    <button
                      onClick={() => handleTogglePublish(project)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border transition ${
                        project.isPublished
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                          : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400'
                      }`}
                      title="Click to toggle publish status"
                    >
                      {project.isPublished ? (
                        <>
                          <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={12} className="text-neutral-400" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed">
                  {project.description || 'No description provided.'}
                </p>

                {/* Tech Stack Chips */}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.slice(0, 6).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 6 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                        +{project.techStack.length - 6} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-neutral-100 dark:border-neutral-800/80">
                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                      title="View live deployment"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                      title="View GitHub repository"
                    >
                      <GithubIcon size={14} />
                    </a>
                  )}
                  <span className="text-[10px] text-neutral-400 font-mono">
                    /{project.slug}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEditModal(project)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="Delete project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full max-w-2xl my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  <Code2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {editingProject ? 'Edit Project' : 'Create New Project'}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Matches backend saveProject controller specification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Error Message */}
            {actionError && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSubmitProject} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Row 1: Title & Acronym */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Project Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. City Civil Registration & Vital Statistics"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Acronym / Code
                  </label>
                  <input
                    type="text"
                    value={formData.acronym}
                    onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                    placeholder="e.g. CRVS, GIS"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              {/* Row 2: Category & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Category
                  </label>
                  <input
                    type="text"
                    list="categories-list"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Municipal & Civic Systems"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-900 dark:text-neutral-100"
                  />
                  <datalist id="categories-list">
                    {DEFAULT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. city-civil-registration"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-900 dark:text-neutral-100 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of what the project solves, its core impact, and target audience..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-900 dark:text-neutral-100 resize-none"
                />
              </div>

              {/* Full Details / Architecture */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Architecture & Implementation Details (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Architectural design, scalability benchmarks, integration touchpoints, and technical challenges overcome..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-900 dark:text-neutral-100 resize-none"
                />
              </div>

              {/* Tech Stack Management */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Tech Stack (Tags)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddTech(techInput)
                      }
                    }}
                    placeholder="Type a technology (e.g. React, PostgreSQL) and press Add"
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-900 dark:text-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTech(techInput)}
                    className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition"
                  >
                    Add Tag
                  </button>
                </div>

                {/* Popular suggestions */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-neutral-400">Suggestions:</span>
                  {POPULAR_TECHS.map((tech) => {
                    const isAdded = formData.techStack.includes(tech)
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => (isAdded ? handleRemoveTech(tech) : handleAddTech(tech))}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                          isAdded
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                        }`}
                      >
                        {isAdded ? `✓ ${tech}` : `+ ${tech}`}
                      </button>
                    )
                  })}
                </div>

                {/* Selected tags */}
                {formData.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60">
                    {formData.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 shadow-2xs"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(tech)}
                          className="text-neutral-400 hover:text-rose-500 ml-0.5"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* URLs: GitHub, Live, Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    GitHub URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/username/project"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Live Demo / Site URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://demo.example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              {/* Project images */}
              <div
                className="space-y-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                onPaste={handlePasteImages}
                tabIndex={0}
                aria-label="Project image uploads. Focus this section and paste an image from the clipboard."
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      Project Images
                    </label>
                    <p className="mt-0.5 text-[11px] text-neutral-500">
                      Up to {MAX_PROJECT_IMAGES} images, 5 MB each. PNG, JPEG, WEBP, or GIF. Focus this area and press Ctrl+V to paste an image.
                    </p>
                  </div>
                  <span className="shrink-0 text-[11px] font-medium text-neutral-500">
                    {formData.imageUrls.length}/{MAX_PROJECT_IMAGES}
                  </span>
                </div>

                <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 px-4 py-3 text-xs font-medium text-neutral-600 transition hover:border-emerald-500 hover:text-emerald-700 dark:border-neutral-700 dark:text-neutral-300 dark:hover:text-emerald-400 ${formData.imageUrls.length >= MAX_PROJECT_IMAGES || isAddingImages ? 'pointer-events-none opacity-50' : ''}`}>
                  <ImagePlus size={16} />
                  <span>{isAddingImages ? 'Loading images...' : 'Choose one or more images'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    multiple
                    disabled={formData.imageUrls.length >= MAX_PROJECT_IMAGES || isAddingImages}
                    onChange={handleAddImages}
                    className="sr-only"
                  />
                </label>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(event) => setImageUrlInput(event.target.value)}
                    placeholder="Or add an image URL"
                    className="min-w-0 flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                    disabled={formData.imageUrls.length >= MAX_PROJECT_IMAGES || isAddingImages}
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    disabled={formData.imageUrls.length >= MAX_PROJECT_IMAGES || isAddingImages}
                    className="rounded-xl bg-neutral-100 px-3 py-2 text-xs font-medium text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                  >
                    Add URL
                  </button>
                </div>

                {formData.imageUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {formData.imageUrls.map((imageUrl, index) => (
                      <div key={`${index}-${imageUrl.slice(0, 40)}`} className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
                        <img
                          src={imageUrl}
                          alt={`Project image ${index + 1}`}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.alt = 'Image preview unavailable'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((current) => ({
                            ...current,
                            imageUrls: current.imageUrls.filter((_, imageIndex) => imageIndex !== index),
                          }))}
                          aria-label={`Remove image ${index + 1}`}
                          className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-100 transition hover:bg-rose-600 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Switches: isPublished & isFeatured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">
                      Published Status
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Visible on public showcase website
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
                  <div>
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block">
                      Featured Project
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Highlighted on home portfolio banner
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                  />
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isAddingImages}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 max-w-sm w-full p-6 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 size={22} />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Delete Project?
              </h3>
              <p className="text-xs text-neutral-500">
                This will remove the project from the database. This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition border border-neutral-200 dark:border-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectsAdmin