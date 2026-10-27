import { useState, useEffect, useRef } from 'react'
import './styles/quiz_page.css'
import quizData from './quizzes.json'

function QuizPage({ index }) {
  // Index is passed to access the given quiz directly
  const quiz = Object.values(quizData)[index]

  // Current selected answer
  const [answers, setAnswers] = useState([])
  const [qPoints, setQPoints] = useState([])
  // stores all the answer indexes so it can be used to make the results of the quiz same with the amount of points each question was scored for


  // Whether the quiz has begun
  const [start, setStart] = useState(false)


  // The current question
  const [questionIndex, setQuestionIndex] = useState(0)
  const question = quiz.questions[questionIndex]
  const [questionPoints, setQuestionPoints] = useState(100)

  // Whether the quiz has finished
  const finished = start && !question

  // the score of the quiz
  const [score, setScore] = useState(0)

  // a function to save the results to localStorage
  function buildResults(finalScore, finalAnswers, finalQPoints) {

    return {
      "name": quiz.name,
      "genre": quiz.genre,
      "timer": quiz.timer,
      "score": finalScore,
      "questions": quiz.questions.map((question, i) => ({
        "answer": finalAnswers[i],
        "correct": question.correct,
        "points": finalAnswers[i] === question.correct ? finalQPoints[i] : 0
      }))
    }
  }

  // runs the save function when the quiz is finished
  useEffect(() => {
    if (!finished) return
    const saved = JSON.parse(localStorage.getItem('results') || '[]')
    saved.push(buildResults(score, answers, qPoints))
    localStorage.setItem('results', JSON.stringify(saved))
  }, [finished])

  // audio player logic
  const clipSeconds = 5 + ((100 - questionPoints) / 20) * 5
  const audioRef = useRef(null)
  const [elapsed, setElapsed] = useState(0)

  return (
    <>
      <section id="quiz">

        {/* starts the quiz and resets all the states to their initial values */}
        {!start && <button id="startQuizBtn" onClick={() => { setStart(true); setQuestionIndex(0); setScore(0); setAnswers([]); setQPoints([]); }}>Start Quiz</button>}

        {start && question && <br />}
        {/* round counter */}
        {start && question && <span id="round">Round {questionIndex + 1}</span>}
        {start && question && <br />}
        {/* score display */}
        {start && question && <span id="score">Score: {score}</span>}
        {start && question && <br />}
        {/* how many points you'll get if you answer correctly with current "hints" */}
        {start && question && <span id="points">Points Available: {questionPoints}</span>}
        {start && question && <br />}
        {/* song progress bar */}
        {start && question && <progress id="song_progress" value={elapsed} max={clipSeconds}></progress>}
        {start && question && <br />}
        {/* the play song button which grabs the link from the quiz json and plays it for 5 seconds + 5 seconds for every hint used */}
        {start && question && <button id="playSongBtn" onClick={() => {
          if (audioRef.current) audioRef.current.pause()
          const audio = new Audio(question.songUrl)
          audioRef.current = audio
          audio.ontimeupdate = () => {
            setElapsed(audio.currentTime)
            if (audio.currentTime >= clipSeconds) audio.pause()
          }
          audio.play()
        }}>Play</button>}
        {start && question && <br />}

        {/* Create the buttons */}
        {/* when an answer is clicked, it checks if it's correct and updates the score and moves to the next question */}
        {/* the buttons sit inside a div with a class so the css can lay them out two per row */}
        {start && question && <div className="options-grid">{question.options.map((option, i) => (
          <button key={i} className="option-btn" onClick={() => {
            if (i === question.correct) {
              setScore(currentScore => currentScore + questionPoints)
            }
            setAnswers(currentAnswers => [...currentAnswers, i])
            setQPoints(currentQPoints => [...currentQPoints, questionPoints])
            setQuestionIndex(questionIndex + 1)
            setQuestionPoints(100)
            if (audioRef.current) audioRef.current.pause()
          }}>{option}</button>
        ))}</div>}

        {start && question && <br />}

        {/* when users click to get a hint it pauses the song, resets the progress bar, and reduces the points available for that question by 20, if 0 points are available it disables the button */}
        {start && question && <button id="hint" disabled={questionPoints <= 0} onClick={() => {
          if (audioRef.current) audioRef.current.pause()
          setElapsed(0)
          setQuestionPoints(currentPoints => Math.max(0, currentPoints - 20))
        }}>Hint</button>}


        {/* when the quiz is finished, it displays the final score */}
        {finished && (
          <div className="quiz-results">
            <h2>Quiz complete!</h2>
            <p>Final score: <span className="final-score">{score}</span></p>
          </div>
        )}



      </section>
    </>
  )
}

export default QuizPage