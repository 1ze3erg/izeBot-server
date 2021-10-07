const express = require("express");
const { registerAdmin, loginAdmin } = require("../controllers/adminController");
const {
    getAllDefaultCommand,
    createDefaultCommand,
    updateDefaultCommand,
    deleteDefaultCommand,
} = require("../controllers/defaultCommandsController");
const { getAllTimer } = require("../controllers/timersController");
const { getAllUser } = require("../controllers/usersController");
const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/allUser", getAllUser);
router.get("/getDefault", getAllDefaultCommand);
router.post("/createDefault", createDefaultCommand);
router.post("/updateDefault/:id", updateDefaultCommand);
router.post("/deleteDefault/:id", deleteDefaultCommand);

module.exports = router;
