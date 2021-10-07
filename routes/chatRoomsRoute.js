const express = require("express");
const { getAllChatRoomByUserId, createChatRoom, updateChatRoom, deleteChatRoom } = require("../controllers/chatRoomsController");
const router = express.Router();

router.get("/", getAllChatRoomByUserId);
router.post("/", createChatRoom);
router.put("/:id", updateChatRoom);
router.delete("/:id", deleteChatRoom);

module.exports = router;
