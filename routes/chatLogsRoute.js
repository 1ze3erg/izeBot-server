const express = require("express");
const { getAllChatLogByUserId, getAllChatLogByChatRoomId } = require("../controllers/chatLogsController");
const router = express.Router();

router.get("/", getAllChatLogByUserId);
router.get("/:chatRoomId", getAllChatLogByChatRoomId);

module.exports = router;