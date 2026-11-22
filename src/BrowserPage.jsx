import { useState } from 'react'
import { Link } from 'react-router-dom'
import './styles/browser_page.css'
import quizData from './quizzes.json'

// the browse page: shows a searchable list of all the quizzes
// props: setPage switches to the quiz page, setQuiz tells the quiz page which quiz to load
function BrowserPage() {
  // turns the quizzes json object into an array of [index, quiz] pairs so it can be mapped over
  const quizzes = Object.entries(quizData)

  // what the user has typed in the search bar
  const [search, setSearch] = useState('')

  // only keep the quizzes whose name or genre contains the search text (ignores capital letters)
  // this makes a new array each time, it does not change the original quizzes
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

        {/* one card per quiz, the key is the quiz's index so react can keep track of each card */}
        <ul>
          {filteredQuizzes.map(([index, {name, genre, timer}]) => (
            <li key={index} className="quiz-card">
              <h3 className="quiz-name">{name}</h3>
              <p>{genre}</p>
              <p>{timer} seconds</p>
              {/* switches to the corresponding quiz page */}
              <Link to={`/quiz/${index}`} className="quiz-play">Play</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default BrowserPage