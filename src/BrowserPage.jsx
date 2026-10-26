import { useState } from 'react'
import './styles/browser_page.css'

function BrowserPage({setPage}) {
  return (
    <>
      <section id="list" aria-labelledby="list-heading">
        <h2 id="list-heading">Browse Quizzes</h2>
            <ul className="quizzes" id="quizzes">
                <li>
                    <article>
                      {/* TODO: replace the variables with javascript logic*/}
                        <button onClick={() => setPage('quiz')}>Quiz1</button>
                        <p>Rock</p>
                        <p>5 sec</p>
                    </article>
                </li>
            </ul>
        </section>
    </>
  )
}

export default BrowserPage
