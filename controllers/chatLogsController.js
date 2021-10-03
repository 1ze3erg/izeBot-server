const { ChatLog } = require("../models");

async function getAllChatLogByUserId(req, res, next) {
    try {
        const chatLogs = await ChatLog.findAll({ where: { userId: req.user.id } });
        res.status(200).send(chatLogs);
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllChatLogByUserId };
