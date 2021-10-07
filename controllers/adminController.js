const CustomErr = require("../helpers/err");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

async function getAllAdmin(req, res, next) {
    try {
        const admins = await Admin.findAll();
        res.status(200).send(admins);
    } catch (err) {
        next(err);
    }
}

async function registerAdmin(req, res, next) {
    try {
        const { username, password, rePassword } = req.body;

        if (!username || username.trim() === "") {
            throw new CustomErr("username is required", 400);
        }

        if (!password || password.trim() === "") {
            throw new CustomErr("password is required", 400);
        }

        if (password !== rePassword) {
            throw new CustomErr("password and rePassword did not match", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await Admin.create({
            username,
            password: hashedPassword,
        });

        res.status(201).send({ msg: `admin ${newAdmin.username} has been created` });
    } catch (err) {
        next(err);
    }
}

async function loginAdmin(req, res, next) {
    try {
        const { username, password } = req.body;

        if (!username || username.trim() === "") {
            throw new CustomErr("username is required", 400);
        }

        if (!password || password.trim() === "") {
            throw new CustomErr("password is required", 400);
        }

        const findAdmin = await Admin.findOne({ where: { username } });
        let isAuth = false;
        if (findAdmin) {
            isAuth = await bcrypt.compare(password, findAdmin.password);
        }

        if (findAdmin && isAuth) {
            const payload = { id: findAdmin.id };
            const secretKey = process.env.ADMIN_SECRET_KEY;
            const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });
            res.status(200).send({
                msg: "admin login success",
                token,
            });
        } else {
            throw new CustomErr("username or password is incorrect", 400);
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllAdmin,
    registerAdmin,
    loginAdmin,
};
