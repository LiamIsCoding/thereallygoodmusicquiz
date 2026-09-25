const express = require("express");
require("dotenv").config();

const app = express();
const port = 3000;
let songList = [];
let selectedtracks = [];
let correctsong = null;
let score = 0;

app.use(express.static(__dirname));

app.get("/lastfm-test", async (req, res) => {
    const selectedGenre = req.query.genre;

    const params = new URLSearchParams({
        method: "tag.gettoptracks",
        tag: selectedGenre,
        api_key: process.env.LASTFM_API_KEY,
        format: "json",
        limit: "1000"
    });

    const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?${params}`
    );

    const data = await response.json();

    songList = data.tracks.track;

    const shuffledTracks = [...songList].sort(() => Math.random() - 0.5);
    selectedTracks = shuffledTracks.slice(0, 4);
    const USsongDetails = selectedTracks.map(track => ({
        title: track.name,
        artist: track.artist
    }));

    correctsong = USsongDetails[0];

    const songDetails = [...USsongDetails].sort(() => Math.random() - 0.5);
    

    res.json({ tracks: songDetails, correctSong: correctsong });

});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

