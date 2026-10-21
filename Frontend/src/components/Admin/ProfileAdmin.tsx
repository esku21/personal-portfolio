import { useEffect, useState, type FormEvent } from 'react'
import { UserCog, Check, Save, User, Mail, MapPin, Briefcase, Lock } from 'lucide-react'
import type { Profile } from '../../types'
import { portfolioApi, type AdminAccount } from '../../services/api'

interface ProfileAdminProps {
  profile?: Profile | null
  onRefresh: () => void
}

export function ProfileAdmin({ profile, onRefresh }: ProfileAdminProps) {
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: profile?.name || 'Eskedar Tesfaye Ketema',
    role: profile?.role || 'Full-Stack & Systems Software Engineer',
    email: profile?.email || 'eskedarteesfayeketema@gmail.com',
    location: profile?.location || 'Adama, Ethiopia',
    bio: profile?.bio || '',
    availability: profile?.availability || 'Open to select opportunities',
    avatarUrl: profile?.avatarUrl || '',
    githubUrl: profile?.githubUrl || '',
    linkedinUrl: profile?.linkedinUrl || ''
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [account, setAccount] = useState<AdminAccount | null>(null)
  const [accountForm, setAccountForm] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
  })
  const [accountSaving, setAccountSaving] = useState(false)
  const [accountSuccess, setAccountSuccess] = useState(false)
  const [accountError, setAccountError] = useState('')

  useEffect(() => {
    void portfolioApi.account().then(({ data }) => {
      setAccount(data)
      setAccountForm((current) => ({ ...current, name: data.name, email: data.email }))
    }).catch((error: unknown) => {
      setAccountError(error instanceof Error ? error.message : 'Could not load admin account')
    })
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    try {
      await portfolioApi.saveProfile(formData)
      setSuccess(true)
      onRefresh()
      setTimeout(() => setSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleAccountSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setAccountSaving(true)
    setAccountSuccess(false)
    setAccountError('')
    try {
      const { data } = await portfolioApi.saveAccount({
        name: accountForm.name,
        email: accountForm.email,
        ...(accountForm.newPassword
          ? { currentPassword: accountForm.currentPassword, newPassword: accountForm.newPassword }
          : {}),
      })
      setAccount(data)
      setAccountForm({ name: data.name, email: data.email, currentPassword: '', newPassword: '' })
      setAccountSuccess(true)
      setTimeout(() => setAccountSuccess(false), 3000)
    } catch (error: unknown) {
      setAccountError(error instanceof Error ? error.message : 'Could not update admin account')
    } finally {
      setAccountSaving(false)
    }
  }

  return (
    <div className="admin-workspace-page max-w-4xl space-y-6">
      <div className="admin-page-header">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <UserCog className="text-[#0d5543] dark:text-[#2dd4bf]" size={24} />
          <span>Profile Settings</span>
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Update your public portfolio details and secure admin account.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Lock className="text-[#0d5543] dark:text-[#2dd4bf]" size={19} />
            Admin Account
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Update the name and email from the Admin table. Leave password fields empty to keep the current password.
          </p>
        </div>

        {accountSuccess && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check size={16} />
            <span>Admin account updated successfully.</span>
          </div>
        )}
        {accountError && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-300">
            {accountError}
          </div>
        )}

        <form onSubmit={handleAccountSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium">
              Admin Name
              <div className="relative mt-1.5">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                />
              </div>
            </label>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium">
              Admin Email
              <div className="relative mt-1.5">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={accountForm.email}
                  onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium">
              Current Password
              <input
                type="password"
                minLength={8}
                value={accountForm.currentPassword}
                onChange={(e) => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
                placeholder="Required when changing password"
                className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
              />
            </label>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium">
              New Password
              <input
                type="password"
                minLength={8}
                value={accountForm.newPassword}
                onChange={(e) => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                placeholder="At least 8 characters"
                className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
              />
            </label>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={accountSaving || !account}
              className="px-6 py-2.5 rounded-xl bg-[#0d5543] hover:bg-[#093c2f] text-white font-semibold flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              <Save size={15} />
              <span>{accountSaving ? 'Saving...' : 'Save Admin Account'}</span>
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm">
        {success && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Check size={16} />
            <span>Profile information saved and synced successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Eskedar Tesfaye Ketema"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                Professional Title / Role
              </label>
              <div className="relative">
                <Briefcase size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Full-Stack & Systems Software Engineer"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                Contact Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="eskedarteesfayeketema@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                Location
              </label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Adama, Ethiopia"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
              Availability Status
            </label>
            <input
              type="text"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              placeholder="Available for select engineering contracts"
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
              Bio Summary
            </label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Specialized in high-reliability municipal administrative software, automated FinTech transaction clearing..."
              className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 mb-1.5 font-medium">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#0d5543] hover:bg-[#093c2f] text-white font-semibold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save size={15} />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}