import { useState, type FormEvent } from 'react'
import { Award, Plus, Trash2, Edit3, ExternalLink, Check, X } from 'lucide-react'
import type { Certification } from '../../types'
import { portfolioApi } from '../../services/api'

interface CertificationsAdminProps {
  certifications: Certification[]
  onRefresh: () => void
}

export function CertificationsAdmin({ certifications, onRefresh }: CertificationsAdminProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [formData, setFormData] = useState<Partial<Certification>>({
    name: '',
    issuer: '',
    issueDate: '',
    credentialId: '',
    credentialUrl: ''
  })

  const openCreate = () => {
    setEditingCert(null)
    setFormData({ name: '', issuer: '', issueDate: '', credentialId: '', credentialUrl: '' })
    setIsModalOpen(true)
  }

  const openEdit = (cert: Certification) => {
    setEditingCert(cert)
    setFormData(cert)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete certification "${name}"?`)) {
      await portfolioApi.deleteCertification(id)
      onRefresh()
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await portfolioApi.saveCertification(formData, editingCert?.id)
    setIsModalOpen(false)
    onRefresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Award className="text-amber-500" size={24} />
            <span>Certifications Management</span>
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            PostgreSQL "Certification" table records
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-xl bg-[#0d5543] hover:bg-[#093c2f] text-white text-xs font-semibold flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus size={15} /> Add Certification
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  {cert.issueDate || 'Verified'}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(cert)}
                    className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id, cert.name)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-sm text-neutral-900 dark:text-neutral-100">
                {cert.name}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {cert.issuer}
              </p>
              {cert.credentialId && (
                <p className="text-[11px] font-mono text-neutral-400 mt-2">
                  ID: {cert.credentialId}
                </p>
              )}
            </div>

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs font-medium text-[#0d5543] dark:text-[#2dd4bf] hover:underline flex items-center gap-1"
              >
                <span>Verify Credential</span> <ExternalLink size={12} />
              </a>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                {editingCert ? 'Edit Certification' : 'New Certification'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Name *</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="AWS Certified Solutions Architect"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Issuer *</label>
                <input
                  required
                  type="text"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="Amazon Web Services"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Issue Date</label>
                <input
                  type="text"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  placeholder="2023-08"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 mb-1 font-medium">Credential URL</label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://..."
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