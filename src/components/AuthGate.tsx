import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

interface AuthGateProps {
  children: ReactNode
  /** true: only signed-in users may see children (redirects to /auth).
   *  false: only signed-out visitors may see children (redirects to /). */
  requireAuth: boolean
}

// Originally written as two separate components (ProtectedRoute and
// RedirectIfAuthed) that were near-identical except for which way the
// redirect pointed. Consolidated into one parameterized guard.
export default function AuthGate({ children, requireAuth }: AuthGateProps) {
  const { user, authLoading } = useAuth()

  if (authLoading) {
    return <p className="route-loading">Loading…</p>
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth" replace />
  }

  if (!requireAuth && user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
