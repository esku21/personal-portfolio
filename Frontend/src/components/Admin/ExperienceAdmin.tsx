import { useState, type FormEvent } from 'react'
import { Building2, Plus, Trash2, Edit3, Check, X } from 'lucide-react'
import type { Experience } from '../../types'
import { portfolioApi } from '../../services/api'

interface ExperienceAdminProps {
  experience: Experience[]
  onRefresh: () => void
}

export function ExperienceAdmin({ experience, onRefresh }: ExperienceAdminProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Experience | null>(null)
  const [formData, setFormData] = useState<Partial<Experience>>({
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  })

  const openCreate = () => {
    setEditingItem(null)
    setFormData({ role: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' })
    setIsModalOpen(true)
  }

  const openEdit = (exp: Experience) => {
    setEditingItem(exp)
    setFormData(exp)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, role: string) => {
    if (confirm(`Delete experience role "${role}"?`)) {
      await portfolioApi.deleteExperience(id)
      onRefresh()
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await portfolioApi.saveExperience(formData, editingItem?.id)
    setIsModalOpen(false)
    onRefresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Building2 className="text-[#0d5543] dark:text-[#2dd4bf]" size={24} />
            <span>Experience Management</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            PostgreSQL "Experience" table records
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-[#0d5543] hover:bg-[#093c2f] text-white text-xs font-semibold flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus size={15} /> Add Work Experience
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {exp.startDate} — {exp.endDate || (exp.current ? 'Present' : 'Completed')}
                </span>
                {exp.current && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                    Current Position
                  </span>
                )}
                {exp.location && (
                  <span className="text-xs text-neutral-400">· {exp.location}</span>
                )}
              </div>
              <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100">
                {exp.role}
              </h3>
              <p className="text-xs font-medium text-[#0d5543] dark:text-[#2dd4bf]">
                {exp.company}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 pt-1 max-w-3xl leading-relaxed">
                {exp.description}
              </p>
            </div>

            <div className="flex items-center gap-1 self-end sm:self-start shrink-0">
              <button
                onClick={() => openEdit(exp)}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Edit3 size={15} />
              </button>
              <button
                onClick={() => handleDelete(exp.id, exp.role)}
                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {editingItem ? 'Edit Experience' : 'Add Experience'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Role / Title *</label>
                <input
                  required
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Senior Systems Engineer"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Company / Organization *</label>
                <input
                  required
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Civic Software Infrastructure Group"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Start Date</label>
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="2022-01"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">End Date</label>
                  <input
                    type="text"
                    value={formData.endDate || ''}
                    disabled={formData.current}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="Present"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 disabled:opacity-50"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked, endDate: e.target.checked ? 'Present' : '' })}
                    className="rounded border-neutral-300 text-[#0d5543]"
                  />
                  <span className="text-neutral-700 dark:text-neutral-300 font-medium">Currently working here</span>
                </label>
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Adama / Remote"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key accomplishments, technologies handled, architecture delivered..."
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
                  className="px-4 py-2 rounded-xl bg-[#0d5543] text-white font-semibold flex items-center gap-1"
                >
                  <Check size={14} /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}