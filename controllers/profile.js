const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const results = await fetch('http://data.nba.net/data/10s/prod/v1/2021/teams.json')
      const teamData = await results.json()
      const eastTeams = await teamData.league.standard.filter(team => team.confName === "East" && team.isNBAFranchise === true)
      const westTeams = await teamData.league.standard.filter(team => team.confName === "West" && team.isNBAFranchise === true)
      
    
      const players = await Player.find({ user: req.params.id })
      // console.log(players)

      const posts = await Post.find({ userId: req.params.id })
      // console.log(posts)

      res.render("profile.ejs", { user: req.user, paramsID: req.params.id, players: players, posts: posts, eastTeams: eastTeams, westTeams: westTeams });
    } catch (err) {
      console.log(err);
    }
  },
  notLoggedIn: (req, res) => {
    console.log('Please login to access profiles page. Redirecting...')
    res.redirect('/')
  }
};