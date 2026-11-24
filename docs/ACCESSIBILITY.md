# Accessibility & UI/UX check (Milestone 3, issue #66)

**Checked by:** Qudsia Fawad · **Date:** 2026-11-23 · **Pages:** Browse, Quiz, My Results, Make a Quiz, Not Found

## How it was checked

- **Keyboard only:** tabbed through every page and used Enter/Space on every control.
- **Screen-reader view:** read the accessibility tree that Chrome exposes (names, roles, headings,
  landmarks) for each page and quiz state (before start, playing, finished).
- **Colour contrast:** worked out WCAG contrast ratios for every text/background colour pair in
  our CSS variables.
- **Responsive:** checked at desktop width (1100px) and phone width (375px).

**Lighthouse Accessibility (desktop, local production build, 2026-11-24):**

| Page | Score |
|------|-------|
| Browse (`/browse`) | 100 |
| My Results (`/results`) | 100 |
| Quiz (`/quiz/0`) | 100 |
| Make a Quiz (`/make`) | to do after #54 |

## What was found and fixed

| # | Problem | WCAG | Fix |
|---|---------|------|-----|
| 1 | The router links (nav, Play, Find a Quiz, Back to Quizzes) had no styles, so they were default blue underlined text on dark purple (about **1.5:1**, unreadable). | 1.4.3 | Styled them like the existing buttons in `index.css` (same size, border, hover). |
| 2 | White text on pink (`#ff4f9a`) buttons was **3.1:1** (Play, Start Quiz, every button on hover). Normal-size text needs 4.5:1. | 1.4.3 | Added `--accent-strong: #d6246f` for pink backgrounds behind white text (**4.8:1**). Bright pink is still used for borders and the score text (4.9:1 on cards). |
| 3 | Search box border was **1.6:1** against the card. Form fields need 3:1 so you can see where they are. The search box also removed its focus outline. | 1.4.11, 2.4.7 | Added `--border-strong: #8172bf` (**3.6:1**) for the search box, and stopped removing the outline. |
| 4 | Focus rings came from the browser default and were hard to see on the dark purple. | 2.4.7 | Added a 3px yellow `:focus-visible` ring to buttons and inputs. It only shows when using the keyboard. |
| 5 | Every quiz card link was just called "Play", so a screen reader heard "Play, Play, Play". | 2.4.6, 4.1.2 | Gave each Play link a unique name with `aria-label`, e.g. "Play quiz 1". |
| 6 | The quiz page had no heading, so you couldn't tell which quiz you were in. | 1.3.1, 2.4.6 | Added the quiz name as an `<h2>`. |
| 7 | The song progress bar had no name. | 4.1.2 | `aria-label="Song clip progress"`. |
| 8 | Round, score and points changes were silent for screen-reader users. | 4.1.3 | `aria-live="polite"` on those values. The "Quiz complete" box is `role="status"`, and so is "No quizzes found". |
| 9 | "Hint" didn't say what it costs. | 3.3.2 | Its accessible name is now "Hint: hear 5 more seconds for 20 fewer points". |
| 10 | Changing pages left keyboard focus on a link that had just disappeared, so the next Tab started from the top of the document. | 2.4.3 | `<main>` gets focus when the URL changes (not on first load or the `/` → `/browse` redirect). |
| 11 | The nav didn't visibly show which page you were on. | 1.3.1 | `NavLink` already sets `aria-current="page"`. I added a pink border for that link so sighted users can see it too. |
| 12 | Finishing a quiz was a dead end. | — (UX) | Added a "See my results" link on the "Quiz complete" screen. |
| 13 | `browser_page.css` styled **every** `<ul>` in the app, including lists on other pages. | — (bug) | Scoped the rule to `.quiz-list`, and removed bullets from the Make a Quiz lists directly. |
| 14 | On phones the quiz cards hugged the left edge and the search bar was a fixed width. | 1.4.10 | Cards are centred and the search bar is full width under 600px. |
| 15 | The browser tab said "thereallygoodmusicquiz" and `favicon.svg` was missing (404). | 2.4.2 | Changed the title to "The Really Good Music Quiz", added a meta description, and added `public/favicon.svg`. |

Already good: `lang="en"`, one `<h1>`, `<header>` / `<nav>` / `<main>` landmarks,
real `<button>`s for actions and links for navigation, routed pages with a Not Found page, a labelled search box, the results toggle using `aria-expanded`, and a
confirm step before clearing results. Muted text (7.6:1) and teal points (10.1:1) pass contrast.

## Still to do (recommendations for the team)

- **Answer feedback:** after picking an option, nothing says whether you were right. A short
  "Correct!" / "It was *song 2*" message (in a `role="status"` element) would help everyone.
- **Spacing with `<br />`:** `QuizPage.jsx` uses `<br />` for spacing. A flex column in CSS would be
  cleaner. Leave this until QuizPage is in its final state (#60, #63).
- **Audio errors:** if a song link has expired, Play fails silently (only `console.error`).
  Show a visible message once #63 replaces the temporary links.
- **Make a Quiz form (#54, still in progress, not changed in this pass):**
  - Add a page heading (`<h2>Make a Quiz</h2>`). Right now the page jumps straight to `<h3>`s.
  - Use visible `<label>`s instead of placeholder-only fields. Placeholders disappear when you type.
  - The four radios are all called "Correct Option" and the four text boxes are all called
    "Option", so a screen reader can't tell them apart. Use names like "Question 1, option 2"
    and "Question 1, option 2 is correct", or wrap each question in a `<fieldset>` with a
    `<legend>`.
  - Give the timer `min="1"`, and say "seconds" in its label.
  - After Submit, show a text message (e.g. in `role="status"`) so people know it worked.
  - The form still needs styling: inputs are the browser default white boxes.
- **New pages:** follow the same rules: label every input, show errors in text (not just colour),
  and use `--accent-strong` behind white text.
- **Re-run this check** on the deployed site after #54, #63 and #67 are merged.
