const express = require("express");
const { useDefaultCommand } = require("../controllers/izeBotController");
const router = express.Router();

router.get("/", useDefaultCommand);

module.exports = router;