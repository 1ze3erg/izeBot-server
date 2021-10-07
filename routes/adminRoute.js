const express = require("express");
const passport = require("passport");
const { registerAdmin, loginAdmin, getAllAdmin } = require("../controllers/adminController");
const router = express.Router();

router.get("/all-admin", passport.authenticate("jwt-admin", { session: false }), getAllAdmin);
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

module.exports = router;
