require("dotenv").config();
require("./config/passport");
const axios = require("axios");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const socketio = require("socket.io");
const adminRoute = require("./routes/adminRoute");
const customCommandsRoute = require("./routes/customCommandsRoute");
const defaultCommandsRoute = require("./routes/defaultCommandsRoute");
const rolesRoute = require("./routes/rolesRoute");
const timersRoute = require("./routes/timersRoute");
const usersRoute = require("./routes/usersRoute");
const izeBotRoute = require("./routes/izeBotRoute");
const chatLogsRoute = require("./routes/chatLogsRoute");
const chatRoomsRoute = require("./routes/chatRoomsRoute");
const usersRoomsRoute = require("./routes/usersRoomsRoute");
const { errController } = require("./controllers/errController");
const { userJoinRoom, getCurrentUser, userLeaveRoom, users, haveUserInRoom } = require("./socket-server/socketRoom");
const { formatChatLog, formatChat } = require("./helpers/format");
const {
    defaultCommand,
    timerJoinRoom,
    timerInRoom,
    changeTimerInRoom,
    timerLeaveRoom,
    timerSetId,
} = require("./izeBot/izeBot");
const { User, ChatLog, ChatRoom, CustomCommand, DefaultCommand, Timer } = require("./models");
const CustomErr = require("./helpers/err");
const port = process.env.PORT || 8888;

const app = express();

// middleware
app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

// path
app.use("/admin", adminRoute);
app.use("/users", usersRoute);
app.use("/roles", passport.authenticate("jwt-admin", { session: false }), rolesRoute);
app.use("/default-commands", defaultCommandsRoute);
app.use("/custom-commands", customCommandsRoute);
app.use("/timers", timersRoute);
app.use("/chat-logs", passport.authenticate("jwt-user", { session: false }), chatLogsRoute);
app.use("/chat-rooms", passport.authenticate("jwt-user", { session: false }), chatRoomsRoute);
app.use("/users-rooms", passport.authenticate("jwt-user", { session: false }), usersRoomsRoute);
app.use("/izeBot", passport.authenticate("jwt-user", { session: false }), izeBotRoute);

// 404
app.use((req, res, next) => {
    throw new CustomErr("resource not found on this server", 404);
});

// err handling
app.use(errController);

const server = app.listen(port, () => {
    console.log(`izeBot server is running on port ${port}...`);
});

const io = socketio(server, {
    cors: {
        origin: "*",
    },
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const findUser = await User.findOne({ where: { id: decoded.id } });
        socket.user = findUser;
        next();
    } catch (err) {
        next(err);
    }
});

io.on("connection", (socket) => {
    console.log(`${socket.user.displayName} connected...`);

    socket.on("join-room", async (displayName, userId, chatRoomId) => {
        const user = userJoinRoom(socket.id, displayName, userId, chatRoomId);

        const findChatRoom = await ChatRoom.findOne({ where: { id: chatRoomId } });

        // set command
        const customCommands = await CustomCommand.findAll({ where: { userId: findChatRoom.hostUserId } });
        const customCommandObj = customCommands.reduce((result, elem) => {
            if (elem.status) {
                result[elem.command] = { response: elem.response, cooldown: elem.cooldown };
            }
            return result;
        }, {});

        // set timer
        timerJoinRoom(chatRoomId);
        const timers = await Timer.findAll({ where: { userId: findChatRoom.hostUserId } });
        let timerArr = [];
        timers.forEach((elem) => {
            const { timerName, response, interval } = elem;
            if (elem.status) {
                timerArr.push({ timerName, response, interval });
            }
        });

        socket.join(user.chatRoomId);

        // noti user join room
        socket.to(user.chatRoomId).emit("notification", `${user.displayName} has joined`);

        // recieve message from client
        socket.on("input-msg", async (socketId, message) => {
            const currentUser = getCurrentUser(socketId);

            // izeBot command response
            const [text, option] = message ? message.split(" ") : "";

            let botMessage = customCommandObj[text.toLowerCase()] || defaultCommand[text.toLowerCase()];

            if (botMessage?.type === "api") {
                const res = await axios.get(botMessage.response);
                botMessage = `จำนวนคนติดเชื้อวันที่ ${new Date(res.data[0]?.txn_date).toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })} จำนวน ${res.data[0]?.new_case} คน`;
            } else if (botMessage?.type === "function") {
                if (option) {
                    botMessage = botMessage.response(+option.split("-")[0], +option.split("-")[1]);
                } else {
                    botMessage = botMessage.response();
                }
            } else if (botMessage?.type === "javascript" || botMessage) {
                botMessage = botMessage.response;
            }

            console.log(botMessage);

            const userChat = formatChat(currentUser.displayName, message, "MEMBER");
            const botChat = botMessage ? formatChat("izeBot", botMessage, "BOT") : null;

            const now = new Date();
            await ChatLog.create(
                formatChatLog(currentUser.displayName, message, now, currentUser.userId, currentUser.chatRoomId)
            );

            // send message back to client
            io.to(currentUser.chatRoomId).emit("chat-msg", userChat);
            if (botChat) {
                setTimeout(() => {
                    io.to(currentUser.chatRoomId).emit("chat-msg", botChat);
                }, 300);
            }

            if (!timerInRoom[chatRoomId].status) {
                changeTimerInRoom(chatRoomId);
                timerArr.forEach((elem) => {
                    const id = setInterval(() => {
                        console.log("socket timer");
                        io.to(currentUser.chatRoomId).emit("chat-msg", {
                            displayName: "izeBot",
                            message: `${elem.response}`,
                            role: "BOT",
                        });
                    }, elem.interval);
                    timerSetId(chatRoomId, id);
                });
            }
        });

        // disconnect socket when user leave room
        socket.on("leave-room", () => {
            socket.disconnect(true);
        });

        // noti user left room
        socket.on("disconnect", () => {
            console.log(`${socket.user.displayName} disconnected...`);
            const user = userLeaveRoom(socket.id);
            if (!haveUserInRoom(chatRoomId)) {
                timerLeaveRoom(chatRoomId);
            }
            if (user) {
                socket.to(user.chatRoomId).emit("notification", `${user.displayName} has left`);
            }
        });
    });
});
