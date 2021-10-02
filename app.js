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
const { errController } = require("./controllers/errController");
const port = process.env.PORT || 8888;

const app = express();

// middleware
app.use(passport.initialize());
app.use(cors());
app.use(express.json());
app.use("/public", express.static("public"));

//path
app.use("/admin", adminRoute);
app.use("/users", usersRoute);
app.use("/custom-commands", customCommandsRoute);
app.use("/default-commands", defaultCommandsRoute);
app.use("/timers", timersRoute);
app.use("/chat-logs", chatLogsRoute);
app.use("/roles", rolesRoute);
app.use("/izeBot", izeBotRoute);

// err handling
app.use(errController);

app.listen(port, () => {
    console.log(`izeBot server is running on port ${port}...`);
});
