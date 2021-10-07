const express = require("express");
const passport = require("passport");
const { getAllTimerByUserId, createTimer, updateTimer, deleteTimer, getAllTimer } = require("../controllers/timersController");
const router = express.Router();

router.get("/all-timer", passport.authenticate("jwt-admin", { session: false }), getAllTimer);
router.get("/", passport.authenticate("jwt-user", { session: false }), getAllTimerByUserId);
router.post("/", passport.authenticate("jwt-user", { session: false }), createTimer);
router.put("/:id", passport.authenticate("jwt-user", { session: false }), updateTimer);
router.delete("/:id", passport.authenticate("jwt-user", { session: false }), deleteTimer);

module.exports = router;