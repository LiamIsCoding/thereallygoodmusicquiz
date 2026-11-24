
import { useState, useEffect, useRef } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import './styles/quiz_page.css'
import { useQuizzes } from './hooks/useQuizzes.js'
import NotFound from './NotFound'


//shuffles the questions so the quiz is not the same each time
function shuffleQuestions(items) {
  const shuffled = [...items]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = current
  }

  return shuffled
}

//builds the result object to save in localStorage after the quiz is finished, uses the shuffled questions to make sure the results match the order of the questions that were actually asked
function buildResults(quiz, finalScore, finalAnswers, finalQPoints, questions) {

  return {
    name: quiz.name,
    genre: quiz.genre,
    timer: quiz.timer,
    score: finalScore,
    questions: questions.map((question, i) => ({
      answer: finalAnswers[i],
      correct: question.correct,
      points:
        finalAnswers[i] === question.correct
          ? finalQPoints[i]
          : 0
    }))
  }
}

function QuizPage() {
  // Get the selected quiz
  const { id } = useParams()
  const { status, quizzes, error, retry } = useQuizzes()
  const quiz = quizzes[id]
  const questionsReady =
    status === 'success' && Boolean(quiz?.questions?.length)

  // Store answers and points for each question
  const [answers, setAnswers] = useState([])
  const [qPoints, setQPoints] = useState([])

  // Quiz progress
  const [start, setStart] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [questions, setQuestions] = useState([])
  const question = questions[questionIndex]
  const [questionPoints, setQuestionPoints] = useState(100)

  // Quiz completion
  const finished = quiz && start && !question

  const [score, setScore] = useState(0)

  //url info
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewError, setPreviewError] = useState('')

  //helper function to fetch the preview url from Deezer
  async function fetchDeezerPreviewUrl(songName, abortSignal) {
    const res = await fetch(
      `/.netlify/functions/deezer-preview?song=${encodeURIComponent(songName)}`,
      { signal: abortSignal }
    )
    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || `Preview lookup failed (${res.status})`)
    }

    return data.previewUrl
  }


  // Save the quiz result after completion
  useEffect(() => {

    if (!finished || !quiz) return


    const saved = JSON.parse(
      localStorage.getItem('results') || '[]'
    )

    saved.push(buildResults(quiz, score, answers, qPoints, questions))

    localStorage.setItem(
      'results',
      JSON.stringify(saved)
    )
  }, [finished])

  // Audio playback
  const clipSeconds =
    5 + ((100 - questionPoints) / 20) * 5

  const audioRef = useRef(null)
  const [elapsed, setElapsed] = useState(0)


  // Stop audio when changing questions or leaving the quiz
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.ontimeupdate = null
        audioRef.current = null
      }
    }
  }, [questionIndex])

  //get the song name from the question to then find the urls
  const songName = question?.options?.[question.correct]

  // Fetch the preview URL from Deezer when the quiz starts or the question changes
  useEffect(() => {
    setPreviewUrl(null)
    setPreviewError('')

    if (!start || !question || !songName) return

    const controller = new AbortController()

    fetchDeezerPreviewUrl(songName, controller.signal)
      .then(setPreviewUrl)
      .catch(error => {
        if (error.name !== 'AbortError') setPreviewError(error.message)
      })

    return () => controller.abort()
  }, [start, id, questionIndex, songName])


  // Check if quiz exists
  if (!quiz && status === 'success') {
    return <NotFound />
  }
  if (status === 'error') {
    return (
      <section className="details-page">
        <div className="details-message details-error" role="alert">
          <p>Couldn't load the quiz: {error}</p>
          <button onClick={retry}>Retry</button>
        </div>
      </section>
    )
  }


  return (
    <>
      <section id="quiz" aria-labelledby="quiz-title">

        {/* quiz name so the player knows which quiz they picked */}
        <h2 id="quiz-title" className="quiz-title">{status === 'loading' ? 'Loading questions...' : quiz.name}</h2>

        {/* Start quiz */}
        {!start && (
          <button
            id="startQuizBtn"
            disabled={!questionsReady}
            onClick={() => {
              //this is where it actually shuffles
              setQuestions(shuffleQuestions(quiz.questions))
              setStart(true)
              setQuestionIndex(0)
              setScore(0)
              setAnswers([])
              setQPoints([])
              setQuestionPoints(100)
              setElapsed(0)
            }}
          >
            Start Quiz
          </button>
        )}

        {start && question && <br />}

        {/* Round counter */}
        {start && question && (
          <span id="round" aria-live="polite">
            Round {questionIndex + 1}
          </span>
        )}

        {start && question && <br />}

        {/* Current score */}
        {start && question && (
          <span id="score" aria-live="polite">
            Score: {score}
          </span>
        )}

        {start && question && <br />}

        {/* Available points */}
        {start && question && (
          <span id="points" aria-live="polite">
            Points Available: {questionPoints}
          </span>
        )}

        {start && question && <br />}

        {/* Audio progress */}
        {start && question && (
          <progress
            id="song_progress"
            aria-label="Song clip progress"
            value={elapsed}
            max={clipSeconds}
          />
        )}

        {start && question && <br />}

        {/* Play the song */}
        {start && question && (
          <button
            id="playSongBtn"
            disabled={!previewUrl}
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause()
              }

              const audio = new Audio(previewUrl)
              audioRef.current = audio

              audio.ontimeupdate = () => {
                setElapsed(audio.currentTime)

                if (audio.currentTime >= clipSeconds) {
                  audio.pause()
                }
              }

              audio.play().catch(error => {
                console.error('Audio playback failed:', error)
              })
            }}
          >
            {!previewUrl ? 'loading...' : 'Play'}
          </button>
        )}

        {start && question && previewError && (
          <p role="alert">{previewError}</p>
        )}

        {start && question && <br />}

        {/* Answer buttons */}
        {start && question && (
          <div className="options-grid">
            {question.options.map((option, i) => (
              <button
                key={i}
                className="option-btn"
                onClick={() => {
                  if (i === question.correct) {
                    setScore(
                      currentScore =>
                        currentScore + questionPoints
                    )
                  }

                  setAnswers(
                    currentAnswers => [
                      ...currentAnswers,
                      i
                    ]
                  )

                  setQPoints(
                    currentQPoints => [
                      ...currentQPoints,
                      questionPoints
                    ]
                  )

                  setQuestionIndex(
                    currentIndex => currentIndex + 1
                  )

                  setQuestionPoints(100)
                  setElapsed(0)

                  if (audioRef.current) {
                    audioRef.current.pause()
                  }
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {start && question && <br />}

        {/* Hint button */}
        {start && question && (
          <button
            id="hint"
            aria-label="Hint: hear 5 more seconds for 20 fewer points"
            disabled={questionPoints <= 0}
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause()
              }

              setElapsed(0)

              setQuestionPoints(
                currentPoints =>
                  Math.max(0, currentPoints - 20)
              )
            }}
          >
            Hint
          </button>
        )}

        {/* Final result */}
        {finished && (
          <div className="quiz-results" role="status">
            <h2>Quiz complete!</h2>
            <p>
              Final score:{' '}
              <span className="final-score">
                {score}
              </span>
            </p>
            <Link to="/results" className="quiz-results-link">See my results</Link>
          </div>
        )}

      </section>
    </>
  )
}

export default QuizPage
