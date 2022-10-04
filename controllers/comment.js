const Comment = require("../models/Comment");


module.exports = {
    createComment: async (req, res) => {
        try {
        
        await Comment.create({
            commentText: req.body.commentText,
            userId: req.user.id,
            postId: req.params.id,
            likes: 0,
            likedBy: [],
        });
        console.log("Comment has been added!");
        res.redirect("/post/" + req.params.id);
        } catch (err) {
        console.log(err);
        }
    },
}