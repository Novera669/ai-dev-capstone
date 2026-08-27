import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import AuthGate from './components/AuthGate'
import HomeView from './pages/Home/HomeView'
import FavouritesView from './pages/Favourites/FavouritesView'
import AuthView from './pages/Auth/AuthView'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route
            path="/favourites"
            element={
              <AuthGate requireAuth>
                <FavouritesView />
              </AuthGate>
            }
          />
          <Route
            path="/auth"
            element={
              <AuthGate requireAuth={false}>
                <AuthView />
              </AuthGate>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
