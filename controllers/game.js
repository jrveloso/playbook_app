const fetch = require('node-fetch');
const AllPlayers = require("../models/AllPlayers")

module.exports = {
    getBoxscore: async (req, res) => {
        const gameId = req.params.id
        console.log('hi')

        const gameData = await fetch(`https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameId}.json`)
        const gameInfo = await gameData.json()
        const homePlayers = gameInfo.game.homeTeam.players.map(player => player.name)
        // console.log(homePlayers)
        const awayPlayers = gameInfo.game.awayTeam.players.map(player => player.name)
        const players = homePlayers.concat(awayPlayers)

        const allPlayers = await AllPlayers.find()
        // const playerInfo = allPlayers.filter(player => players.includes(player.full_name))
        // console.log(playerInfo)
        // console.log('hi')
        res.render("game.ejs", { user: req.user, game: gameInfo, allPlayers: allPlayers });
    },
};