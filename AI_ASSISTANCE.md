# How AI Assisted in Building RecipeFinder

## Following an established architecture, not inventing one
This project deliberately follows the MVVM pattern demonstrated in the
mentor session (Model = plain business logic, ViewModel = a custom hook
holding React state and actions, View = the component that renders it),
applied to a different API and domain (TheMealDB recipes instead of OMDb
movies). AI was directed prompt-by-prompt to build each layer in isolation
— e.g. explicitly told "no hooks, no direct fetch calls" when writing a
Model, and "no JSX" when writing a ViewModel — which kept the separation of
concerns intact instead of collapsing into one big component, which is the
usual failure mode when asking AI for a "recipe app" in one shot.

## Incremental, constrained prompting
Almost every prompt in `PROMPTS.md` includes explicit negative constraints
("don't add Firebase yet," "don't call fetch directly," "don't render JSX
here"). This was the single most useful technique — it stopped the AI from
front-loading functionality into the wrong layer, which is a natural
tendency when an LLM can see the end goal and wants to get there in fewer
steps.

## Boilerplate and repetitive scaffolding
AI generated the mechanical, well-known-shape code quickly: the MVVM file
skeletons, Firebase SDK initialization, typed error handling in
`authService.ts`, and CSS for each screen. This is where AI assistance
saved the most time relative to typing it by hand.

## Debugging a real behavioral bug
After building the Home screen, clearing the search box left stale search
results on screen instead of reloading the random recipe set. I described
the symptom ("when I search and then clear the search, the page doesn't
reload") and had AI trace it to the `useEffect` only running on mount, then
fix it so an empty query re-triggers `loadInitial()`.

## Where AI got things wrong or left gaps
- It initially wrote two nearly-identical route-guard components
  (`ProtectedRoute` and `RedirectIfAuthed`) instead of one parameterized
  component — the same "generate per-use-case instead of reusing" pattern
  seen in the mentor's own session structure. Caught on review, consolidated
  into a single `AuthGate` (see `IMPROVEMENTS.md`).
- The Firebase service functions caught errors and threw a new generic
  `Error`, discarding the original error object — meaning a genuine bug
  (e.g. malformed database rules) would look identical to a network
  hiccup in the UI, with no trace for debugging.
- There was no early check for missing/misconfigured Firebase environment
  variables — without it, a missing `.env` produces a cryptic low-level
  Firebase SDK error instead of a message actually telling you what's wrong.

## Where I did the work myself
I wrote and sequenced every prompt (including the explicit "don't do X yet"
constraints that kept each layer clean), set up the actual Firebase
project through the console (Authentication, Realtime Database, security
rules, web app registration), tested the full auth + favourites flow
end-to-end locally, and performed the three refactors documented in
`IMPROVEMENTS.md` by hand.
