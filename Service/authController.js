const Service = require("../models/Service");
const Role = require("../models/Role");
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
      const {
        login,
        password,
        nameService,
        nameAdmin,
        webAddress,
        startOfWork,
        endOfWork,
        telephoneNumber,
        city,
        address,
        index,
        assistanceServices,
      } = req.body;
      const candidate = await Service.findOne({ login });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким логином уже существует" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const serviceRole = await Role.findOne({ value: "ADMIN" });
      const service = new Service({
        login: login,
        password: hashPassword,
        nameService: nameService,
        nameAdmin: nameAdmin,
        webAddress: webAddress,
        startOfWork: startOfWork,
        endOfWork: endOfWork,
        telephoneNumber: telephoneNumber,
        city: city,
        address: address,
        index: index,
        roles: [serviceRole.value],
        assistanceServices: assistanceServices,
      });
      await service.save();
      return res.json({ message: "Пользователь успешно зарегистрирован" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Ошибка регистрации" });
    }
  }

  async login(req, res) {
    try {
      const { login, password } = req.body;
      const service = await Service.findOne({ login });
      if (!service) {
        return res
          .status(400)
          .json({ message: `Администратор с логином ${login} не найден` });
      }
      const validPassword = bcrypt.compareSync(password, service.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Введен неверный пароль" });
      }
      const token = generateAccessToken(service._id, service.roles);
      return res.json({ service, token });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Ошибка авторизации" });
    }
  }

  async getService(req, res) {
    try {
      // Получение данных из запроса
      const { assistanceServices } = req.body;

      // Поиск всех записей в модели Service
      const services = await Service.find();

      // Фильтрация массива services на основе assistanceServices
      const filteredServices = services.filter((service) => {
        // Проверка, содержит ли текущая запись service все значения из массива assistanceServices
        return assistanceServices.every((assistanceService) =>
          service.assistanceServices.includes(assistanceService)
        );
      });

      // Отправка отфильтрованных данных в ответ
      res.json(filteredServices);
    } catch (e) {
      console.log(e);
    }
  }
  async getReviews(req, res) {
    try {
      // Получение имени сервиса из параметров запроса или из другого источника, например, из тела запроса
      const nameService = req.body.nameService; // или req.body.nameService, в зависимости от вашей реализации

      // Использование модели Service и метода find для поиска отзывов (reviews) по имени сервиса
      const reviews = await Service.find({ nameService }); // Предполагается, что модель Service имеет поле nameService, которое содержит имя сервиса

      // Отправка отзывов на фронтенд в виде JSON-ответа
      res.json(reviews);
    } catch (err) {
      // Обработка ошибок, если они возникнут
      console.error(err);
      res.status(500).json({ error: "Ошибка сервера" });
    }
  }
  async addReview(req, res) {
    try {
      const { review, userName, nameService } = req.body;

      // Найти уже существующую запись сервиса в базе по имени
      const existingService = await Service.findOne({
        nameService,
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
      res.status(500).json({
        success: false,
        message: "Произошла ошибка при добавлении отзыва",
      });
    }
  }
}

module.exports = new authController();
