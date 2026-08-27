import { registerUser, loginUser, logoutUser } from '../../services/authService'
import type { User } from 'firebase/auth'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function validate(email: string, password: string): void {
  if (!email || !password) {
    throw new Error('Email and password are required.')
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }
}

export async function register(email: string, password: string): Promise<User> {
  const cleanEmail = normalizeEmail(email)
  validate(cleanEmail, password)
  return registerUser(cleanEmail, password)
}

export async function login(email: string, password: string): Promise<User> {
  const cleanEmail = normalizeEmail(email)
  validate(cleanEmail, password)
  return loginUser(cleanEmail, password)
}

export async function logout(): Promise<void> {
  return logoutUser()
}
