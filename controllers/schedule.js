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
  
        //Players in user's watchlist
        const players = await Player.find({ user: req.user._id })
        // console.log(players)

        //Teams
        const results = await fetch(`https://api.sportradar.com/nba/trial/v7/en/seasons/2022/REG/standings.json?api_key=${process.env.SPORTRADAR_API_KEY}`)
        const standings = await results.json()
        const westConf = standings.conferences[1].divisions.map(div => div)
        const westTeams = westConf.map(div => div.teams).flat().sort((a, b) => b.win_pct - a.win_pct)
        const eastConf = standings.conferences[0].divisions.map(div => div)
        const eastTeams = eastConf.map(div => div.teams).flat().sort((a, b) => b.win_pct - a.win_pct)
        const teams = westConf.map(div => div.teams).concat(eastConf.map(div => div.teams)).flat()
        console.log(eastTeams)

        const response = await fetch('https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json')
        const scheduleData = await response.json()
        const scheduleInfo = scheduleData.leagueSchedule.gameDates
        const monthSchedule = scheduleInfo.filter(day => day.games[0].gameCode.includes(scheduleId))
        console.log(monthSchedule.length, monthSchedule[0].games.length)
        console.log(monthSchedule[0].games[0].gameTimeUTC)

        //Scores today
        const gameData = await fetch(`https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json`)
        const gameScores = await gameData.json()
    
        res.render("schedule.ejs", { user: req.user, players: players, westConf: westConf, eastConf: eastConf, westTeams: westTeams, eastTeams: eastTeams, teams: teams, time: today, schedule: monthSchedule, gameInfo: gameScores });
      } catch (err) {
        console.log(err);
      }
    }
  };