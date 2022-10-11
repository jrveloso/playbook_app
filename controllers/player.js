const fetch = require('node-fetch');
const Player = require("../models/Player");


module.exports = {
    getPlayer: async (req, res) => {
        try {
          //Get player stats
          const playerId = req.params.id
          console.log(playerId)
          const response = await fetch(`http://data.nba.net/data/10s/prod/v1/2022/players/${playerId}_profile.json`)
          const playerData = await response.json()
          console.log
          const seasonAvgs = playerData.league.standard.stats.regularSeason.season.map( stats => stats)

          //Get player info
          const result = await fetch("http://data.nba.net/data/10s/prod/v1/2022/players.json")
          const players =  await result.json()
          const playerInfo = players.league.standard.find(player => player.personId === playerId)
          // console.log(teamArray)

          //Players in user's watchlist
          const playersInDb = await Player.find({ user: req.user._id })
          // console.log(players)

          //Get player's team
          const results = await fetch('http://data.nba.net/data/10s/prod/v1/2021/teams.json')
          const teamData = await results.json()
          const playersTeam = await teamData.league.standard.find(team => team.teamId === playerInfo.teamId)
    
          res.render("player.ejs", { stats : seasonAvgs, user: req.user, picId: playerId, player: playerInfo, team : playersTeam, onWatchlist: playersInDb });
        } catch (err) {
          console.log(err);
        }
    },
    addPlayer: async (req, res) => {
        try {
            const playerId = req.params.id
            //Get player info
            const result = await fetch("http://data.nba.net/data/10s/prod/v1/2022/players.json")
            const players =  await result.json()
            const playerInfo = players.league.standard.find(player => player.personId === playerId)
            const playerName = `${playerInfo.firstName} ${playerInfo.lastName}`
            // console.log(teamArray)

            await Player.create({
                playerId: playerId,
                playerName: playerName,
                playerPosition: playerInfo.pos,
                user: req.user.id
            });
            console.log("Player has been added!");
            res.redirect(`/player/${playerId}`);
        } catch (err) {
            console.log(err);
        }
    },
}