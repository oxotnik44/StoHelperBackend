const User = require("../models/User");
const Role = require("../models/Role");
const Assistance = require("../models/Assistance");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {validationResult} = require("express-validator");
const {secret} = require("../config");
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secret, {expiresIn: "24h"});
};

class authController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res
                    .status(400)
                    .json({message: "Ошибка при регистрации", errors});
            }
            const {login, password, carNumber, vinNumber, telephoneNumber} =
                req.body;
            const candidate = await User.findOne({login});
            if (candidate) {
                return res
                    .status(400)
                    .json({message: "Пользователь с таким логином уже существует"});
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"});
            const user = new User({
                login,
                password: hashPassword,
                roles: [userRole.value],
                carNumber,
                vinNumber,
                telephoneNumber,
            });
            await user.save();
            return res.json({message: "Пользователь успешно зарегестрирован"});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "Registration error"});
        }
    }

    async login(req, res) {
        try {
            const {login, password} = req.body;
            const user = await User.findOne({login});
            if (!user) {
                return res
                    .status(400)
                    .json({message: `Пользователь ${login} логином не найден`});
            }
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({message: `Введён не верный пароль`});
            }
            const token = generateAccessToken(user._id, user.roles);
            return res.json({user, token});
        } catch (e) {
            console.log(e);
            res.status(400).json({message: "Autharization error"});
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (e) {
        }
    }

    async getAssistance(req, res) {
        try {
            const assistance = await Assistance.find();
            res.json(assistance);
        } catch (e) {
        }
    }

}

module.exports = new authController();
