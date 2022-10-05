const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      // const response = await fetch('https://api.sportradar.us/nba/trial/v7/en/seasons/2021/REG/standings.json?api_key=nvw29fxe8j7t27fhcu2n7sj5');
      // const data = await response.json();

      // const eastTeams = await data.conferences[1].divisions.map( con => con.teams).flat();
      // const westTeams = await data.conferences[0].divisions.map( con => con.teams).flat()
      // console.log(eastTeams, westTeams);

      const players = await Player.find({ user: req.params.id })
      // console.log(players)

      const posts = await Post.find({ userId: req.params.id })
      console.log(posts)
      

      res.render("profile.ejs", { user: req.user, paramsID: req.params.id, players: players, posts: posts});
    } catch (err) {
      console.log(err);
    }
  },
  notLoggedIn: (req, res) => {
    console.log('Please login to access profiles page. Redirecting...')
    res.redirect('/')
  }
};