const CustomErr = require("../helpers/err");
const { UserRoom, User, Role, ChatRoom } = require("../models");

async function getAllUserRoomByUserId(req, res, next) {
    try {
        const UserRooms = await UserRoom.findAll({
            where: { userId: req.user.id },
            include: ChatRoom,
        });
        res.status(200).send(UserRooms);
    } catch (err) {
        next(err);
    }
}

async function getAllUserRoomByRoomId(req, res, next) {
    try {
        const { chatRoomId } = req.params;
        const UserRooms = await UserRoom.findAll({
            include: [
                {
                    model: User,
                    attributes: ["id", "displayName"],
                },
                {
                    model: ChatRoom,
                    where: {
                        id: chatRoomId,
                    },
                },
            ],
        });
        res.status(200).send(UserRooms);
    } catch (err) {
        next(err);
    }
}

async function createUserRoom(req, res, next) {
    try {
        const { userId, email, chatRoomId } = req.body;

        if (!userId && !email) {
            throw new CustomErr("userId or email is required", 400);
        }

        let findUser;
        if (email && email.trim() !== "") {
            findUser = await User.findOne({ where: { email } });
            if (!findUser) {
                throw new CustomErr("this user email not found", 400);
            }
        }

        const newUserRoom = await UserRoom.create({
            userId: userId ?? findUser.id,
            chatRoomId,
            status: "PENDING",
            roleId: 5,
        });

        res.status(201).send(newUserRoom);
    } catch (err) {
        next(err);
    }
}

async function updateUserRoom(req, res, next) {
    try {
        const { userId, chatRoomId } = req.params;
        const { status, roleId } = req.body;

        const findUserRoom = await UserRoom.findOne({
            where: { userId, chatRoomId },
            include: {
                model: ChatRoom,
                attributes: ["hostUserId"],
            },
        });
        if (!findUserRoom) {
            throw new CustomErr("can't update this userRoom because not found userRoom", 400);
        }

        if (roleId) {
            if (findUserRoom.ChatRoom.hostUserId !== req.user.id) {
                throw new CustomErr("can't update this userRoom because you are not host", 400);
            }
            const findRole = await Role.findOne({ where: { id: roleId } });
            if (!findRole) {
                throw new CustomErr("role not found", 400);
            }
        }

        if (status) {
            if (!["JOIN", "PENDING"].includes(status)) {
                throw new CustomErr("status must be only JOIN, PENDING, CANCEL", 400);
            }
        }

        await UserRoom.update(
            {
                status,
                roleId,
            },
            { where: { userId, chatRoomId } }
        );

        res.status(200).send({ msg: `update userRoom of userId ${userId} in chatRoomId ${chatRoomId}` });
    } catch (err) {
        next(err);
    }
}

async function deleteUserRoom(req, res, next) {
    try {
        const { userId, chatRoomId } = req.params;

        const findUserRoom = await UserRoom.findOne({ userId: req.user.id, chatRoomId });
        if (!findUserRoom) {
            throw new CustomErr("can't update this userRoom", 400);
        }

        await UserRoom.destroy({ where: { userId, chatRoomId } });
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllUserRoomByUserId, getAllUserRoomByRoomId, createUserRoom, updateUserRoom, deleteUserRoom };