const express = require("express");
const passport = require("passport");
const { registerUser, loginUser, updateUser, getUserByUserId } = require("../controllers/usersController");
const router = express.Router();

router.get("/individual", passport.authenticate("jwt-user", { session: false }), getUserByUserId);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", passport.authenticate("jwt-user", { session: false }), updateUser);

module.exports = router;
