import { StrictMode, useEffect, useState, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { isFirebaseConfigured } from './isFirebaseConfigured'

// App (and everything it imports, including firebaseService.ts) is only
// loaded lazily, AFTER the config check below passes. That keeps a missing
// .env from ever reaching firebase's own initializeApp() call, which used
// to throw during module import and blank the whole page with nothing
// rendered — see IMPROVEMENTS.md.
const App = lazy(() => import('./App.tsx'))

function ConfigError() {
  return (
    <div style={{ maxWidth: 480, margin: '80px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 20 }}>Firebase is not configured</h1>
      <p style={{ color: '#555', lineHeight: 1.5 }}>
        Copy <code>.env.example</code> to <code>.env</code> in the project root and fill in your
        Firebase project's config values, then restart <code>npm run dev</code>. See{' '}
        <code>README.md</code> for the full setup steps.
      </p>
    </div>
  )
}

function Root() {
  const [configured, setConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    setConfigured(isFirebaseConfigured())
  }, [])

  if (configured === null) return null
  if (!configured) return <ConfigError />

  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
