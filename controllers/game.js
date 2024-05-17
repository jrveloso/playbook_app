const fetch = require('node-fetch');
const AllPlayers = require("../models/AllPlayers")

module.exports = {
    getBoxscore: async (req, res) => {
        const gameId = req.params.id

        const gameData = await fetch(`https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameId}.json`)
        const gameInfo = await gameData.json()
        // console.log(gameInfo)
        const homePlayers = gameInfo.game.homeTeam.players.map(player => player.name)
        console.log(homePlayers)
        const awayPlayers = gameInfo.game.awayTeam.players.map(player => player.name)
        // const players = homePlayers.concat(awayPlayers)

        // const allPlayers = await AllPlayers.find()
        const ant = AllPlayers.find(player => player.full_name === "Anthony Edwards").id
        console.log(ant)
        
        // console.log(allPlayers)
        // const playerInfo = allPlayers.filter(player => players.includes(player.full_name))
        // console.log(playerInfo)
        // console.log('hi')
        res.render("game.ejs", { user: req.user, game: gameInfo, allPlayers: allPlayers, awayPlayers: awayPlayers, homePlayers: homePlayers });
    },
};