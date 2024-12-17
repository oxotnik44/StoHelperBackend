const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./Users/authRouter"); // Убедитесь, что путь правильный
const serviceRouter = require("./Service/authRouter"); // Убедитесь, что путь правильный
const PORT = process.env.PORT || 5000;

const app = express();

// Middleware для парсинга JSON
app.use(express.json());

// Подключение маршрутов
app.use("/api/auth", authRouter);
app.use("/api/service", serviceRouter); // Убедитесь, что путь правильный

// Функция для подключения к MongoDB
const start = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://artemnovikov1969:gWGp1CAQ8cRd77RQ@cluster0.tjqox.mongodb.net/StoHelperBackendRemastered`
    );
    console.log("MongoDB connected"); // Лог успешного подключения
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.error("MongoDB connection error:", e.message); // Лог ошибки подключения
  }
};

// Запуск сервера
start();
