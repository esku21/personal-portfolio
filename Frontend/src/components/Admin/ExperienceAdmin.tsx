import { useState, type ChangeEvent, type ClipboardEvent, type FormEvent } from 'react'
import { Building2, Plus, Trash2, Edit3, Check, X, AlertCircle, CheckCircle2, Loader2, ImagePlus } from 'lucide-react'
import type { Experience } from '../../types'
import { portfolioApi } from '../../services/api'

const MAX_EXPERIENCE_IMAGES = 10
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

interface ExperienceAdminProps {
  experience: Experience[]
  onRefresh: () => void
}

export function ExperienceAdmin({ experience, onRefresh }: ExperienceAdminProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Experience | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAddingImages, setIsAddingImages] = useState(false)
  const [actionError, setActionError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState<Partial<Experience>>({
    role: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    imageUrls: [],
  })

  const addImageFiles = async (files: File[]) => {
    if (files.length === 0) return

    const remainingSlots = MAX_EXPERIENCE_IMAGES - (formData.imageUrls?.length ?? 0)
    if (files.length > remainingSlots) {
      setActionError(`An experience entry can have up to ${MAX_EXPERIENCE_IMAGES} images.`)
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

    setActionError('')
    setIsAddingImages(true)
    try {
      const imageUrls = await Promise.all(files.map(readImageFile))
      setFormData((current) => ({
        ...current,
        imageUrls: [...(current.imageUrls ?? []), ...imageUrls],
      }))
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not read the selected images.')
    } finally {
      setIsAddingImages(false)
    }
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''
    void addImageFiles(files)
  }

  const handleImagePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const files = Array.from(event.clipboardData.items)
      .filter((item) => item.kind === 'file' && item.type.startsWith('image/'))
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null)
    if (files.length === 0) return
    event.preventDefault()
    void addImageFiles(files)
  }

  const openCreate = () => {
    setEditingItem(null)
    setFormData({ role: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '', imageUrls: [] })
    setActionError('')
    setSuccessMessage('')
    setIsModalOpen(true)
  }

  const openEdit = (exp: Experience) => {
    setEditingItem(exp)
    setFormData({ ...exp, current: exp.current ?? exp.endDate === 'Present' })
    setActionError('')
    setSuccessMessage('')
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, role: string) => {
    if (confirm(`Delete experience role "${role}"?`)) {
      await portfolioApi.deleteExperience(id)
      onRefresh()
    }
  }

  const handleTogglePublish = async (item: Experience) => {
    await portfolioApi.saveExperience({ isPublished: item.isPublished === false }, item.id)
    onRefresh()
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setActionError('')
    setSuccessMessage('')
    try {
      await portfolioApi.saveExperience(formData, editingItem?.id)
      await onRefresh()
      setSuccessMessage(editingItem ? 'Experience successfully updated.' : 'Experience successfully added.')
      window.setTimeout(() => {
        setIsModalOpen(false)
        setSuccessMessage('')
      }, 1200)
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Could not save experience.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-workspace-page space-y-6">
      <div className="admin-page-header flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Building2 className="text-[#0d5543] dark:text-[#2dd4bf]" size={24} />
            <span>Experience Management</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage your roles, work history, and supporting images.
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
            className="admin-record-card p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
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
              <button onClick={() => void handleTogglePublish(exp)} className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-neutral-100 text-neutral-600">
                {exp.isPublished === false ? 'Draft' : 'Published'}
              </button>
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
            {actionError && (
              <div role="alert" className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}
            {successMessage && (
              <div role="status" className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">
                <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
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
              <div
                onPaste={handleImagePaste}
                tabIndex={0}
                aria-label="Experience image upload. Focus this area and press Ctrl+V to paste images."
                className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="block font-medium text-neutral-700 dark:text-neutral-300">Experience Images (Optional)</span>
                    <span className="text-[11px] text-neutral-500">Up to {MAX_EXPERIENCE_IMAGES} images, 5 MB each.</span>
                  </div>
                  <span className="text-[11px] text-neutral-500">{formData.imageUrls?.length ?? 0}/{MAX_EXPERIENCE_IMAGES}</span>
                </div>
                <label className={`mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 px-3 py-3 text-xs text-neutral-500 hover:border-[#0d5543] dark:border-neutral-700 ${((formData.imageUrls?.length ?? 0) >= MAX_EXPERIENCE_IMAGES || isAddingImages) ? 'pointer-events-none opacity-50' : ''}`}>
                  <ImagePlus size={16} />
                  <span>{isAddingImages ? 'Loading images...' : 'Choose one or more images'}</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    multiple
                    disabled={(formData.imageUrls?.length ?? 0) >= MAX_EXPERIENCE_IMAGES || isAddingImages}
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
                <p className="mt-1 text-[11px] text-neutral-500">Or focus this area and press Ctrl+V to paste images.</p>
                {!!formData.imageUrls?.length && (
                  <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {formData.imageUrls.map((imageUrl, index) => (
                      <div key={`${index}-${imageUrl.slice(0, 36)}`} className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
                        <img src={imageUrl} alt={`Experience image ${index + 1}`} className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData((current) => ({
                            ...current,
                            imageUrls: (current.imageUrls ?? []).filter((_, imageIndex) => imageIndex !== index),
                          }))}
                          aria-label={`Remove experience image ${index + 1}`}
                          className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-100 hover:bg-rose-600 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting || isAddingImages}
                  className="px-4 py-2 rounded-xl text-neutral-500 hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isAddingImages || Boolean(successMessage)}
                  className="px-4 py-2 rounded-xl bg-[#0d5543] text-white font-semibold flex items-center gap-1"
                >
                  {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}