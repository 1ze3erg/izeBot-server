const express = require("express");
const { getAllCustomCommandByUserId, createCustomCommand, updateCustomCommand, deleteCustomCommand } = require("../controllers/customCommandsController");
const router = express.Router();

router.get("/", getAllCustomCommandByUserId);
router.post("/", createCustomCommand);
router.put("/:id", updateCustomCommand);
router.delete("/:id", deleteCustomCommand);

module.exports = router;
