import { useParams, Link } from 'react-router-dom'
import './styles/details_page.css'
import NotFound from './NotFound.jsx'
import { useQuizzes } from './hooks/useQuizzes.js'
import { useQuizArtists } from './hooks/useQuizArtists.js'
import { artistUrl } from './api/lastfm.js'

// the quiz details page (/quiz/:id/details): shows which artists are in a quiz before you play it
// 1. loads the quizzes from cloud storage (same place the Browse page gets them)
// 2. looks up each song on Last.fm (track.search) to find its artist
// only artists are shown, not song titles, so the page doesn't give away the answers
// props: quizzes and search can be passed in by tests, the app uses the defaults
function QuizDetailsPage({ quizzes: testQuizzes, search } = {}) {
  // the quiz id from the url, e.g. "0" in /quiz/0/details
  const { id } = useParams()

  // hooks must run before any early return
  const quizzesState = useQuizzes({ initial: testQuizzes })
  const quiz = quizzesState.quizzes[id]
  const { status, artists, unmatched, missing, error, retry } = useQuizArtists(quiz, search ? { search } : undefined)

  // still loading the quiz itself
  if (quizzesState.status === 'loading') {
    return (
      <section className="details-page">
        <p className="details-message" role="status">Loading quiz…</p>
      </section>
    )
  }

  // couldn't load the quizzes at all
  if (quizzesState.status === 'error') {
    return (
      <section className="details-page">
        <div className="details-message details-error" role="alert">
          <p>Couldn't load the quiz: {quizzesState.error}</p>
          <button onClick={quizzesState.retry}>Retry</button>
        </div>
      </section>
    )
  }

  if (!quiz) {
    return <NotFound />
  }

  const questionCount = quiz.questions?.length ?? 0

  return (
    <section className="details-page" aria-labelledby="details-heading">
      <h2 id="details-heading">{quiz.name}</h2>
      <p className="details-meta">
        {quiz.genre} · {questionCount} {questionCount === 1 ? 'song' : 'songs'} · {quiz.timer} seconds
      </p>

      <h3>Artists in this quiz</h3>

      {/* loading: role="status" so screen readers announce it */}
      {status === 'loading' && (
        <p className="details-message" role="status">Looking up artists…</p>
      )}

      {/* error: role="alert" is announced right away, and Retry runs the request again */}
      {status === 'error' && (
        <div className="details-message details-error" role="alert">
          <p>Couldn't load the artists: {error}</p>
          <button onClick={retry}>Retry</button>
        </div>
      )}

      {/* no song names in this quiz */}
      {status === 'empty' && (
        <p className="details-message">Song info hasn't been added to this quiz yet.</p>
      )}

      {status === 'success' && (
        <>
          {artists.length === 0 ? (
            <p className="details-message">No artists were found for this quiz.</p>
          ) : (
            <ul className="artist-list">
              {artists.map(artist => (
                <li key={artist} className="artist-chip">
                  <a href={artistUrl(artist)} target="_blank" rel="noreferrer">
                    {artist}
                    {/* tells screen reader users the link opens a new tab */}
                    <span className="visually-hidden"> (opens Last.fm in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          {unmatched > 0 && (
            <p className="details-note">
              {unmatched} {unmatched === 1 ? 'song' : 'songs'} couldn't be found on Last.fm.
            </p>
          )}
        </>
      )}

      {missing > 0 && status !== 'empty' && (
        <p className="details-note">
          {missing} {missing === 1 ? 'question doesn\'t' : 'questions don\'t'} have song info yet.
        </p>
      )}

      <div className="details-actions">
        <Link to={`/quiz/${id}`} className="quiz-play">Play this quiz</Link>
        <Link to="/browse" className="details-back">Back to quizzes</Link>
      </div>
    </section>
  )
}

export default QuizDetailsPage
