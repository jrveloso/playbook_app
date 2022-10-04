const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Profile Routes - simplified for now
router.get("/", profileController.notLoggedIn)
router.get("/:id", ensureAuth, profileController.getProfile);

module.exports = router;