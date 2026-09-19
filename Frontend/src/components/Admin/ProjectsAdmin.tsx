import { useState, type FormEvent } from 'react'
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  GitBranch, 
  Check, 
  X, 
  Star, 
  SlidersHorizontal,
  FolderGit2
} from 'lucide-react'
import type { Project } from '../../types'
import { portfolioApi } from '../../services/api'

interface ProjectsAdminProps {
  projects: Project[]
  onRefresh: () => void
}

export function ProjectsAdmin({ projects, onRefresh }: ProjectsAdminProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(false)
  const [techInput, setTechInput] = useState('')

  // Form State
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    acronym: '',
    category: 'Municipal & Civic Systems',
    description: '',
    details: '',
    techStack: ['TypeScript', 'PostgreSQL', 'React'],
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    isPublished: true,
    isFeatured: false
  })

  const openCreateModal = () => {
    setEditingProject(null)
    setFormData({
      title: '',
      slug: '',
      acronym: '',
      category: 'Municipal & Civic Systems',
      description: '',
      details: '',
      techStack: ['TypeScript', 'PostgreSQL', 'React'],
      githubUrl: '',
      liveUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      isPublished: true,
      isFeatured: false
    })
    setTechInput('')
    setIsModalOpen(true)
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setFormData({
      ...project,
      techStack: project.techStack || []
    })
    setTechInput((project.techStack || []).join(', '))
    setIsModalOpen(true)
  }

  const handleTogglePublish = async (project: Project) => {
    await portfolioApi.saveProject({ isPublished: !project.isPublished }, project.id)
    onRefresh()
  }

  const handleToggleFeatured = async (project: Project) => {
    await portfolioApi.saveProject({ isFeatured: !project.isFeatured }, project.id)
    onRefresh()
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await portfolioApi.deleteProject(id)
      onRefresh()
    }
  }

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const parsedTech = techInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    const payload = {
      ...formData,
      techStack: parsedTech.length > 0 ? parsedTech : formData.techStack,
      slug: formData.slug || formData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`
    }

    try {
      await portfolioApi.saveProject(payload, editingProject?.id)
      setIsModalOpen(false)
      onRefresh()
    } catch (err) {
      alert('Error saving project. Please check fields.')
    } finally {
      setLoading(false)
    }
  }

  const filtered = projects.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.acronym && p.acronym.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = 
      categoryFilter === 'all' || 
      (p.category && p.category.toLowerCase().includes(categoryFilter.toLowerCase()))

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <FolderGit2 className="text-[#0d5543] dark:text-[#2dd4bf]" size={24} />
            <span>Projects Management</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            PostgreSQL "Project" table records (14 schema fields)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-[#0d5543] hover:bg-[#093c2f] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-sm self-start sm:self-auto"
        >
          <Plus size={15} /> Add New Project
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search projects by title, acronym, tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0d5543]/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal size={14} className="text-neutral-400 hidden sm:inline" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="municipal">Municipal & Civic Systems</option>
            <option value="fintech">FinTech & SaaS</option>
            <option value="tools">Tools & Utilities</option>
          </select>
        </div>
      </div>

      {/* Projects Table / Card List */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600 dark:text-neutral-300">
            <thead className="bg-neutral-50 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Project Info</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Tech Stack</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Featured</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map((project) => (
                <tr key={project.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors">
                  <td className="px-5 py-4 max-w-xs">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                      {project.title}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-neutral-500">
                      {project.acronym && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                          {project.acronym}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-neutral-400 truncate">
                        /{project.slug}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {project.category || 'General'}
                    </span>
                  </td>

                  <td className="px-4 py-4 max-w-[200px]">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack?.slice(0, 3).map((tech) => (
                        <span key={tech} className="px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {tech}
                        </span>
                      ))}
                      {(project.techStack?.length || 0) > 3 && (
                        <span className="text-[10px] text-neutral-400 self-center">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleTogglePublish(project)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                        project.isPublished !== false
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {project.isPublished !== false ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        project.isFeatured
                          ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/30'
                          : 'text-neutral-400 hover:text-neutral-600'
                      }`}
                      title={project.isFeatured ? 'Featured on home' : 'Set featured'}
                    >
                      <Star size={15} fill={project.isFeatured ? 'currentColor' : 'none'} />
                    </button>
                  </td>

                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="View Live"
                        >
                          <ExternalLink size={15} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="View Repository"
                        >
                          <GitBranch size={15} />
                        </a>
                      )}
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        title="Edit Project"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        title="Delete Project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-neutral-400 text-xs">
                    No projects found matching current criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-8">
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h3>
                <p className="text-xs text-neutral-500">
                  Saves directly into PostgreSQL "Project" table columns
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Adama Municipal Land System"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-[#0d5543]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Acronym
                  </label>
                  <input
                    type="text"
                    value={formData.acronym}
                    onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                    placeholder="ADAMA-LMIS"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-[#0d5543]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="adama-municipal-land-management"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                  >
                    <option value="Municipal & Civic Systems">Municipal & Civic Systems</option>
                    <option value="FinTech & SaaS">FinTech & SaaS</option>
                    <option value="Tools & Utilities">Tools & Utilities</option>
                    <option value="Enterprise Architecture">Enterprise Architecture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Brief Description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive digital cadastre and property registration platform..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-[#0d5543]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Detailed Case Study / Architectural Overview
                </label>
                <textarea
                  rows={3}
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  placeholder="Architectural breakdown, spatial indexing with PostGIS, transaction concurrency..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Tech Stack (comma-separated text[])
                </label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="PostgreSQL, TypeScript, React 19, Docker, Node.js"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://adama.gov.et/demo"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/example/project"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded border-neutral-300 text-[#0d5543] focus:ring-[#0d5543]"
                  />
                  <span>isPublished (Visible on frontend)</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-neutral-300 text-[#0d5543] focus:ring-[#0d5543]"
                  />
                  <span>isFeatured (Showcase banner)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-[#0d5543] hover:bg-[#093c2f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Check size={14} /> {editingProject ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}