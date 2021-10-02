const express = require("express");
const {
    getAllDefaultCommand,
    createDefaultCommand,
    updateDefaultCommand,
    deleteDefaultCommand,
} = require("../controllers/defaultCommandsController");
const router = express.Router();

router.get("/", getAllDefaultCommand);
router.post("/", createDefaultCommand);
router.put("/:id", updateDefaultCommand);
router.delete("/:id", deleteDefaultCommand);

module.exports = router;
