// Recipe shape used across the app — normalized from TheMealDB's raw response.
export interface Recipe {
  id: string
  title: string
  category: string
  area: string
  thumbnail: string
}

// TheMealDB's raw meal object (partial — only fields we use).
export interface MealDbMeal {
  idMeal: string
  strMeal: string
  strCategory: string
  strArea: string
  strMealThumb: string
}

export interface MealDbSearchResponse {
  meals: MealDbMeal[] | null
}
