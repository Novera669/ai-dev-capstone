import type { MealDbMeal, MealDbSearchResponse, Recipe } from '../types'

// TheMealDB's free tier uses the shared test key "1" — no signup required.
const API_URL = 'https://www.themealdb.com/api/json/v1/1'

function toRecipe(meal: MealDbMeal): Recipe {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    category: meal.strCategory,
    area: meal.strArea,
    thumbnail: meal.strMealThumb,
  }
}

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const response = await fetch(`${API_URL}/search.php?s=${encodeURIComponent(query)}`)

  if (!response.ok) {
    throw new Error(`TheMealDB request failed with status ${response.status}`)
  }

  const data: MealDbSearchResponse = await response.json()

  if (!data.meals) {
    return []
  }

  return data.meals.map(toRecipe)
}
