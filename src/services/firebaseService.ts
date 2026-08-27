import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase, ref, set, remove, get, child } from 'firebase/database'
import type { Recipe } from '../types'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Without this check, a missing .env produces a confusing low-level
// Firebase error the first time auth or the database is touched. Failing
// fast here with a clear message saves a debugging detour.
if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
  throw new Error(
    'Firebase is not configured. Copy .env.example to .env and fill in your ' +
      'Firebase project values (see README.md).'
  )
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getDatabase(app)

// Stored at users/{userId}/favourites/{recipeId}
function favouritesPath(userId: string, recipeId?: string) {
  return recipeId
    ? `users/${userId}/favourites/${recipeId}`
    : `users/${userId}/favourites`
}

export async function addFavourite(userId: string, recipe: Recipe): Promise<void> {
  try {
    await set(ref(db, favouritesPath(userId, recipe.id)), recipe)
  } catch (err) {
    // Keep the original error's message (logged for debugging) instead of
    // discarding it — the first version threw a generic string here, which
    // made real failures (e.g. bad database rules) hard to diagnose.
    console.error('addFavourite failed:', err)
    throw new Error('Could not save this recipe to favourites. Please try again.')
  }
}

export async function removeFavourite(userId: string, recipeId: string): Promise<void> {
  try {
    await remove(ref(db, favouritesPath(userId, recipeId)))
  } catch (err) {
    console.error('removeFavourite failed:', err)
    throw new Error('Could not remove this recipe from favourites. Please try again.')
  }
}

export async function getFavourites(userId: string): Promise<Recipe[]> {
  try {
    const snapshot = await get(child(ref(db), favouritesPath(userId)))
    if (!snapshot.exists()) return []
    const value = snapshot.val() as Record<string, Recipe>
    return Object.values(value)
  } catch (err) {
    console.error('getFavourites failed:', err)
    throw new Error('Could not load your favourites. Please try again.')
  }
}
