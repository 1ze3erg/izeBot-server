const { ChatLog, ChatRoom } = require("../models");

async function getAllChatLogByUserId(req, res, next) {
    try {
        const chatLogs = await ChatLog.findAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: {
                model: ChatRoom,
                where: {
                    hostUserId: req.user.id
                },
                attributes: { exclude: ["createdAt", "updatedAt"] }
            },
            order: [["date", "DESC"]]
        });
        res.status(200).send(chatLogs);
    } catch (err) {
        next(err);
    }
}

async function getAllChatLogByChatRoomId(req, res, next) {
    try {
        const { chatRoomId } = req.params;
        const ChatLogs = await ChatLog.findAll({ where: { userId: req.user.id, chatRoomId } });
        res.status(200).send(ChatLogs);
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllChatLogByUserId, getAllChatLogByChatRoomId };
