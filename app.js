require("dotenv").config();
require("./config/passport");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const adminRoute = require("./routes/adminRoute");
const customCommandsRoute = require("./routes/customCommandsRoute");
const defaultCommandsRoute = require("./routes/defaultCommandsRoute");
const rolesRoute = require("./routes/rolesRoute");
const timersRoute = require("./routes/timersRoute");
const usersRoute = require("./routes/usersRoute");
const izeBotRoute = require("./routes/izeBotRoute");
const chatLogsRoute = require("./routes/chatLogsRoute");
const chatRoomsRoute = require("./routes/chatRoomsRoute");
const { errController } = require("./controllers/errController");
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
app.use("/izeBot", passport.authenticate("jwt-user", { session: false }), izeBotRoute);

// 404
app.use((req, res, next) => {
    throw new CustomErr("resource not found on this server", 404);
});

// err handling
app.use(errController);

app.listen(port, () => {
    console.log(`izeBot server is running on port ${port}...`);
});
