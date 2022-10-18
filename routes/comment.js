const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comments Routes - simplified for now
router.post("/createComment/:id", commentController.createComment);

router.put("/likeComment/:postId/:id", commentController.likeComment);

router.put("/unlikeComment/:postId/:id", commentController.unlikeComment);

router.delete("/deleteComment/:postId/:id", commentController.deleteComment);

module.exports = router;