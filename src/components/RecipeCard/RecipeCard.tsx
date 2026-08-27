import type { Recipe } from '../../types'
import './RecipeCard.css'

interface RecipeCardProps {
  recipe: Recipe
  onFavourite?: (recipe: Recipe) => void
  onRemove?: (recipeId: string) => void
}

export default function RecipeCard({ recipe, onFavourite, onRemove }: RecipeCardProps) {
  return (
    <div className="recipe-card">
      <img className="recipe-card__thumb" src={recipe.thumbnail} alt={recipe.title} loading="lazy" />
      <div className="recipe-card__body">
        <h3 className="recipe-card__title">{recipe.title}</h3>
        <p className="recipe-card__meta">
          {recipe.category} · {recipe.area}
        </p>
        <div className="recipe-card__actions">
          {onFavourite && (
            <button className="recipe-card__btn" onClick={() => onFavourite(recipe)}>
              ♥ Save
            </button>
          )}
          {onRemove && (
            <button
              className="recipe-card__btn recipe-card__btn--remove"
              onClick={() => onRemove(recipe.id)}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
