const izeBot = {
    "new Date()": new Date(),
    "Math.random()": Math.random(),
};

const timerInRoom = {};

function timerJoinRoom(chatRoomId) {
    if (!(chatRoomId in timerInRoom)) {
        timerInRoom[chatRoomId] = false;
    }
}

function changeTimerInRoom(chatRoomId, ) {
    timerInRoom[chatRoomId] = true;
}

function timerLeaveRoom(chatRoomId) {
    delete timerInRoom[chatRoomId];
}

module.exports = { izeBot, timerInRoom, timerJoinRoom, changeTimerInRoom, timerLeaveRoom };
