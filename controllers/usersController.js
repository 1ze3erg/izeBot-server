const { User } = require("../models");
const { isEmail } = require("validator");
const CustomErr = require("../helpers/err");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const util = require("util");
const cloudinary = require("cloudinary").v2;
const uploadPromise = util.promisify(cloudinary.uploader.upload);

async function getAllUser(req, res, next) {
    try {
        const users = await User.findAll();
        res.status(200).send(users);
    } catch (err) {
        next(err);
    }
}

async function getUserByUserId(req, res, next) {
    try {
        const user = await User.findOne({
            where: { id: req.user.id },
            attributes: { exclude: ["id", "password", "createdAt", "updatedAt"] },
        });
        res.status(200).send(user);
    } catch (err) {
        next(err);
    }
}

async function registerUser(req, res, next) {
    try {
        const { displayName, email, password, rePassword } = req.body;

        if (!displayName || displayName.trim() === "") {
            throw new CustomErr("displayName is required", 400);
        }

        if (!email || email.trim() === "") {
            throw new CustomErr("email is required", 400);
        }

        if (!isEmail(email)) {
            throw new CustomErr("email is invalid", 400);
        }

        if (!password || password.trim() === "") {
            throw new CustomErr("password is required", 400);
        }

        if (password !== rePassword) {
            throw new CustomErr("password and rePassword did not match", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            avatar: "http://localhost:8888/public/images/default-avatar.png",
            displayName,
            email,
            password: hashedPassword,
        });

        res.status(201).send({ msg: `user ${newUser.displayName} has been created` });
    } catch (err) {
        next(err);
    }
}

async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || email.trim() === "") {
            throw new CustomErr("email is required", 400);
        }

        if (!password || password.trim() === "") {
            throw new CustomErr("password is required", 400);
        }

        const findUser = await User.findOne({ where: { email } });
        let isAuth = false;
        if (findUser) {
            isAuth = await bcrypt.compare(password, findUser.password);
        }

        if (findUser && isAuth) {
            const payload = { id: findUser.id, displayName: findUser.displayName };
            const secretKey = process.env.SECRET_KEY;
            const token = jwt.sign(payload, secretKey, { expiresIn: "10d" });
            return res.status(200).send({
                msg: "login success",
                token,
                userId: findUser.id,
                displayName: findUser.displayName,
                avatar: findUser.avatar,
            });
        } else {
            throw new CustomErr("email or password is incorrect", 400);
        }
    } catch (err) {
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        const { displayName, email, password, firstName, lastName, phoneNumber, address, country, postalCode } =
            req.body;

        await User.update(
            {
                displayName,
                email,
                password,
                firstName,
                lastName,
                phoneNumber,
                address,
                country,
                postalCode,
            },
            { where: { id: req.user.id } }
        );

        res.status(200).send({ msg: `update user ${req.user.displayName} success` });
    } catch (err) {
        next(err);
    }
}

async function updateAvatar(req, res, next) {
    try {
        console.log(req.file);
        let result;
        if (req.file?.size <= 5 * 1e6) {
            result = await uploadPromise(req.file.path);
            fs.unlinkSync(req.file.path);
        } else {
            fs.unlinkSync(req.file.path);
            throw new CustomErr("Your image file is greater than 5 MB", 400);
        }

        await User.update({ avatar: result.secure_url }, { where: { id: req.user.id } });

        res.status(200).send({ msg: `upload avatar success` });
    } catch (err) {
        next(err);
    }
}

module.exports = { getAllUser, getUserByUserId, registerUser, loginUser, updateUser, updateAvatar };
