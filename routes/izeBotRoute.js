const express = require("express");
const { getDefaultCommandObj, getCustomCommandObj, getTimerArr } = require("../controllers/izeBotController");
const router = express.Router();

router.get("/default-command", getDefaultCommandObj);
router.get("/custom-command", getCustomCommandObj);
router.get("/timer", getTimerArr);

module.exports = router;
