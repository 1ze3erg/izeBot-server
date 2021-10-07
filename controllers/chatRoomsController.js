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

async function createChatRoom(req, res, next) {
    try {
        const { chatRoomName } = req.body;

        if (!chatRoomName || chatRoomName.trim() === "") {
            throw new CustomErr("chatRoomName is required");
        }

        const newChatRoom = await ChatRoom.create({
            chatRoomName,
            hostUserId: req.user.id,
        });

        const newUserRoom = await UserRoom.create({
            userId: req.user.id,
            chatRoomId: newChatRoom.id,
            status: "JOIN",
            roleId: 2,
        });

        res.status(201).send({ newChatRoom, newUserRoom });
    } catch (err) {
        next(err);
    }
}

async function updateChatRoom(req, res, next) {
    try {
        const { id } = req.params;
        const { chatRoomName } = req.body;

        const findChatRoom = await ChatRoom.findOne({ where: { id } });
        if (!findChatRoom) {
            throw new CustomErr("can't update at this chatroom id", 400);
        }

        if (!chatRoomName || chatRoomName.trim() === "") {
            throw new CustomErr("chatRoomName is required", 400);
        }

        await ChatRoom.update(
            {
                chatRoomName,
            },
            { where: { id, hostUserId: req.user.id } }
        );

        res.status(200).send({ msg: `update chatroom id ${id} success` });
    } catch (err) {
        next(err);
    }
}

async function deleteChatRoom(req, res, next) {
    try {
        const { id } = req.params;

        const findChatRoom = await ChatRoom.findOne({ where: { id } });
        if (!findChatRoom) {
            throw new CustomErr("can't delete at this chatroom id", 400);
        }

        await ChatRoom.update(
            {
                isAvailable: false,
            },
            { where: { id } }
        );

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllChatRoomByUserId, createChatRoom, updateChatRoom, deleteChatRoom };
