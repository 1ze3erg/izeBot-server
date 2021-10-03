const express = require("express");
const passport = require("passport");
const { registerUser, loginUser, updateUser } = require("../controllers/usersController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", passport.authenticate("jwt-user", { session: false }), updateUser);

module.exports = router;
