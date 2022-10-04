const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const Player = require("../models/Player");

module.exports = {
    getTeam: async (req, res) => {
      try {
        const teamId = req.params.id;
      
        const response = await fetch(`https://api.sportradar.us/nba/trial/v7/en/teams/${teamId}/profile.json?api_key=nvw29fxe8j7t27fhcu2n7sj5`);
  
        const teamData = await response.json();
        console.log(teamData);
  
        res.render("team.ejs", { team: teamData, user: req.user });
      } catch (err) {
        console.log(err);
      }
    }
}