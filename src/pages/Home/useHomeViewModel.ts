import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecipes, initialRecipes } from './HomeModel'
import { useAuth } from '../../context/AuthContext'
import { addFavourite } from '../../services/firebaseService'
import type { Recipe } from '../../types'

export function useHomeViewModel() {
  const [query, setQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const loadInitial = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const results = await initialRecipes()
      setRecipes(results)
    } catch (err) {
      setError('Could not load recipes right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load a random selection on first mount, and again whenever the
  // search query is cleared (so returning "home" always shows recipes).
  useEffect(() => {
    if (!query.trim()) {
      loadInitial()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSearch() {
    if (!query.trim()) {
      loadInitial()
      return
    }
    setLoading(true)
    setError('')
    try {
      const results = await getRecipes(query)
      setRecipes(results)
    } catch (err) {
      setError('Something went wrong searching for recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // If the visitor isn't signed in, send them to /auth instead of silently
  // failing. Once logged in, add the recipe to their favourites.
  async function handleFavouriteClick(recipe: Recipe) {
    if (!user) {
      navigate('/favourites')
      return
    }
    try {
      await addFavourite(user.uid, recipe)
    } catch (err) {
      setError('Could not save this recipe to favourites. Please try again.')
    }
  }

  return { query, setQuery, recipes, loading, error, handleSearch, handleFavouriteClick }
}
