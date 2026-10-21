import type {
  Certification,
  ContactMessage,
  Education,
  Experience,
  Profile,
  PortfolioReport,
  Project,
  Service,
  Skill,
  Stats,
} from '../types'

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.protocol}//${window.location.hostname}:5000/api`
).replace(/\/+$/, '')

type ApiResponse<T = unknown> = { data: T }

export interface AdminAccount {
  id: string
  name: string
  email: string
}

async function request<T = unknown>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('admin_token')
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const message = payload && typeof payload === 'object' && 'error' in payload
      ? String(payload.error)
      : `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return { data: payload as T }
}

async function portfolioResource<T>(resource: string): Promise<ApiResponse<T>> {
  const response = await request<Record<string, T>>('/portfolio')
  return { data: response.data[resource] }
}

function saveResource(resource: string, data: unknown, id?: string) {
  const path = id ? `/admin/${resource}/${id}` : `/admin/${resource}`
  return request(path, {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  })
}

function deleteResource(resource: string, id: string) {
  return request(`/admin/${resource}/${id}`, { method: 'DELETE' })
}

export const portfolioApi = {
  portfolio() { return request<import('../types').Portfolio>('/portfolio') },
  login(email: string, password: string) {
    return request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  stats() { return request<Stats>('/admin/stats') },
  reports(params: URLSearchParams) { return request<PortfolioReport>(`/admin/reports${params.size ? `?${params}` : ''}`) },
  projects() { return request<Project[]>('/admin/projects') },
  messages() { return request<ContactMessage[]>('/admin/messages') },
  profile() { return request<Profile | undefined>('/admin/profile') },
  account() { return request<AdminAccount>('/auth/me') },
  skills() { return request<Skill[]>('/admin/skills') },
  experience() { return request<Experience[]>('/admin/experience') },
  education() { return request<Education[]>('/admin/education') },
  certifications() { return portfolioResource<Certification[]>('certifications') },
  services() { return request<Service[]>('/admin/services') },

  saveProject(data: unknown, id?: string) { return saveResource('projects', data, id) },
  deleteProject(id: string) { return deleteResource('projects', id) },
  saveSkill(data: unknown, id?: string) { return saveResource('skills', data, id) },
  deleteSkill(id: string) { return deleteResource('skills', id) },
  saveExperience(data: unknown, id?: string) { return saveResource('experience', data, id) },
  deleteExperience(id: string) { return deleteResource('experience', id) },
  saveEducation(data: unknown, id?: string) { return saveResource('education', data, id) },
  deleteEducation(id: string) { return deleteResource('education', id) },
  saveCertification(data: unknown, id?: string) { return saveResource('certifications', data, id) },
  deleteCertification(id: string) { return deleteResource('certifications', id) },
  saveService(data: unknown, id?: string) { return saveResource('services', data, id) },
  deleteService(id: string) { return deleteResource('services', id) },
  updateMessage(id: string, status: string) {
    return request(`/admin/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
  deleteMessage(id: string) { return deleteResource('messages', id) },
  contact(data: { name: string; email: string; phone: string; subject: string; message: string }) {
    return request('/contact', { method: 'POST', body: JSON.stringify(data) })
  },
  saveProfile(data: unknown) { return request('/admin/profile', { method: 'PUT', body: JSON.stringify(data) }) },
  saveAccount(data: unknown) { return request<AdminAccount>('/admin/account', { method: 'PUT', body: JSON.stringify(data) }) },
  resetToSeed() { return request('/admin/reset-seed', { method: 'POST' }) },
}