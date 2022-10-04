const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const teamController = require("../controllers/team");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now

router.get("/:id", ensureAuth, teamController.getTeam);

// router.post("/createPost", upload.single("file"), postController.createPost);

// router.put("/likePost/:id", postController.likePost);

// router.delete("/deletePost/:id", postController.deletePost);

module.exports = router;