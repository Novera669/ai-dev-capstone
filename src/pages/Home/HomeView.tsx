import Header from '../../components/Header/Header'
import RecipeCard from '../../components/RecipeCard/RecipeCard'
import { useHomeViewModel } from './useHomeViewModel'
import './HomeView.css'

export default function HomeView() {
  const { query, setQuery, recipes, loading, error, handleSearch, handleFavouriteClick } =
    useHomeViewModel()

  return (
    <>
      <Header query={query} onQueryChange={setQuery} onSearch={handleSearch} />
      <main className="home">
        {loading && <p className="home__status">Loading recipes…</p>}
        {error && <p className="home__status home__status--error">{error}</p>}

        {!loading && !error && recipes.length === 0 && (
          <p className="home__status">No recipes found. Try a different search.</p>
        )}

        <div className="home__grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onFavourite={handleFavouriteClick} />
          ))}
        </div>
      </main>
    </>
  )
}
