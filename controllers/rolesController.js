const CustomErr = require("../helpers/err");
const { Role } = require("../models");
const { isNumeric, isInt } = require("validator");

async function getAllRole(req, res, next) {
    try {
        const roles = await Role.findAll();
        res.status(200).send(roles);
    } catch (err) {
        next(err);
    }
}

async function createRole(req, res, next) {
    try {
        const { roleName, roleIcon } = req.body;

        if (!roleName || roleName.trim() === "") {
            throw new CustomErr("roleName is required", 400);
        }

        if (!roleIcon || roleIcon.trim() === "") {
            throw new CustomErr("roleIcon is required", 400);
        }

        const newRole = await Role.create({
            roleName,
            roleIcon,
        });

        res.status(201).send(newRole);
    } catch (err) {
        next(err);
    }
}

async function updateRole(req, res, next) {
    try {
        const { id } = req.params;
        const { roleName, roleIcon, roleStyle, roleLimit } = req.body;

        const findRole = await Role.findOne({ where: { id } });
        if (!findRole) {
            throw new CustomErr("can't update at this role id", 400);
        }

        if (roleLimit) {
            if (!isNumeric(roleLimit, { no_symbols: true }) || !isInt(roleLimit, { gt: 0 })) {
                throw new CustomErr("roleLimit is not numeric or integer or greater than zero", 400);
            }
        }

        await Role.update(
            {
                roleName,
                roleIcon,
                roleStyle,
                roleLimit,
            },
            { where: { id } }
        );

        res.status(200).send(`update role id ${id} success`);
    } catch (err) {
        next(err);
    }
}

async function deleteRole(req, res, next) {
    try {
        const { id } = req.params;

        const findRole = await Role.findOne({ where: { id } });
        if (!findRole) {
            throw new CustomErr("can't delete at this role id", 400);
        }

        await Role.destroy({ where: { id } });

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllRole, createRole, updateRole, deleteRole };
