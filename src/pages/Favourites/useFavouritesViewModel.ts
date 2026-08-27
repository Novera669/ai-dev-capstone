import { useEffect, useState, useCallback } from 'react'
import { loadFavourites, deleteFavourite } from './FavouritesModel'
import { useAuth } from '../../context/AuthContext'
import type { Recipe } from '../../types'

export function useFavouritesViewModel() {
  const [favourites, setFavourites] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  const loadMovies = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError('')
    try {
      const results = await loadFavourites(user.uid)
      setFavourites(results)
    } catch (err) {
      setError('Could not load your favourites. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadMovies()
  }, [loadMovies])

  async function removeMovie(recipeId: string) {
    if (!user) return
    try {
      await deleteFavourite(user.uid, recipeId)
      setFavourites((prev) => prev.filter((r) => r.id !== recipeId))
    } catch (err) {
      setError('Could not remove this recipe. Please try again.')
    }
  }

  return { favourites, loading, error, loadMovies, removeMovie }
}
