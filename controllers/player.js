const Player = require("../models/Player");


module.exports = {
    getPlayer: async (req, res) => {
        try {
          const playerId = req.params.id
          const response = await fetch(`https://api.sportradar.us/nba/trial/v7/en/players/${playerId}/profile.json?api_key=nvw29fxe8j7t27fhcu2n7sj5`)
          const playerData = await response.json()
          console.log(playerData)
    
    
          res.render("player.ejs", { player : playerData, user: req.user });
        } catch (err) {
          console.log(err);
        }
    },
    addPlayer: async (req, res) => {
        try {
            const id = req.params.id
            const response = await fetch(`https://api.sportradar.us/nba/trial/v7/en/players/${id}/profile.json?api_key=nvw29fxe8j7t27fhcu2n7sj5`)
            const playerData = await response.json()

            await Player.create({
                playerId: id,
                playerName: playerData.full_name,
                playerPosition: playerData.position,
                user: req.user.id
            });
            console.log("Player has been added!");
            res.redirect(`/profile/${req.user.id}`);
        } catch (err) {
            console.log(err);
        }
    },
}