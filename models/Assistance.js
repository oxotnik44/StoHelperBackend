const { Schema, model } = require("mongoose");

const Assistance = new Schema({
  assistance: { type: String, unique: true, required: true },
  urlAssistance: { type: String, required: true },
});

module.exports = model("Assistance", Assistance);
