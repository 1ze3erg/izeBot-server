const usersInRooms = [];

function userJoinRoom(socketId, displayName, userId, chatRoomId) {
    const user = { socketId, displayName, userId, chatRoomId };
    usersInRooms.push(user);
    return user;
}

function getCurrentUser(socketId) {
    const user = usersInRooms.find(elem => elem.socketId === socketId);
    return user;
}

function userLeaveRoom(socketId) {
    const index = usersInRooms.findIndex(elem => elem.socketId === socketId);
    if (index !== -1) {
        return usersInRooms.splice(index, 1)[0];
    }
}

function haveUserInRoom(chatRoomId) {
    const index = usersInRooms.findIndex(elem => elem.chatRoomId === chatRoomId);
    if (index === -1) {
        return false;
    }
    return true;
}

module.exports = { usersInRooms, userJoinRoom, getCurrentUser, userLeaveRoom, haveUserInRoom };
