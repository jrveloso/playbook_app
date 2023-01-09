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

            //Teams
            const results = await fetch(`https://api.sportradar.com/nba/trial/v7/en/seasons/2022/REG/standings.json?api_key=${process.env.SPORTRADAR_API_KEY}`)
            const standings = await results.json()
            const westConf = standings.conferences[1].divisions.map(div => div)
            const westTeams = westConf.map(div => div.teams).flat().sort((a, b) => b.win_pct - a.win_pct)
            const eastConf = standings.conferences[0].divisions.map(div => div)
            const eastTeams = eastConf.map(div => div.teams).flat().sort((a, b) => b.win_pct - a.win_pct)
            const teams = westConf.map(div => div.teams).concat(eastConf.map(div => div.teams)).flat()
 
            
            //Get profile info
            const profile = await User.find({ _id: userId })

            const players = await Player.find({ user: userId })

            const posts = await Post.find({ userId: userId }).sort({ createdAt: "desc" }).lean()
            
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
          const bioUpdate = req.body.bio
          console.log(bioUpdate)
        
          await User.findOneAndUpdate(
            { _id: userId },
            {
              bio: bioUpdate
            }
          );
          console.log("Bio has been updated!");
    
          res.redirect(`/profile/${userId}`);
        } catch (err) {
          console.log(err);
        }
      },
};
  