import { useState } from 'react'
import './styles/quiz_page.css'
import quizData from './quizzes.json'

function QuizPage({index}) {
  {/* Index is passed to access the given quiz directly */}
  const quiz = Object.values(quizData)[index]
  
  {/* Current selected answer */}
  const [answer, setAnswer] = useState(0)
  
  {/* Whether the quiz has begun */}
  const [start, setStart] = useState(false)

  {/* The current question */}
  const [questionIndex, setQuestionIndex] = useState(0)
  const question = quiz.questions[questionIndex]
  
  return (
    <>
      <section id="quiz">

        {!start && <button id="startQuizBtn" onClick={() => {setStart(true); setQuestionIndex(0)}}>Start Quiz</button>}

        {/* TODO: Add functionality to the song player and round counter */}
        {start && question && <br />}
        {start && question && <span id="round">Round 1</span>}
        {start && question && <br />}
        {start && question && <span id="song_player_here">song player here</span>}
        {start && question && <button id="playSongBtn">Play</button>}
        {start && question && <br />}

        {/* Create the buttons */}
        {start && question && question.options.map((option, i) => (
          <button onClick={() => {setAnswer(i); setQuestionIndex(questionIndex+1)}}>{option}</button>
        ))}

        {/* TODO: add hint button */}

        {/* TODO: add logic to check whether the answer was correct, then move on to the next question */}
      </section>
    </>
  )
}

export default QuizPage
