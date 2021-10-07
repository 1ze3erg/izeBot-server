function formatChatLog(chatter, message, date, userId, chatRoomId) {
    return { chatter, message, date, userId, chatRoomId };
}

function formatChat(displayName, message, role) {
    return { displayName, message, role };
}

module.exports = { formatChatLog, formatChat };
