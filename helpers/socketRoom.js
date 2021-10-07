const users = [];

function userJoinRoom(socketId, displayName, userId, chatRoomId) {
    const user = { socketId, displayName, userId, chatRoomId };
    users.push(user);
    return user;
}

function getCurrentUser(socketId) {
    const user = users.find(elem => elem.socketId === socketId);
    return user;
}

function userLeaveRoom(socketId) {
    const index = users.findIndex(elem => elem.socketId === socketId);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

module.exports = { users, userJoinRoom, getCurrentUser, userLeaveRoom };
