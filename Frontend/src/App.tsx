import { useState, useEffect } from 'react'
import { AdminDashboard } from './components/AdminDashboard'
import { AdminLogin } from './components/AdminLogin'
import { PortfolioView } from './components/Portfolio/PortfolioView'
import { Moon, Sun } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

export function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem('admin_token') || '')
  const [isAdmin, setIsAdmin] = useState(() => Boolean(localStorage.getItem('admin_token')))
  const isLoginRoute = location.pathname === '/login'
  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  // Synchronize dark theme class on document element and persist in localStorage
  useEffect(() => {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    if (dark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [dark])

  return (
    <div className="relative min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Floating theme switcher */}
      <div className="fixed bottom-4 right-4 z-50 rounded-2xl bg-neutral-900/90 p-1.5 text-white shadow-2xl backdrop-blur-md dark:bg-neutral-800/95">
        <button
          onClick={() => setDark(!dark)}
          className="p-1.5 rounded-xl text-neutral-400 hover:text-white transition"
          title="Toggle Dark Mode"
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>

      {/* Main View */}
      {isLoginRoute ? (
        <AdminLogin
          onLogin={(nextToken) => {
            setToken(nextToken)
            setIsAdmin(true)
            navigate('/admin')
          }}
        />
      ) : isAdmin && token ? (
        <AdminDashboard
          token={token}
          onLogout={() => {
            localStorage.removeItem('admin_token')
            setToken('')
            setIsAdmin(false)
            navigate('/')
          }}
          dark={dark}
          setDark={setDark}
        />
      ) : (
        <PortfolioView dark={dark} setDark={setDark} />
      )}
    </div>
  )
}

export default App