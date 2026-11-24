import { useState, useEffect } from 'react'
import { searchTrack, uniqueArtists } from '../api/lastfm.js'

// custom hook: looks up the artists for every song in a quiz using Last.fm
// returns { status, artists, unmatched, missing, retry }
//   status:    'loading' | 'success' | 'error' | 'empty' (no songs to look up)
//   artists:   each artist once, e.g. ['Queen', 'Nirvana']
//   unmatched: how many songs Last.fm couldn't find
//   missing:   how many questions don't have a song name yet
//   error:     the error message when status is 'error'
//   retry:     call this to try the request again
export function useQuizArtists(quiz, { search = searchTrack } = {}) {
  const [state, setState] = useState({ status: 'loading', artists: [], unmatched: 0, error: null })
  // bumping this number re-runs the effect, that's how retry works
  const [attempt, setAttempt] = useState(0)

  // the song names to look up (questions without a "song" field are skipped)
  const questions = quiz?.questions ?? []
  const songs = questions.map(q => q.song).filter(Boolean)
  const missing = questions.length - songs.length
  // a string version of the songs so the effect only re-runs when the actual names change
  const songsKey = songs.join('\n')

  useEffect(() => {
    if (songs.length === 0) {
      setState({ status: 'empty', artists: [], unmatched: 0, error: null })
      return
    }

    // AbortController lets us cancel the requests if the user leaves the page
    // or the quiz changes before they finish, so an old (stale) answer never overwrites a new one
    const controller = new AbortController()
    setState(s => ({ ...s, status: 'loading', error: null }))

    // look up every song at the same time
    Promise.all(songs.map(song => search(song, { signal: controller.signal })))
      .then(tracks => {
        setState({
          status: 'success',
          artists: uniqueArtists(tracks),
          unmatched: tracks.filter(t => !t).length,
          error: null,
        })
      })
      .catch(error => {
        // a cancelled request is expected, not a real error, so ignore it
        if (error.name === 'AbortError') return
        setState({ status: 'error', artists: [], unmatched: 0, error: error.message })
      })

    // cleanup: runs when leaving the page or before the effect runs again
    return () => controller.abort()
  }, [songsKey, attempt, search])

  return { ...state, missing, retry: () => setAttempt(a => a + 1) }
}
