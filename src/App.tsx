import { NotificationPreferencesForm } from './components/NotificationPreferencesForm'
import './App.css'

function App() {
  return (
    <main className="app">
      <NotificationPreferencesForm
        onSave={async (preferences) => {
          await new Promise((resolve) => setTimeout(resolve, 400))
          console.log('Saved notification preferences:', preferences)
        }}
      />
    </main>
  )
}

export default App
