const User = require("../models/User");
const Role = require("../models/Role");
const Assistance = require("../models/Assistance");
const Service = require("../models/Service")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { secret } = require("../config");
const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};
class authController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { login, password, carNumber, vinNumber, telephoneNumber } =
        req.body;
      const candidate = await User.findOne({ login });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким логином уже существует" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: "USER" });
      const user = new User({
        login,
        password: hashPassword,
        roles: [userRole.value],
        carNumber,
        vinNumber,
        telephoneNumber,
      });
      await user.save();
      return res.json({ message: "Пользователь успешно зарегестрирован" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
  }

  async login(req, res) {
    try {
      const { login, password } = req.body;
      const user = await User.findOne({ login });
      if (!user) {
        return res
          .status(400)
          .json({ message: `Пользователь ${login} логином не найден` });
      }
      const validPassword = bcrypt.compareSync(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: `Введён не верный пароль` });
      }
      const token = generateAccessToken(user._id, user.roles);
      return res.json({ user, token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Autharization error" });
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {}
  }
  async getAssistance(req, res) {
    try {
      const assistance = await Assistance.find();
      res.json(assistance);
    } catch (e) {}
  }
  async addReview(req, res) {
    try {
      const { review, userName, serviceName } = req.body;

      // Найти уже существующую запись сервиса в базе по имени
      const existingService = await Service.findOne({
        nameService: serviceName,
      });

      if (existingService) {
        // Создать новый объект отзыва
        const newReview = { review, userName };

        // Добавить новый отзыв в массив отзывов в записи сервиса
        existingService.reviews.push(newReview);

        // Сохранить изменения в базе данных
        await existingService.save();

        res
          .status(200)
          .json({ success: true, message: "Отзыв успешно добавлен" });
      } else {
        // Если запись сервиса не найдена, вернуть ошибку
        return res
          .status(404)
          .json({ success: false, message: "Запись сервиса не найдена" });
      }
    } catch (err) {
      console.error("Ошибка при добавлении отзыва:", err);
      res
        .status(500)
        .json({
          success: false,
          message: "Произошла ошибка при добавлении отзыва",
        });
    }
  }
}

module.exports = new authController();
