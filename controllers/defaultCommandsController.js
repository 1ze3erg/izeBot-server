const CustomErr = require("../helpers/err");
const { DefaultCommand } = require("../models");

async function getAllDefaultCommand(req, res, next) {
    try {
        const defaultCommands = await DefaultCommand.findAll();
        res.status(200).send(defaultCommands.reverse());
    } catch (err) {
        next(err);
    }
}

async function createDefaultCommand(req, res, next) {
    try {
        const { command, response, description } = req.body;

        if (!command || command.trim() === "") {
            throw new CustomErr("command is required", 400);
        }

        if (!response || response.trim() === "") {
            throw new CustomErr("response is required", 400);
        }

        if (!description || description.trim() === "") {
            throw new CustomErr("description is required", 400);
        }

        const newDefaultCommand = await DefaultCommand.create({
            command,
            response,
            description,
        });

        res.status(201).send(newDefaultCommand);
    } catch (err) {
        next(err);
    }
}

async function updateDefaultCommand(req, res, next) {
    try {
        const { id } = req.params;
        const { status, command, response, description, cooldown } = req.body;

        const findDefaultCommand = await DefaultCommand.findOne({ where: { id } });
        if (!findDefaultCommand) {
            throw new CustomErr("can't update at this defaultCommand id", 400);
        }

        if (cooldown) {
            if (!isNumeric(cooldown, { no_symbols: true }) || isInt(cooldown, { min: 0 })) {
                throw new CustomErr("interval is not numeric or integer or less than than zero", 400);
            }
        }

        await DefaultCommand.update(
            {
                status,
                command,
                response,
                description,
                cooldown,
            },
            { where: { id } }
        );

        res.status(200).send({ msg: `update defaultCommand id ${id} success` });
    } catch (err) {
        next(err);
    }
}

async function deleteDefaultCommand(req, res, next) {
    try {
        const { id } = req.params;

        const findDefaultCommand = await DefaultCommand.findOne({ where: { id } });
        if (!findDefaultCommand) {
            throw new CustomErr("can't delete at this defaultCommand id", 400);
        }

        await DefaultCommand.destroy({ where: { id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllDefaultCommand, createDefaultCommand, updateDefaultCommand, deleteDefaultCommand };
