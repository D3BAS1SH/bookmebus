import { z } from 'zod/v4'

// ─── Enums ────────────────────────────────────────────────────────
export const UserRole = {
  OWNER: 'OWNER',
  DRIVER: 'DRIVER',
  TRAVELER: 'TRAVELER',
} as const

export type UserRole = (typeof UserRole)[keyof typeof UserRole]

// ─── Zod Schemas ──────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(1, 'Full name is required')
      .max(100, 'Full name is too long'),
    email: z.email('Please enter a valid email address'),
    phone: z
      .string()
      .min(7, 'Phone must be at least 7 digits')
      .max(15, 'Phone is too long'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(30, 'Password is too long'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['OWNER', 'DRIVER', 'TRAVELER'] as const),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>

// ─── API Response Types ───────────────────────────────────────────

/** Generic wrapper that Spring Boot returns */
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  error?: unknown
  timestamp: string
}

/** Full user object returned by the backend (includes JWT token) */
export interface UserResponse {
  userId: string
  fullName: string
  email: string
  phone: string
  role: UserRole
  active: boolean
  createdAt: string
  token: string
}

/** Client-side user object (token stripped — stored in httpOnly cookie) */
export interface AuthUser {
  userId: string
  fullName: string
  email: string
  phone: string
  role: UserRole
  active: boolean
}
