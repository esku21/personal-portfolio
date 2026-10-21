import { z } from 'zod'

const optionalUrl = z.string().url().or(z.literal('')).optional()
const optionalImage = z.string().max(8_000_000).refine(
  (value) => value === '' || /^data:image\/(png|jpeg|jpg|webp|gif);base64,/.test(value),
  'Image must be a PNG, JPEG, WEBP, or GIF upload',
).optional()
function isValidProjectImage(value: string) {
  if (/^https?:\/\//.test(value)) return true

  const match = value.match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,([A-Za-z0-9+/]+={0,2})$/)
  if (!match?.[1] || !match[2]) return false

  const mimeType = match[1]
  const bytes = Buffer.from(match[2], 'base64')
  if (mimeType === 'png') {
    return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  }
  if (mimeType === 'jpeg' || mimeType === 'jpg') {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  }
  if (mimeType === 'gif') {
    return bytes.length >= 6 && ['GIF87a', 'GIF89a'].includes(bytes.toString('ascii', 0, 6))
  }
  return bytes.length >= 12 &&
    bytes.toString('ascii', 0, 4) === 'RIFF' &&
    bytes.toString('ascii', 8, 12) === 'WEBP'
}

const projectImage = z.string().max(8_000_000).refine(
  isValidProjectImage,
  'Image must be an HTTP(S) URL or a valid PNG, JPEG, WEBP, or GIF image',
)

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
})

export const adminAccountSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  currentPassword: z.string().min(8).max(200).optional(),
  newPassword: z.string().min(8).max(200).optional(),
}).refine(
  ({ currentPassword, newPassword }) => Boolean(currentPassword) === Boolean(newPassword),
  { message: 'Current password and new password must be provided together' },
)

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email(),
  phone: z.string().trim().min(7).max(30),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(3000),
})

export const projectSchema = z.object({
  slug: z.string().trim().min(2).max(100).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(2).max(160),
  acronym: z.string().trim().min(2).max(20),
  description: z.string().trim().min(10).max(500),
  details: z.string().trim().min(10).max(10000).or(z.literal('')).optional(),
  techStack: z.array(z.string().trim().min(1)).min(1).max(20),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  imageUrl: z.union([projectImage, z.literal(''), z.null()]).optional(),
  imageUrls: z.array(projectImage).max(10).optional(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().min(2).max(160),
  bio: z.string().trim().min(10).max(2000),
  location: z.string().trim().min(2).max(120),
  email: z.string().email(),
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  avatarUrl: optionalUrl,
  resumeUrl: optionalUrl,
  availability: z.string().trim().max(240).optional(),
  aboutTitle: z.string().trim().max(240).optional(),
  aboutText: z.string().trim().max(3000).optional(),
})

export const messageStatusSchema = z.object({
  status: z.enum(['unread', 'read', 'archived']),
})

export const experienceSchema = z.object({
  role: z.string().trim().min(2).max(160),
  company: z.string().trim().min(2).max(160),
  location: z.string().trim().max(160).optional().default(''),
  startDate: z.string().trim().min(1).max(40),
  endDate: z.string().trim().max(40).nullable().optional(),
  current: z.boolean().optional().default(false),
  description: z.string().trim().min(2).max(3000),
  imageUrls: z.array(projectImage).max(10).optional(),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
})

export const educationSchema = z.object({
  institution: z.string().trim().min(2).max(200),
  degree: z.string().trim().min(2).max(160),
  location: z.string().trim().max(160).optional().default(''),
  startDate: z.string().trim().min(1).max(40),
  endDate: z.string().trim().max(40).nullable().optional(),
  description: z.string().trim().max(3000).optional().default(''),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
})

export const skillSchema = z.object({
  name: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(160),
  level: z.number().int().min(0).max(100).default(70),
  imageUrl: z.string().max(8_000_000).refine(
    (value) => value === '' || /^data:image\/(png|jpeg|jpg|webp|gif);base64,/.test(value),
    'Image must be a PNG, JPEG, WEBP, or GIF upload',
  ).nullable().optional(),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
})

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(2).max(3000),
  icon: z.string().trim().min(1).max(80),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
})

export const certificationSchema = z.object({
  name: z.string().trim().min(2).max(160),
  issuer: z.string().trim().min(2).max(160),
  issueDate: z.string().trim().max(40).optional().default(''),
  credentialUrl: optionalUrl,
  imageUrl: optionalImage,
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
})

export const idSchema = z.object({ id: z.string().min(1) })
