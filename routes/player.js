const express = require("express");
const router = express.Router();
const playerController = require("../controllers/player");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Comments Routes - simplified for now
// router.get("/searchPlayer", playerController.searchPlayer);
router.get("/:id", ensureAuth, playerController.getPlayer);
router.get("/playerFromProfile/:profileId/:id", ensureAuth, playerController.playerFromProfile);
router.post("/:id", ensureAuth, playerController.addPlayer);
router.delete("/:id", ensureAuth, playerController.removePlayer);


module.exports = router;