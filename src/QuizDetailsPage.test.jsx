// @vitest-environment happy-dom
import { describe, it, expect, afterEach, vi } from 'vitest'
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
    questions: [{ options: ['', ''], correct: 0 }],
  },
  // like a quiz made on the Make a Quiz page: no "song" field, so the correct answer is used
  2: {
    name: 'Made On Site',
    genre: 'nu metal',
    timer: 5,
    questions: [
      { options: ['Last Resort', 'In the End'], correct: 1 },
    ],
  },
}

// fake Last.fm search: answers from this table instead of calling the real API
const artistsBySong = {
  'Bohemian Rhapsody': 'Queen',
  'Smells Like Teen Spirit': 'Nirvana',
  'Somebody to Love': 'Queen',
  'In the End': 'Linkin Park',
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

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

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

  it('uses the correct answer as the song when there is no "song" field', async () => {
    renderAt('/quiz/2/details')
    expect(await screen.findByRole('link', { name: /Linkin Park/ })).toBeTruthy()
  })

  it('loads the quiz from cloud storage when no quizzes are passed in', async () => {
    const fetchMock = vi.fn(async () => ({ ok: true, json: async () => quizzes }))
    vi.stubGlobal('fetch', fetchMock)
    render(
      <MemoryRouter initialEntries={['/quiz/0/details']}>
        <Routes>
          <Route path="/quiz/:id/details" element={<QuizDetailsPage search={fakeSearch} />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByRole('status').textContent).toMatch(/loading quiz/i)
    expect(await screen.findByRole('heading', { name: 'Test Rock' })).toBeTruthy()
    expect(await screen.findByRole('link', { name: /Nirvana/ })).toBeTruthy()
    expect(fetchMock.mock.calls[0][0]).toBe('/.netlify/functions/quizzes')
  })

  it('shows an error with Retry when the quizzes cannot be loaded', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 500 })))
    render(
      <MemoryRouter initialEntries={['/quiz/0/details']}>
        <Routes>
          <Route path="/quiz/:id/details" element={<QuizDetailsPage search={fakeSearch} />} />
        </Routes>
      </MemoryRouter>
    )
    const alert = await screen.findByRole('alert')
    expect(alert.textContent).toMatch(/Couldn't load the quiz/)

    // the cloud works again, so Retry should load the quiz
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => quizzes })))
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByRole('heading', { name: 'Test Rock' })).toBeTruthy()
  })

  it('shows the not found page for a quiz that does not exist', () => {
    renderAt('/quiz/99/details')
    expect(screen.getByText(/couldn't be found/i)).toBeTruthy()
  })
})
