import { useState, type ChangeEvent, type ClipboardEvent, type FormEvent } from 'react'
import { Cpu, Plus, Trash2, Edit3, Check, X, ImagePlus } from 'lucide-react'
import type { Skill } from '../../types'
import { portfolioApi } from '../../services/api'

interface SkillsAdminProps {
  skills: Skill[]
  onRefresh: () => void
}

export function SkillsAdmin({ skills, onRefresh }: SkillsAdminProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Skill | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    category: 'Backend & APIs',
    level: 85,
    imageUrl: '',
  })

  const addSkillImage = (file: File | undefined) => {
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) {
      setFeedback({ type: 'error', message: 'Please choose a PNG, JPEG, WEBP, or GIF image.' })
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'The image must be smaller than 5 MB.' })
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const imageUrl = reader.result
      if (typeof imageUrl !== 'string') {
        setFeedback({ type: 'error', message: 'Could not read the selected image.' })
        return
      }
      setFormData((current) => ({ ...current, imageUrl }))
      setFeedback(null)
    }
    reader.onerror = () => setFeedback({ type: 'error', message: 'Could not read the selected image.' })
    reader.readAsDataURL(file)
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    addSkillImage(event.currentTarget.files?.[0])
    event.currentTarget.value = ''
  }

  const handleImagePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const image = Array.from(event.clipboardData.items)
      .find((item) => item.kind === 'file' && item.type.startsWith('image/'))
      ?.getAsFile()
    if (!image) return
    event.preventDefault()
    addSkillImage(image)
  }

  const openCreate = () => {
    setEditingItem(null)
    setFormData({ name: '', category: 'Backend & APIs', level: 85, imageUrl: '' })
    setFeedback(null)
    setIsModalOpen(true)
  }

  const openEdit = (sk: Skill) => {
    setEditingItem(sk)
    setFormData(sk)
    setFeedback(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete skill "${name}"?`)) {
      await portfolioApi.deleteSkill(id)
      onRefresh()
    }
  }

  const handleTogglePublish = async (skill: Skill) => {
    await portfolioApi.saveSkill({ isPublished: skill.isPublished === false }, skill.id)
    onRefresh()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)
    try {
      await portfolioApi.saveSkill(formData, editingItem?.id)
      setFeedback({ type: 'success', message: editingItem ? 'Skill successfully updated.' : 'Skill successfully added.' })
      await onRefresh()
    } catch (error) {
      setFeedback({ type: 'error', message: error instanceof Error ? error.message : 'Could not save the skill.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="admin-workspace-page space-y-6">
      <div className="admin-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Cpu className="text-[#0d5543] dark:text-[#2dd4bf]" size={24} />
            <span>Skills & Tech Stack</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Organize your technical strengths and proficiency levels.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-[#0d5543] hover:bg-[#093c2f] text-white text-xs font-semibold flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus size={15} /> Add New Skill
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="admin-record-card p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3"
          >
            <div className="flex items-start justify-between">
            <div className="flex min-w-0 items-center gap-3">
              {skill.imageUrl && (
                <img src={skill.imageUrl} alt="" className="h-10 w-10 shrink-0 rounded-lg border border-neutral-200 object-cover dark:border-neutral-700" />
              )}
              <div className="min-w-0">
              <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                {skill.name}
              </h3>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {skill.category}
              </span>
              </div>
            </div>
              <div className="flex items-center gap-1">
                <button onClick={() => void handleTogglePublish(skill)} className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-neutral-100 text-neutral-600">
                  {skill.isPublished === false ? 'Draft' : 'Published'}
                </button>
                <button
                  onClick={() => openEdit(skill)}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <Edit3 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(skill.id, skill.name)}
                  className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-400">Proficiency</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{skill.level}%</span>
              </div>
              <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div 
                  className="h-full bg-[#0d5543] dark:bg-[#2dd4bf] rounded-full transition-all duration-500" 
                  style={{ width: `${skill.level}%` }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {editingItem ? 'Edit Skill' : 'Add New Skill'}
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
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Skill Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="PostgreSQL & PostGIS"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Database & Spatial"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-neutral-700 dark:text-neutral-300 font-medium">Level ({formData.level}%)</label>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                  className="w-full accent-[#0d5543]"
                />
              </div>
              <div
                onPaste={handleImagePaste}
                tabIndex={0}
                aria-label="Skill image upload. Focus this area and press Ctrl+V to paste an image."
                className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/40"
              >
                <span className="block font-medium text-neutral-700 dark:text-neutral-300">Skill Image (Optional)</span>
                <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-3 py-3 text-neutral-500 hover:border-[#0d5543] dark:border-neutral-700">
                  <ImagePlus size={17} />
                  <span>{formData.imageUrl ? 'Replace image' : 'Upload image (max 5 MB)'}</span>
                  <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImageChange} className="hidden" />
                </label>
                <p className="mt-1 text-[11px] text-neutral-500">Or focus this area and press Ctrl+V to paste an image.</p>
                {formData.imageUrl && (
                  <div className="relative mt-2 w-fit">
                    <img src={formData.imageUrl} alt="Skill preview" className="h-20 w-20 rounded-xl border border-neutral-200 object-cover dark:border-neutral-700" />
                    <button
                      type="button"
                      onClick={() => setFormData((current) => ({ ...current, imageUrl: '' }))}
                      aria-label="Remove skill image"
                      className="absolute -right-2 -top-2 rounded-full bg-neutral-800 p-1 text-white hover:bg-rose-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
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
                  className="px-4 py-2 rounded-xl bg-[#0d5543] text-white font-semibold flex items-center gap-1"
                >
                  <Check size={14} /> {isSaving ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}