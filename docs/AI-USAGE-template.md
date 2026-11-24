# AI-USAGE.md

This file logs every time an AI tool contributed to submitted code in this project.
Add an entry before you commit the AI-assisted code. (Using AI only to learn -
explanations, error messages, design talk - does not need an entry.) See the course AI
policy. Reminder: **milestones 1-2 (weeks 3, 6) must be AI-free** - this file should
be empty until the third milestone.

Also drop a marker where the code lives: `// AI-assisted - see AI-USAGE.md #<n>`.

---

## Entry template (copy for each use)

### #N - <short title>
- **Date:** YYYY-MM-DD
- **Member:** <your name>
- **Tool / model:** <e.g. free-tier assistant> (free models only)
- **Files:** `src/...`, `src/...`
- **Prompt (verbatim):**

  ```
  <paste the exact prompt you gave the AI>
  ```

- **What it produced & what I changed:** <1–3 sentences: did you keep it as-is, edit it,
  rewrite parts? why is it correct?>

---

## Log

<!-- Entries go below, newest last. Example: -->

### #1 - Display check
- **Date:** 2026-10-30
- **Member:** Sasha Dmitriev
- **Tool / model:** gemini (AI overview)
- **Files:** `src/QuizPage.jsx`
- **Prompt (verbatim):**

  ```
  how to make something only display if a variable is true jsx
  ```

- **What it produced & what I changed:** 
"To make something display only when a variable is true in JSX, you should use the logical AND (&&) operator inside curly braces" I used && operator to render quiz buttons.

### #2 - Growing input form
- **Date:** 2026-11-22
- **Member:** Sasha Dmitriev
- **Tool / model:** gemini (AI overview)
- **Files:** `src/MakePage.jsx`
- **Prompt (verbatim):**

  ```
  how to make an input form that you can add new instances to react
  ```

- **What it produced & what I changed:** 
Gave boiler plate code for form, including update functions. I referenced the update logic and some of the add/remove logic, and instead made the form use li to be similar to the browser format

### #3 - Netlify bug
- **Date:** 2026-11-23
- **Member:** Sasha Dmitriev
- **Tool / model:** gemini (AI overview)
- **Files:** `netlify.toml`
- **Prompt (verbatim):**

  ```
  Page not found
  Looks like you’ve followed a broken link or entered a URL that doesn’t exist on this site.

  If this is your site, and you weren’t expecting a 404 for this path, please visit Netlify’s “page not found” support guide for troubleshooting tips.
  On reload
  ```

- **What it produced & what I changed:** 
basic redirects fix for the .toml file, used the fix and debugged

### #4 - Generate a price-formatting helper
- **Date:** 2026-11-23
- **Member:** Sasha Dmitriev
- **Tool / model:** gemini (AI overview)
- **Files:** `netlify/functions/quizzes.js`
- **Prompt (verbatim):**

  ```
  how to access and save information in netlify using react
  ```

- **What it produced & what I changed:** 
Made a basic data saving and loading function, I changed it to instead work with quizzes and take json directly

### #5 - Test environment fix (issue #65)
- **Date:** 2026-11-24
- **Member:** Qudsia Fawad
- **Tool / model:** Claude
- **Files:** `src/QuizDetailsPage.test.jsx`, `package.json`
- **Prompt (verbatim):**

  ```
  The component tests time out on startup with "Failed to start forks worker". Suggest a fix that works in my WSL setup.
  ```

- **What it produced & what I changed:** 
Switched the component tests from jsdom to the lighter happy-dom environment. I installed happy-dom, and all tests passed.

### #6 - Details page loads quizzes from cloud storage (issue #65)
- **Date:** 2026-11-24
- **Member:** Qudsia Fawad
- **Tool / model:** Claude 
- **Files:** `src/api/quizzes.js`, `src/api/quizzes.test.js`, `src/hooks/useQuizzes.js`, `src/hooks/useQuizArtists.js`, `src/QuizDetailsPage.jsx`, `src/QuizDetailsPage.test.jsx`

**Prompt (verbatim):**

  ```
  Quizzes are now stored with Netlify Blobs instead of quizzes.json. Update the details page so it loads quizzes from cloud storage and works for quizzes created on the Make a Quiz page.

  ```

- **What it produced & what I changed:**
The details page now loads quizzes from the Netlify function (with its own loading/error/Retry) instead of `quizzes.json`. For quizzes made on the website, which have no `song` field, it uses the correct answer's text as the song name. I merged milestone4 into my branch and confirmed all tests pass. I then put `quizzes.json` and `scripts/update-song-urls.mjs` back to the milestone4 versions, so the app only uses the cloud quiz data.

### #7 - Make a Quiz page accessibility (issue #66)
- **Date:** 2026-11-24
- **Member:** Qudsia Fawad
- **Tool / model:** Claude 
- **Files:** `src/MakePage.jsx`, `src/styles/make_page.css`, `docs/ACCESSIBILITY.md`

**Prompt (verbatim):**

  ```
  The Make a Quiz page is now finished. Fix its accessibility issues from docs/ACCESSIBILITY.md (heading, labels, unique control names, submit feedback, contrast) without changing the existing saving logic or design.
  ```

- **What it produced & what I changed:**
A page heading, visible labels for name/genre/timer, unique screen reader names for each answer box and radio button, a "Saving..." state, and a success or error message after submitting. It also raised the input border and placeholder contrast and kept the keyboard focus outline. Sasha's saving logic and layout were kept. I ran Lighthouse on `/make`.

### #8 - Lighthouse list warning fix (issue #66)
- **Date:** 2026-11-24
- **Member:** Qudsia Fawad
- **Tool / model:** Claude 
- **Files:** `src/MakePage.jsx`

**Prompt (verbatim):**

  ```
  Lighthouse scores `/make` at 96 with the flag "List items (`<li>`) are not contained within `<ul>`, `<ol>` or `<menu>` parent elements". Fix it without losing the radio-group semantics.

  ```

- **What it produced & what I changed:**
Moved `role="radiogroup"` from the `<ul>` to a wrapping `<div>`, so the answers stay a real list. Re-running Lighthouse gave 100, and I added the score to `docs/ACCESSIBILITY.md`.