const express = require("express");
const { getAllCustomCommand, createCustomCommand, updateCustomCommand, deleteCustomCommand } = require("../controllers/customCommandsController");
const router = express.Router();

router.get("/", getAllCustomCommand);
router.post("/", createCustomCommand);
router.put("/:id", updateCustomCommand);
router.delete("/:id", deleteCustomCommand);

module.exports = router;
