import { useState, type ChangeEvent, type ClipboardEvent, type FormEvent } from 'react'
import { Award, Check, Edit3, ExternalLink, ImagePlus, Plus, Trash2, X } from 'lucide-react'
import type { Certification } from '../../types'
import { portfolioApi } from '../../services/api'

interface CertificationsAdminProps {
  certifications: Certification[]
  onRefresh: () => void | Promise<void>
}

interface CertificationFormData {
  name: string
  issuer: string
  issueDate: string
  credentialUrl: string
  imageUrl: string
}

const emptyForm: CertificationFormData = { name: '', issuer: '', issueDate: '', credentialUrl: '', imageUrl: '' }

export function CertificationsAdmin({ certifications, onRefresh }: CertificationsAdminProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [formData, setFormData] = useState<CertificationFormData>({ ...emptyForm })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message })
    window.setTimeout(() => setNotice(null), 3500)
  }

  const openCreate = () => {
    setEditingCert(null)
    setFormData({ ...emptyForm })
    setNotice(null)
    setIsModalOpen(true)
  }

  const openEdit = (cert: Certification) => {
    setEditingCert(cert)
    setFormData({
      name: cert.name || '',
      issuer: cert.issuer || '',
      issueDate: cert.issueDate || '',
      credentialUrl: cert.credentialUrl || '',
      imageUrl: cert.imageUrl || '',
    })
    setNotice(null)
    setIsModalOpen(true)
  }

  const addCertificateImage = (file: File | undefined) => {
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)) {
      showNotice('error', 'Please choose a PNG, JPEG, WEBP, or GIF image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showNotice('error', 'The image must be smaller than 5 MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setFormData((current) => ({ ...current, imageUrl: String(reader.result) }))
    reader.onerror = () => showNotice('error', 'Could not read the selected image.')
    reader.readAsDataURL(file)
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    addCertificateImage(event.currentTarget.files?.[0])
    event.currentTarget.value = ''
  }

  const handleImagePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    const image = Array.from(event.clipboardData.items)
      .find((item) => item.kind === 'file' && item.type.startsWith('image/'))
      ?.getAsFile()
    if (!image) return

    event.preventDefault()
    addCertificateImage(image)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete certification "${name}"?`)) return
    try {
      await portfolioApi.deleteCertification(id)
      await onRefresh()
      showNotice('success', 'Certification deleted successfully.')
    } catch (error) {
      showNotice('error', error instanceof Error ? error.message : 'Could not delete certification.')
    }
  }

  const handleTogglePublish = async (certification: Certification) => {
    await portfolioApi.saveCertification({ isPublished: certification.isPublished === false }, certification.id)
    onRefresh()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await portfolioApi.saveCertification({
        name: formData.name.trim(),
        issuer: formData.issuer.trim(),
        issueDate: formData.issueDate.trim(),
        credentialUrl: formData.credentialUrl.trim(),
        imageUrl: formData.imageUrl,
      }, editingCert?.id)
      setIsModalOpen(false)
      await onRefresh()
      showNotice('success', editingCert ? 'Certification updated successfully.' : 'Certification added successfully.')
    } catch (error) {
      showNotice('error', error instanceof Error ? error.message : 'Could not save certification.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="admin-workspace-page space-y-6">
      {notice && <div role="alert" className={`fixed right-5 top-5 z-[60] rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${notice.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>{notice.message}</div>}
      <div className="admin-page-header flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-neutral-900 dark:text-neutral-100"><Award className="text-amber-500" size={24} /><span>Certifications Management</span></h1>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">Manage your credentials and verification links.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 self-start rounded-xl bg-[#0d5543] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#093c2f] sm:self-auto"><Plus size={15} /> Add Certification</button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <div key={cert.id} className="admin-record-card flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
            {cert.imageUrl && <img src={cert.imageUrl} alt={cert.name} className="mb-4 h-36 w-full rounded-xl object-cover" />}
            <div>
              <div className="mb-2 flex items-start justify-between gap-2"><span className="rounded bg-neutral-100 px-2 py-0.5 text-xs font-mono text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">{cert.issueDate || 'Verified'}</span><div className="flex items-center gap-1"><button onClick={() => openEdit(cert)} aria-label={`Edit ${cert.name}`} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"><Edit3 size={14} /></button><button onClick={() => handleDelete(cert.id, cert.name)} aria-label={`Delete ${cert.name}`} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"><Trash2 size={14} /></button></div></div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{cert.name}</h3><p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{cert.issuer}</p>
            </div>
            <button onClick={() => void handleTogglePublish(cert)} className="mt-4 px-2 py-1 text-[10px] font-semibold rounded-lg bg-neutral-100 text-neutral-600">{cert.isPublished === false ? 'Draft' : 'Published'}</button>
            {cert.credentialUrl && <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-1 border-t border-neutral-100 pt-3 text-xs font-medium text-[#0d5543] hover:underline dark:border-neutral-800 dark:text-[#2dd4bf]"><span>Verify Credential</span><ExternalLink size={12} /></a>}
          </div>
        ))}
      </div>

      {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"><div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"><div className="mb-4 flex items-center justify-between"><h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{editingCert ? 'Edit Certification' : 'New Certification'}</h3><button onClick={() => setIsModalOpen(false)} aria-label="Close dialog" className="text-neutral-400"><X size={18} /></button></div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <label className="block font-medium text-neutral-700 dark:text-neutral-300">Name *<input required type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="AWS Certified Solutions Architect" className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950" /></label>
          <label className="block font-medium text-neutral-700 dark:text-neutral-300">Issuer *<input required type="text" value={formData.issuer} onChange={(event) => setFormData({ ...formData, issuer: event.target.value })} placeholder="Amazon Web Services" className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950" /></label>
          <label className="block font-medium text-neutral-700 dark:text-neutral-300">Issue Date<input type="text" value={formData.issueDate} onChange={(event) => setFormData({ ...formData, issueDate: event.target.value })} placeholder="2023-08" className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950" /></label>
          <label className="block font-medium text-neutral-700 dark:text-neutral-300">Credential URL (Optional)<input type="url" value={formData.credentialUrl} onChange={(event) => setFormData({ ...formData, credentialUrl: event.target.value })} placeholder="https://..." className="mt-1 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-950" /></label>
          <div onPaste={handleImagePaste} tabIndex={0} aria-label="Certificate image upload. Focus this area and press Ctrl+V to paste an image." className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0d5543]/40"><span className="font-medium text-neutral-700 dark:text-neutral-300">Certificate Image</span><label className="mt-1 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-3 py-3 text-neutral-500 hover:border-[#0d5543] dark:border-neutral-700"><ImagePlus size={17} /><span>{formData.imageUrl ? 'Replace image' : 'Upload image (max 5 MB)'}</span><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleImageChange} className="hidden" /></label><p className="mt-1 text-[11px] text-neutral-500">Or focus this area and press Ctrl+V to paste an image.</p>{formData.imageUrl && <img src={formData.imageUrl} alt="Certificate preview" className="mt-2 h-28 w-full rounded-xl object-cover" />}</div>
          <div className="flex justify-end gap-2 pt-3"><button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-4 py-2 text-neutral-500 hover:bg-neutral-100">Cancel</button><button type="submit" disabled={isSubmitting} className="flex items-center gap-1 rounded-xl bg-[#0d5543] px-4 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"><Check size={14} />{isSubmitting ? 'Saving...' : 'Save'}</button></div>
        </form></div></div>}
    </div>
  )
}
