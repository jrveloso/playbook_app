const fetch = require('node-fetch');
const Player = require("../models/Player");

module.exports = {
    getPlayer: async (req, res) => {
        try {
          //Get player stats
          const playerId = req.params.id
          // console.log(playerId)
          const response = await fetch(`http://data.nba.net/data/10s/prod/v1/2022/players/${playerId}_profile.json`)
          const playerData = await response.json()
          const careerAvgs = await playerData.league.standard.stats.careerSummary
          // console.log(careerAvgs)
          const seasonAvgs = playerData.league.standard.stats.regularSeason.season.map( stats => stats)
          // console.log(seasonAvgs)

          //Get player info
          const result = await fetch("http://data.nba.net/data/10s/prod/v1/2022/players.json")
          const players =  await result.json()
          const playerInfo = players.league.standard.find(player => player.personId === playerId)
          // console.log(playerInfo)

          //Players in user's watchlist
          const playersInDb = await Player.find({ user: req.user._id })
          // console.log(players)

          //Get player's current team
          const results = await fetch('http://data.nba.net/data/10s/prod/v1/2022/teams.json')
          const teamData = await results.json()
          const playersTeam = await teamData.league.standard.find(team => team.teamId === playerInfo.teamId)
          const nbaTeams = await teamData.league.standard.filter(team => team.isNBAFranchise === true)
          console.log(nbaTeams.find(team => team.teamId == seasonAvgs[0].teams[0].teamId).urlName)
          
          //Drafted by
          const draftedBy = teamData.league.standard.find(team => team.teamId === playerInfo.draft.teamId)
          // console.log(draftedBy)

          res.render("player.ejs", { stats: seasonAvgs, career: careerAvgs, user: req.user, picId: playerId, player: playerInfo, team: playersTeam, allTeams: nbaTeams, onWatchlist: playersInDb, draftedBy: draftedBy});
        } catch (err) {
          console.log(err);
        }
    },
    playerFromProfile: async (req, res) => {
        try {
          //userprofile id
          const profileId = req.params.profileId
          //Get player stats
          const playerId = req.params.id
          // console.log(playerId)
          const response = await fetch(`http://data.nba.net/data/10s/prod/v1/2022/players/${playerId}_profile.json`)
          const playerData = await response.json()
          const careerAvgs = await playerData.league.standard.stats.careerSummary
          // console.log(playerData.league.standard)
          const seasonAvgs = playerData.league.standard.stats.regularSeason.season.map( stats => stats)
          // console.log(seasonAvgs)

          //Get player info
          const result = await fetch("http://data.nba.net/data/10s/prod/v1/2022/players.json")
          const players =  await result.json()
          const playerInfo = players.league.standard.find(player => player.personId === playerId)
          //console.log(playerInfo)

          //Players in user's watchlist
          const playersInDb = await Player.find({ user: profileId })
          // console.log(players)

          //Get player's current team
          const results = await fetch('http://data.nba.net/data/10s/prod/v1/2022/teams.json')
          const teamData = await results.json()
          const playersTeam = await teamData.league.standard.find(team => team.teamId === playerInfo.teamId)
          const nbaTeams = await teamData.league.standard.filter(team => team.isNBAFranchise === true)
          console.log(nbaTeams.find(team => team.teamId == seasonAvgs[0].teams[0].teamId).urlName)

          //Drafted by
          const draftedBy = teamData.league.standard.find(team => team.teamId === playerInfo.draft.teamId)
          // console.log(draftedBy)
   

          res.render("player.ejs", { stats: seasonAvgs, career: careerAvgs, user: req.user, picId: playerId, player: playerInfo, team: playersTeam, allTeams: nbaTeams, onWatchlist: playersInDb, draftedBy: draftedBy});
        } catch (err) {
          console.log(err);
        }
    },
    searchPlayer: async (req, res) => {
        try {
          const searchedPlayer = req.query.player
          //Get player info
          const result = await fetch("http://data.nba.net/data/10s/prod/v1/2022/players.json")
          const players =  await result.json()
          console.log(players.league.standard[0])
          const playerInfo = players.league.standard.find(player => `${player.firstName.toLowerCase()} ${player.lastName.toLowerCase()}` === searchedPlayer.toLowerCase())
          console.log(playerInfo)

          //Get player stats
          const playerId = playerInfo.personId
          // console.log(playerId)
          const response = await fetch(`http://data.nba.net/data/10s/prod/v1/2022/players/${playerId}_profile.json`)
          const playerData = await response.json()
          const seasonAvgs = playerData.league.standard.stats.regularSeason.season.map( stats => stats)

          //Get player's current team
          const results = await fetch('http://data.nba.net/data/10s/prod/v1/2022/teams.json')
          const teamData = await results.json()
          // console.log(teamData.league)
          const playersTeam = await teamData.league.standard.find(team => team.teamId === playerInfo.teamId)
          
          //Drafted by
          const draftedBy = teamData.league.standard.find(team => team.teamId === playerInfo.draft.teamId)

           //Players in user's watchlist
           const playersInDb = await Player.find({ user: req.user._id })
           // console.log(players)

          res.render("player.ejs", { stats: seasonAvgs, user: req.user, picId: playerId, player: playerInfo, team: playersTeam, allTeams: teamData, onWatchlist: playersInDb, draftedBy: draftedBy});
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
    removePlayer: async (req, res) => {
        try {
            const playerId = req.params.id

            await Player.remove({
                playerId: playerId,
                user: req.user.id
            });
            console.log("Player has been deleted!");
            res.redirect(`/player/${playerId}`);
        } catch (err) {
            console.log(err);
        }
    },
}