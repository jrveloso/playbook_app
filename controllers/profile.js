const fetch = require('node-fetch');
const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const userId = req.params.id
      const results = await fetch('http://data.nba.net/data/10s/prod/v1/2021/teams.json')
      const teamData = await results.json()
      const eastTeams = await teamData.league.standard.filter(team => team.confName === "East" && team.isNBAFranchise === true)
      const westTeams = await teamData.league.standard.filter(team => team.confName === "West" && team.isNBAFranchise === true)
      
      //Get profile info
      const profile = await User.find({ _id: userId })
      console.log(profile)

      const players = await Player.find({ user: userId })
      // console.log(players)

      const posts = await Post.find({ userId: userId }).sort({ createdAt: "desc" }).lean()
      // console.log(posts)

      res.render("profile.ejs", { user: req.user, paramsID: req.params.id, players: players, posts: posts, eastTeams: eastTeams, westTeams: westTeams, userProfile: profile });
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