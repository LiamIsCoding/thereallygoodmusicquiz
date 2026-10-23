import { useState } from 'react'
import './styles/quiz.css'

function Quiz() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="quiz">
        {/* TODO: replace the variables with javascript logic*/}
        <button id="startQuizBtn">Start Quiz</button>
        <button id="Hint">hint</button>
        <br />
        <span id="round">Round 1</span>
        <br />
        <span id="song_player_here">song player here</span>
        <button id="playSongBtn">Play</button>
        <br />
        <button id="option_1">option 1</button>
        <button id="option_2">option 2</button>
        <br />
        <button id="option_3">option 3</button>
        <button id="option_4">option 4</button>
      </section>
    </>
  )
}

export default Quiz
