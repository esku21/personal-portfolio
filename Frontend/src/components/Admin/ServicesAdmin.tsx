import { useState, type FormEvent } from 'react'
import { Layers3, Plus, Trash2, Edit3, Check, X } from 'lucide-react'
import type { Service } from '../../types'
import { portfolioApi } from '../../services/api'

interface ServicesAdminProps {
  services: Service[]
  onRefresh: () => void
}

const iconChoices = [
  { name: 'Layers3', label: 'Layers (Systems / Architectural)' },
  { name: 'LayoutTemplate', label: 'Layout (Full-Stack / Frontend)' },
  { name: 'Compass', label: 'Compass (Database & Optimization)' },
  { name: 'Code', label: 'Code (API & Microservices)' },
  { name: 'Server', label: 'Server (Backend Infrastructure)' },
  { name: 'Shield', label: 'Shield (Security & Audit)' }
]

export function ServicesAdmin({ services, onRefresh }: ServicesAdminProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Service | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [pageFeedback, setPageFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [formData, setFormData] = useState<Partial<Service>>({
    title: '',
    description: '',
    icon: 'Layers3'
  })

  const openCreate = () => {
    setEditingItem(null)
    setFormData({ title: '', description: '', icon: 'Layers3' })
    setFeedback(null)
    setIsModalOpen(true)
  }

  const openEdit = (srv: Service) => {
    setEditingItem(srv)
    setFormData(srv)
    setFeedback(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete service "${title}"?`)) {
      try {
        await portfolioApi.deleteService(id)
        setPageFeedback({ type: 'success', message: 'Service successfully deleted.' })
        await onRefresh()
      } catch (error) {
        setPageFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Could not delete the service.' })
      }
    }
  }

  const handleTogglePublish = async (service: Service) => {
    await portfolioApi.saveService({ isPublished: service.isPublished === false }, service.id)
    onRefresh()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)
    setPageFeedback(null)
    try {
      await portfolioApi.saveService(formData, editingItem?.id)
      setFeedback({ type: 'success', message: editingItem ? 'Service successfully updated.' : 'Service successfully added.' })
      await onRefresh()
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Could not save the service.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="admin-workspace-page space-y-6">
      <div className="admin-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Layers3 className="text-[#0d5543] dark:text-[#2dd4bf]" size={24} />
            <span>Services Management</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Shape the services visitors see in your portfolio.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-[#0d5543] hover:bg-[#093c2f] text-white text-xs font-semibold flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus size={15} /> Add Service
        </button>
      </div>

      {pageFeedback && (
        <div
          role="alert"
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${pageFeedback.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-rose-200 bg-rose-50 text-rose-700'}`}
        >
          {pageFeedback.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service, index) => (
          <div
            key={service.id}
            className="admin-record-card p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs text-[#0d5543] dark:text-[#2dd4bf] font-semibold bg-[#0d5543]/10 dark:bg-[#2dd4bf]/10 px-2 py-0.5 rounded">
                  0{index + 1} · {service.icon}
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => void handleTogglePublish(service)} className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-neutral-100 text-neutral-600">
                    {service.isPublished === false ? 'Draft' : 'Published'}
                  </button>
                  <button
                    onClick={() => openEdit(service)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id, service.title)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100 mb-2">
                {service.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {editingItem ? 'Edit Service' : 'Add Service'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400">
                <X size={18} />
              </button>
            </div>
            {feedback && (
              <div
                role="alert"
                className={`mb-4 rounded-xl border px-3 py-2.5 text-xs font-medium ${feedback.type === 'success'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-rose-200 bg-rose-50 text-rose-700'}`}
              >
                {feedback.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Service Title *</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Municipal & Civic Software Engineering"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Icon Symbol</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                >
                  {iconChoices.map(c => (
                    <option key={c.name} value={c.name}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive delivery of secure web applications..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-[#0d5543] text-white font-semibold flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Check size={14} /> {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}