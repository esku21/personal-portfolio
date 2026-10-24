import type {
  Certification,
  ContactMessage,
  Education,
  Experience,
  Portfolio,
  PortfolioReport,
  Profile,
  Project,
  Service,
  Skill,
  Stats,
} from '../types'

// API URL for local development and production.
const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:5000/api'
    : 'https://personal-portfolio-esku.onrender.com/api')
).replace(/\/+$/, '')

type ApiResponse<T = unknown> = {
  data: T
}

export interface AdminAccount {
  id: string
  name: string
  email: string
}

interface LoginResponse {
  token: string
  admin?: AdminAccount
}

function getErrorMessage(payload: unknown, status: number): string {
  if (payload !== null && typeof payload === 'object') {
    if (
      'error' in payload &&
      typeof payload.error === 'string'
    ) {
      return payload.error
    }

    if (
      'message' in payload &&
      typeof payload.message === 'string'
    ) {
      return payload.message
    }
  }

  return `Request failed with status ${status}`
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('admin_token')
      : null

  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    })
  } catch {
    throw new Error(
      'Cannot connect to the server. Check your internet connection and API URL, then try again.',
    )
  }

  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, response.status))
  }

  return { data: payload as T }
}

function saveResource(
  resource: string,
  data: unknown,
  id?: string,
) {
  const path = id
    ? `/admin/${resource}/${encodeURIComponent(id)}`
    : `/admin/${resource}`

  return request(path, {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  })
}

function deleteResource(resource: string, id: string) {
  return request(
    `/admin/${resource}/${encodeURIComponent(id)}`,
    { method: 'DELETE' },
  )
}

export const portfolioApi = {
  // Public portfolio
  portfolio() {
    return request<Portfolio>('/portfolio')
  },

  // Authentication
  login(email: string, password: string) {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    })
  },

  account() {
    return request<AdminAccount>('/auth/me')
  },

  // Dashboard and reports
  stats() {
    return request<Stats>('/admin/stats')
  },

  reports(params: URLSearchParams) {
    const query = params.toString()

    return request<PortfolioReport>(
      `/admin/reports${query ? `?${query}` : ''}`,
    )
  },

  // Read admin resources
  projects() {
    return request<Project[]>('/admin/projects')
  },

  messages() {
    return request<ContactMessage[]>('/admin/messages')
  },

  profile() {
    return request<Profile | undefined>('/admin/profile')
  },

  skills() {
    return request<Skill[]>('/admin/skills')
  },

  experience() {
    return request<Experience[]>('/admin/experience')
  },

  education() {
    return request<Education[]>('/admin/education')
  },

  certifications() {
    return request<Certification[]>('/admin/certifications')
  },

  services() {
    return request<Service[]>('/admin/services')
  },

  // Projects
  saveProject(data: unknown, id?: string) {
    return saveResource('projects', data, id)
  },

  deleteProject(id: string) {
    return deleteResource('projects', id)
  },

  // Skills
  saveSkill(data: unknown, id?: string) {
    return saveResource('skills', data, id)
  },

  deleteSkill(id: string) {
    return deleteResource('skills', id)
  },

  // Experience
  saveExperience(data: unknown, id?: string) {
    return saveResource('experience', data, id)
  },

  deleteExperience(id: string) {
    return deleteResource('experience', id)
  },

  // Education
  saveEducation(data: unknown, id?: string) {
    return saveResource('education', data, id)
  },

  deleteEducation(id: string) {
    return deleteResource('education', id)
  },

  // Certifications
  saveCertification(data: unknown, id?: string) {
    return saveResource('certifications', data, id)
  },

  deleteCertification(id: string) {
    return deleteResource('certifications', id)
  },

  // Services
  saveService(data: unknown, id?: string) {
    return saveResource('services', data, id)
  },

  deleteService(id: string) {
    return deleteResource('services', id)
  },

  // Contact messages
  updateMessage(id: string, status: string) {
    return request(
      `/admin/messages/${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
    )
  },

  deleteMessage(id: string) {
    return deleteResource('messages', id)
  },

  contact(data: {
    name: string
    email: string
    phone: string
    subject: string
    message: string
  }) {
    return request('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Profile and admin account
  saveProfile(data: unknown) {
    return request('/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  saveAccount(data: unknown) {
    return request<AdminAccount>('/admin/account', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
}
