# The Really Good Music Quiz
## Members
Member | Preferred Role(s)
--- | --- 
Sasha Dmitriev | Controlled form and blobs for persistent cloud state
Qudsia Fawad | Browse, detail view, and accessibility
Liam Evask | Playing the quiz, with Last.fm integration
Omar Ahmed | User results

## Domain
Create a song guessing game, using API calls to Last.fm(https://www.last.fm/) to allow the user to listen to the song for a certain amount of time. The user then guesses the song name, and/or the artist. Potential formats for this include multiple choice or free-response.

## Project Board
The project board can be found at https://github.com/users/LiamIsCoding/projects/1 or in the Projects tab.

## Website Deployment
The running website can be found at https://thereallygoodmusicquiz.netlify.app

## Running locally
1. `npm install`
2. Copy `.env.example` to `.env.local` and add a Last.fm API key (free at https://www.last.fm/api/account/create). `.env.local` is ignored by git, so the key is never committed.
3. `npm run dev` to run the app, `npm test` to run the tests.

On Netlify, the key is set under **Site configuration → Environment variables** as `VITE_LASTFM_API_KEY`.
