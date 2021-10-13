const defaultCommand = {
    hello: { response: "Hello User", type: "string" },
    bye: { response: "Goodbye User", type: "string" },
    "!random": {
        response: function (min = 0, max = 10) {
            return Math.floor(Math.random() * (max - min)) + min;
        },
        type: "function",
    },
    "!pi": { response: Math.PI, type: "javascript" },
    "!now": { response: new Date().toLocaleString(), type: "javascript" },
    "!covid": { response: "https://covid19.ddc.moph.go.th/api/Cases/today-cases-all", type: "api" },
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

module.exports = { defaultCommand, timerInRoom, timerJoinRoom, timerSetId, changeTimerInRoom, timerLeaveRoom };
