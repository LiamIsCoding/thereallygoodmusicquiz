import { useState } from 'react'
import './styles/browser_page.css'
import quizData from './quizzes.json'

function BrowserPage({setPage, setQuiz}) {
  const quizzes = Object.entries(quizData)
  
  return (
    <>
      <div className="body">
        <h2 id="list-heading">Browse Quizzes</h2>
        <ul>
          {quizzes.map(([index, {name, genre, timer}]) => (
            <li key={index} className="quiz-card">
              <h3 className="quiz-name">{name}</h3>
              <p>{genre}</p>
              <p>{timer} seconds</p>
              <button onClick={() => {setPage('quiz'); setQuiz(Number(index))}}>Play</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default BrowserPage
