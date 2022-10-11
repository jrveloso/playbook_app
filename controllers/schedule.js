const fetch = require('node-fetch');
const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Player = require("../models/Player");

module.exports = {
    getSchedule: async (req, res) => {
      try {
        const scheduleId = req.params.id
        //Get todays date
        const today = new Date()
        const year = today.getFullYear()
        const todaysDate = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate().toString().length === 1 ? "0" + today.getDate() : today.getDate()}`
        // console.log(todaysDate)
  
        //Teams
        const results = await fetch(`http://data.nba.net/data/10s/prod/v1/${year}/teams.json`)
        const teamData = await results.json()
        const teams = await teamData.league.standard.map(team => team)
        // console.log(teams[0]);
  
        //Players in user's watchlist
        const players = await Player.find({ user: req.user._id })
        // console.log(players)
  
        //Schedule
        const response = await fetch(`http://data.nba.net/data/10s/prod/v1/${year}/schedule.json`)
        const scheduleData = await response.json()
        const scheduleInfo = scheduleData.league.standard
        //Games this month
        const monthSchedule = scheduleInfo.filter(game => game.startDateEastern.includes(scheduleId))
        //Games today
        const todaysGames = scheduleData.league.standard.filter(games => games.startDateEastern === todaysDate)
    
        res.render("schedule.ejs", { user: req.user, players: players, teams: teams, games: todaysGames, time: today, schedule: monthSchedule });
      } catch (err) {
        console.log(err);
      }
    }
  };