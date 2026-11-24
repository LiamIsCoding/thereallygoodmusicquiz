import { useState } from 'react'
import { Link } from 'react-router-dom'
import './styles/browser_page.css'
import quizData from './quizzes.json'

// the browse page: shows a searchable list of all the quizzes
// each card links to that quiz's own page (/quiz/<id>)
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
            type="search"
            className="search-bar"
            placeholder="Search by name or genre..."
            aria-label="Search quizzes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* message shown when nothing matches the search */}
        {/* role="status" makes screen readers announce this message when it appears */}
        {filteredQuizzes.length === 0 && <p className="no-results" role="status">No quizzes found.</p>}

        {/* one card per quiz, the key is the quiz's index so react can keep track of each card */}
        <ul className="quiz-list" aria-labelledby="list-heading">
          {filteredQuizzes.map(([index, {name, genre, timer}]) => (
            <li key={index} className="quiz-card">
              <h3 className="quiz-name">{name}</h3>
              <p>{genre}</p>
              <p>{timer} seconds</p>
              {/* opens this quiz's page, e.g. /quiz/0
                  aria-label gives each Play link a unique name, e.g. "Play quiz 1" */}
              <Link to={`/quiz/${index}`} className="quiz-play" aria-label={`Play ${name}`}>Play</Link>
              {/* opens the details page that shows which artists are in this quiz */}
              <Link to={`/quiz/${index}/details`} className="quiz-details" aria-label={`Details for ${name}`}>Details</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default BrowserPage