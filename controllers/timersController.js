const { Timer } = require("../models");
const { isNumeric, isInt } = require("validator");
const CustomErr = require("../helpers/err");

async function getAllTimer(req, res, next) {
    try {
        const timers = await Timer.findAll();
        res.status(200).send(timers);
    } catch (err) {
        next(err);
    }
}

async function getAllTimerByUserId(req, res, next) {
    try {
        const timers = await Timer.findAll({ where: { userId: req.user.id } });
        res.status(200).send(timers.reverse());
    } catch (err) {
        next(err);
    }
}

async function createTimer(req, res, next) {
    try {
        const { timerName, response, interval, desciption } = req.body;

        if (!timerName || timerName.trim() === "") {
            throw new CustomErr("timerName is required", 400);
        }

        if (!response || response.trim() === "") {
            throw new CustomErr("response is required", 400);
        }

        if (!interval || interval.trim() === "") {
            throw new CustomErr("interval is required", 400);
        }

        if (!isNumeric(interval) || !isInt(interval) || +interval < 60000) {
            throw new CustomErr("interval is not numeric or integer or less than 1 min", 400);
        }

        const newTimer = await Timer.create({
            timerName,
            response,
            interval,
            desciption,
            userId: req.user.id,
        });

        res.status(201).send(newTimer);
    } catch (err) {
        next(err);
    }
}

async function updateTimer(req, res, next) {
    try {
        const { id } = req.params;
        const { status, timerName, response, interval, description } = req.body;

        const findTimer = await Timer.findOne({ where: { id, userId: req.user.id } });
        if (!findTimer) {
            throw new CustomErr("can't update at this timer id", 400);
        }

        if (interval) {
            if (!isNumeric(interval, { no_symbols: true }) || !isInt(interval, { min: 60000 })) {
                throw new CustomErr("interval is not numeric or integer or greater than or equal 1 min", 400);
            }
        }

        await Timer.update(
            {
                status,
                timerName,
                response,
                interval,
                description,
            },
            { where: { id, userId: req.user.id } }
        );

        res.status(200).send({ msg: `update timer id ${id} success` });
    } catch (err) {
        next(err);
    }
}

async function deleteTimer(req, res, next) {
    try {
        const { id } = req.params;

        const findTimer = await Timer.findOne({ where: { id, userId: req.user.id } });
        if (!findTimer) {
            throw new CustomErr("can't delete at this timer id", 400);
        }

        await Timer.destroy({ where: { id, userId: req.user.id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllTimer, getAllTimerByUserId, createTimer, updateTimer, deleteTimer };
