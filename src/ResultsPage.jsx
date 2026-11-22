import { useState } from 'react'
import './styles/results.css'
import { NavLink } from 'react-router-dom'

function loadResults() {
  try {
    const stored = JSON.parse(localStorage.getItem('results') || '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

function ResultsPage() {
  const [results, setResults] = useState(loadResults)
  const [expanded, setExpanded] = useState(null)

  function clearResults() {
    if (!window.confirm('Delete all saved quiz results?')) return
    localStorage.removeItem('results')
    setResults([])
    setExpanded(null)
  }

  return (
    <section className="results-page" aria-labelledby="results-heading">
      <h2 id="results-heading">My Results</h2>
      {results.length === 0 ? (
        <div className="results-empty">
          <p>No saved quiz attempts yet. Complete a quiz to see your scores here.</p>
          <NavLink to="/browse">Find a Quiz</NavLink>
        </div>
      ) : (
        <>
          <p className="results-summary">{results.length} completed {results.length === 1 ? 'attempt' : 'attempts'}</p>
          <ul className="results-list">
            {[...results].reverse().map((result, reversedIndex) => {
              const originalIndex = results.length - 1 - reversedIndex
              const questions = Array.isArray(result.questions) ? result.questions : []
              const correct = questions.filter(q => q.answer === q.correct).length
              const open = expanded === originalIndex
              return (
                <li className="result-card" key={originalIndex}>
                  <div className="result-top">
                    <div>
                      <h3>{result.name || 'Music Quiz'}</h3>
                      <p>{result.genre || 'Music'} · {correct}/{questions.length} correct</p>
                    </div>
                    <strong className="result-score">{Number(result.score) || 0} pts</strong>
                  </div>
                  <button aria-expanded={open} onClick={() => setExpanded(open ? null : originalIndex)}>
                    {open ? 'Hide answers' : 'View answers'}
                  </button>
                  {open && (
                    <ol className="answer-list">
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
