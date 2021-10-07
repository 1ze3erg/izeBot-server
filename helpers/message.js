function formatMessage(chatter, message, date, userId, chatRoomId) {
    return { chatter, message, date, userId, chatRoomId };
}

module.exports = { formatMessage }