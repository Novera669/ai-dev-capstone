# Manual Improvements After Reviewing AI-Generated Code

Four real issues found on review and through testing, fixed by hand.

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

## 3. Missing Firebase config: two iterations, found by actually testing a fresh clone

**First attempt — the obvious fix.** If `.env` was missing or incomplete,
the app would fail deep inside the Firebase SDK the first time auth or the
database was touched, with an error message that doesn't mention `.env` at
all. The obvious fix looked like a fail-fast check at the top of
`firebaseService.ts`:

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

This looked correct and built without errors, so it shipped.

**Found by testing, not by reading code.** Before submitting, I cloned the
repo fresh into a separate folder (`git clone` into `test-clone`, no `.env`
present) to simulate what a grader would actually do. The app loaded to a
**completely blank white page** — no error message at all, in direct
contradiction to what the fix above was supposed to show. The real cause:
`firebaseService.ts` is imported by `App.tsx`, which is imported directly
by `main.tsx`. The `throw` fires *during module import*, before React has
rendered anything, so the whole app silently fails to mount instead of
showing the intended message. This confirmed the first fix was based on
reading the code and assuming it would work, not on actually running it
in the failure state.

**Second, correct fix.** Moved the check into a standalone module with
**no Firebase imports at all**, and restructured `main.tsx` to check
*before* lazily importing `App` (and therefore before Firebase is ever
touched):

```ts
// src/isFirebaseConfigured.ts — no firebase imports, safe to check first
export function isFirebaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_DATABASE_URL
  )
}
```

```tsx
// src/main.tsx
const App = lazy(() => import('./App.tsx'))  // only loaded if configured

function Root() {
  const [configured, setConfigured] = useState<boolean | null>(null)
  useEffect(() => { setConfigured(isFirebaseConfigured()) }, [])

  if (configured === null) return null
  if (!configured) return <ConfigError />   // real on-screen message
  return <Suspense fallback={null}><App /></Suspense>
}
```

Re-tested in the same fresh `test-clone` folder: without `.env`, the page
now shows a readable "Firebase is not configured" message with setup
instructions instead of a blank screen. With `.env` restored, the app
loads and works exactly as before.

---

## Verification

After each fix, `tsc -b && vite build` was re-run to confirm no
regressions. The full signup → search → favourite → logout → login →
view-favourites flow was manually re-tested against a real Firebase
project. Critically, the config-check fix was verified by actually
cloning the repository into a separate, clean folder with no `.env` —
not just by reading the code — which is what caught the blank-page
regression in the first place.
