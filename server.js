require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const SpotifyWebApi = require('spotify-web-api-node');

// middleware and cors
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// localhost port
const PORT = process.env.PORT;

app.post('/refresh', async (req, res) => {
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  try {
    const data = await spotifyApi.refreshAccessToken();
    res.json({
      accessToken: data.body.access_token,
      expiresIn: data.body.expires_in,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
});

app.post('/login', async (req, res) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
});

app.listen(PORT, () => {
  console.log(`running server on port ${PORT}`);
});
