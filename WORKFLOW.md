# WORKFLOW.md — Vague vs. Precise Prompting Drill

## Setup
Feature: a notification preferences settings form. Built twice on separate
branches (`round-1-vague`, `round-2-precise`) in fresh AI sessions.

## Round 1: Vague prompt
Prompt: "Build a settings form for notification preferences." No file
references, no constraints, no examples, no verification step. Took roughly
5–10 minutes and felt effortless.

The AI interpreted the feature broadly on its own: delivery channels, topic
categories, digest frequency, and quiet hours with start/end times. It
included baseline validation ("enable at least one channel," start ≠ end
time) and reasonable semantic HTML (fieldset/legend, label-wrapped inputs,
aria-labelledby, role="alert"/role="status"). No tests were written.

## Round 2: Precise prompt
Prompt specified exact fields (email/SMS toggles, frequency dropdown,
conditional phone number), a required library pairing (react-hook-form +
zod), explicit accessibility requirements, example interaction behavior, and
a verification step instructing the AI to write and run tests. Took roughly
20–40 minutes total, including manual debugging described below.

The AI built exactly the four specified fields. Phone validation used zod's
`.superRefine()` to require and format-check the phone number only when SMS
is enabled — matching the spec precisely. It cleared the phone error via a
`useEffect` when SMS was toggled off, matching the stated example behavior.
Accessibility went further than Round 1: `aria-invalid` and
`aria-describedby` (via `useId()`) explicitly linked the phone input to its
error message. It wrote 5 unit tests (default render, conditional field,
validation error, error clearing, valid submit) and all passed.

## The AI mistake I caught
Despite 5 passing tests, the app didn't actually run. The AI never created
`index.html`, `main.tsx`, or `App.tsx` on the `round-2-precise` branch, so
the dev server returned a 404 and the browser showed a blank page. The tests
exercised the component directly through a test harness, so they passed
without ever confirming the component was mounted anywhere real. I had to
manually pull the missing entry-point files from Round 1 and repoint
`App.tsx` at the new component before the form actually rendered. This was
the single biggest lesson of the drill: passing unit tests are not the same
as a working app, and "write it, then write tests and run them" doesn't
automatically verify integration — it only verifies what the tests were
written to check.

## Review effort
Round 1 felt fast and required no fixing, but built the wrong scope with no
way to verify its own claimed behavior. Round 2 felt slower up front and
required real debugging time on top of the AI's own work, but the extra time
went toward catching an actual integration bug rather than re-litigating
scope. End to end, Round 2 took longer, but it's the version I'd trust
without a full manual re-test — once the entry point bug is understood, it's
a five-minute fix, and future rounds should tell the AI to confirm the app
actually renders, not just that unit tests pass.