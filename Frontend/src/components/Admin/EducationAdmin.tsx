import { useState, type FormEvent } from 'react'
import { GraduationCap, Plus, Trash2, Edit3, Check, X } from 'lucide-react'
import type { Education } from '../../types'
import { portfolioApi } from '../../services/api'

interface EducationAdminProps {
  education: Education[]
  onRefresh: () => void
}

export function EducationAdmin({ education, onRefresh }: EducationAdminProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Education | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [saveError, setSaveError] = useState('')
  const [formData, setFormData] = useState<Partial<Education>>({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  })

  const openCreate = () => {
    setEditingItem(null)
    setFormData({ degree: '', institution: '', location: '', startDate: '', endDate: '', description: '' })
    setSaveMessage('')
    setSaveError('')
    setIsModalOpen(true)
  }

  const openEdit = (edu: Education) => {
    setEditingItem(edu)
    setFormData(edu)
    setSaveMessage('')
    setSaveError('')
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, degree: string) => {
    if (confirm(`Delete education record "${degree}"?`)) {
      await portfolioApi.deleteEducation(id)
      onRefresh()
    }
  }

  const handleTogglePublish = async (item: Education) => {
    await portfolioApi.saveEducation({ isPublished: item.isPublished === false }, item.id)
    onRefresh()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')
    setSaveError('')
    try {
      await portfolioApi.saveEducation(formData, editingItem?.id)
      setSaveMessage(editingItem ? 'Education successfully updated.' : 'Education successfully added.')
      await onRefresh()
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Could not save the education record.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="admin-workspace-page space-y-6">
      <div className="admin-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <GraduationCap className="text-[#0d5543] dark:text-[#2dd4bf]" size={24} />
            <span>Education Management</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Keep your academic background and qualifications up to date.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-[#0d5543] hover:bg-[#093c2f] text-white text-xs font-semibold flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus size={15} /> Add Education Record
        </button>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div
            key={edu.id}
            className="admin-record-card p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {edu.startDate} — {edu.endDate || 'Present'}
                </span>
                {edu.location && (
                  <span className="text-xs text-neutral-400">· {edu.location}</span>
                )}
              </div>
              <h3 className="font-semibold text-base text-neutral-900 dark:text-neutral-100">
                {edu.degree}
              </h3>
              <p className="text-xs font-medium text-[#0d5543] dark:text-[#2dd4bf]">
                {edu.institution}
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 pt-1 max-w-3xl leading-relaxed">
                {edu.description}
              </p>
            </div>

            <div className="flex items-center gap-1 self-end sm:self-start shrink-0">
              <button onClick={() => void handleTogglePublish(edu)} className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-neutral-100 text-neutral-600">
                {edu.isPublished === false ? 'Draft' : 'Published'}
              </button>
              <button
                onClick={() => openEdit(edu)}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Edit3 size={15} />
              </button>
              <button
                onClick={() => handleDelete(edu.id, edu.degree)}
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
                {editingItem ? 'Edit Education' : 'Add Education'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400">
                <X size={18} />
              </button>
            </div>
            {saveMessage && (
              <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-medium text-emerald-700">
                {saveMessage}
              </div>
            )}
            {saveError && (
              <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs font-medium text-rose-700">
                {saveError}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Degree / Field *</label>
                <input
                  required
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="B.Sc. in Software Engineering"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Institution / University *</label>
                <input
                  required
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="Adama Science and Technology University (ASTU)"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Start Year</label>
                  <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="2015"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                  />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">End Year</label>
                  <input
                    type="text"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="2019"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                  />
                </div>
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Adama, Ethiopia"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key coursework, honors, research focus..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-[#0d5543] text-white font-semibold flex items-center gap-1"
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