import Header from '../../components/Header/Header'
import RecipeCard from '../../components/RecipeCard/RecipeCard'
import { useFavouritesViewModel } from './useFavouritesViewModel'
import './FavouritesView.css'

export default function FavouritesView() {
  const { favourites, loading, error, removeMovie } = useFavouritesViewModel()

  return (
    <>
      <Header />
      <main className="favourites">
        <h1 className="favourites__title">Your Favourites</h1>

        {loading && <p className="favourites__status">Loading your favourites…</p>}
        {error && <p className="favourites__status favourites__status--error">{error}</p>}

        {!loading && !error && favourites.length === 0 && (
          <p className="favourites__status">
            No favourites yet — save recipes from the Home page to see them here.
          </p>
        )}

        <div className="favourites__grid">
          {favourites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onRemove={removeMovie} />
          ))}
        </div>
      </main>
    </>
  )
}
