
import { useState, useEffect, useRef } from 'react'
import './styles/quiz_page.css'
import quizData from './quizzes.json'

function QuizPage({ index }) {
  // Get the selected quiz
  const quiz = Object.values(quizData)[index]

  // Store answers and points for each question
  const [answers, setAnswers] = useState([])
  const [qPoints, setQPoints] = useState([])

  // Quiz progress
  const [start, setStart] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const question = quiz.questions[questionIndex]
  const [questionPoints, setQuestionPoints] = useState(100)

  // Quiz completion
  const finished = start && !question
  const [score, setScore] = useState(0)

  // Build the result to save in localStorage
  function buildResults(finalScore, finalAnswers, finalQPoints) {
    return {
      name: quiz.name,
      genre: quiz.genre,
      timer: quiz.timer,
      score: finalScore,
      questions: quiz.questions.map((question, i) => ({
        answer: finalAnswers[i],
        correct: question.correct,
        points:
          finalAnswers[i] === question.correct
            ? finalQPoints[i]
            : 0
      }))
    }
  }

  // Save the quiz result after completion
  useEffect(() => {
    if (!finished) return

    const saved = JSON.parse(
      localStorage.getItem('results') || '[]'
    )

    saved.push(buildResults(score, answers, qPoints))

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

  return (
    <>
      <section id="quiz">

        {/* Start quiz */}
        {!start && (
          <button
            id="startQuizBtn"
            onClick={() => {
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
          <span id="round">
            Round {questionIndex + 1}
          </span>
        )}

        {start && question && <br />}

        {/* Current score */}
        {start && question && (
          <span id="score">
            Score: {score}
          </span>
        )}

        {start && question && <br />}

        {/* Available points */}
        {start && question && (
          <span id="points">
            Points Available: {questionPoints}
          </span>
        )}

        {start && question && <br />}

        {/* Audio progress */}
        {start && question && (
          <progress
            id="song_progress"
            value={elapsed}
            max={clipSeconds}
          />
        )}

        {start && question && <br />}

        {/* Play the song */}
        {start && question && (
          <button
            id="playSongBtn"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause()
              }

              const audio = new Audio(question.songUrl)
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
            Play
          </button>
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
          <div className="quiz-results">
            <h2>Quiz complete!</h2>
            <p>
              Final score:{' '}
              <span className="final-score">
                {score}
              </span>
            </p>
          </div>
        )}

      </section>
    </>
  )
}

export default QuizPage
