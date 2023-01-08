const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const settingsController = require("../controllers/settings");
const postController = require("../controllers/post");
const gameController = require("../controllers/game");
const playerController = require("../controllers/player");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/feed", ensureAuth, postController.getFeed);
router.get("/", authController.getLogin);
router.get("/boxscore/:id", gameController.getBoxscore);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
router.get("/settings/:id", ensureAuth, settingsController.getSettings);
router.put("/settings/:id", upload.single("file"), settingsController.updateProfilePic);
router.put("/settings/bio/:id", settingsController.updateBio);

router.get("/search", playerController.listPlayers)
router.get("/get/:id", playerController.findPlayer)

module.exports = router;