const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const scheduleController = require("../controllers/schedule");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, scheduleController.getSchedule);

module.exports = router;