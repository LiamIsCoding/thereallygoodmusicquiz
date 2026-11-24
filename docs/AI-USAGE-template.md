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

### #1 - Generate a price-formatting helper
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

### #2 - Generate a price-formatting helper
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

### #3 - Generate a price-formatting helper
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