// loads all quizzes from our cloud storage (the Netlify function in netlify/functions/quizzes.js)
// returns an object like { "0": { name, genre, timer, questions }, "1": { ... } }
// signal is from an AbortController so the request can be cancelled
export async function fetchQuizzes({ signal, fetchFn = fetch } = {}) {
  const response = await fetchFn('/.netlify/functions/quizzes', { signal })
  if (!response.ok) {
    throw new Error(`Couldn't load quizzes (${response.status})`)
  }
  return response.json()
}

// the song name to look up for a question:
// uses the "song" field if the quiz has one, otherwise the text of the correct answer
// (quizzes made on the Make a Quiz page only have options + correct)
export function songForQuestion(question) {
  if (!question) return null
  if (question.song) return question.song
  const answer = question.options?.[question.correct]
  return typeof answer === 'string' && answer.trim() ? answer.trim() : null
}
