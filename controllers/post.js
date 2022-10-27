const fetch = require('node-fetch');
const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Player = require("../models/Player");
const { startSession } = require('../models/User');

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
      const year = today.getFullYear()
      const month = today.getMonth() + 1
      const day = today.getDate().toString().length === 1 ? "0" + today.getDate() : today.getDate()
      const todaysDate = `${year}${month}${day}`
      // console.log(today)

      //Teams
      const results = await fetch(`http://data.nba.net/data/10s/prod/v1/${year}/teams.json`)
      const teamData = await results.json()
      const teams = await teamData.league.standard.filter(team => team.isNBAFranchise === true)
      // console.log(teams)

      //Players in user's watchlist
      const watchlistPlayers = await Player.find({ user: req.user._id })
      // console.log(players)

      //Games today
      const response = await fetch(`http://data.nba.net/data/10s/prod/v1/${year}/schedule.json`)
      const scheduleData = await response.json()
      const todaysGames = scheduleData.league.standard.filter(games => games.startDateEastern === todaysDate)
      // console.log(todaysGames)

      //Next Games
      const nextDateWithGames = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate().toString().length === 1 ? "0" + Number(today.getDate()) + 1 : Number(today.getDate()) + 1}`
      // console.log(nextDateWithGames)
      const nextGames = scheduleData.league.standard.filter(games => games.startDateEastern === nextDateWithGames)
      // console.log(nextGames)

      //Scores today
      const gameData = await fetch(`https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json`)
      const gameScores = await gameData.json()

      res.render("feed.ejs", { posts: posts, users: users, user: req.user, players: watchlistPlayers, teams: teams, games: todaysGames, time: today, gameInfo: gameScores, nextGames: nextGames });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      
      const commentsUsers = []
      commentsUsers.push(post.userId)  // Push the poster's ID into the Array
      // console.log(commentsUsers)
      const comments = await Comment.find({postId: req.params.id}).sort({ createdAt: "desc" }).lean();
      console.log(comments)

      for (let comment of comments) {
        commentsUsers.push(comment.userId) // Iterate through comments and pushing all user IDs into the array
      }
      
      const users = await User.find({_id: commentsUsers}).lean();

      console.log(users)

      res.render("post.ejs", { post: post, user: req.user, comments: comments, users: users });
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
        likedBy: [],
      });
      console.log("Post has been added!");
      res.redirect(`/feed`);
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      const userId = req.user.id
      const postId = req.params.id
      await Post.updateMany(
        { _id: postId },
        {
          $inc: { likes: 1 },
          $push: { likedBy: userId },
        });
      console.log("Likes +1");
      if(postId !== '') {
        res.redirect(`/post/${postId}`);
      }
    } catch (err) {
      console.log(err);
    }
  },
  unlikePost: async (req, res) => {
    try {
      const postId = req.params.id
      await Post.updateMany(
        { _id: postId },
        {
          $inc: { likes: -1 },
          $pull: { likedBy: req.user.id },
        }
      );
      console.log("Likes +1");
      if(postId !== '') {
        res.redirect(`/post/${postId}`);
      }
    } catch (err) {
      console.log(err);
    }
  },
  likePostInFeed: async (req, res) => {
    try {
      // console.log(req.user.id)
      const userId = req.user.id
      const postId = req.params.id
      await Post.updateMany(
        { _id: postId },
        {
          $inc: { likes: 1 },
          $push: { likedBy: userId },
        });
      console.log("Likes +1");
      if(postId !== '') {
        res.redirect("/feed");
      }
    } catch (err) {
      console.log(err);
    }
  },
  unlikePostInFeed: async (req, res) => {
    try {
      // console.log(req.user.id)
      const userId = req.user.id
      const postId = req.params.id
      await Post.updateMany(
        { _id: postId },
        {
          $inc: { likes: -1 },
          $pull: { likedBy: userId },
        });
      console.log("Likes -1");
      if(postId !== '') {
        res.redirect("/feed");
      }
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      // await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/feed");
    } catch (err) {
      res.redirect("/feed");
    }
  },
};