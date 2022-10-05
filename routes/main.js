const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
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

module.exports = router;