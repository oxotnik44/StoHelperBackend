const mongoose = require("mongoose");

// Определение схемы Service
const serviceSchema = new mongoose.Schema({
  login: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  nameService: { type: String, required: true, unique: true },
  nameAdmin: { type: String, required: true, unique: true },
  webAddress: { type: String, required: true },
  startOfWork: { type: String, required: true },
  endOfWork: { type: String, required: true },
  telephoneNumber: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  index: { type: String, required: true },
  roles: [{ type: String, ref: "Role" }],
  assistanceServices: [{ type: String }],
  reviews: [
    {
      review: [
        {
          review: String,
          userName: String,
        },
      ],
    },
  ],
});

// Создание модели Service на основе схемы
const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
