const izeBot = {
    "new Date()": new Date(),
    "Math.random()": Math.random(),
};

const timerInRoom = {};

function timerJoinRoom(chatRoomId) {
    if (!(chatRoomId in timerInRoom)) {
        timerInRoom[chatRoomId] = { status: false, intervalId: [] };
    }
}

function timerSetId(chatRoomId, id) {
    timerInRoom[chatRoomId].intervalId.push(id);
}

function changeTimerInRoom(chatRoomId) {
    timerInRoom[chatRoomId].status = true;
}

function timerLeaveRoom(chatRoomId) {
    timerInRoom[chatRoomId].intervalId.forEach((elem) => {
        clearInterval(elem);
    });
    delete timerInRoom[chatRoomId];
}

module.exports = { izeBot, timerInRoom, timerJoinRoom, timerSetId, changeTimerInRoom, timerLeaveRoom };
