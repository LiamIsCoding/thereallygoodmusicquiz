import { useState } from 'react'
import './styles/results.css'
import { NavLink } from 'react-router-dom'

// reads the saved quiz attempts out of localStorage
// QuizPage saves each finished quiz into the 'results' key as a JSON array
// if nothing is saved yet, or the saved data is broken/not an array, we fall back to an empty list
// so the page never crashes because of bad storage
function loadResults() {
  try {
    const stored = JSON.parse(localStorage.getItem('results') || '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

// the "My Results" page: lists every quiz attempt the player has finished, newest first
function ResultsPage() {
  // the saved attempts, passing the function (not calling it) means it only reads localStorage once
  const [results, setResults] = useState(loadResults)
  // which card has its answers open (the attempt's index in `results`), null means all closed
  const [expanded, setExpanded] = useState(null)

  // deletes every saved attempt after the player confirms
  // clears localStorage AND the state so the page updates right away
  function clearResults() {
    if (!window.confirm('Delete all saved quiz results?')) return
    localStorage.removeItem('results')
    setResults([])
    setExpanded(null)
  }

  return (
    // aria-labelledby names this section with its heading for screen readers
    <section className="results-page" aria-labelledby="results-heading">
      <h2 id="results-heading">My Results</h2>

      {/* empty state: nothing saved yet, so point the player to the quizzes */}
      {results.length === 0 ? (
        <div className="results-empty">
          <p>No saved quiz attempts yet. Complete a quiz to see your scores here.</p>
          <NavLink to="/browse" className="results-browse-link">Find a Quiz</NavLink>
        </div>
      ) : (
        <>
          <p className="results-summary">{results.length} completed {results.length === 1 ? 'attempt' : 'attempts'}</p>
          <ul className="results-list">
            {/* copy then reverse so the newest attempt is first without changing the saved order */}
            {[...results].reverse().map((result, reversedIndex) => {
              // work out where this attempt sits in the original (not reversed) array,
              // that index stays the same for each attempt so it is used as the key and for `expanded`
              const originalIndex = results.length - 1 - reversedIndex
              // older/broken saves might not have a questions array, so default to empty
              const questions = Array.isArray(result.questions) ? result.questions : []
              // count the rounds where the chosen option matches the correct option
              const correct = questions.filter(q => q.answer === q.correct).length
              const open = expanded === originalIndex
              // id for the answer list so the toggle button can point at it with aria-controls
              const answersId = `answers-${originalIndex}`
              return (
                <li className="result-card" key={originalIndex}>
                  <div className="result-top">
                    <div>
                      <h3>{result.name || 'Music Quiz'}</h3>
                      <p>{result.genre || 'Music'} · {correct}/{questions.length} correct</p>
                    </div>
                    {/* Number() || 0 makes sure a missing score shows as 0 instead of NaN */}
                    <strong className="result-score">{Number(result.score) || 0} pts</strong>
                  </div>

                  {/* opens this card's answers (or closes it if already open)
                      aria-expanded tells screen readers whether the list is showing */}
                  <button
                    aria-expanded={open}
                    aria-controls={answersId}
                    onClick={() => setExpanded(open ? null : originalIndex)}
                  >
                    {open ? 'Hide answers' : 'View answers'}
                  </button>

                  {/* round by round breakdown, only rendered while the card is open */}
                  {open && (
                    <ol className="answer-list" id={answersId}>
                      {questions.map((q, i) => (
                        <li key={i}>
                          Round {i + 1}: {q.answer === q.correct ? 'Correct' : 'Incorrect'} — {Number(q.points) || 0} points
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              )
            })}
          </ul>
          <button className="clear-results" onClick={clearResults}>Clear saved results</button>
        </>
      )}
    </section>
  )
}

export default ResultsPage
