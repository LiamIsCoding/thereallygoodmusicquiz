import { useState } from 'react'
import './styles/browser_page.css'
import quizData from './quizzes.json'

function BrowserPage({setPage, setQuiz}) {
  const quizzes = Object.entries(quizData)

  // what the user has typed in the search bar
  const [search, setSearch] = useState('')

  // only keep the quizzes whose name or genre contains the search text
  const filteredQuizzes = quizzes.filter(([index, {name, genre}]) => {
    const text = search.toLowerCase()
    return name.toLowerCase().includes(text) || genre.toLowerCase().includes(text)
  })

  return (
    <>
      <div className="body">

        {/* heading on the left, search bar on the right */}
        <div className="browse-top">
          <h2 id="list-heading">Browse Quizzes</h2>

          {/* the search bar is controlled by state: typing updates `search` and the list re-renders */}
          <input
            type="text"
            className="search-bar"
            placeholder="Search by name or genre..."
            aria-label="Search quizzes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* message shown when nothing matches the search */}
        {filteredQuizzes.length === 0 && <p className="no-results">No quizzes found.</p>}

        <ul>
          {filteredQuizzes.map(([index, {name, genre, timer}]) => (
            <li key={index} className="quiz-card">
              <h3 className="quiz-name">{name}</h3>
              <p>{genre}</p>
              <p>{timer} seconds</p>
              <button onClick={() => {setPage('quiz'); setQuiz(Number(index))}}>Play</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default BrowserPage