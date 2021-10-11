const express = require("express");
const passport = require("passport");
const {
    registerUser,
    loginUser,
    updateUser,
    getUserByUserId,
    getAllUser,
    updateAvatar,
} = require("../controllers/usersController");
const { uploadAvatar } = require("../middlewares/uploadAvatar");
const router = express.Router();

router.get("/all-user", passport.authenticate("jwt-admin", { session: false }), getAllUser);
router.get("/individual", passport.authenticate("jwt-user", { session: false }), getUserByUserId);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", passport.authenticate("jwt-user", { session: false }), updateUser);
router.put(
    "/upload-avatar",
    passport.authenticate("jwt-user", { session: false }),
    uploadAvatar.single("upload-avatar"),
    updateAvatar
);

module.exports = router;
