const Router = require("express");
const router = new Router();
const controller = require("./authController");
const { check } = require("express-validator");

router.post(
  "/registrationUser",
  [
    check("login", "Логин пользователя не может быть пустым").notEmpty(),
    check("password", "Пароль пользователя не может быть пустым").notEmpty(),
  ],
  controller.registration
);
router.post("/loginUser", controller.login);
router.get("/users", controller.getUsers);
router.get("/retrievedAssistance", controller.getAssistance);
router.post("/addReview"), controller.addReview;

module.exports = router;
