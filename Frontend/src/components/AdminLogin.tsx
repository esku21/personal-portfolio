import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowUpRight, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  ShieldCheck 
} from 'lucide-react'
import { portfolioApi } from '../services/api'

interface AdminLoginProps {
  onLogin: (token: string) => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await portfolioApi.login(email, password)
      localStorage.setItem('admin_token', data.token)
      onLogin(data.token)
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid email or password. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] text-neutral-900 flex flex-col justify-between selection:bg-[#0d5543] selection:text-white">
      {/* Top Navigation Bar: Duplicate 'E.' logo removed; 'Back to portfolio' neatly right-aligned */}
      <header className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-end">
        <Link 
          to="/" 
          id="back-to-portfolio-link"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors py-2 px-3 rounded-lg hover:bg-neutral-100"
        >
          <ArrowLeft size={16} />
          Back to portfolio
        </Link>
      </header>

      {/* Main Centered Login Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div 
          id="admin-login-card"
          className="w-full max-w-[420px] bg-white rounded-2xl border border-neutral-200/80 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] p-6 sm:p-10"
        >
          {/* Card Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium mb-4">
              <ShieldCheck size={14} className="text-[#0d5543]" />
              Secure Admin Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
              Welcome back.
            </h1>
            <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
              Enter your administrative credentials to manage projects, messages, and profile details.
            </p>
          </div>

          {/* Error Message Box */}
          {error && (
            <div 
              id="login-error-alert"
              role="alert"
              className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200/70 flex items-start gap-3 text-red-700 text-sm"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form id="admin-login-form" onSubmit={submit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label 
                htmlFor="admin-email-input"
                className="block text-xs font-medium uppercase tracking-wider text-neutral-500"
              >
                Email Address
              </label>
              
              <div className="relative">
                {/* Fixed leading icon container */}
                <div 
                  className="leading-icon-container absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 z-10"
                  aria-hidden="true"
                >
                  <Mail size={18} className="text-neutral-400 shrink-0" />
                </div>
                <input
                  id="admin-email-input"
                  required
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full !pl-11 pl-11 pr-4 py-2.5 text-sm bg-neutral-50/50 border border-neutral-200 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d5543]/20 focus:border-[#0d5543] transition-all disabled:opacity-50 input-with-leading-icon login-input-lead"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="admin-password-input"
                  className="block text-xs font-medium uppercase tracking-wider text-neutral-500"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                {/* Fixed leading icon container */}
                <div 
                  className="leading-icon-container absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 z-10"
                  aria-hidden="true"
                >
                  <Lock size={18} className="text-neutral-400 shrink-0" />
                </div>
                <input
                  id="admin-password-input"
                  required
                  minLength={6}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full !pl-11 !pr-11 pl-11 pr-11 py-2.5 text-sm bg-neutral-50/50 border border-neutral-200 rounded-xl placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0d5543]/20 focus:border-[#0d5543] transition-all disabled:opacity-50 input-with-leading-icon input-with-trailing-icon login-input-both"
                />
                {/* Fixed trailing button container */}
                <div className="trailing-icon-container absolute inset-y-0 right-0 pr-2.5 flex items-center z-10">
                  <button
                    id="toggle-password-visibility-btn"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0d5543]/20"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="admin-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#0d5543] hover:bg-[#093c30] text-white text-sm font-medium rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed group cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security footnote */}
          <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-center gap-2 text-xs text-neutral-400">
            <span>256-bit encrypted session</span>
            <span>•</span>
            <span>Single Admin Access</span>
          </div>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="w-full py-6 text-center text-xs text-neutral-400">
        &copy; {new Date().getFullYear()} Eskedar Portfolio. All rights reserved.
      </footer>
    </main>
  )
}