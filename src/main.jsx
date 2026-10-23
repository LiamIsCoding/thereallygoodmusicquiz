import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import Quiz from './Quiz.jsx'
import Browser from './Browser.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <section id="header">
      <header className="site-header">
        <div className="title">
          <h1>The Really Good Music Quiz</h1>
        </div>
        <nav>
          <a href="browser.html">Find a Quiz</a>
          <a href="#browse">My Quizzes</a>
        </nav>
      </header>
    </section>
    
    {/* TODO: add logic for switch webpages */}
    <Quiz />
  </StrictMode>,
)
