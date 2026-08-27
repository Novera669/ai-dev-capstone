RecipeFinder

A React + TypeScript recipe search app, built for the AI-assisted development capstone, following the MVVM architecture and Firebase-backed favourites pattern demonstrated in the mentor session ("Using AI Effectively in React Development"), applied independently to a different domain: recipes via TheMealDB instead of movies via OMDb.

Features
Search recipes by name (TheMealDB API, no API key required)
Random selection of ~20 recipes shown on load
Save / remove favourites, backed by Firebase Realtime Database
Email/password authentication (Firebase Auth)
Favourites are private per-user (users/{uid}/favourites/..., enforced by database security rules)
/favourites is a protected route — signed-out visitors are redirected to /auth; clicking "Save" while signed out redirects there too
MVVM structure: every screen has a Model (business logic), a ViewModel (a custom hook holding state/actions), and a View (the component)
Getting started
1. Firebase project

You need your own Firebase project with Authentication (Email/Password provider enabled) and Realtime Database created.

Recommended database security rules (restricts each user to their own favourites):

json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
2. Environment variables

Copy .env.example to .env and fill in your Firebase web app config (Project settings → your app → SDK setup and configuration):

bash
cp .env.example .env
3. Install and run
bash
npm install
npm run dev

Open the printed local URL.

Build for production
bash
npm run build
npm run preview
Project structure
src/
  components/
    Header/            # nav + search bar
    RecipeCard/         # presentational recipe card
    AuthGate.tsx         # route guard (protects / redirects based on auth state)
  context/
    AuthContext.tsx      # global auth state via Firebase onAuthStateChanged
  pages/
    Home/
      HomeModel.ts        # search + random-recipe business logic
      useHomeViewModel.ts # React state/actions for Home
      HomeView.tsx         # renders Home
    Favourites/
      FavouritesModel.ts
      useFavouritesViewModel.ts
      FavouritesView.tsx
    Auth/
      AuthModel.ts
      useAuthViewModel.ts
      AuthView.tsx
  services/
    mealdbService.ts     # TheMealDB API — no React
    firebaseService.ts    # Firebase init + favourites CRUD — no React
    authService.ts         # Firebase Authentication — no React
  types/
    index.ts              # shared Recipe / TheMealDB types
Submission notes

This project was built with AI (Claude) as a development assistant, following the architecture from the mentor session. See:

PROMPTS.md — the prompt log used during development
AI_ASSISTANCE.md — how AI helped at each stage, and where it fell short
IMPROVEMENTS.md — before/after examples of manual fixes made after reviewing AI-generated code