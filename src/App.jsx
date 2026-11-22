import { useState } from 'react'

import { Routes, Route, Navigate, NavLink} from 'react-router-dom';

import BrowserPage from './BrowserPage.jsx';
import QuizPage from './QuizPage.jsx';
import ResultsPage from './ResultsPage.jsx';
import MakePage from './MakePage.jsx';
import NotFound from './NotFound.jsx';

function App() {
  return (
    <>
        <section id="header">
            <header className="site-header">
                <div className="title">
                    <h1>The Really Good Music Quiz</h1>
                </div>
                <nav>
                    <NavLink to="/browse">Browse</NavLink>
                    <NavLink to="/results">See My Results</NavLink>
                    <NavLink to="/make">Make a Quiz</NavLink>
                </nav>
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<Navigate to="/browse" replace />} />
                    <Route path="/browse" element={<BrowserPage />} />
                    <Route path="/quiz/:id" element={<QuizPage />} />
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