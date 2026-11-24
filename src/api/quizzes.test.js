import { describe, it, expect } from 'vitest'
import { fetchQuizzes, songForQuestion } from './quizzes.js'

describe('fetchQuizzes', () => {
  it('gets the quizzes from the Netlify function', async () => {
    const calls = []
    const fetchFn = async (url, options) => {
      calls.push({ url, options })
      return { ok: true, json: async () => ({ 0: { name: 'quiz 1' } }) }
    }
    const controller = new AbortController()
    const quizzes = await fetchQuizzes({ fetchFn, signal: controller.signal })

    expect(quizzes[0].name).toBe('quiz 1')
    expect(calls[0].url).toBe('/.netlify/functions/quizzes')
    expect(calls[0].options.signal).toBe(controller.signal)
  })

  it('throws when the request fails', async () => {
    const fetchFn = async () => ({ ok: false, status: 500 })
    await expect(fetchQuizzes({ fetchFn })).rejects.toThrow("Couldn't load quizzes (500)")
  })
})

describe('songForQuestion', () => {
  it('uses the "song" field when there is one', () => {
    expect(songForQuestion({ song: 'In the End', options: ['x', 'y'], correct: 0 })).toBe('In the End')
  })

  it('falls back to the correct answer text', () => {
    expect(songForQuestion({ options: ['Last Resort', 'In the End'], correct: 1 })).toBe('In the End')
  })

  it('returns null when there is nothing to look up', () => {
    expect(songForQuestion({ options: ['', ''], correct: 0 })).toBe(null)
    expect(songForQuestion(undefined)).toBe(null)
  })
})
