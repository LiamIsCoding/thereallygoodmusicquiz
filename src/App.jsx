import { useEffect, useRef } from 'react'

import { Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';

import BrowserPage from './BrowserPage.jsx';
import QuizPage from './QuizPage.jsx';
import ResultsPage from './ResultsPage.jsx';
import MakePage from './MakePage.jsx';
import NotFound from './NotFound.jsx';
import QuizDetailsPage from './QuizDetailsPage.jsx';

function App() {
  // when the page (url) changes, move keyboard/screen reader focus to the top of the new page
  // (otherwise focus is lost on the link that was just removed from the screen)
  // (skipped on first load, and on the automatic redirect from "/" to "/browse")
  const { pathname } = useLocation()
  const mainRef = useRef(null)
  const previousPath = useRef(pathname)
  useEffect(() => {
    const cameFrom = previousPath.current
    if (cameFrom === pathname) return
    previousPath.current = pathname
    if (cameFrom === '/') return
    mainRef.current?.focus()
  }, [pathname])

  return (
    <>
        <section id="header">
            <header className="site-header">
                <div className="title">
                    <h1>The Really Good Music Quiz</h1>
                </div>
                {/* NavLink adds aria-current="page" to the link for the open page automatically */}
                <nav aria-label="Main">
                    <NavLink to="/browse">Browse Quizzes</NavLink>
                    <NavLink to="/results">See My Results</NavLink>
                    <NavLink to="/make">Make a Quiz</NavLink>
                </nav>
            </header>

            {/* tabIndex -1 lets the code focus <main> without adding it to the Tab order */}
            <main ref={mainRef} tabIndex={-1}>
                <Routes>
                    <Route path="/" element={<Navigate to="/browse" replace />} />
                    <Route path="/browse" element={<BrowserPage />} />
                    <Route path="/quiz/:id" element={<QuizPage />} />
                    <Route path="/quiz/:id/details" element={<QuizDetailsPage />} />
                    <Route path="/results" element={<ResultsPage />} />
                    <Route path="/make" element={<MakePage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </section>
    </>
  )
}

export default App
