import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Header.css'

interface HeaderProps {
  query?: string
  onQueryChange?: (value: string) => void
  onSearch?: () => void
}

export default function Header({ query = '', onQueryChange, onSearch }: HeaderProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <header className="header">
      <div className="header__brand">
        <Link to="/" className="header__logo">🍲 RecipeFinder</Link>
        <nav className="header__nav">
          <Link to="/">Home</Link>
          <Link to="/favourites">Favourites</Link>
        </nav>
      </div>

      <form
        className="header__search"
        onSubmit={(e) => {
          e.preventDefault()
          onSearch?.()
        }}
      >
        <input
          type="text"
          placeholder="Search recipes…"
          value={query}
          onChange={(e) => onQueryChange?.(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="header__auth">
        {user ? (
          <button className="header__logout" onClick={handleLogout}>Log out</button>
        ) : (
          <Link to="/auth">Log in</Link>
        )}
      </div>
    </header>
  )
}
