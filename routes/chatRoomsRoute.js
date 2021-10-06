const express = require("express");
const { getAllChatRoomByUserId } = require("../controllers/chatRoomsController");
const router = express.Router();

router.get("/", getAllChatRoomByUserId);

module.exports = router;
