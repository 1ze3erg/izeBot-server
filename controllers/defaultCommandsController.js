const { DefaultCommand } = require("../models");

async function getAllDefaultCommand(req, res, next) {
    try {
        const defaultCommands = await DefaultCommand.findAll();
        res.status(200).send(defaultCommands);
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllDefaultCommand };
