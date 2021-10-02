const express = require("express");
const { getAllChatLog, createChatLog, updateChatLog, deleteChatLog } = require("../controllers/chatLogsController");
const router = express.Router();

router.get("/", getAllChatLog);
router.post("/", createChatLog);
router.put("/", updateChatLog);
router.delete("/", deleteChatLog);

module.exports = router;