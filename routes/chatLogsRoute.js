const express = require("express");
const { getAllChatLogByUserId } = require("../controllers/chatLogsController");
const router = express.Router();

router.get("/", getAllChatLogByUserId);

module.exports = router;