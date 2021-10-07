require("dotenv").config();
require("./config/passport");
const express = require("express");
const cors = require("cors");
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
const { userJoinRoom, getCurrentUser, userLeaveRoom } = require("./helpers/socketRoom");
const { formatMessage } = require("./helpers/message");
const { customCommand, defaultCommand, timers } = require("./izeBot/izeBot");
const { ChatLog } = require("./models");
const CustomErr = require("./helpers/err");
const port = process.env.PORT || 8888;

const app = express();

// middleware
app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

// path admin
app.use("/admin", passport.authenticate("jwt-admin", { session: false }), adminRoute);
app.use("/roles", passport.authenticate("jwt-admin", { session: false }), rolesRoute);
// path user
app.use("/users", usersRoute);
app.use("/default-commands", passport.authenticate("jwt-user", { session: false }), defaultCommandsRoute);
app.use("/custom-commands", passport.authenticate("jwt-user", { session: false }), customCommandsRoute);
app.use("/timers", passport.authenticate("jwt-user", { session: false }), timersRoute);
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

io.on("connection", (socket) => {
    console.log(`socket id = ${socket.id} connected...`);

    socket.on("join-room", (displayName, userId, chatRoomId) => {
        const user = userJoinRoom(socket.id, displayName, userId, chatRoomId);

        socket.join(user.chatRoomId);

        // noti user join room
        socket.to(user.chatRoomId).emit("notification", `${user.displayName} has joined`);

        // timer response interval
        // timers.forEach((elem) => {
        //     setInterval(() => {
        //         io.to(user.chatRoomId).emit("timer", {
        //             displayName: "izeBot",
        //             message: elem.response,
        //             role: "BOT",
        //         });
        //     }, 60000);
        // });

        // recieve message from client
        socket.on("input-msg", async (socketId, message) => {
            const currentUser = getCurrentUser(socketId);

            // izeBot command response
            const [command, ...option] = message ? message.split(" ") : "";
            console.log("command = ", command);
            console.log("option = ", option);
            let botMessage = defaultCommand[command] || customCommand[command];

            if (typeof botMessage === "function") {
                if (command === "Hi") {
                    botMessage = botMessage(currentUser.displayName);
                }
                if (command === "random") {
                    botMessage = botMessage(+option[0], +option[1]);
                }
            }

            const chats = botMessage
                ? [
                      { displayName: currentUser.displayName, message: message, role: "MEMBER" },
                      { displayName: "izeBot", message: `${botMessage}`, role: "BOT" },
                  ]
                : [{ displayName: currentUser.displayName, message: message, role: "MEMBER" }];

            const now = new Date();
            await ChatLog.create(
                formatMessage(currentUser.displayName, message, now, currentUser.userId, currentUser.chatRoomId)
            );

            // send message back to client
            io.to(currentUser.chatRoomId).emit("chat-msg", chats);
        });

        // disconnect socket when user leave room
        socket.on("leave-room", () => {
            socket.disconnect(true);
        });

        // noti user left room
        socket.on("disconnect", () => {
            const user = userLeaveRoom(socket.id);
            if (user) {
                socket.to(user.chatRoomId).emit("notification", `${user.displayName} has left`);
            }
        });
    });
});
