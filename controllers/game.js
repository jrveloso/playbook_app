const fetch = require('node-fetch');

module.exports = {
    getBoxscore: async (req, res) => {
        const gameId = req.params.id

        const gameData = await fetch(`https://cdn.nba.com/static/json/liveData/boxscore/boxscore_${gameId}.json`)
        const gameInfo = await gameData.json()

        res.render("game.ejs", { user: req.user, game: gameInfo });
    },
};