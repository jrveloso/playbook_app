const fetch = require('node-fetch');
const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const userId = req.params.id

      //Get todays date
      const today = new Date()
      const year = today.getFullYear()

      //Teams
      const results = await fetch(`https://api.sportradar.com/nba/trial/v7/en/seasons/2022/REG/standings.json?api_key=${process.env.SPORTRADAR_API_KEY}`)
      const standings = await results.json()
      const westConf = standings.conferences[1].divisions.map(div => div)
      const westTeams = westConf.map(div => div.teams).flat().sort((a, b) => b.win_pct - a.win_pct)
      const eastConf = standings.conferences[0].divisions.map(div => div)
      const eastTeams = eastConf.map(div => div.teams).flat().sort((a, b) => b.win_pct - a.win_pct)
      const teams = westConf.map(div => div.teams).concat(eastConf.map(div => div.teams)).flat()
      // console.log(eastTeams)
      
      //Get profile info
      const profile = await User.find({ _id: userId })
      // console.log(profile)

      const players = await Player.find({ user: userId })
      // console.log(players)

      const posts = await Post.find({ userId: userId }).sort({ createdAt: "desc" }).lean()
      // console.log(posts)

      //Scores today
      const gameData = await fetch(`https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json`)
      const gameScores = await gameData.json()
      // console.log(gameScores.scoreboard.games[0].homeTeam)

      res.render("profile.ejs", { user: req.user, paramsID: req.params.id, players: players, posts: posts, gameInfo: gameScores, westConf: westConf, eastConf: eastConf, westTeams: westTeams, eastTeams: eastTeams, teams: teams, time: today, teams: teams, userProfile: profile });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      // const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        // title: req.body.title,
        text: req.body.text,
        userId: req.user.id,
        likes: 0,
      });
      console.log("Post has been added!");

      res.redirect(`/profile/${req.user.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  notLoggedIn: (req, res) => {
    console.log('Please login to access profiles page. Redirecting...')
    res.redirect('/')
  }
};