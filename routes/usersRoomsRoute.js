const express = require("express");
const {
    getAllUserRoomByUserId,
    getAllUserRoomByRoomId,
    createUserRoom,
    updateUserRoom,
    deleteUserRoom,
} = require("../controllers/usersRoomsController");
const router = express.Router();

router.get("/", getAllUserRoomByUserId);
router.get("/chatRoomId/:chatRoomId", getAllUserRoomByRoomId);
router.post("/invite", createUserRoom);
router.put("/edit/:userId/:chatRoomId", updateUserRoom);
router.delete("/leave/:userId/:chatRoomId", deleteUserRoom);

module.exports = router;