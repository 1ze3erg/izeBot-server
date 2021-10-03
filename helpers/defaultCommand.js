const { DefaultCommand } = require("../models");

const defaultCommands = [
    { command: "", response: "", description: "" },
    { command: "", response: "", description: "" },
    { command: "", response: "", description: "" },
    { command: "", response: "", description: "" },
]

async function createDafaultCommand(userId) {
    defaultCommands.forEach(elem=>{
        await DefaultCommand.create({ ...elem, userId })
    })
}