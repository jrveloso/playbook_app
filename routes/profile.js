const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const profileController = require("../controllers/profile");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Profile Routes - simplified for now
router.get("/", profileController.notLoggedIn)
router.get("/:id", ensureAuth, profileController.getProfile);
router.post("/createPost", upload.single("file"), profileController.createPost);

module.exports = router;