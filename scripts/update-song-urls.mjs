// Run right before the demo (Deezer links expire after ~15 minutes):
//   node scripts/update-song-urls.mjs
import { readFile, writeFile } from 'node:fs/promises'

// a rock song and a metal song to test with
const SONGS = {
  0: 'queen bohemian rhapsody',
  1: 'evanescence bring me to life'
}

const file = new URL('../src/quizzes.json', import.meta.url)
const quizzes = JSON.parse(await readFile(file, 'utf8'))

for (const [quizId, term] of Object.entries(SONGS)) {
  const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(term)}&limit=1`)
  const json = await res.json()
  const url = json.data[0].preview
  quizzes[quizId].questions.forEach(question => { question.songUrl = url })
  console.log(`Quiz ${quizId}: updated "${term}"`)
}

await writeFile(file, JSON.stringify(quizzes, null, 4))
