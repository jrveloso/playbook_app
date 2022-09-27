const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const response = await fetch('https://api.sportradar.us/nba/trial/v7/en/seasons/2021/REG/standings.json?api_key=nvw29fxe8j7t27fhcu2n7sj5');
      const data = await response.json();

      const eastTeams = data.conferences[1].divisions.map( con => con.teams).flat();
      const westTeams = data.conferences[0].divisions.map( con => con.teams).flat()
      console.log(eastTeams, westTeams);

      res.render("profile.ejs", { user: req.user, eastTeams: eastTeams, westTeams: westTeams });
    } catch (err) {
      console.log(err);
    }
  },
  getTeam: async (req, res) => {
    try {
      const teamId = req.params.id;
      console.log('hi');
    
      const response = await fetch(`https://api.sportradar.us/nba/trial/v7/en/teams/${teamId}/profile.json?api_key=nvw29fxe8j7t27fhcu2n7sj5`);
      const teamData = await response.json();
      console.log(teamData);

      res.render("team.ejs", { team: teamData });
    } catch (err) {
      console.log(err);
    }
  },
  getPlayer: async (req, res) => {
    try {
      const playerId = req.params.id
      const response = await fetch(`https://api.sportradar.us/nba/trial/v7/en/players/${playerId}/profile.json?api_key=nvw29fxe8j7t27fhcu2n7sj5`)
      const playerData = await response.json()
      console.log(playerData.seasons[0].teams)


      res.render("player.ejs", { player : playerData });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};