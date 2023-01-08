const fetch = require('node-fetch');
const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Player = require("../models/Player");

module.exports = {
    getTeam: async (req, res) => {
      try {
        const teamName = req.params.id;
        // console.log(teamName)

        //Get todays date
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth() + 1
        const day = today.getDate().toString().length === 1 ? "0" + today.getDate() : today.getDate()
        const todaysDate = `${year}${month}${day}`
        // console.log(today)

        //Teams
        // const data = await fetch(`https://api.sportradar.com/nba/trial/v7/en/seasons/2022/REG/rankings.json?api_key=nvw29fxe8j7t27fhcu2n7sj5`)
        // const standings = await data.json()
        // const westConf = standings.conferences[1].divisions.map(div => div)
        // const westTeams = westConf.map(div => div.teams).flat().sort((a, b) => a.rank.conference - b.rank.conference)
        // const eastConf = standings.conferences[0].divisions.map(div => div)
        // const eastTeams = eastConf.map(div => div.teams).flat().sort((a, b) => a.rank.conference - b.rank.conference)
        // const teams = westConf.map(div => div.teams).concat(eastConf.map(div => div.teams)).flat()
        // const teamId = teams.find(team => team.name.toLowerCase() == teamName).id
        // console.log(teams.length)

        //Find team
        const results = await fetch(`https://api.sportradar.com/nba/trial/v7/en/teams/${teamName}/profile.json?api_key=${process.env.SPORTRADAR_API_KEY}`)
        const teamResults = await results.json()

        //Grab players on roster
        // const response = await fetch(`http://data.nba.net/data/10s/prod/v1/2022/teams/${teamName}/roster.json`);
        // const teamData = await response.json();
        // console.log(teamData.league)
        // const rosterIds = teamData.league.standard.players.map(id => id.personId);
        // console.log(rosterIds)

        //Players in user's watchlist
        const watchlistPlayers = await Player.find({ user: req.user._id })
        // console.log(players)

        //grab rostered players from player data
        // const result = await fetch("http://data.nba.net/data/10s/prod/v1/2022/players.json")
        // const players =  await result.json()
        // const teamArray = players.league.standard.filter(player => rosterIds.includes(player.personId))
        // console.log(teamArray)

        //Scores today
        const gameData = await fetch(`https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json`)
        const gameScores = await gameData.json()
        // console.log(gameScores.scoreboard.games)
  
        res.render("team.ejs", { players: watchlistPlayers, user: req.user, team: teamResults, time: today, gameInfo: gameScores });
      } catch (err) {
        console.log(err);
      }
    }
}