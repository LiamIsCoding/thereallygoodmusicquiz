import { useState } from 'react'
import './styles/browser.css'

function Browser() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="list" aria-labelledby="list-heading">
        <h2 id="list-heading">Browse Quizzes</h2>
            <ul className="quizzes" id="quizzes">
                <li>
                    <article>
                        <h3><a href="quiz.html">EXAMPLEQUIZ</a></h3>
                        <p>Rock</p>
                        <p>5 sec</p>
                    </article>
                </li>
            </ul>
        </section>
    </>
  )
}

export default Browser
