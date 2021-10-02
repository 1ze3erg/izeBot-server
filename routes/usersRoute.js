const express = require("express");
const passport = require("passport");
const { registerUser, loginUser, updateUser } = require("../controllers/usersController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/:id", passport.authenticate("jwt", { session: false }), updateUser);

module.exports = router;
