const { DefaultCommand, CustomCommand, Timer } = require("../models");

async function getDefaultCommandObj(req, res, next) {
    try {
        const defaultCommands = await DefaultCommand.findAll();
        const defaultCommandObj = defaultCommands.reduce((result, elem) => {
            result[elem.command] = { response: elem.response, cooldown: elem.cooldown };
            return result;
        }, {});
        res.status(200).send(defaultCommandObj);
    } catch (err) {
        next(err);
    }
}

async function getCustomCommandObj(req, res, next) {
    try {
        const customCommands = await CustomCommand.findAll({ where: { userId: req.user.id } });
        const customCommandObj = customCommands.reduce((result, elem) => {
            if (elem.status) {
                result[elem.command.toLowerCase()] = { response: elem.response, cooldown: elem.cooldown };
            }
            return result;
        }, {});
        res.status(200).send(customCommandObj);
    } catch (err) {
        next(err);
    }
}

async function getTimerArr(req, res, next) {
    try {
        const timers = await Timer.findAll({ where: { userId: req.user.id } });
        let timerArr = [];
        timers.forEach((elem) => {
            const { timerName, response, interval } = elem;
            if (elem.status) {
                timerArr.push({ timerName, response, interval });
            }
        });
        res.status(200).send(timerArr);
    } catch (err) {
        next(err);
    }
}

module.exports = { getDefaultCommandObj, getCustomCommandObj, getTimerArr };
