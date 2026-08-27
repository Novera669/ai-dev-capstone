import { searchRecipes } from '../../services/mealdbService'
import type { Recipe } from '../../types'

const SEED_KEYWORDS = [
  'Chicken', 'Beef', 'Pasta', 'Curry', 'Soup', 'Salad', 'Rice',
  'Cake', 'Fish', 'Pork', 'Vegetarian', 'Lamb', 'Breakfast',
  'Dessert', 'Seafood',
]

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

function pickRandomKeywords(count: number): string[] {
  return shuffle(SEED_KEYWORDS).slice(0, count)
}

export async function getRecipes(query: string): Promise<Recipe[]> {
  const trimmed = query.trim()
  if (trimmed.length < 2) {
    return []
  }
  return searchRecipes(trimmed)
}

export async function initialRecipes(): Promise<Recipe[]> {
  const keywords = pickRandomKeywords(5)
  const results = await Promise.all(keywords.map((keyword) => searchRecipes(keyword)))
  const merged = results.flat()

  const seen = new Set<string>()
  const unique = merged.filter((recipe) => {
    if (seen.has(recipe.id)) return false
    seen.add(recipe.id)
    return true
  })

  return shuffle(unique).slice(0, 20)
}
