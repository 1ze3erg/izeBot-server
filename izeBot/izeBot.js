const defaultCommand = {
    Hi: function sayHi(name) {
        return "Hi " + name;
    },
    now: new Date(),
    random: function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    rank: "Radiant",
};

const customCommand = {
    "!love": "love you too",
    "!hello": "hello",
    "!socketio": "เข้ามาอ่านการใช้งาน socket.io ได้ที่ => https://socket.io/",
};

const timers = [
    { timerName: "hello", response: "Hello Everyone", interval: 10000 },
    { timerName: "welcome", response: "Welcome Everyone", interval: 20000 },
];

module.exports = { defaultCommand, customCommand, timers };