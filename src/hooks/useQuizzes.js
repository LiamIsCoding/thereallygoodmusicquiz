import { useState, useEffect } from 'react'
import { fetchQuizzes } from '../api/quizzes.js'

// custom hook: loads all quizzes from cloud storage
// returns { status, quizzes, error, retry }
//   status: 'loading' | 'success' | 'error'
// pass { initial } to skip loading and use those quizzes instead (used by tests)
export function useQuizzes({ initial, load = fetchQuizzes } = {}) {
  const [state, setState] = useState(
    initial ? { status: 'success', quizzes: initial, error: null } : { status: 'loading', quizzes: {}, error: null }
  )
  // bumping this number re-runs the effect, that's how retry works
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (initial) return

    // cancel the request if the user leaves the page before it finishes
    const controller = new AbortController()
    setState(s => ({ ...s, status: 'loading', error: null }))

    load({ signal: controller.signal })
      .then(quizzes => setState({ status: 'success', quizzes: quizzes || {}, error: null }))
      .catch(error => {
        // a cancelled request is expected, not a real error
        if (error.name === 'AbortError') return
        setState({ status: 'error', quizzes: {}, error: error.message })
      })

    return () => controller.abort()
  }, [initial, load, attempt])

  return { ...state, retry: () => setAttempt(a => a + 1) }
}
