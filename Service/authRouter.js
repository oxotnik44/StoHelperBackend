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
router.put("/addReview", controller.addReview);
router.post("/getReviews", controller.getReviews);
router.post("/getApplication", controller.getApplication);


module.exports = router;
