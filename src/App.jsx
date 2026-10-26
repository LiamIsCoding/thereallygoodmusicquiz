import { useState } from 'react'
import BrowserPage from './BrowserPage.jsx'
import QuizPage from './QuizPage.jsx'

function App() {
  const [page, setPage] = useState('browse')

    let currentPage;
    switch (page) {
        case 'browse':
            currentPage = <BrowserPage setPage={setPage}/>;
            break;
        case 'quiz':
            currentPage = <QuizPage />;
            break;
        case 'results':
            
            break;

        default:

            break;
    }

  return (
    <>
        <section id="header">
            <header className="site-header">
                <div className="title">
                    <h1>The Really Good Music Quiz</h1>
                </div>
                <nav>
                    <button onClick={() => setPage('browse')}>Find a Quiz</button>
                    <button onClick={() => setPage('results')}>My Results</button>
                </nav>
            </header>

            <main>
                {currentPage}
            </main>
        </section>
    </>
  )
}

export default App