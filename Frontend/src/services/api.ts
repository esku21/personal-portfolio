import axios from 'axios'
import type { Portfolio, Project, Profile, Stats } from '../types'

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api' })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const portfolioApi = {
  get: () => api.get<Portfolio>('/portfolio'),
  project: (slug: string) => api.get<Project>(`/projects/${slug}`),
  contact: (data: Record<string, string>) => api.post('/contact', data),
  login: (email: string, password: string) => api.post<{ token: string; admin: { id: string; email: string; name: string } }>('/auth/login', { email, password }),
  stats: () => api.get<Stats>('/admin/stats'),
  projects: () => api.get<Project[]>('/admin/projects'),
  saveProject: (data: Partial<Project>, id?: string) => id ? api.patch<Project>(`/admin/projects/${id}`, data) : api.post<Project>('/admin/projects', data),
  deleteProject: (id: string) => api.delete(`/admin/projects/${id}`),
  messages: () => api.get<{ id: string; name: string; email: string; subject: string; message: string; status: string; createdAt: string }[]>('/admin/messages'),
  updateMessage: (id: string, status: string) => api.patch(`/admin/messages/${id}`, { status }),
  profile: () => api.get<Profile>('/admin/profile'),
  saveProfile: (data: Partial<Profile>) => api.put<Profile>('/admin/profile', data),
}
