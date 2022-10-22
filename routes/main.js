const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const settingsController = require("../controllers/settings");
const postController = require("../controllers/post");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
// router.get("/", homeController.getIndex);
// router.get("/profile", ensureAuth, postController.getProfile);
// router.get("/team/:id", ensureAuth, postController.getTeam);
// router.get("/player/:id", ensureAuth, postController.getPlayer);
// router.post("/player/:id", ensureAuth, postController.addPlayer);
router.get("/feed", ensureAuth, postController.getFeed);
router.get("/", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", upload.single("file"), authController.postSignup);
router.get("/settings/:id", ensureAuth, settingsController.getSettings);
router.put("/settings/:id", upload.single("file"), settingsController.updateProfilePic);
router.put("/settings/bio/:id", upload.single("file"), settingsController.updateBio);

module.exports = router;