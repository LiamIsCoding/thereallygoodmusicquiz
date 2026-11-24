import { describe, it, expect } from 'vitest'
import { mapTrack, searchTrack, uniqueArtists, artistUrl } from './lastfm.js'

// a fake fetch that returns whatever JSON we give it, and remembers the url it was called with
function fakeFetch(body, { ok = true, status = 200 } = {}) {
  const calls = []
  const fn = async (url, options) => {
    calls.push({ url, options })
    return { ok, status, json: async () => body }
  }
  fn.calls = calls
  return fn
}

// what a real Last.fm track.search response looks like (trimmed down)
const lastfmResponse = {
  results: {
    trackmatches: {
      track: [
        { name: 'Bohemian Rhapsody', artist: 'Queen', url: 'https://www.last.fm/music/Queen/_/Bohemian+Rhapsody', listeners: '2500000' },
      ],
    },
  },
}

describe('mapTrack', () => {
  it('maps a Last.fm track into our shape', () => {
    expect(mapTrack(lastfmResponse.results.trackmatches.track[0])).toEqual({
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      url: 'https://www.last.fm/music/Queen/_/Bohemian+Rhapsody',
      listeners: 2500000,
    })
  })

  it('handles the artist being an object', () => {
    expect(mapTrack({ name: 'In the End', artist: { name: 'Linkin Park' } }).artist).toBe('Linkin Park')
  })

  it('returns null for missing or incomplete tracks', () => {
    expect(mapTrack(undefined)).toBe(null)
    expect(mapTrack({ name: 'No artist' })).toBe(null)
  })
})

describe('searchTrack', () => {
  it('calls track.search with the song name and returns the first match', async () => {
    const fetchFn = fakeFetch(lastfmResponse)
    const track = await searchTrack('Bohemian Rhapsody', { apiKey: 'test-key', fetchFn })

    expect(track.artist).toBe('Queen')
    const url = new URL(fetchFn.calls[0].url)
    expect(url.searchParams.get('method')).toBe('track.search')
    expect(url.searchParams.get('track')).toBe('Bohemian Rhapsody')
    expect(url.searchParams.get('api_key')).toBe('test-key')
    expect(url.searchParams.get('format')).toBe('json')
  })

  it('picks the match with the most listeners, not just the first one', async () => {
    const response = {
      results: {
        trackmatches: {
          track: [
            { name: 'Paint It Black', artist: 'BiSH', listeners: '20000' },
            { name: 'Paint It, Black', artist: 'The Rolling Stones', listeners: '1900000' },
            { name: 'Paint It Black', artist: 'Some Cover Band', listeners: '500' },
          ],
        },
      },
    }
    const track = await searchTrack('Paint It Black', { apiKey: 'k', fetchFn: fakeFetch(response) })
    expect(track.artist).toBe('The Rolling Stones')
  })

  it('passes the abort signal through to fetch', async () => {
    const fetchFn = fakeFetch(lastfmResponse)
    const controller = new AbortController()
    await searchTrack('Bohemian Rhapsody', { apiKey: 'k', fetchFn, signal: controller.signal })
    expect(fetchFn.calls[0].options.signal).toBe(controller.signal)
  })

  it('handles Last.fm sending a single track object instead of an array', async () => {
    const single = { results: { trackmatches: { track: { name: 'In the End', artist: 'Linkin Park' } } } }
    const track = await searchTrack('In the End', { apiKey: 'k', fetchFn: fakeFetch(single) })
    expect(track.artist).toBe('Linkin Park')
  })

  it('returns null when nothing matches', async () => {
    const empty = { results: { trackmatches: { track: [] } } }
    expect(await searchTrack('zzzz', { apiKey: 'k', fetchFn: fakeFetch(empty) })).toBe(null)
  })

  it('throws when the HTTP request fails', async () => {
    const fetchFn = fakeFetch({}, { ok: false, status: 500 })
    await expect(searchTrack('x', { apiKey: 'k', fetchFn })).rejects.toThrow('Last.fm request failed (500)')
  })

  it('throws Last.fm error messages (e.g. a bad API key)', async () => {
    const fetchFn = fakeFetch({ error: 10, message: 'Invalid API key' })
    await expect(searchTrack('x', { apiKey: 'bad', fetchFn })).rejects.toThrow('Invalid API key')
  })

  it('throws a clear message when there is no API key', async () => {
    await expect(searchTrack('x', { apiKey: '', fetchFn: fakeFetch(lastfmResponse) })).rejects.toThrow('Missing Last.fm API key')
  })
})

describe('uniqueArtists', () => {
  it('lists each artist once, keeps order, and skips songs with no match', () => {
    const tracks = [
      { artist: 'Korn' },
      null,
      { artist: 'Linkin Park' },
      { artist: 'korn' },
    ]
    expect(uniqueArtists(tracks)).toEqual(['Korn', 'Linkin Park'])
  })
})

describe('artistUrl', () => {
  it('builds a Last.fm artist link', () => {
    expect(artistUrl('Linkin Park')).toBe('https://www.last.fm/music/Linkin+Park')
    expect(artistUrl('AC/DC')).toBe('https://www.last.fm/music/AC%2FDC')
  })
})
