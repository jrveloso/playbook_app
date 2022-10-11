const fetch = require('node-fetch');
const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Player = require("../models/Player");

module.exports = {
  getFeed: async (req, res) => {
    try {
      //Posts in feed
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      
      //Usernames for posts
      const users = await User.find()
      // console.log(users)
      
      //Get todays date
      const today = new Date()
      // console.log(today.valueOf())
      const year = today.getFullYear()
      const todaysDate = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate().toString().length === 1 ? "0" + today.getDate() : today.getDate()}`
      // console.log(todaysDate)

      //Teams
      const results = await fetch(`http://data.nba.net/data/10s/prod/v1/${year}/teams.json`)
      const teamData = await results.json()
      const teams = await teamData.league.standard.filter(team => team.isNBAFranchise === true)
      // console.log(teamData.league.standard);

      //Players in user's watchlist
      const players = await Player.find({ user: req.user._id })
      // console.log(players)

      //Games today
      const response = await fetch(`http://data.nba.net/data/10s/prod/v1/${year}/schedule.json`)
      const scheduleData = await response.json()
      console.log(scheduleData.league.standard)
      const todaysGames = scheduleData.league.standard.filter(games => games.startDateEastern === todaysDate)
      // console.log(todaysGames)
      // console.log(req.user.id)
      // console.log(posts[0].userId)


      res.render("feed.ejs", { posts: posts, users: users, user: req.user, players: players, teams: teams, games: todaysGames, time: today});
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
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
      res.redirect(`/feed`);
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};