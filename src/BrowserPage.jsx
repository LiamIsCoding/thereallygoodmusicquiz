import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './styles/browser_page.css'

// The browse page: shows a searchable list of all the quizzes
// Each card links to that quiz's own page (/quiz/<id>)
function BrowserPage() {
  // Quizzes for reading
  const [quizzes, setQuizzes] = useState({});

  const [loading, setLoading] = useState(true);

  // What the user has typed in the search bar
  const [search, setSearch] = useState('')

  const [sortBy, setSortBy] = useState('name-asc') // default sort by name

  useEffect(() => {
    async function loadQuizzes() {
      try {
        // Request quiz data
        const response = await fetch("/.netlify/functions/quizzes");

        // Set quizzes if data is received
        if (response.ok) {
          setQuizzes(await response.json());
        }
      }
      finally {
        setLoading(false);
      }
    }

    loadQuizzes();
  }, [])

  // Only keep the quizzes whose name or genre contains the search text (ignores capital letters)
  // This makes a new array each time, it does not change the original quizzes
  const filteredQuizzes = Object.entries(quizzes).filter(([index, { name, genre }]) => {
    const text = search.toLowerCase()
    return name.toLowerCase().includes(text) || genre.toLowerCase().includes(text)
  })

  // Sort the filtered quizzes
  const sortedQuizzes = [...filteredQuizzes].sort(([a, { name: nameA }], [b, { name: nameB }]) => {
    if (sortBy === 'name-asc') {
      return nameA.localeCompare(nameB)
    }
    if (sortBy === 'name-desc') {
      return nameB.localeCompare(nameA)
    }
    if (sortBy === 'genre-asc') {
      return quizzes[a].genre.localeCompare(quizzes[b].genre)
    }
    if (sortBy === 'genre-desc') {
      return quizzes[b].genre.localeCompare(quizzes[a].genre)
    }
    if (sortBy === 'timer-asc') {
      return quizzes[a].timer - quizzes[b].timer
    }
    if (sortBy === 'timer-desc') {
      return quizzes[b].timer - quizzes[a].timer
    }
    return 0
  })

  return (
    <>
      <div className="body">

        {/* Heading on the left, search bar on the right */}
        <div className="browse-top">
          <h2 id="list-heading">Browse Quizzes</h2>
          <div className="browse-controls">
            {/* Sort dropdown */}
            <select
              aria-label="Sort quizzes"
              className="sort-dropdown"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="genre-asc">Genre (A-Z)</option>
              <option value="genre-desc">Genre (Z-A)</option>
              <option value="timer-asc">Timer (shortest first)</option>
              <option value="timer-desc">Timer (longest first)</option>
            </select>
            {/* The search bar is controlled by state: typing updates `search` and the list re-renders */}
            <input
              type="search"
              className="search-bar"
              placeholder="Search by name or genre..."
              aria-label="Search quizzes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Message shown when nothing matches the search */}
        {/* Role="status" makes screen readers announce this message when it appears */}
        {sortedQuizzes.length === 0 && loading && <p className="no-results" role="status">Loading quizzes...</p>}
        {sortedQuizzes.length === 0 && !loading && <p className="no-results" role="status">No quizzes found.</p>}

        {/* one card per quiz, the key is the quiz's index so react can keep track of each card */}
        <ul className="quiz-list" aria-labelledby="list-heading">
          {sortedQuizzes.map(([index, { name, genre, timer }]) => (
            <li key={index} className="quiz-card">
              <h3 className="quiz-name">{name}</h3>
              <p>{genre}</p>
              <p>{timer} seconds</p>
              {/* Opens this quiz's page, e.g. /quiz/0
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