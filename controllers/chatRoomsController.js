const CustomErr = require("../helpers/err");
const { ChatRoom, UserRoom } = require("../models");

async function getAllChatRoomByUserId(req, res, next) {
    try {
        const chatRooms = await ChatRoom.findAll({ where: { hostUserId: req.user.id } });
        res.status(200).send(chatRooms);
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllChatRoomByUserId };
