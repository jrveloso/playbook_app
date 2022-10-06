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

        const results = await fetch('http://data.nba.net/data/10s/prod/v1/2021/teams.json')
        const teamResults = await results.json()
        const chosenTeam = await teamResults.league.standard.find(team => team.urlName === teamName)
        // console.log(chosenTeam)

        const response = await fetch(`http://data.nba.net/data/10s/prod/v1/2022/teams/${teamName}/roster.json`);
        const teamData = await response.json();
        // console.log(teamData.league)
        const rosterIds = teamData.league.standard.players.map(id => id.personId);
        // console.log(rosterIds)

        const result = await fetch("http://data.nba.net/data/10s/prod/v1/2022/players.json")
        const players =  await result.json()
        const teamArray = players.league.standard.filter(player => rosterIds.includes(player.personId))
        // console.log(teamArray)
  
        res.render("team.ejs", { players: teamArray, user: req.user, team: chosenTeam });
      } catch (err) {
        console.log(err);
      }
    }
}