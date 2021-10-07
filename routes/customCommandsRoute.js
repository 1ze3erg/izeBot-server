const express = require("express");
const passport = require("passport");
const { getAllCustomCommandByUserId, createCustomCommand, updateCustomCommand, deleteCustomCommand, getAllCustomCommand } = require("../controllers/customCommandsController");
const router = express.Router();

router.get("/all-custom", passport.authenticate("jwt-admin", { session: false }), getAllCustomCommand);
router.get("/", passport.authenticate("jwt-user", { session: false }), getAllCustomCommandByUserId);
router.post("/", passport.authenticate("jwt-user", { session: false }), createCustomCommand);
router.put("/:id", passport.authenticate("jwt-user", { session: false }), updateCustomCommand);
router.delete("/:id", passport.authenticate("jwt-user", { session: false }), deleteCustomCommand);

module.exports = router;
