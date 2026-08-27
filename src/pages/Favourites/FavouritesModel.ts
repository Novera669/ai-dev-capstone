import { getFavourites, addFavourite, removeFavourite } from '../../services/firebaseService'
import type { Recipe } from '../../types'

export async function loadFavourites(userId: string): Promise<Recipe[]> {
  return getFavourites(userId)
}

export async function saveFavourite(userId: string, recipe: Recipe): Promise<void> {
  return addFavourite(userId, recipe)
}

export async function deleteFavourite(userId: string, recipeId: string): Promise<void> {
  return removeFavourite(userId, recipeId)
}
