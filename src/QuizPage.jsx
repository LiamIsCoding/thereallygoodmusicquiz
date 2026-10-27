import { useState, useEffect } from 'react'
import './styles/quiz_page.css'
import quizData from './quizzes.json'

function QuizPage({ index }) {
  {/* Index is passed to access the given quiz directly */ }
  const quiz = Object.values(quizData)[index]

  {/* Current selected answer */ }
  //const [answer, setAnswer] = useState(0)
  const [answers, setAnswers] = useState([])
  const [qPoints, setQPoints] = useState([])
  //stores all the answer indexes so it can be used to make the results of the quiz


  {/* Whether the quiz has begun */ }
  const [start, setStart] = useState(false)


  {/* The current question */ }
  const [questionIndex, setQuestionIndex] = useState(0)
  const question = quiz.questions[questionIndex]
  const [questionPoints, setQuestionPoints] = useState(100)

  {/* Whether the quiz has finished */ }
  const finished = start && !question

  {/*the score of the quiz*/ }
  const [score, setScore] = useState(0)

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

  useEffect(() => {
    if (!finished) return
    const saved = JSON.parse(localStorage.getItem('results') || '[]')
    saved.push(buildResults(score, answers, qPoints))
    localStorage.setItem('results', JSON.stringify(saved))
  }, [finished])


  return (
    <>
      <section id="quiz">

        {!start && <button id="startQuizBtn" onClick={() => { setStart(true); setQuestionIndex(0); setScore(0); setAnswers([]); setQPoints([]); }}>Start Quiz</button>}

        {/* TODO: Add functionality to the song player and round counter */}
        {start && question && <br />}
        {start && question && <span id="round">Round {questionIndex + 1}</span>}
        {start && question && <br />}
        {start && question && <span id="score">Score: {score}</span>}
        {start && question && <br />}
        {start && question && <span id="points">Points Available: {questionPoints}</span>}
        {start && question && <br />}
        {start && question && <span id="song_player_here">song player here</span>}
        {start && question && <button id="playSongBtn">Play</button>}
        {start && question && <br />}

        {/* Create the buttons */}
        {start && question && question.options.map((option, i) => (
          <button key={i} onClick={() => {
            if (i === question.correct) {
              setScore(currentScore => currentScore + questionPoints)
            }
            setAnswers(currentAnswers => [...currentAnswers, i])
            setQPoints(currentQPoints => [...currentQPoints, questionPoints])
            setQuestionIndex(questionIndex + 1)
            setQuestionPoints(100)
          }}>{option}</button>
        ))}

        {start && question && <br />}

        {start && question && <button id="hint" disabled={questionPoints <= 0} onClick={() => {
          //hint logic

          //hint payment
          setQuestionPoints(currentPoints => Math.max(0, currentPoints - 20))

        }}>Hint</button>}


        {finished && (
          <>
            <h2>Quiz complete!</h2>
            <p>Final score: {score}</p>
          </>

        )}



      </section>
    </>
  )
}

export default QuizPage
