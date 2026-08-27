# Development Prompt Log

RecipeFinder was built following the same architecture and workflow shown in
the mentor session ("Using AI Effectively in React Development" — Ishak,
FlyRank Internship, July 2026), applied independently to a different domain
(recipes via TheMealDB, instead of movies via OMDb). Prompts below are in
the order they were used with Claude.

---

### 1. Project setup
> "Initialize a new React application using Vite, React, and TypeScript.
> Use functional components only. Do not install any UI library. Do not add
> any recipe functionality yet."
>
> "Remove all default Vite content, images, styles, and demonstration code.
> Leave a minimal working React application with an empty App component."

### 2. Header
> "Create a reusable Header component. It should contain: a Home navigation
> link, a Favourites navigation link, a search input, and a Search button.
> Use React Router links for navigation. Only create and display the
> Header — do not create the Home or Favourites screens yet, and don't
> connect the search input to any functionality yet."
>
> "Add styling to the header."

### 3. Home MVVM structure
> "Create the empty MVVM file structure for the Home screen: HomeModel.ts,
> useHomeViewModel.ts, HomeView.tsx. HomeModel will later hold Home-specific
> data and business logic, useHomeViewModel will hold React state and
> actions, HomeView will render the UI. Create only minimal placeholder
> exports so the app compiles — no API requests, state, or recipe UI yet."

### 4. Favourites MVVM structure
> "Create the same empty MVVM structure for the Favourites screen:
> FavouritesModel.ts, useFavouritesViewModel.ts, FavouritesView.tsx. Minimal
> placeholder exports only — no Firebase, state, or recipe cards yet."

### 5. TheMealDB service
> "Create a services folder and an empty TheMealDB service file. Add a
> comment explaining it will contain communication with TheMealDB. Don't
> implement the request yet."
>
> "Implement the recipe search request. Create an exported async function
> searchRecipes(query: string): Promise<Recipe[]> that calls TheMealDB's
> search.php endpoint, normalizes the raw meal objects into our Recipe
> type, and throws a readable error on failure. No React hooks, no
> useEffect, no component state — this file is pure data access."

### 6. Home model, view model, and view
> "Implement HomeModel.getMovies-equivalent — call it getRecipes(query).
> Trim the query, require at least 2 characters, call searchRecipes, and
> return the list. No hooks, no direct fetch calls."
>
> "Implement useHomeViewModel: manage query, recipes, loading, and error
> with useState. Add handleSearch() that sets loading, clears the previous
> error, calls getRecipes, and updates state. Return everything HomeView
> needs. No JSX, no direct service imports."
>
> "Implement HomeView: use useHomeViewModel, display a loading message,
> display errors, render the recipe list with .map(). Don't add a search
> input here — we already have one in the Header."

### 7. Initial random recipes
> "Add an initialRecipes() function to HomeModel that automatically loads
> at least 20 recipes when the Home screen opens, using a different random
> selection each time. Pick random keywords from a seed list (Chicken,
> Beef, Pasta, Curry, etc.), fetch them in parallel with Promise.all,
> dedupe by id, shuffle, and return exactly 20. Keep it all in HomeModel,
> no hooks, no direct fetch calls."

### 8. RecipeCard
> "Create a reusable RecipeCard component that takes one Recipe via props
> and displays the thumbnail, title, category, and area. Add a Favourite
> button but don't wire it up yet — keep this component purely
> presentational, no API calls."
>
> "Update HomeView to render RecipeCard instead of raw markup."

### 9. Home reload bug
> "When I search for a recipe and then clear the search, the page doesn't
> reload the random recipes — it should. Debug and fix this."

### 10. Firebase setup and favourites
> "Configure Firebase. Create firebaseService.ts that initializes Firebase
> using environment variables and exports the database instance. Don't
> save or load favourites yet, don't modify HomeView, don't add
> authentication yet."
>
> "Add favourites functions to firebaseService.ts: addFavourite(userId,
> recipe), removeFavourite(userId, recipeId), getFavourites(userId). Use
> recipe id as the unique key. Keep all Firebase calls inside this service.
> Throw readable errors. No hooks, no UI updates yet."
>
> "Implement FavouritesModel as a thin wrapper around firebaseService:
> loadFavourites, saveFavourite, deleteFavourite."
>
> "Implement useFavouritesViewModel: manage favourites/loading/error with
> useState, load favourites with useEffect on mount, expose removeMovie
> (equivalent removeRecipe). Use FavouritesModel only, not firebaseService
> directly."
>
> "Implement FavouritesView using useFavouritesViewModel: loading state,
> error state, render favourites with RecipeCard, friendly empty message,
> allow removing a recipe."
>
> "Connect the Favourite button on Home — right now clicking it does
> nothing, it should save that recipe to the signed-in user's favourites
> in Realtime Database."

### 11. Auth and Firestore/Realtime DB config
> "Update firebaseService.ts to also initialize Firebase Authentication
> (getAuth) alongside the Realtime Database (getDatabase), reading config
> from Vite environment variables, using the modular SDK. Also create an
> .env.example with placeholder Firebase variables."

### 12. Authentication
> "Create authService.ts with registerUser, loginUser, logoutUser, and
> subscribeToAuthChanges, using Firebase Authentication's modular
> functions. Convert Firebase error codes into readable messages. No
> hooks, no JSX."
>
> "Create the Auth MVVM structure (AuthModel.ts, useAuthViewModel.ts,
> AuthView.tsx) with minimal placeholder exports so the app still
> compiles."
>
> "Implement AuthModel: register/login/logout functions that trim and
> validate the email, require a 6+ character password, then call the
> matching authService function. No hooks, no direct Firebase calls."
>
> "Implement useAuthViewModel: manage email, password, mode
> (login/register), loading, and error with useState. handleSubmit calls
> AuthModel.login or .register depending on mode, clears the password on
> success, stores readable errors. Return everything AuthView needs."
>
> "Implement AuthView: controlled email/password inputs, a submit button
> disabled while loading, a mode-toggle button, readable error display,
> proper form submission handling."
>
> "Create a global AuthContext using onAuthStateChanged through
> authService. Expose user, authLoading, and logout. Wrap the app in
> AuthProvider. Unsubscribe on unmount."

### 13. Routing and auth UX
> "Update routing: /auth shows AuthView, Home stays public, /favourites is
> protected — redirect unauthenticated visitors to /auth and redirect
> already-authenticated users away from /auth. Preserve the Header on
> every page."
>
> "If an unauthenticated visitor clicks the Favourite button on Home,
> redirect them toward login instead of doing nothing."
>
> "Move that favourite-click redirect logic into the view model rather
> than the view."

### 14. Per-user favourites structure
> "Update the favourites service so favourites are stored under the
> signed-in user's own profile: users/{userId}/favourites/{recipeId}.
> Update addFavourite/removeFavourite/getFavourites to accept userId. Don't
> read auth.currentUser inside the service — the caller passes it in.
> Throw a readable error if userId is missing."

### 15. Logout
> "Add a logout button in the Header, wired to the logout function from
> AuthContext."

### 16. Build verification
> "Run tsc -b && vite build and fix any TypeScript or build errors before
> considering this done."

### 17. Review and refactor pass
> "Review the generated code for duplicated logic, fragile assumptions,
> and missed edge cases — the kind of things a careful reviewer would flag
> before merging. Point them out so I can fix them by hand."

### 18. Documentation for submission
> "I need to submit this with the completed app, this prompt log, a short
> explanation of how AI assisted, and concrete examples of manual fixes I
> made after reviewing the generated code. Help me draft the write-ups."
