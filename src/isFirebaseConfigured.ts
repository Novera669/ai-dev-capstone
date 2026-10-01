// Deliberately has NO firebase imports, so it's safe to check before
// firebase/app is ever loaded — checking inside firebaseService.ts itself
// threw during module import and blanked the whole React app with no
// on-screen message, which is worse than the problem it was meant to fix.
export function isFirebaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_DATABASE_URL
  )
}
