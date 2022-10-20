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
      const todaysDate = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate().toString().length === 1 ? "0" + today.getDate() : today.getDate()}`
      // console.log(todaysDate)

      //Teams
      const results = await fetch(`http://data.nba.net/data/10s/prod/v1/${year}/teams.json`)
      const teamData = await results.json()
      const teams = await teamData.league.standard.filter(team => team.isNBAFranchise === true)
      // console.log(teams);

      const result = await fetch("http://data.nba.net/data/10s/prod/v1/2022/players.json")
      const players =  await result.json()
      const currentPlayerList = players.league.standard.map(player => [`${player.firstName} ${player.lastName}`, player.personId])
      // console.log(currentPlayerList[0])

      //Players in user's watchlist
      const watchlistPlayers = await Player.find({ user: req.user._id })
      // console.log(players)

      //Games today
      const response = await fetch(`http://data.nba.net/data/10s/prod/v1/${year}/schedule.json`)
      const scheduleData = await response.json()
      // console.log(scheduleData.league.standard)
      const todaysGames = scheduleData.league.standard.filter(games => games.startDateEastern === todaysDate)
      // console.log(todaysGames)
      // console.log(todaysDate)

      const nextDateWithGames = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate().toString().length === 1 ? "0" + Number(today.getDate()) + 1 : Number(today.getDate()) + 1}`
      // console.log(nextDateWithGames)

      //find first date with games
      const nextGames = scheduleData.league.standard.filter(games => games.startDateEastern === nextDateWithGames)
      // console.log(nextGames)

      //standings
      const data = await fetch(`https://api.sportradar.us/nba/trial/v7/en/seasons/${year}/REG/standings.json?api_key=nvw29fxe8j7t27fhcu2n7sj5`)
      const standings = await data.json()
      const westConf = standings.conferences[0].divisions.map(div => div.teams).flat().sort((a, b) => a.calc_rank.conf_rank - b.calc_rank.conf_rank)
      const eastConf = standings.conferences[1].divisions.map(div => div.teams).flat().sort((a, b) => a.calc_rank.conf_rank - b.calc_rank.conf_rank)
      // console.log(westConf)

      res.render("feed.ejs", { posts: posts, users: users, user: req.user, players: watchlistPlayers, teams: teams, games: todaysGames, time: today, nextGames: nextGames, standings: standings, west: westConf, east: eastConf });
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
      // console.log(comments)
      // const timestamps = comments.map(el => timestamp.postedTime(el.createdAt))
      for (let comment of comments) {
        commentsUsers.push(comment.user) // Iterate through comments and pushing all user IDs into the array
      }
      
      const users = await User.find({_id: commentsUsers}).lean();
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