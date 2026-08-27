# Manual Improvements After Reviewing AI-Generated Code

Three real issues found on review, fixed by hand.

---

## 1. Duplicated route-guard components

**Problem:** The AI-generated routing used two separate components,
`ProtectedRoute` (redirect to `/auth` if signed out) and `RedirectIfAuthed`
(redirect to `/` if signed in) — nearly identical except for which
direction the redirect pointed. Any change to the loading state or redirect
behavior would need to be made twice.

**Before** (two files):
```tsx
// ProtectedRoute.tsx
export default function ProtectedRoute({ children }: Props) {
  const { user, authLoading } = useAuth()
  if (authLoading) return <p className="route-loading">Loading…</p>
  if (!user) return <Navigate to="/auth" replace />
  return <>{children}</>
}

// RedirectIfAuthed.tsx — almost the same file again
export default function RedirectIfAuthed({ children }: Props) {
  const { user, authLoading } = useAuth()
  if (authLoading) return <p className="route-loading">Loading…</p>
  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}
```

**After:** Consolidated into a single `AuthGate` component with a
`requireAuth` boolean prop:
```tsx
export default function AuthGate({ children, requireAuth }: AuthGateProps) {
  const { user, authLoading } = useAuth()
  if (authLoading) return <p className="route-loading">Loading…</p>
  if (requireAuth && !user) return <Navigate to="/auth" replace />
  if (!requireAuth && user) return <Navigate to="/" replace />
  return <>{children}</>
}
```
Used as `<AuthGate requireAuth><FavouritesView /></AuthGate>` and
`<AuthGate requireAuth={false}><AuthView /></AuthGate>` in `App.tsx`.

---

## 2. Firebase service swallowed the real error

**Problem:** `addFavourite`, `removeFavourite`, and `getFavourites` in
`firebaseService.ts` caught any error and threw a new generic `Error` with
a fixed message. This meant a genuine misconfiguration (wrong database
rules, revoked auth token, malformed data) was indistinguishable in the
console from an ordinary network failure — there was nothing to debug from.

**Before:**
```ts
export async function addFavourite(userId: string, recipe: Recipe) {
  try {
    await set(ref(db, favouritesPath(userId, recipe.id)), recipe)
  } catch (err) {
    throw new Error('Could not save this recipe to favourites. Please try again.')
  }
}
```

**After:** Log the original error for debugging before throwing the
user-facing message:
```ts
export async function addFavourite(userId: string, recipe: Recipe) {
  try {
    await set(ref(db, favouritesPath(userId, recipe.id)), recipe)
  } catch (err) {
    console.error('addFavourite failed:', err)
    throw new Error('Could not save this recipe to favourites. Please try again.')
  }
}
```
Applied the same pattern to `removeFavourite` and `getFavourites`.

---

## 3. No early check for missing Firebase config

**Problem:** If `.env` was missing or incomplete, the app would fail deep
inside the Firebase SDK the first time auth or the database was touched,
with an error message that doesn't mention `.env` at all — a real
"why is this broken" moment I hit myself while setting up my own Firebase
project.

**Before:**
```ts
const firebaseConfig = { apiKey: import.meta.env.VITE_FIREBASE_API_KEY, /* … */ }
const app = initializeApp(firebaseConfig)
```

**After:**
```ts
const firebaseConfig = { apiKey: import.meta.env.VITE_FIREBASE_API_KEY, /* … */ }

if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
  throw new Error(
    'Firebase is not configured. Copy .env.example to .env and fill in your ' +
      'Firebase project values (see README.md).'
  )
}

const app = initializeApp(firebaseConfig)
```

---

## Verification

After each fix, `tsc -b && vite build` was re-run to confirm no
regressions, and the full signup → search → favourite → logout → login →
view favourites flow was manually re-tested in the browser against a real
Firebase project.
