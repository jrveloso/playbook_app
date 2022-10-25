const fetch = require('node-fetch');

module.exports = {
    getBoxscore: async (req, res) => {
        const gameId = req.params.id

        const gameData = await fetch(`https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameId}.json`)
        const gameInfo = await gameData.json()
        console.log(gameInfo.game.homeTeam.players)

        res.render("game.ejs", { user: req.user, game: gameInfo });
    },
};