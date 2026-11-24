// @vitest-environment happy-dom
import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import QuizDetailsPage from './QuizDetailsPage.jsx'

// small test quizzes so the tests don't depend on quizzes.json
const quizzes = {
  0: {
    name: 'Test Rock',
    genre: 'rock',
    timer: 5,
    questions: [
      { options: ['a', 'b'], correct: 0, song: 'Bohemian Rhapsody' },
      { options: ['a', 'b'], correct: 0, song: 'Smells Like Teen Spirit' },
      { options: ['a', 'b'], correct: 0, song: 'Somebody to Love' },
    ],
  },
  1: {
    name: 'No Songs Yet',
    genre: 'pop',
    timer: 5,
    questions: [{ options: ['a', 'b'], correct: 0 }],
  },
}

// fake Last.fm search: answers from this table instead of calling the real API
const artistsBySong = {
  'Bohemian Rhapsody': 'Queen',
  'Smells Like Teen Spirit': 'Nirvana',
  'Somebody to Love': 'Queen',
}
const fakeSearch = async song => (artistsBySong[song] ? { title: song, artist: artistsBySong[song] } : null)

// renders the page at a url like /quiz/0/details, the same way the app's router does
function renderAt(path, search = fakeSearch) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/quiz/:id/details" element={<QuizDetailsPage quizzes={quizzes} search={search} />} />
      </Routes>
    </MemoryRouter>
  )
}

afterEach(cleanup)

describe('QuizDetailsPage', () => {
  it('shows a loading message, then each artist once', async () => {
    renderAt('/quiz/0/details')

    expect(screen.getByRole('heading', { name: 'Test Rock' })).toBeTruthy()
    expect(screen.getByRole('status').textContent).toMatch(/looking up artists/i)

    // Queen appears in two songs but should only be listed once
    expect(await screen.findByRole('link', { name: /Queen/ })).toBeTruthy()
    expect(screen.getAllByRole('link', { name: /Queen/ })).toHaveLength(1)
    expect(screen.getByRole('link', { name: /Nirvana/ })).toBeTruthy()
  })

  it('does not show song titles (no spoilers)', async () => {
    renderAt('/quiz/0/details')
    await screen.findByRole('link', { name: /Queen/ })
    expect(screen.queryByText(/Bohemian Rhapsody/)).toBe(null)
  })

  it('shows an error with a Retry button that tries again', async () => {
    let calls = 0
    const flakySearch = async song => {
      calls++
      if (calls <= 3) throw new Error('Network down')
      return fakeSearch(song)
    }
    renderAt('/quiz/0/details', flakySearch)

    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toMatch(/Network down/)

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByRole('link', { name: /Nirvana/ })).toBeTruthy()
  })

  it('cancels the request when leaving the page', async () => {
    let signal
    const slowSearch = (song, options) => {
      signal = options.signal
      return new Promise(() => {}) // never finishes
    }
    const { unmount } = renderAt('/quiz/0/details', slowSearch)
    expect(signal.aborted).toBe(false)
    unmount()
    expect(signal.aborted).toBe(true)
  })

  it('explains when a quiz has no song info yet', async () => {
    renderAt('/quiz/1/details')
    expect(await screen.findByText(/hasn't been added/i)).toBeTruthy()
  })

  it('shows the not found page for a quiz that does not exist', () => {
    renderAt('/quiz/99/details')
    expect(screen.getByText(/couldn't be found/i)).toBeTruthy()
  })
})
