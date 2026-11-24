// Run right before the demo (Deezer links expire after ~15 minutes):
//   node scripts/update-song-urls.mjs
// Each question's audio is looked up from its "song" field, so every question plays its own song.
import { readFile, writeFile } from 'node:fs/promises'

const file = new URL('../src/quizzes.json', import.meta.url)
const quizzes = JSON.parse(await readFile(file, 'utf8'))

for (const [quizId, quiz] of Object.entries(quizzes)) {
  for (const question of quiz.questions) {
    // skip questions that don't have a song name yet
    if (!question.song) continue
    const res = await fetch(`https://api.deezer.com/search?q=${encodeURIComponent(question.song)}&limit=1`)
    const json = await res.json()
    if (!json.data?.length) {
      console.log(`Quiz ${quizId}: no Deezer match for "${question.song}"`)
      continue
    }
    question.songUrl = json.data[0].preview
    console.log(`Quiz ${quizId}: updated "${question.song}"`)
  }
}

await writeFile(file, JSON.stringify(quizzes, null, 4))
