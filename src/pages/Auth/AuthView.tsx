import { useAuthViewModel } from './useAuthViewModel'
import './AuthView.css'

export default function AuthView() {
  const { email, setEmail, password, setPassword, mode, loading, error, handleSubmit, toggleMode } =
    useAuthViewModel()

  return (
    <main className="auth">
      <form
        className="auth__form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <h1>{mode === 'login' ? 'Login' : 'Create Account'}</h1>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="auth__error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
        </button>

        <button type="button" className="auth__toggle" onClick={toggleMode}>
          {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Log in'}
        </button>
      </form>
    </main>
  )
}
