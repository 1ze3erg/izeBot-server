const express = require("express");
const { getAllTimer, createTimer, updateTimer, deleteTimer } = require("../controllers/timersController");
const router = express.Router();

router.get("/", getAllTimer);
router.post("/", createTimer);
router.put("/:id", updateTimer);
router.delete("/:id", deleteTimer);

module.exports = router;