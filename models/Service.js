const { Schema, model } = require("mongoose");

const Service = new Schema({
  login: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  nameService: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  webAddress: { type: String, required: true },
  startOfWork: { type: String, required: true },
  endOfWork: { type: String, required: true },
  telephoneNumber: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  index: { type: String, required: true },
  roles: [{ type: String, ref: "Role" }],
  assistanceServices: [{ type: String }],
});

module.exports = model("Service", Service);
