const express = require("express");
const { getAllTimerByUserId, createTimer, updateTimer, deleteTimer } = require("../controllers/timersController");
const router = express.Router();

router.get("/", getAllTimerByUserId);
router.post("/", createTimer);
router.put("/:id", updateTimer);
router.delete("/:id", deleteTimer);

module.exports = router;