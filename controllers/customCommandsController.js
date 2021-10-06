const CustomErr = require("../helpers/err");
const { CustomCommand } = require("../models");
const { isNumeric, isInt } = require("validator");

async function getAllCustomCommandByUserId(req, res, next) {
    try {
        const customCommands = await CustomCommand.findAll({ where: { userId: req.user.id } });
        res.status(200).send(customCommands);
    } catch (err) {
        next(err);
    }
}

async function createCustomCommand(req, res, next) {
    try {
        const { command, response, description } = req.body;

        if (!command || command.trim() === "") {
            throw new CustomErr("command is required", 400);
        }

        if (!response || response.trim() === "") {
            throw new CustomErr("response is required", 400);
        }

        const newCustomCommand = await CustomCommand.create({
            command,
            response,
            description,
            userId: req.user.id,
        });

        res.status(201).send(newCustomCommand);
    } catch (err) {
        next(err);
    }
}

async function updateCustomCommand(req, res, next) {
    try {
        const { id } = req.params;
        const { status, command, response, description, cooldown } = req.body;

        const findCustomCommand = await CustomCommand.findOne({ where: { id, userId: req.user.id } });
        if (!findCustomCommand) {
            throw new CustomErr("can't update at this customCommand id", 400);
        }

        if (cooldown) {
            if (!isNumeric(cooldown, { no_symbols: true }) || isInt(cooldown, { min: 0 })) {
                throw new CustomErr("interval is not numeric or integer or less than than zero", 400);
            }
        }

        await CustomCommand.update(
            {
                status,
                command,
                response,
                description,
                cooldown,
            },
            { where: { id, userId: req.user.id } }
        );

        res.status(200).send({ msg: `update customCommand id ${id} success` });
    } catch (err) {
        next(err);
    }
}

async function deleteCustomCommand(req, res, next) {
    try {
        const { id } = req.params;

        const findCustomCommand = await CustomCommand.findOne({ where: { id, userId: req.user.id } });
        if (!findCustomCommand) {
            throw new CustomErr("can't delete at this customCommand id", 400);
        }

        await CustomCommand.destroy({ where: { id, userId: req.user.id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllCustomCommandByUserId, createCustomCommand, updateCustomCommand, deleteCustomCommand };
