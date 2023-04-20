const { Schema, model } = require("mongoose");

const User = new Schema({
  login: { type: String, unique: true, required: true },
  password: { type: String,  required: true },
  carNumber: { type: String, unique: true, required: false },
  vinNumber: { type: String, unique: true, required: false },
  telephoneNumber: { type: String, unique: true, required: false },
  roles: [{ type: String, ref: "Role" }],
});

module.exports = model("User", User);
