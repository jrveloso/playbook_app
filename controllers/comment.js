const Comment = require("../models/Comment");


module.exports = {
    createComment: async (req, res) => {
        try {
        await Comment.create({
            comment: req.body.comment,
            userId: req.user.id,
            postId: req.params.id,
            likes: 0,
            likedBy: [],
        });
        console.log("Comment has been added!");
        res.redirect(`/post/${req.params.id}`);
        } catch (err) {
        console.log(err);
        }
    },
    likeComment: async (req, res) => {
        try {
          const commentId = req.params.id
          await Comment.updateMany(
            { _id: commentId },
            {
                $inc: { likes: 1 },
                $push: { likedBy: req.user.id },
            });
          console.log("Likes +1");
          if(commentId !== '') {
            res.redirect(`/post/${req.params.postId}`);
          }
        } catch (err) {
          console.log(err);
        }
      },
    unlikeComment: async (req, res) => {
        try {
          const commentId = req.params.id
          await Comment.updateMany(
            { _id: commentId },
            {
                $inc: { likes: -1 },
                $pull: { likedBy: req.user.id },
            });
          console.log("Likes -1");
          if(commentId !== '') {
            res.redirect(`/post/${req.params.postId}`);
          }
        } catch (err) {
          console.log(err);
        }
      },
    deleteComment: async (req, res) => {
        try {
          // Find post by id
          const commentId = req.params.id
          // Delete image from cloudinary
          // await cloudinary.uploader.destroy(comment.cloudinaryId);
          // Delete comment from db
          await Comment.remove({ _id: commentId });
          console.log("Deleted Comment");
          res.redirect(`/post/${commentId}`);
        } catch (err) {
          res.redirect(`/post/${commentId}`);
        }
      },
}