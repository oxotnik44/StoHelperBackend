const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");

router.post(
  "/registrationService",
  [
    check("login", "Логин пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль пользователя не может быть пустым").notEmpty(),
  ],
  controller.registration
);
router.post("/loginService", controller.login);
router.post("/shippingAssistance", controller.getService);

module.exports = router;
