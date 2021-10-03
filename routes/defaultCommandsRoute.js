const express = require("express");
const passport = require("passport");
const { getAllDefaultCommand } = require("../controllers/defaultCommandsController");
const router = express.Router();

router.get("/", getAllDefaultCommand);

module.exports = router;
