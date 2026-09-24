const express = require("express");
require("dotenv").config();

const app = express();
const port = 3000;
let songList = [];
let genreList = [];

app.use(express.static(__dirname));

app.get("/genres", async (req, res) => {
    const params = new URLSearchParams({
        method: "tag.getTopTags",
        api_key: process.env.LASTFM_API_KEY,
        format: "json"
    });

    const response = await fetch(
        `https://ws.audioscrobbler.com/2.0/?${params}`
    );
    
    const data = await response.json();
    genreList = data.toptags.tag;
    res.json(data);
});



app.get("/lastfm-test", async (req, res) => {
  const params = new URLSearchParams({
    method: "tag.gettoptracks",
    tag: "rock",
    api_key: process.env.LASTFM_API_KEY,
    format: "json",
    limit: "100"
  });

  const response = await fetch(
    `https://ws.audioscrobbler.com/2.0/?${params}`
  );

  const data = await response.json();

  songList = data.tracks.track;

  res.json(data);

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

