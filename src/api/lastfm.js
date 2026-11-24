// talks to the Last.fm web service
// everything Last.fm-specific stays in this file, the rest of the app only sees our own simple shapes

const API_URL = 'https://ws.audioscrobbler.com/2.0/'

// the key comes from .env.local (VITE_LASTFM_API_KEY=...) so it is never committed to git
// on Netlify it is set under Site configuration -> Environment variables
const API_KEY = import.meta.env?.VITE_LASTFM_API_KEY

// turns one Last.fm track result into the shape our app uses:
// { title, artist, url, listeners }
// this is the "boundary": if Last.fm ever changes its format, only this function needs to change
export function mapTrack(track) {
  if (!track || !track.name || !track.artist) return null
  return {
    title: track.name,
    // track.search gives the artist as a plain string
    artist: typeof track.artist === 'string' ? track.artist : track.artist.name,
    url: track.url || null,
    listeners: Number(track.listeners) || 0,
  }
}

// searches Last.fm for a song name and returns the best match (or null if nothing matched)
// "best" = the match with the most listeners, so the famous version wins
// (e.g. "Paint It Black" finds The Rolling Stones, not a smaller band with a song of the same name)
// signal is from an AbortController so the request can be cancelled (e.g. when leaving the page)
// apiKey can be passed in for tests, otherwise the key from .env.local is used
export async function searchTrack(songName, { signal, apiKey = API_KEY, fetchFn = fetch } = {}) {
  if (!apiKey) {
    throw new Error('Missing Last.fm API key. Add VITE_LASTFM_API_KEY to .env.local')
  }

  const params = new URLSearchParams({
    method: 'track.search',
    track: songName,
    api_key: apiKey,
    format: 'json',
    limit: '10',
  })

  const response = await fetchFn(`${API_URL}?${params}`, { signal })
  if (!response.ok) {
    throw new Error(`Last.fm request failed (${response.status})`)
  }

  const data = await response.json()
  // Last.fm sometimes sends errors (like a bad API key) as normal JSON with an "error" field
  if (data.error) {
    throw new Error(data.message || 'Last.fm returned an error')
  }

  const matches = data?.results?.trackmatches?.track
  // Last.fm can send a single object instead of an array, so handle both
  const list = (Array.isArray(matches) ? matches : [matches]).map(mapTrack).filter(Boolean)
  if (list.length === 0) return null

  // pick the most listened-to match
  return list.reduce((best, track) => (track.listeners > best.listeners ? track : best))
}

// takes the matched tracks and returns each artist once, in the order they first appear
// null entries (songs with no match) are skipped
export function uniqueArtists(tracks) {
  const seen = new Set()
  const artists = []
  for (const track of tracks) {
    if (!track) continue
    const key = track.artist.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    artists.push(track.artist)
  }
  return artists
}

// link to an artist's page on Last.fm
export function artistUrl(artist) {
  return `https://www.last.fm/music/${encodeURIComponent(artist).replace(/%20/g, '+')}`
}
