const fetch = require('node-fetch');
const cloudinary = require("../middleware/cloudinary");
const Player = require("../models/Player");
const Post = require("../models/Post");
const User = require("../models/User");

module.exports = {
    getSettings: async (req, res) => {
        try {
            const userId = req.params.id

            //Get todays date
            const today = new Date()
            const year = today.getFullYear()
            const month = today.getMonth() + 1
            const day = today.getDate().toString().length === 1 ? "0" + today.getDate() : today.getDate()
            const todaysDate = `${year}${month}${day}`
            // console.log(today)

            //Teams
             //Teams
            const results = await fetch(`https://api.sportradar.com/nba/trial/v7/en/seasons/2022/REG/rankings.json?api_key=nvw29fxe8j7t27fhcu2n7sj5`)
            const standings = await results.json()
            const westConf = standings.conferences[1].divisions.map(div => div)
            const westTeams = westConf.map(div => div.teams).flat().sort((a, b) => a.rank.conference - b.rank.conference)
            const eastConf = standings.conferences[0].divisions.map(div => div)
            const eastTeams = eastConf.map(div => div.teams).flat().sort((a, b) => a.rank.conference - b.rank.conference)
            const teams = westConf.map(div => div.teams).concat(eastConf.map(div => div.teams)).flat()
            // console.log(eastTeams)
            // const results = await fetch(`http://data.nba.net/data/10s/prod/v1/${year}/teams.json`)
            // const teamData = await results.json()
            // const teams = await teamData.league.standard.filter(team => team.isNBAFranchise === true)
            // console.log(teams);
            
            //Get profile info
            const profile = await User.find({ _id: userId })
            console.log(profile)

            const players = await Player.find({ user: userId })
            // console.log(players)

            const posts = await Post.find({ userId: userId }).sort({ createdAt: "desc" }).lean()
            // console.log(posts)
            
            res.render("settings.ejs", { user: req.user, paramsID: req.params.id, players: players, posts: posts, westConf: westConf, eastConf: eastConf, westTeams: westTeams, eastTeams: eastTeams, teams: teams, time: today, teams: teams, userProfile: profile });
        } catch (err) {
            console.log(err);
        }
    },
    updateProfilePic: async (req, res) => {
        try {
          const userId = req.params.id
          // Delete image from cloudinary
          let user = await User.findById({ _id: userId });
          await cloudinary.uploader.destroy(user.cloudinaryId);
          
          // Upload image to cloudinary
          const result = await cloudinary.uploader.upload(req.file.path);
    
          await User.findOneAndUpdate(
            { _id: userId },
            {
              image: result.secure_url,
              cloudinaryId: result.public_id
            }
          );
          console.log("Photo has been added!");
    
          res.redirect(`/profile/${userId}`);
        } catch (err) {
          console.log(err);
        }
      },
    updateBio: async (req, res) => {
        try {
          const userId = req.params.id
        
          await User.findOneAndUpdate(
            { _id: userId },
            {
              bio: req.body.bio
            }
          );
          console.log("Bio has been updated!");
    
          res.redirect(`/profile/${userId}`);
        } catch (err) {
          console.log(err);
        }
      },
};
  