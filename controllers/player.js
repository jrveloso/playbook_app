const fetch = require('node-fetch');
const Player = require("../models/Player");
const AllPlayers = require("../models/AllPlayers")

module.exports = {
    getPlayer: async (req, res) => {
        try {
          //Get player stats
          const playerId = req.params.id
          // console.log(playerId)
          // const response = await fetch(`http://data.nba.net/data/10s/prod/v1/2022/players/${playerId}_profile.json`)
          // const playerData = await response.json()
          // const careerAvgs = await playerData.league.standard.stats.careerSummary
          // console.log(isNaN(careerAvgs.fgm/careerAvgs.gamesPlayed) ? true : false)
          // const seasonAvgs = playerData.league.standard.stats.regularSeason.season.map( stats => stats)
          // console.log(seasonAvgs)

          //Get player info
          const result = await fetch(`https://api.sportradar.com/nba/trial/v7/en/players/${playerId}/profile.json?api_key=${process.env.SPORTRADAR_API_KEY}`)
          const player =  await result.json()
          const results = await fetch("http://data.nba.net/data/10s/prod/v1/2022/players.json")
          const players =  await results.json()
          const personId = players.league.standard.find(playerData => `${playerData.firstName} ${playerData.lastName}` === player.full_name).personId
          console.log(personId)

          //Players in user's watchlist
          const playersInDb = await Player.find({ user: req.user._id })
          // console.log(players)

          //Get player's current team
          // const results = await fetch('http://data.nba.net/data/10s/prod/v1/2022/teams.json')
          // const teamData = await results.json()
          // const playersTeam = await teamData.league.standard.find(team => team.teamId === playerInfo.teamId)
          // const nbaTeams = await teamData.league.standard.filter(team => team.isNBAFranchise === true)
          
          //Drafted by
          // const draftedBy = teamData.league.standard.find(team => team.teamId === playerInfo.draft.teamId)
          // console.log(draftedBy)

          res.render("player.ejs", { user: req.user, picId: personId, player: player, onWatchlist: playersInDb });
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
          // const response = await fetch(`http://data.nba.net/data/10s/prod/v1/2022/players/${playerId}_profile.json`)
          // const playerData = await response.json()
          // const careerAvgs = await playerData.league.standard.stats.careerSummary
          // console.log(playerData.league.standard)
          // const seasonAvgs = playerData.league.standard.stats.regularSeason.season.map( stats => stats)
          // console.log(seasonAvgs)

          //Get player info
          const result = await fetch(`https://api.sportradar.com/nba/trial/v7/en/players/${playerId}/profile.json?api_key=${process.env.SPORTRADAR_API_KEY}`)
          const player =  await result.json()
          const results = await fetch("http://data.nba.net/data/10s/prod/v1/2022/players.json")
          const players =  await results.json()
          const personId = players.league.standard.find(playerData => `${playerData.firstName} ${playerData.lastName}` === player.full_name).personId
          console.log(personId)

          //Players in user's watchlist
          const playersInDb = await Player.find({ user: profileId })
          // console.log(players)

          //Get player's current team
          // const results = await fetch('http://data.nba.net/data/10s/prod/v1/2022/teams.json')
          // const teamData = await results.json()
          // const playersTeam = await teamData.league.standard.find(team => team.teamId === playerInfo.teamId)
          // const nbaTeams = await teamData.league.standard.filter(team => team.isNBAFranchise === true)

          //Drafted by
          // const draftedBy = teamData.league.standard.find(team => team.teamId === playerInfo.draft.teamId)
          // console.log(draftedBy)
   
          res.render("player.ejs", { user: req.user, picId: personId, player: player, onWatchlist: playersInDb});
        } catch (err) {
          console.log(err);
        }
    },
    searchPlayerName: async(request, response) => {
        try {
            const name = request.query.player
            // console.log(request)
            
            const playerId = await AllPlayers.findOne({ full_name: name })
            console.log(playerId)

            //Get player info
            const result = await fetch(`https://api.sportradar.com/nba/trial/v7/en/players/${playerId._id}/profile.json?api_key=${process.env.SPORTRADAR_API_KEY}`, {
                headers: {
                  'User-Agent': 'ANYTHING_WILL_WORK_HERE'
                }
              })
            const player =  await result.json()
            const results = await fetch("http://data.nba.net/data/10s/prod/v1/2022/players.json")
            const players =  await results.json()
            const personId = players.league.standard.find(playerData => `${playerData.firstName} ${playerData.lastName}` === player.full_name).personId
            console.log(personId)

            //Players in user's watchlist
            const playersInDb = await Player.find({ user: req.user._id })
            // console.log(players)

            res.render("player.ejs", { user: req.user, picId: personId, player: player, onWatchlist: playersInDb });
        } catch (error) {
            // response.status(500).send({message: error.message})
            console.log(error)
        }
    },
    listPlayers: async(request, response) => {
        try {
            let result = await AllPlayers.aggregate([
                {
                    "$search" : {
                        "autocomplete" : {
                            "query": `${request.query.query}`,
                            "path": "full_name",
                            "fuzzy": {
                                "maxEdits": 2,
                                "prefixLength": 3
                            }
                        }
                    }
                }
            ])
            result = Array.from(result)
            // console.log(result)
            response.send(result)
        } catch (error) {
            response.status(500).send({message: error.message})
            console.log(error)
        }
    },
    findPlayer: async(request, response) => {
        try {
            let result = await AllPlayers.findOne({
                "_id" : ObjectId(request.params.id)
            })
            response.send(result)
        } catch(error) {
            response.status(500).send({message: error.message})
        }
    },
    addPlayer: async (req, res) => {
        try {
            const playerId = req.params.id
           //Get player info
            const result = await fetch(`https://api.sportradar.com/nba/trial/v7/en/players/${playerId}/profile.json?api_key=${process.env.SPORTRADAR_API_KEY}`)
            const player =  await result.json()
            const playerName = `${player.first_name} ${player.last_name}`
            // console.log(teamArray)

            await Player.create({
                playerId: playerId,
                playerName: playerName,
                playerPosition: player.position,
                user: req.user.id
            });
            console.log("Player has been added!");
            res.redirect(`/feed`);
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