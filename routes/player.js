const express = require("express");
const router = express.Router();
const playerController = require("../controllers/player");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comments Routes - simplified for now
router.get("/searchPlayer", playerController.searchPlayer);
router.get("/:id", ensureAuth, playerController.getPlayer);
router.post("/:id", ensureAuth, playerController.addPlayer);


module.exports = router;