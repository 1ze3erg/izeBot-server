const express = require("express");
const passport = require("passport");
const { getAllDefaultCommand, createDefaultCommand, updateDefaultCommand, deleteDefaultCommand } = require("../controllers/defaultCommandsController");
const router = express.Router();

router.get("/", getAllDefaultCommand);
router.post("/create-default", passport.authenticate("jwt-admin", { session: false }), createDefaultCommand);
router.put("/update-default/:id", passport.authenticate("jwt-admin", { session: false }), updateDefaultCommand);
router.delete("/delete-default/:id", passport.authenticate("jwt-admin", { session: false }), deleteDefaultCommand);

module.exports = router;
